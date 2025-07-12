import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';
import { validateRegister, validateLogin, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Register
router.post('/register', validateRegister, handleValidationErrors, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user'
    });
  }
});

// Login
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login'
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { bio, avatar } = req.body;
    const allowedUpdates = { bio, avatar };
    
    // Remove undefined values
    Object.keys(allowedUpdates).forEach(key => 
      allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      allowedUpdates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const newToken = generateToken(req.user._id);
    
    res.json({
      success: true,
      data: { token: newToken }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token'
    });
  }
});

// Google OAuth routes
router.get('/google', (req, res, next) => {
  console.log('Google OAuth route hit');
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/auth?error=google_auth_failed`,
    session: false
  }),
  async (req, res) => {
    console.log('Google callback route hit after passport authentication');
    console.log('User from passport:', req.user);
    console.log('User type:', typeof req.user);
    console.log('User._id:', req.user?._id);
    
    try {
      if (!req.user) {
        console.error('No user in req.user after passport authentication');
        return res.redirect(`${process.env.CLIENT_URL}/auth?error=no_user`);
      }

      const token = generateToken(req.user._id);
      console.log('Google OAuth successful, redirecting to success page with token');
      res.redirect(`/api/auth/success?token=${token}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/auth?error=server_error`);
    }
  }
);

// GitHub OAuth routes  
router.get('/github', (req, res, next) => {
  console.log('GitHub OAuth route hit');
  next();
}, passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { 
    failureRedirect: `${process.env.CLIENT_URL}/auth?error=github_auth_failed`,
    session: false
  }),
  async (req, res) => {
    console.log('GitHub callback route hit after passport authentication');
    console.log('User from passport:', req.user);
    console.log('User type:', typeof req.user);
    console.log('User._id:', req.user?._id);
    
    try {
      if (!req.user) {
        console.error('No user in req.user after passport authentication');
        return res.redirect(`${process.env.CLIENT_URL}/auth?error=no_user`);
      }

      const token = generateToken(req.user._id);
      console.log('GitHub OAuth successful, redirecting to success page with token');
      res.redirect(`/api/auth/success?token=${token}`);
    } catch (error) {
      console.error('GitHub OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/auth?error=server_error`);
    }
  }
);

// OAuth success route
router.get('/success', (req, res) => {
  const { token } = req.query;
  console.log('Success route hit with token:', !!token);
  
  if (!token) {
    console.log('No token provided, redirecting to auth with error');
    return res.redirect(`${process.env.CLIENT_URL}/auth?error=no_token`);
  }

  console.log('Sending success page with token to close popup');
  // Send HTML page that will handle the token and close the popup
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authentication Success</title>
      </head>
      <body>
        <h2>Authentication Successful!</h2>
        <p>Completing login...</p>
        <script>
          console.log('OAuth success page loaded');
          console.log('Token present:', !!('${token}'));
          console.log('Window opener exists:', !!window.opener);
          
          if (window.opener) {
            console.log('Sending OAuth success message');
            
            const message = {
              type: 'OAUTH_SUCCESS',
              token: '${token}'
            };
            
            // Try multiple approaches
            try {
              window.opener.postMessage(message, 'http://localhost:5173');
              console.log('Message sent to http://localhost:5173');
            } catch (e) {
              console.error('Error sending to specific origin:', e);
            }
            
            setTimeout(() => {
              try {
                window.opener.postMessage(message, '*');
                console.log('Message sent to any origin');
              } catch (e) {
                console.error('Error sending to any origin:', e);
              }
            }, 100);
            
            setTimeout(() => {
              console.log('Closing popup window');
              window.close();
            }, 2000); // 2 seconds
          } else {
            console.log('No window.opener, storing token locally');
            localStorage.setItem('token', '${token}');
            window.location.href = 'http://localhost:5173/dashboard';
          }
        </script>
      </body>
    </html>
  `);
});

// Test endpoint to diagnose OAuth flow
router.get('/test-google-callback', async (req, res) => {
  console.log('TEST: Google callback test endpoint hit');
  console.log('TEST: Query params:', req.query);
  console.log('TEST: Session:', req.session);
  
  // Simulate what passport.authenticate should do
  try {
    // Mock profile data for testing
    const mockProfile = {
      id: 'test123',
      emails: [{ value: 'test@gmail.com' }],
      displayName: 'Test User'
    };
    
    console.log('TEST: Looking for user with googleId:', mockProfile.id);
    let user = await User.findOne({ googleId: mockProfile.id });
    
    if (user) {
      console.log('TEST: Found existing user:', user._id);
    } else {
      console.log('TEST: No user found, would create new user');
    }
    
    res.json({
      success: true,
      message: 'Test callback working',
      userFound: !!user,
      profile: mockProfile
    });
  } catch (error) {
    console.error('TEST: Error in test callback:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
