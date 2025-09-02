// User Account Deletion API
import { parseJWTSession, users } from '../auth/callback.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get session token from cookie
    const sessionToken = req.headers.cookie
      ?.split(';')
      ?.find(cookie => cookie.trim().startsWith('session='))
      ?.split('=')[1];

    if (!sessionToken) {
      return res.status(401).json({ error: 'No session found' });
    }

    // Parse JWT session token
    const userData = parseJWTSession(sessionToken);
    if (!userData) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Get confirmation from request body
    const { confirmation } = req.body;
    if (confirmation !== 'DELETE_MY_ACCOUNT') {
      return res.status(400).json({ 
        error: 'Account deletion requires confirmation string: DELETE_MY_ACCOUNT' 
      });
    }

    // Find user
    const user = users.get(userData.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`🗑️ Deleting account for user: ${user.email} (${user.id})`);

    // Remove user from users map
    users.delete(userData.userId);

    // Clear session cookie
    res.setHeader('Set-Cookie', [
      'session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
    ]);

    console.log(`✅ Account deleted successfully for: ${user.email}`);

    res.json({
      success: true,
      message: 'Account has been permanently deleted',
      deletedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Account deletion API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}