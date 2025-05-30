import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { generateSecret, verifyToken, generateQRCode, sendVerificationEmail } from '../services/twoFactorService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt with data:', { ...req.body, password: '[REDACTED]' });
    
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          username: !username ? 'Username is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }


    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        console.log('Email already in use:', email);
        return res.status(400).json({ error: 'Email already in use' });
      }
    } catch (dbError) {
      console.error('Database error checking existing user:', dbError);
      return res.status(500).json({ error: 'Database error checking existing user' });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error('Error hashing password:', hashError);
      return res.status(500).json({ error: 'Error processing password' });
    }
    
    console.log('Creating new user...');
    let user;
    try {
      user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: 'user' 
      });
      console.log('User created successfully:', { id: user.id, username: user.username, email: user.email });
    } catch (createError) {
      console.error('Error creating user:', createError);
      if (createError.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
      return res.status(500).json({ error: 'Error creating user account' });
    }

    try {
      await ActivityLog.create({
        userId: user.id,
        action: 'register',
        entityType: 'user',
        entityId: user.id,
        details: 'New user registered'
      });
      console.log('Activity log created successfully');
    } catch (logError) {
      console.error('Error creating activity log:', logError);
      // Don't fail registration if activity log fails
    }

    let token;
    try {
      token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      console.log('Token generated successfully');
    } catch (tokenError) {
      console.error('Error generating token:', tokenError);
      return res.status(500).json({ error: 'Error generating authentication token' });
    }

    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Registration failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.twoFactorEnabled) {
      const tempToken = jwt.sign(
        { id: user.id, temp: true },
        JWT_SECRET,
        { expiresIn: '5m' }
      );
      return res.json({ 
        requiresTwoFactor: true,
        tempToken
      });
    }

    await ActivityLog.create({
      userId: user.id,
      action: 'login',
      entityType: 'user',
      entityId: user.id,
      details: 'User logged in'
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/setup-2fa', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const secret = generateSecret();
    const qrCode = await generateQRCode(secret);

    user.twoFactorSecret = secret.base32;
    await user.save();

    res.json({ qrCode, secret: secret.base32 });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ error: error.message });
  }
});


router.post('/verify-2fa', authenticateToken, async (req, res) => {
  try {
    console.log('2FA verification attempt:', {
      userId: req.user.id,
      code: req.body.code
    });

    const userId = req.user.id;
    const { code } = req.body;

    if (!code) {
      console.log('No verification code provided');
      return res.status(400).json({ error: 'Verification code is required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.twoFactorSecret) {
      console.log('No 2FA secret found for user:', userId);
      return res.status(400).json({ error: '2FA setup not initiated' });
    }

    const isValid = verifyToken(user.twoFactorSecret, code);
    if (!isValid) {
      console.log('Invalid verification code for user:', userId);
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    user.twoFactorEnabled = true;
    await user.save();

    console.log('2FA enabled successfully for user:', userId);
    res.json({ success: true, message: '2FA has been enabled successfully' });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ 
      error: 'Failed to verify 2FA',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.post('/verify-2fa-login', async (req, res) => {
  try {
    const { tempToken, token } = req.body;
    
    const decoded = jwt.verify(tempToken, JWT_SECRET);
    if (!decoded.temp) {
      return res.status(400).json({ error: 'Invalid temporary token' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA not enabled' });
    }

    const isValid = verifyToken(user.twoFactorSecret, token);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    await ActivityLog.create({
      userId: user.id,
      action: 'login',
      entityType: 'user',
      entityId: user.id,
      details: 'User logged in with 2FA'
    });

    const finalToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token: finalToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/2fa-status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ enabled: user.twoFactorEnabled });
  } catch (error) {
    console.error('2FA status error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/disable-2fa', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;
    const user = await User.findByPk(userId);

    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA not enabled' });
    }

    const isValid = verifyToken(user.twoFactorSecret, token);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    user.twoFactorEnabled = false;
    user.twoFactorVerified = false;
    user.twoFactorSecret = null;
    await user.save();

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;