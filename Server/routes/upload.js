import express from 'express';
import { upload, handleUploadError } from '../utils/upload.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Upload single image
router.post('/image', authenticateToken, upload.single('image'), handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image'
    });
  }
});

export default router;
