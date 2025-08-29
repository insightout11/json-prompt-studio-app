# Production Environment Variables Setup

## Required Environment Variables for Live Deployment

Before deploying to production, ensure all of these environment variables are properly configured:

### 🔐 Critical Security Variables

```bash
# Stripe Configuration (REQUIRED for payments)
STRIPE_SECRET_KEY=sk_live_... # Get from Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_... # Get from Stripe Webhook settings

# Google OAuth (REQUIRED for authentication)
GOOGLE_CLIENT_ID=your-actual-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-actual-secret
```

### 📊 Analytics & Tracking

```bash
# Google Analytics 4
VITE_GA4_ID=G-XXXXXXXXXX # Get from Google Analytics

# Google Search Console  
VITE_SEARCH_CONSOLE_ID=your-verification-code # Get from Search Console

# Error Tracking (Optional)
VITE_ERROR_TRACKING_ID=your-error-tracking-id # Sentry, LogRocket, etc.
```

### 💳 Stripe Price Configuration

```bash
# Production Stripe Price IDs (REQUIRED)
STRIPE_PRICE_PRO_MONTHLY=price_live_xxx... # Monthly Pro subscription
STRIPE_PRICE_PRO_YEARLY=price_live_xxx...  # Yearly Pro subscription

# Frontend Price IDs (must match above)
VITE_STRIPE_PRICE_PRO_MONTHLY=price_live_xxx...
VITE_STRIPE_PRICE_PRO_YEARLY=price_live_xxx...
```

### 🤖 AI API Keys (Optional - users can provide their own)

```bash
# Groq API for text operations
VITE_GROQ_API_KEY=gsk_live_...

# OpenAI API for image analysis
VITE_OPENAI_API_KEY=sk_live_...
```

### 🌐 App Configuration

```bash
# Production App Settings
VITE_APP_VERSION=1.0.0
VITE_APP_URL=https://yourdomain.com
NODE_ENV=production
```

## Security Checklist

- [ ] All placeholder values replaced with real credentials
- [ ] Stripe keys are using `sk_live_` prefix (not test keys)
- [ ] Google OAuth credentials are for production domain
- [ ] Webhook secrets are properly configured in Stripe dashboard
- [ ] Environment variables are set in your hosting platform (Vercel, Netlify, etc.)
- [ ] No sensitive keys are committed to git repository

## Deployment Steps

1. **Set Environment Variables**: Configure all required variables in your hosting platform
2. **Stripe Webhook Setup**: Configure webhook endpoint URL in Stripe dashboard
3. **Google OAuth Setup**: Add production domain to authorized origins in Google Console
4. **Build & Deploy**: Run `npm run build` and deploy to your hosting platform
5. **Test**: Verify authentication and payments work in production

## Testing Production Variables

Use these commands to verify your environment is properly configured:

```bash
# Test build process
npm run build

# Test lint (should pass without errors)  
npm run lint

# Verify no debug logs in production
grep -r "console\.log" . --exclude-dir=node_modules --exclude-dir=dist
```

## Database Integration (Future)

Current webhook handlers are implemented with placeholder functions. To complete the production setup:

1. Choose a database (MongoDB, PostgreSQL, etc.)
2. Replace placeholder functions in `api/webhook.js` with real database operations
3. Implement user session persistence beyond localStorage
4. Add proper error handling and monitoring

## Support

If you encounter issues during deployment, check:
1. Environment variables are properly set
2. Stripe webhook URL is accessible
3. Google OAuth redirect URIs match your domain
4. All API keys have proper permissions