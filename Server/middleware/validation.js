import { body, validationResult } from 'express-validator';
import sanitizeHtml from 'sanitize-html';

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];
export const validateQuestion = [
  body('title')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters long')
    .customSanitizer(value => {
      return sanitizeHtml(value, {
        allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
        allowedAttributes: {
          'a': ['href', 'target'],
          'img': ['src', 'alt', 'width', 'height'],
          '*': ['style']
        },
        allowedStyles: {
          '*': {
            'text-align': [/^(left|right|center|justify)$/],
            'font-weight': [/^(bold|normal)$/],
            'font-style': [/^(italic|normal)$/],
            'text-decoration': [/^(underline|line-through|none)$/]
          }
        }
      });
    }),
  
  body('tags')
    .isArray({ min: 1, max: 5 })
    .withMessage('Please provide 1-5 tags')
    .custom((tags) => {
      if (tags.some(tag => typeof tag !== 'string' || tag.trim().length === 0)) {
        throw new Error('All tags must be non-empty strings');
      }
      return true;
    })
];

// Answer validation rules
export const validateAnswer = [
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Answer must be at least 10 characters long')
    .customSanitizer(value => {
      return sanitizeHtml(value, {
        allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
        allowedAttributes: {
          'a': ['href', 'target'],
          'img': ['src', 'alt', 'width', 'height'],
          '*': ['style']
        },
        allowedStyles: {
          '*': {
            'text-align': [/^(left|right|center|justify)$/],
            'font-weight': [/^(bold|normal)$/],
            'font-style': [/^(italic|normal)$/],
            'text-decoration': [/^(underline|line-through|none)$/]
          }
        }
      });
    })
];

// Comment validation rules
export const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters')
];

// Tag validation rules
export const validateTag = [
  body('name')
    .trim()
    .toLowerCase()
    .isLength({ min: 1, max: 20 })
    .withMessage('Tag name must be between 1 and 20 characters')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Tag name can only contain lowercase letters, numbers, and hyphens'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Tag description cannot exceed 200 characters'),
  
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color')
];
