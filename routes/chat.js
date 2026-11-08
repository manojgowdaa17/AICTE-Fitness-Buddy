const express = require('express');
const router = express.Router();
const { generateWithGranite } = require('../services/ibmGranite');
const { buildMessages, buildWelcomeMessages } = require('../services/fitnessPrompts');

/**
 * POST /api/chat
 * Body: { message: string, history: Array<{role, content}> }
 */
router.post('/', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (message.trim().length > 1000) {
    return res.status(400).json({ error: 'Message too long (max 1000 characters).' });
  }

  try {
    const messages = buildMessages(history, message.trim());
    const reply    = await generateWithGranite(messages);

    if (!reply) {
      return res.status(502).json({ error: 'AI service returned an empty response. Please try again.' });
    }

    return res.json({ reply });
  } catch (err) {
    console.error('[Chat Route Error]', err.response?.data || err.message);

    if (err.response?.status === 401) {
      return res.status(401).json({ error: 'IBM Cloud authentication failed. Please check your API key.' });
    }
    if (err.response?.status === 429) {
      return res.status(429).json({ error: 'AI service rate limit reached. Please wait a moment.' });
    }
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'AI service timed out. Please try again.' });
    }

    return res.status(500).json({ error: 'Failed to get response from AI. Please try again.' });
  }
});

/**
 * GET /api/chat/welcome
 * Returns an AI-generated welcome message.
 */
router.get('/welcome', async (req, res) => {
  try {
    const messages = buildWelcomeMessages();
    const reply    = await generateWithGranite(messages);
    return res.json({ reply: reply || "👋 Hi! I'm Fitness Buddy, your personal AI health and fitness coach! I'm here to help you with workouts, meal ideas, and motivation. What are your fitness goals today?" });
  } catch (err) {
    console.error('[Welcome Route Error]', err.message);
    return res.json({
      reply: "👋 Hi! I'm Fitness Buddy, your personal AI health and fitness coach powered by IBM Granite! I can help you with personalized home workouts, healthy meal ideas, and daily motivation. What fitness goal would you like to work towards today?",
    });
  }
});

module.exports = router;
