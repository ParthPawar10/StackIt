import express from 'express';
import User from '../models/User.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's questions and answers count
    const [questionCount, answerCount] = await Promise.all([
      Question.countDocuments({ author: id, isActive: true }),
      Answer.countDocuments({ author: id, isActive: true })
    ]);

    const userData = {
      ...user.toJSON(),
      stats: {
        questions: questionCount,
        answers: answerCount
      }
    };

    res.json({
      success: true,
      data: { user: userData }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

// Get user's questions
router.get('/:id/questions', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const questions = await Question.find({
      author: id,
      isActive: true
    })
      .populate('tags', 'name color')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments({ author: id, isActive: true });

    res.json({
      success: true,
      data: {
        questions,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: questions.length
        }
      }
    });
  } catch (error) {
    console.error('Get user questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user questions'
    });
  }
});

export default router;
