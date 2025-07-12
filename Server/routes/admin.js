import express from 'express';
import User from '../models/User.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import Notification from '../models/Notification.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin stats endpoint
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalQuestions,
      totalAnswers,
      newUsersToday,
      activeUsers
    ] = await Promise.all([
      User.countDocuments({}),
      Question.countDocuments({}),
      Answer.countDocuments({}),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) } }),
      User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 24*60*60*1000) } })
    ]);
    // If you have a Report model, replace 0 with the count of pending reports
    const pendingReports = 0;
    res.json({
      success: true,
      data: {
        totalUsers,
        totalQuestions,
        totalAnswers,
        pendingReports,
        activeUsers,
        newUsersToday
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

// Ban a user
router.post('/ban/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { banned: true });
    if (!user) return res.status(404).json({ 
      success: false,
      message: 'User not found' 
    });
    res.json({ 
      success: true,
      message: 'User banned' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

// Unban a user
router.post('/unban/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { banned: false });
    if (!user) return res.status(404).json({ 
      success: false,
      message: 'User not found' 
    });
    res.json({ 
      success: true,
      message: 'User unbanned' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

// Platform-wide message
router.post('/broadcast', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { message } = req.body;
    await Notification.create({ type: 'system', message, global: true });
    res.json({ 
      success: true,
      message: 'Broadcast sent' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

// Download user activity report (CSV)
router.get('/report/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'username email createdAt role banned');
    let csv = 'Username,Email,CreatedAt,Role,Banned\n';
    users.forEach(u => {
      csv += `${u.username},${u.email},${u.createdAt},${u.role},${u.banned}\n`;
    });
    res.header('Content-Type', 'text/csv');
    res.attachment('user_report.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

export default router;
