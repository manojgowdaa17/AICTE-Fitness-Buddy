/**
 * auth.js – lightweight in-memory auth (no DB required)
 * Uses bcrypt-style hashing via crypto, JWT-like tokens via signed JSON.
 * For production, replace with a real DB + proper JWT library.
 */
const express  = require('express');
const crypto   = require('crypto');
const router   = express.Router();

// ── In-memory stores ────────────────────────────────────────────
// users: { [email]: { id, name, email, passwordHash, createdAt } }
const users  = new Map();
// sessions: { [token]: { userId, email, name, expiresAt } }
const sessions = new Map();

// ── Helpers ─────────────────────────────────────────────────────
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'fb_salt_2024').digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function createSession(user) {
  const token = generateToken();
  sessions.set(token, {
    userId:    user.id,
    email:     user.email,
    name:      user.name,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
}

// ── Middleware: optional auth (attaches user if token valid) ────
function optionalAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (token) {
    const session = sessions.get(token);
    if (session && session.expiresAt > Date.now()) {
      req.user = session;
    }
  }
  next();
}

// ── POST /api/auth/signup ────────────────────────────────────────
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }
  if (users.has(email.toLowerCase())) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const user = {
    id:           crypto.randomUUID(),
    name:         name.trim(),
    email:        email.toLowerCase().trim(),
    passwordHash: hashPassword(password),
    createdAt:    new Date().toISOString(),
  };
  users.set(user.email, user);

  const token = createSession(user);
  return res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// ── POST /api/auth/login ─────────────────────────────────────────
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = users.get(email.toLowerCase().trim());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = createSession(user);
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// ── POST /api/auth/logout ────────────────────────────────────────
router.post('/logout', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (token) sessions.delete(token);
  return res.json({ ok: true });
});

// ── GET /api/auth/me ─────────────────────────────────────────────
router.get('/me', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not authenticated.' });

  const session = sessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ error: 'Session expired.' });
  }
  return res.json({ user: { id: session.userId, name: session.name, email: session.email } });
});

module.exports = { router, optionalAuth };
