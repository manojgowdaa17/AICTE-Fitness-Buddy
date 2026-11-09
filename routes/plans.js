/**
 * plans.js – routes for workout plans, sessions, and progress tracking
 * GET  /api/plans               – list all plans
 * GET  /api/plans/:planId       – single plan with sessions
 * GET  /api/plans/:planId/sessions/:sessionId – session detail with exercises
 * POST /api/plans/:planId/start – start a plan (auth optional)
 * POST /api/plans/:planId/sessions/:sessionId/complete – mark session done
 * POST /api/plans/:planId/exercises/:exerciseId/log – log exercise reps/sets
 * GET  /api/plans/progress      – get all progress for the user
 */
const express = require('express');
const router  = express.Router();
const { PLANS, getProgress } = require('../data/workoutPlans');
const { optionalAuth } = require('./auth');

router.use(optionalAuth);

// Helper: guest userId based on IP
function getUserId(req) {
  return req.user ? req.user.userId : `guest_${req.ip.replace(/[.:]/g, '_')}`;
}

// ── GET /api/plans ───────────────────────────────────────────────
router.get('/', (req, res) => {
  const userId   = getUserId(req);
  const progress = getProgress(userId);

  const list = PLANS.map(p => ({
    id:          p.id,
    title:       p.title,
    level:       p.level,
    goal:        p.goal,
    duration:    p.duration,
    daysPerWeek: p.daysPerWeek,
    emoji:       p.emoji,
    color:       p.color,
    description: p.description,
    totalSessions: p.sessions.length,
    started:     !!progress[p.id],
    completedSessions: progress[p.id]
      ? (progress[p.id].completedSessions || []).length
      : 0,
  }));

  res.json({ plans: list });
});

// ── GET /api/plans/:planId ───────────────────────────────────────
router.get('/:planId', (req, res) => {
  const plan = PLANS.find(p => p.id === req.params.planId);
  if (!plan) return res.status(404).json({ error: 'Plan not found.' });

  const userId   = getUserId(req);
  const progress = getProgress(userId);
  const pp       = progress[plan.id] || {};

  res.json({
    plan: {
      ...plan,
      started:           !!pp.startedAt,
      startedAt:         pp.startedAt || null,
      completedSessions: pp.completedSessions || [],
    },
  });
});

// ── GET /api/plans/:planId/sessions/:sessionId ───────────────────
router.get('/:planId/sessions/:sessionId', (req, res) => {
  const plan = PLANS.find(p => p.id === req.params.planId);
  if (!plan) return res.status(404).json({ error: 'Plan not found.' });

  const session = plan.sessions.find(s => s.id === req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found.' });

  const userId   = getUserId(req);
  const progress = getProgress(userId);
  const pp       = progress[plan.id] || {};
  const logs     = (pp.exerciseLogs || []).filter(l => l.sessionId === session.id);

  res.json({ session, logs });
});

// ── POST /api/plans/:planId/start ────────────────────────────────
router.post('/:planId/start', (req, res) => {
  const plan = PLANS.find(p => p.id === req.params.planId);
  if (!plan) return res.status(404).json({ error: 'Plan not found.' });

  const userId   = getUserId(req);
  const progress = getProgress(userId);

  if (!progress[plan.id]) {
    progress[plan.id] = {
      startedAt:         new Date().toISOString(),
      completedSessions: [],
      exerciseLogs:      [],
    };
  }

  res.json({ ok: true, startedAt: progress[plan.id].startedAt });
});

// ── POST /api/plans/:planId/sessions/:sessionId/complete ─────────
router.post('/:planId/sessions/:sessionId/complete', (req, res) => {
  const plan = PLANS.find(p => p.id === req.params.planId);
  if (!plan) return res.status(404).json({ error: 'Plan not found.' });

  const session = plan.sessions.find(s => s.id === req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found.' });

  const userId   = getUserId(req);
  const progress = getProgress(userId);

  if (!progress[plan.id]) {
    progress[plan.id] = { startedAt: new Date().toISOString(), completedSessions: [], exerciseLogs: [] };
  }

  const completed = progress[plan.id].completedSessions;
  if (!completed.includes(session.id)) {
    completed.push(session.id);
  }

  res.json({ ok: true, completedSessions: completed });
});

// ── POST /api/plans/:planId/exercises/:exerciseId/log ────────────
router.post('/:planId/exercises/:exerciseId/log', (req, res) => {
  const { sessionId, setsCompleted, repsCompleted, note } = req.body;

  const plan = PLANS.find(p => p.id === req.params.planId);
  if (!plan) return res.status(404).json({ error: 'Plan not found.' });

  const userId   = getUserId(req);
  const progress = getProgress(userId);

  if (!progress[plan.id]) {
    progress[plan.id] = { startedAt: new Date().toISOString(), completedSessions: [], exerciseLogs: [] };
  }

  const entry = {
    exerciseId:    req.params.exerciseId,
    sessionId:     sessionId || null,
    setsCompleted: setsCompleted || 0,
    repsCompleted: repsCompleted || 0,
    note:          note || '',
    loggedAt:      new Date().toISOString(),
  };
  progress[plan.id].exerciseLogs.push(entry);

  res.json({ ok: true, entry });
});

// ── GET /api/plans/progress/all ──────────────────────────────────
router.get('/progress/all', (req, res) => {
  const userId   = getUserId(req);
  const progress = getProgress(userId);

  const result = Object.entries(progress).map(([planId, pp]) => {
    const plan = PLANS.find(p => p.id === planId);
    return {
      planId,
      planTitle:         plan ? plan.title : planId,
      planEmoji:         plan ? plan.emoji : '🏋️',
      totalSessions:     plan ? plan.sessions.length : 0,
      startedAt:         pp.startedAt,
      completedSessions: pp.completedSessions || [],
      totalLogs:         (pp.exerciseLogs || []).length,
      lastActivity:      (pp.exerciseLogs || []).length
        ? pp.exerciseLogs[pp.exerciseLogs.length - 1].loggedAt
        : pp.startedAt,
    };
  });

  res.json({ progress: result });
});

module.exports = router;
