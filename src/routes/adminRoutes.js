import express from 'express';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import Animal from '../models/Animal.js';
import Shelter from '../models/Shelter.js';
import sequelize from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findByPk(decoded.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.use(adminMiddleware);

router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'isMonitored', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id/toggle-monitor', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({ isMonitored: !user.isMonitored });
    
    await ActivityLog.create({
      userId: req.user.id,
      action: 'admin_action',
      entityType: 'user',
      entityId: user.id,
      details: `Set monitoring status to ${user.isMonitored}`
    });

    res.json({ 
      message: `Monitoring ${user.isMonitored ? 'enabled' : 'disabled'}`,
      user: {
        id: user.id,
        isMonitored: user.isMonitored
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/monitored-users', async (req, res) => {
  try {
    const users = await User.findAll({
      where: { isMonitored: true },
      include: [{
        model: ActivityLog,
        as: 'activities',
        limit: 5,
        order: [['createdAt', 'DESC']]
      }]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user-activity/:userId', async (req, res) => {
  try {
    const activities = await ActivityLog.findAll({
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await Promise.all([
      User.count(),
      Animal.count(),
      Shelter.count(),
      ActivityLog.count(),
      User.count({ where: { isMonitored: true } })
    ]);

    res.json({
      totalUsers: stats[0],
      totalAnimals: stats[1],
      totalShelters: stats[2],
      totalActivities: stats[3],
      monitoredUsers: stats[4]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/force-monitor-check', async (req, res) => {
  try {
    
    const monitoredCount = await User.count({ where: { isMonitored: true } });
    res.json({ 
      message: 'Manual monitoring check completed',
      monitoredUsers: monitoredCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/animals/:id', async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id);
    if (!animal) return res.status(404).json({ error: 'Animal not found' });

    await animal.destroy();
    
    await ActivityLog.create({
      userId: req.user.id,
      action: 'admin_delete',
      entityType: 'animal',
      entityId: animal.id,
      details: `Admin deleted animal ${animal.name}`
    });

    res.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
