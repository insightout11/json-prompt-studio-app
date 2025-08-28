# 🔑 API Keys Setup Guide

## Quick Setup Instructions

### 1. Get Your API Keys

**Stable Horde (Free Tier):**
- Visit: https://stablehorde.net/register
- Sign in with Google/Discord/GitHub
- Copy your API key

**Google Gemini (Pro Tier):**
- Visit: https://aistudio.google.com/app/apikey
- Sign in with Google account
- Create API key

### 2. Update Environment Variables

Replace the placeholder values in your `.env` file:

```bash
# Replace these with your actual API keys
HORDE_API_KEY=your_actual_stable_horde_key
GEMINI_API_KEY=your_actual_google_gemini_key

# Optional: Google OAuth (for "Continue with Google" feature)
GOOGLE_CLIENT_ID=your-google-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
```

**📋 Need Google OAuth setup?** See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for detailed instructions.

### 3. Test the Integration

Start your development server:
```bash
npm run dev:full  # Starts both frontend and backend
```

Then visit your app and try generating an image preview!

## 🚨 Security Notes

- ✅ API keys are server-side only (never sent to browser)
- ✅ Rate limiting protects against abuse
- ✅ Environment variables are git-ignored
- ⚠️  Never commit real API keys to version control
- 💡 Use `0000000000` for Horde if testing without registration

## 💰 Pricing Overview

**Stable Horde:**
- Free with registration
- Earn Kudos by contributing compute or small donations
- Higher Kudos = better priority in queue

**Google Gemini:**
- Generous free tier for development
- Pay-per-use for production
- Check current pricing: https://ai.google.dev/pricing

## 🧪 Testing Your Setup

1. **Check API Health:**
   - Visit: `http://localhost:3002/api/health`
   - Should show both APIs as configured: `true`

2. **Test Free Generation:**
   - Create any JSON prompt in the app
   - Click "Generate Free Preview"
   - Should work with Stable Horde

3. **Test Pro Generation:**
   - Switch to Pro mode (or use dev toggles)
   - Generate with enhanced options
   - Should use Gemini placeholder (until real API available)

## 🔧 Troubleshooting

**"API key not configured" errors:**
- Double-check `.env` file has correct variable names
- Restart your development server after changing `.env`
- Verify no extra spaces around the `=` sign

**Rate limiting issues:**
- Clear localStorage to reset anonymous usage
- Register for a Stable Horde account for better limits

**Can't see the preview tray:**
- Ensure you have some JSON data generated first
- The tray appears below the JSON output section

## Next Steps

Once API keys are working:
1. Test both free and pro image generation
2. Try the storyboard integration features
3. Experiment with different prompt enhancements
4. Consider setting up the BYOK system for power users

Happy generating! 🎨