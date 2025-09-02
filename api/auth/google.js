// Google OAuth Authentication - Handle Google Sign-In
import { google } from 'googleapis';
import crypto from 'crypto';
import { users, sessions, createJWTSession } from './callback.js';

// Initialize Google OAuth client
let oauth2Client = null;

function initGoogleOAuth() {
  if (!oauth2Client && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const redirectUri = process.env.NODE_ENV === 'production' 
      ? 'https://jsonpromptstudio.com/api/auth/google'
      : 'http://localhost:5188/api/auth/google';
      
    oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );
  }
  return oauth2Client;
}

// Generate session ID
function generateSessionId() {
  return crypto.randomBytes(24).toString('hex');
}

// Credit granting helper (same as callback.js)
function grantNewUserBonus(userId, email) {
  return {
    creditsGranted: 10,
    type: 'bonus_new_user',
    grantedAt: new Date().toISOString()
  };
}

// Google OAuth initiation endpoint
async function initiateGoogleAuth(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = initGoogleOAuth();
    if (!client) {
      return res.status(500).json({ 
        error: 'Google OAuth not configured',
        details: 'Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET'
      });
    }

    // Generate the URL for Google OAuth consent screen
    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      state: crypto.randomBytes(16).toString('hex'), // CSRF protection
    });

    res.json({ authUrl });

  } catch (error) {
    console.error('Google OAuth initiation error:', error);
    res.status(500).json({ 
      error: 'Failed to initiate Google authentication',
      details: error.message 
    });
  }
}

// Main Google OAuth handler - handles both initiation and callback
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if this is a callback (has code parameter) or initiation
  const { code } = req.query;
  
  if (!code) {
    // This is an initiation request
    return await initiateGoogleAuth(req, res);
  }

  try {
    const { code, error, state } = req.query;

    if (error) {
      console.error('Google OAuth error:', error);
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://jsonpromptstudio.com/app'
        : 'http://localhost:5188/app';
      const redirectUrl = new URL(baseUrl);
      redirectUrl.searchParams.set('auth', 'error');
      redirectUrl.searchParams.set('error', 'google_auth_failed');
      return res.redirect(302, redirectUrl.toString());
    }

    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    const client = initGoogleOAuth();
    if (!client) {
      return res.status(500).json({ 
        error: 'Google OAuth not configured' 
      });
    }

    // Exchange authorization code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const userInfo = await oauth2.userinfo.get();
    
    const {
      id: googleId,
      email,
      name,
      picture: avatarUrl,
      verified_email: emailVerified
    } = userInfo.data;

    if (!email) {
      throw new Error('Email not provided by Google');
    }

    if (!emailVerified) {
      throw new Error('Google account email not verified');
    }


    // Find or create user (same logic as magic link)
    let user = users.get(email);
    let isNewUser = false;

    if (!user) {
      // Create new user
      isNewUser = true;
      const userId = crypto.randomUUID();
      
      user = {
        id: userId,
        email: email,
        name: name || null,
        avatarUrl: avatarUrl || null,
        googleId: googleId,
        authMethod: 'google',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        tier: 'new_user', // Start with new_user tier for 10 bonus generations
        monthlyUsage: 0,
        hasUsedNewUserBonus: false,
        emailVerified: true // Google OAuth verifies email
      };

      users.set(email, user);
    } else {
      // Update existing user with Google info
      user.name = user.name || name;
      user.avatarUrl = user.avatarUrl || avatarUrl;
      user.googleId = googleId;
      user.lastLoginAt = new Date().toISOString();
      users.set(email, user);
    }

    // Grant new user bonus (idempotent)
    let bonusGranted = null;
    if (isNewUser && !user.hasUsedNewUserBonus) {
      bonusGranted = grantNewUserBonus(user.id, email);
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'bonus_credits_granted', {
          amount: bonusGranted.creditsGranted,
          user_id: user.id,
          auth_method: 'google'
        });
      }
    }

    // Create JWT-based session token
    const sessionToken = createJWTSession(user);

    // Set session cookie  
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieDomain = isProduction ? '; Domain=.jsonpromptstudio.com' : '';
    
    // Set session cookie
    res.setHeader('Set-Cookie', [
      `session=${sessionToken}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax${isProduction ? '; Secure' : ''}${cookieDomain}`,
      `justUpgraded=true; Path=/; Max-Age=60; SameSite=Lax${isProduction ? '; Secure' : ''}${cookieDomain}`
    ]);

    // Analytics
    if (isNewUser) {
    }

    // Redirect back to app with success
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://jsonpromptstudio.com/app'
      : 'http://localhost:5188/app';
    const redirectUrl = new URL(baseUrl);
    redirectUrl.searchParams.set('auth', 'success');
    redirectUrl.searchParams.set('method', 'google');
    
    res.redirect(302, redirectUrl.toString());

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    
    // Redirect to app with error
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://jsonpromptstudio.com/app'
      : 'http://localhost:5188/app';
    const redirectUrl = new URL(baseUrl);
    redirectUrl.searchParams.set('auth', 'error');
    redirectUrl.searchParams.set('error', 'google_callback_failed');
    
    res.redirect(302, redirectUrl.toString());
  }
}

// Export for server.js routing
export { initiateGoogleAuth };