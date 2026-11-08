const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * Simple health check – confirms env vars are set (without exposing secrets).
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Fitness Buddy',
    timestamp: new Date().toISOString(),
    config: {
      ibmApiKey: process.env.IBM_API_KEY ? '✅ Set' : '❌ Missing',
      ibmProjectId: process.env.IBM_PROJECT_ID ? '✅ Set' : '❌ Missing',
      ibmWmlUrl: process.env.IBM_WML_URL || '❌ Missing',
      graniteModel: process.env.IBM_GRANITE_MODEL || 'ibm/granite-3-8b-instruct',
    },
  });
});

module.exports = router;
