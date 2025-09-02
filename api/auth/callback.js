// Authentication Callback Handler - Process OAuth callbacks and manage sessions
import crypto from 'crypto';

// Simple in-memory storage for development - in production use Redis/Database
export const users = new Map();
export const sessions = new Map();
export const magicTokens = new Map();

// Generate session ID
function generateSessionId() {
  return crypto.randomBytes(24).toString('hex');
}

// Generate magic link token
export function generateMagicToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Credit granting helper
function grantNewUserBonus(userId, email) {
  return {
    creditsGranted: 10,
    type: 'bonus_new_user',
    grantedAt: new Date().toISOString(),
    email
  };
}

// Create or update user
export function createOrUpdateUser(userData) {
  const userId = userData.id || userData.email;
  const existingUser = users.get(userId);
  
  const user = {
    id: userId,
    email: userData.email,
    name: userData.name || userData.email.split('@')[0],
    picture: userData.picture || null,
    provider: userData.provider || 'email',
    createdAt: existingUser?.createdAt || new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    credits: existingUser?.credits || 10, // New users get 10 credits
    isPro: existingUser?.isPro || false,
    tier: existingUser?.tier || 'free'
  };
  
  // Grant bonus for new users
  if (!existingUser) {
    const bonus = grantNewUserBonus(userId, userData.email);
    user.bonusGranted = bonus;
  }
  
  users.set(userId, user);
  return user;
}

// Create session
export function createSession(userId) {
  const sessionId = generateSessionId();
  const session = {
    id: sessionId,
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  };
  
  sessions.set(sessionId, session);
  return session;
}

// Validate session
export function validateSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  
  if (new Date(session.expiresAt) < new Date()) {
    sessions.delete(sessionId);
    return null;
  }
  
  return session;
}

// Get user by session
export function getUserBySession(sessionId) {
  const session = validateSession(sessionId);
  if (!session) return null;
  
  return users.get(session.userId);
}

// Main callback handler (for Vercel serverless)
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, state, error } = req.query;

    if (error) {
      console.error('OAuth error:', error);
      return res.redirect('/app?auth_error=' + encodeURIComponent(error));
    }

    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    // This would typically exchange the code for tokens and get user info
    // For now, we'll create a demo user
    const demoUser = createOrUpdateUser({
      id: 'demo_user_' + Date.now(),
      email: 'demo@example.com',
      name: 'Demo User',
      provider: 'google'
    });

    const session = createSession(demoUser.id);

    // Set session cookie
    res.setHeader('Set-Cookie', `session=${session.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);

    // Redirect back to app
    res.redirect('/app?auth_success=true');

  } catch (err) {
    console.error('Callback error:', err);
    res.redirect('/app?auth_error=' + encodeURIComponent('Authentication failed'));
  }
}