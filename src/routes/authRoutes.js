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
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'user' 
    });
    await ActivityLog.create({
      userId: user.id,
      action: 'register',
      entityType: 'user',
      entityId: user.id,
      details: 'New user registered'
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If 2FA is enabled, require verification
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

    // If 2FA is not enabled, proceed with normal login
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

// Setup 2FA
router.post('/setup-2fa', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const secret = generateSecret();
    const qrCode = await generateQRCode(secret);

    // Save the secret temporarily
    user.twoFactorSecret = secret.base32;
    await user.save();

    res.json({ qrCode, secret: secret.base32 });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify and enable 2FA
router.post('/verify-2fa', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;
    const user = await User.findByPk(userId);

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ error: '2FA not set up' });
    }

    const isValid = verifyToken(user.twoFactorSecret, token);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    user.twoFactorEnabled = true;
    user.twoFactorVerified = true;
    await user.save();

    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify 2FA token during login
router.post('/verify-2fa-login', async (req, res) => {
  try {
    const { tempToken, token } = req.body;
    
    // Verify the temporary token
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

// Get 2FA status
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

// Disable 2FA
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