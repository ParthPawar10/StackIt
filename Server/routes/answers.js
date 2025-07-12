import express from 'express';
import Answer from '../models/Answer.js';
import Question from '../models/Question.js';
import Notification from '../models/Notification.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateAnswer, validateComment, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Create new answer
router.post('/', authenticateToken, validateAnswer, handleValidationErrors, async (req, res) => {
  try {
    const { content, questionId } = req.body;

    const question = await Question.findById(questionId);
    if (!question || !question.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const answer = new Answer({
      content,
      author: req.user._id,
      question: questionId
    });

    await answer.save();

    // Mention detection: find @username in content
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const mentionedUsernames = [];
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
      mentionedUsernames.push(match[1]);
    }
    if (mentionedUsernames.length > 0) {
      const mentionedUsers = await User.find({ username: { $in: mentionedUsernames } });
      for (const mentionedUser of mentionedUsers) {
        if (mentionedUser._id.toString() !== req.user._id.toString()) {
          const mentionNotification = new Notification({
            recipient: mentionedUser._id,
            sender: req.user._id,
            type: 'mention',
            message: `${req.user.username} mentioned you in an answer`,
            relatedQuestion: questionId,
            relatedAnswer: answer._id
          });
          await mentionNotification.save();
          // Emit real-time notification
          const io = req.app.get('io');
          io.to(`user-${mentionedUser._id}`).emit('new-notification', {
            type: 'mention',
            message: mentionNotification.message,
            questionId: questionId,
            answerId: answer._id
          });
        }
      }
    }

    // Update question answer count
    question.answerCount += 1;
    await question.save();

    // Create notification for question author
    if (question.author.toString() !== req.user._id.toString()) {
      const notification = new Notification({
        recipient: question.author,
        sender: req.user._id,
        type: 'answer',
        message: `${req.user.username} answered your question`,
        relatedQuestion: questionId,
        relatedAnswer: answer._id
      });
      await notification.save();

      // Emit real-time notification
      const io = req.app.get('io');
      io.to(`user-${question.author}`).emit('new-notification', {
        type: 'answer',
        message: notification.message,
        questionId: questionId,
        answerId: answer._id
      });
    }

    const populatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'username avatar reputation');

    res.status(201).json({
      success: true,
      message: 'Answer created successfully',
      data: { answer: populatedAnswer }
    });
  } catch (error) {
    console.error('Create answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create answer'
    });
  }
});

// Vote on answer
router.post('/:id/vote', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body;
    const userId = req.user._id;

    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    if (answer.author.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot vote on your own answer'
      });
    }

    // Remove existing votes
    answer.votes.upvotes = answer.votes.upvotes.filter(
      vote => vote.user.toString() !== userId.toString()
    );
    answer.votes.downvotes = answer.votes.downvotes.filter(
      vote => vote.user.toString() !== userId.toString()
    );

    // Add new vote
    if (voteType === 'up') {
      answer.votes.upvotes.push({ user: userId });
    } else if (voteType === 'down') {
      answer.votes.downvotes.push({ user: userId });
    }

    answer.voteScore = answer.votes.upvotes.length - answer.votes.downvotes.length;
    await answer.save();

    res.json({
      success: true,
      data: { voteScore: answer.voteScore, userVote: voteType }
    });
  } catch (error) {
    console.error('Vote answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record vote'
    });
  }
});

// Accept answer (only question author)
router.post('/:id/accept', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const answer = await Answer.findById(id).populate('question');
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    // Check if user is question author
    if (answer.question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only question author can accept answers'
      });
    }

    // Unaccept previous answer if exists
    if (answer.question.acceptedAnswer) {
      await Answer.findByIdAndUpdate(answer.question.acceptedAnswer, {
        isAccepted: false
      });
    }

    // Accept this answer
    answer.isAccepted = true;
    await answer.save();

    // Update question
    answer.question.acceptedAnswer = answer._id;
    await answer.question.save();

    res.json({
      success: true,
      message: 'Answer accepted successfully'
    });
  } catch (error) {
    console.error('Accept answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept answer'
    });
  }
});

export default router;
