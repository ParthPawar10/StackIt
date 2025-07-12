# OAuth Setup Guide

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - Development: `http://localhost:5000/api/auth/google/callback`
     - Production: `https://yourdomain.com/api/auth/google/callback`
5. Copy the Client ID and Client Secret
6. Update your `.env` file:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   ```

## GitHub OAuth Setup

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "Developer settings" > "OAuth Apps"
3. Click "New OAuth App"
4. Fill in the details:
   - Application name: StackIt
   - Homepage URL: `http://localhost:5173` (development) or your domain
   - Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
5. Click "Register application"
6. Copy the Client ID and Client Secret
7. Update your `.env` file:
   ```
   GITHUB_CLIENT_ID=your_github_client_id_here
   GITHUB_CLIENT_SECRET=your_github_client_secret_here
   ```

## Environment Variables

Your complete `.env` file should include:

```env
# Existing variables...
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://parthpawar1011:Parth%4010@stackit.dioenby.mongodb.net/stackit?retryWrites=true&w=majority&appName=stackit
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
SESSION_SECRET=your_super_secret_session_key_change_this_in_production
CLIENT_URL=http://localhost:5173

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Other existing variables...
```

## Testing

1. Start your server: `npm run dev`
2. Go to your client application
3. Click "Sign in" and try the Google or GitHub buttons
4. The OAuth flow should redirect you through the provider and back to your app

## Troubleshooting

- Make sure your redirect URIs match exactly (including protocol and port)
- Check that your OAuth apps are configured for the correct environment
- Verify that the CLIENT_URL environment variable points to your frontend URL
- Check browser console for any CORS or network errors
