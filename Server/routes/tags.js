import express from 'express';
import Tag from '../models/Tag.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateTag, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Get all tags
router.get('/', async (req, res) => {
  try {
    const { search, limit = 50, popular } = req.query;
    
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let sortOption = { name: 1 };
    if (popular === 'true') {
      sortOption = { questionCount: -1, name: 1 };
    }

    const tags = await Tag.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .populate('createdBy', 'username');

    res.json({
      success: true,
      data: { tags }
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tags'
    });
  }
});

// Create new tag
router.post('/', authenticateToken, validateTag, handleValidationErrors, async (req, res) => {
  try {
    const { name, description, color } = req.body;

    // Check if tag already exists
    const existingTag = await Tag.findOne({ name: name.toLowerCase() });
    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: 'Tag already exists'
      });
    }

    const tag = new Tag({
      name: name.toLowerCase(),
      description,
      color: color || '#3b82f6',
      createdBy: req.user._id
    });

    await tag.save();

    res.status(201).json({
      success: true,
      message: 'Tag created successfully',
      data: { tag }
    });
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create tag'
    });
  }
});

export default router;
