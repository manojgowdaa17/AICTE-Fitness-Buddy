require('dotenv').config();
require('./config');           // fallback credentials when .env is not present
const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const rateLimit  = require('express-rate-limit');
const path       = require('path');

const chatRouter   = require('./routes/chat');
const healthRouter = require('./routes/health');
const { router: authRouter } = require('./routes/auth');
const plansRouter  = require('./routes/plans');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiter – protect AI and auth endpoints
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 200,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ── Routes ──────────────────────────────────────────────────────
app.use('/api/auth',   authRouter);
app.use('/api/chat',   chatRouter);
app.use('/api/plans',  plansRouter);
app.use('/api/health', healthRouter);

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Error handler ───────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({ error: 'Internal server error. Please try again.' });
});

app.listen(PORT, () => {
  console.log(`\n🏋️  Fitness Buddy is running!`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Mode:    ${process.env.NODE_ENV || 'development'}\n`);
});
