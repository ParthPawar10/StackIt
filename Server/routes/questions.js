import express from 'express';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import Tag from '../models/Tag.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateQuestion, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Get all questions with pagination and filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'recent', // recent, popular, votes, unanswered
      tags,
      search,
      author
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { isActive: true };

    // Add filters
    if (tags) {
      const tagIds = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagIds };
    }

    if (author) {
      query.author = author;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Define sort options
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { views: -1, createdAt: -1 };
        break;
      case 'votes':
        sortOption = { voteScore: -1, createdAt: -1 };
        break;
      case 'unanswered':
        query.answerCount = 0;
        sortOption = { createdAt: -1 };
        break;
      default: // recent
        sortOption = { isPinned: -1, createdAt: -1 };
    }

    const questions = await Question.find(query)
      .populate('author', 'username avatar reputation')
      .populate('tags', 'name color')
      .populate('acceptedAnswer')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Question.countDocuments(query);

    res.json({
      success: true,
      data: {
        questions,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: questions.length,
          totalQuestions: total
        }
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions'
    });
  }
});

// Get single question with answers
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate('author', 'username avatar reputation createdAt')
      .populate('tags', 'name color')
      .populate('acceptedAnswer');

    if (!question || !question.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Increment view count if user is different from author
    if (!req.user || req.user._id.toString() !== question.author._id.toString()) {
      // Check if this user hasn't viewed this question recently
      const hasViewed = question.viewedBy.some(view => 
        req.user && view.user.toString() === req.user._id.toString()
      );

      if (!hasViewed) {
        question.views += 1;
        if (req.user) {
          question.viewedBy.push({ user: req.user._id });
        }
        await question.save();
      }
    }

    // Get answers for this question
    const answers = await Answer.find({ 
      question: id, 
      isActive: true 
    })
      .populate('author', 'username avatar reputation createdAt')
      .populate('comments.author', 'username avatar')
      .sort({ isAccepted: -1, voteScore: -1, createdAt: 1 });

    res.json({
      success: true,
      data: {
        question,
        answers
      }
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch question'
    });
  }
});

// Create new question
router.post('/', authenticateToken, validateQuestion, handleValidationErrors, async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    // Process tags - create new ones if they don't exist
    const tagIds = [];
    for (const tagName of tags) {
      let tag = await Tag.findOne({ name: tagName.toLowerCase() });
      
      if (!tag) {
        tag = new Tag({
          name: tagName.toLowerCase(),
          createdBy: req.user._id
        });
        await tag.save();
      }
      
      // Increment question count for the tag
      tag.questionCount += 1;
      await tag.save();
      
      tagIds.push(tag._id);
    }

    // Create question
    const question = new Question({
      title,
      description,
      author: req.user._id,
      tags: tagIds
    });

    await question.save();

    // Populate the question for response
    const populatedQuestion = await Question.findById(question._id)
      .populate('author', 'username avatar reputation')
      .populate('tags', 'name color');

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: { question: populatedQuestion }
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create question'
    });
  }
});

// Vote on question
router.post('/:id/vote', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'up' or 'down'
    const userId = req.user._id;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is trying to vote on their own question
    if (question.author.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot vote on your own question'
      });
    }

    // Remove any existing votes from this user
    question.votes.upvotes = question.votes.upvotes.filter(
      vote => vote.user.toString() !== userId.toString()
    );
    question.votes.downvotes = question.votes.downvotes.filter(
      vote => vote.user.toString() !== userId.toString()
    );

    // Add new vote
    if (voteType === 'up') {
      question.votes.upvotes.push({ user: userId });
    } else if (voteType === 'down') {
      question.votes.downvotes.push({ user: userId });
    }

    // Calculate vote score
    question.voteScore = question.votes.upvotes.length - question.votes.downvotes.length;

    await question.save();

    // Create notification for question author
    if (voteType === 'up') {
      const notification = new Notification({
        recipient: question.author,
        sender: userId,
        type: 'vote',
        message: `${req.user.username} upvoted your question`,
        relatedQuestion: question._id
      });
      await notification.save();

      // Emit real-time notification
      const io = req.app.get('io');
      io.to(`user-${question.author}`).emit('new-notification', {
        type: 'vote',
        message: notification.message,
        questionId: question._id,
        questionTitle: question.title
      });
    }

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      data: {
        voteScore: question.voteScore,
        userVote: voteType
      }
    });
  } catch (error) {
    console.error('Vote question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record vote'
    });
  }
});

// Update question (only by author)
router.put('/:id', authenticateToken, validateQuestion, handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags } = req.body;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is the author
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the author can edit this question'
      });
    }

    // Update basic fields
    question.title = title;
    question.description = description;

    // Update tags if provided
    if (tags) {
      // Decrease count for old tags
      for (const oldTagId of question.tags) {
        await Tag.findByIdAndUpdate(oldTagId, {
          $inc: { questionCount: -1 }
        });
      }

      // Process new tags
      const tagIds = [];
      for (const tagName of tags) {
        let tag = await Tag.findOne({ name: tagName.toLowerCase() });
        
        if (!tag) {
          tag = new Tag({
            name: tagName.toLowerCase(),
            createdBy: req.user._id
          });
          await tag.save();
        }
        
        tag.questionCount += 1;
        await tag.save();
        tagIds.push(tag._id);
      }

      question.tags = tagIds;
    }

    await question.save();

    const populatedQuestion = await Question.findById(question._id)
      .populate('author', 'username avatar reputation')
      .populate('tags', 'name color');

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: { question: populatedQuestion }
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update question'
    });
  }
});

// Delete question (only by author or admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check permissions
    if (question.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question'
      });
    }

    // Soft delete
    question.isActive = false;
    await question.save();

    // Decrease tag counts
    for (const tagId of question.tags) {
      await Tag.findByIdAndUpdate(tagId, {
        $inc: { questionCount: -1 }
      });
    }

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete question'
    });
  }
});

export default router;
