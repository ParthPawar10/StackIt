import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Initialize OAuth strategies
export function initializeOAuth() {
  console.log('Initializing OAuth strategies...');
  console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
  console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);
  
  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback",
          scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
          console.log('=== GOOGLE STRATEGY CALLBACK STARTED ===');
          console.log('Function parameters received:');
          console.log('- accessToken:', typeof accessToken);
          console.log('- refreshToken:', typeof refreshToken);
          console.log('- profile:', typeof profile);
          console.log('- done:', typeof done);
          console.log('Access Token received:', !!accessToken);
          console.log('Profile object:', JSON.stringify(profile, null, 2));
          console.log('Google strategy callback executed with profile:', {
            id: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value
          });
          
          console.log('About to start try block for user creation...');
          
          try {
            console.log('Starting user lookup/creation process...');
            
            // Check if user already exists with this Google ID
            console.log('Checking for existing Google user with ID:', profile.id);
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
              console.log('Found existing Google user:', user._id);
              console.log('About to call done() with user object:', {
                id: user._id,
                email: user.email,
                username: user.username,
                type: typeof user
              });
              const result = done(null, user);
              console.log('Done() function call result:', result);
              return result;
            }

            console.log('No Google user found, checking for existing email user...');
            // Check if user exists with same email
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
              console.log('Found existing email user, linking Google account:', user._id);
              // Link Google account to existing user
              user.googleId = profile.id;
              await user.save();
              console.log('Google account linked successfully');
              return done(null, user);
            }

            // Create new user
            console.log('Creating new Google user with data:', {
              googleId: profile.id,
              username: profile.displayName || profile.emails[0].value.split('@')[0],
              email: profile.emails[0].value,
              fullName: profile.displayName,
              avatar: profile.photos[0]?.value
            });
            
            const newUser = new User({
              googleId: profile.id,
              username: profile.displayName || profile.emails[0].value.split('@')[0],
              email: profile.emails[0].value,
              fullName: profile.displayName,
              avatar: profile.photos[0]?.value,
              isEmailVerified: true, // Google emails are verified
            });

            await newUser.save();
            console.log('New Google user created successfully:', newUser._id);
            done(null, newUser);
          } catch (error) {
            console.error('Error in Google OAuth strategy:', error);
            console.error('Error stack:', error.stack);
            done(error, null);
          }
        }
      )
    );
    console.log('Google OAuth strategy initialized');
  } else {
    console.log('Google OAuth credentials not found, skipping Google strategy');
  }

  // GitHub OAuth Strategy
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: "/api/auth/github/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists with this GitHub ID
            let user = await User.findOne({ githubId: profile.id });

            if (user) {
              return done(null, user);
            }

            // Check if user exists with same email
            const email = profile.emails?.[0]?.value;
            if (email) {
              user = await User.findOne({ email });

              if (user) {
                // Link GitHub account to existing user
                user.githubId = profile.id;
                await user.save();
                return done(null, user);
              }
            }

            // Create new user
            console.log('Creating new GitHub user:', {
              githubId: profile.id,
              username: profile.username || profile.displayName || `github_${profile.id}`,
              email: email,
              fullName: profile.displayName
            });
            const newUser = new User({
              githubId: profile.id,
              username: profile.username || profile.displayName || `github_${profile.id}`,
              email: email,
              fullName: profile.displayName,
              avatar: profile.photos[0]?.value,
              isEmailVerified: !!email, // GitHub emails might not be public
            });

            await newUser.save();
            console.log('New GitHub user created successfully:', newUser._id);
            done(null, newUser);
          } catch (error) {
            done(error, null);
          }
        }
      )
    );
    console.log('GitHub OAuth strategy initialized');
  } else {
    console.log('GitHub OAuth credentials not found, skipping GitHub strategy');
  }
}

export default passport;
