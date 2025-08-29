// Session API - Get current user data from session
import { users, sessions } from './callback.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get session ID from cookie
    const sessionId = req.headers.cookie
      ?.split(';')
      ?.find(cookie => cookie.trim().startsWith('session='))
      ?.split('=')[1];

    if (!sessionId) {
      return res.status(401).json({ error: 'No session found' });
    }

    // Look up session
    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      sessions.delete(sessionId);
      return res.status(401).json({ error: 'Session expired' });
    }

    // Get user data
    const user = users.get(session.email);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Return user data (excluding sensitive info)
    const userData = {
      id: user.id,
      email: user.email,
      tier: user.tier,
      monthlyUsage: user.monthlyUsage,
      hasUsedNewUserBonus: user.hasUsedNewUserBonus,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      isAuthenticated: true
    };

    
    res.json(userData);

  } catch (error) {
    console.error('Session API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}