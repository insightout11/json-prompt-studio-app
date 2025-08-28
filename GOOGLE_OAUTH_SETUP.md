# Google OAuth Setup Guide

This guide shows you how to set up Google OAuth authentication for the "Continue with Google" feature.

## Prerequisites
- Google account
- Access to Google Cloud Console

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `AI Video Prompt Generator` (or your app name)
4. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google+ API" (or "People API")
3. Click "Enable" 

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth 2.0 Client IDs"**
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" (for testing)
   - Fill in required fields:
     - App name: `AI Video Prompt Generator`
     - User support email: Your email
     - Developer contact information: Your email
   - Add scopes: `userinfo.email`, `userinfo.profile`
   - Add test users: Your email addresses

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `AI Video Prompt Generator Web Client`
   - Authorized redirect URIs:
     - `http://localhost:5188/api/auth/google/callback` (development)
     - `https://yourdomain.com/api/auth/google/callback` (production)

5. Click **"Create"**
6. Copy the **Client ID** and **Client Secret**

## Step 4: Add Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Google OAuth credentials:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-actual-client-secret
```

## Step 5: Test the Setup

1. Restart your server: `npm run dev` and `PORT=3001 node server.js`
2. Go to `http://localhost:5188/`
3. Try to generate an image (use up anonymous trials)
4. Click **"Continue with Google"**
5. Should open Google OAuth popup

## Common Issues

### "redirect_uri_mismatch" Error
- Make sure the redirect URI in Google Console exactly matches your callback URL
- For development: `http://localhost:5188/api/auth/google/callback`
- Note: Use the port where your Vite dev server is running

### "This app isn't verified" Warning
- During development, Google shows a warning screen
- Click "Advanced" → "Go to [Your App Name] (unsafe)" to continue
- This is normal for development/testing

### "Access blocked" Error
- Make sure you added your email as a test user in the OAuth consent screen
- Or publish your app for general use (requires verification)

## Production Setup

For production deployment:

1. Update the authorized redirect URI in Google Console:
   ```
   https://yourdomain.com/api/auth/google/callback
   ```

2. Update the redirect URL in your server code (`api/auth/google.js`):
   ```javascript
   // Change this line to use your domain
   `https://yourdomain.com/api/auth/google/callback`
   ```

3. Consider verifying your app to remove the "unverified app" warning

## Security Notes

- Keep your `GOOGLE_CLIENT_SECRET` private - never commit to git
- Use HTTPS in production
- Consider implementing additional security measures like state parameter validation
- Review Google's OAuth security best practices

## Testing

Once set up, the Google OAuth flow should:
1. Open Google sign-in popup when "Continue with Google" is clicked
2. Create a new user account (or login existing user)
3. Grant 10 bonus premium generations
4. Redirect to the app with authentication success

The user gets the same benefits as magic link authentication but with a faster, one-click experience.