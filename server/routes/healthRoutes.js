const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');
const { TOOL_REGISTRY } = require('../services/tools');

/**
 * GET /api/health
 * System health check and readiness probe
 */
router.get('/health', (req, res) => {
  const isGeminiReady = geminiService.isConfigured();

  res.json({
    status: 'OK',
    application: 'StudyMate AI - Academic Assistant Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    geminiConfigured: isGeminiReady,
    geminiStatusMessage: isGeminiReady
      ? 'Google Gemini API is configured and ready.'
      : 'GEMINI_API_KEY is not set in server/.env. Add your free key to enable live AI responses.',
    registeredToolsCount: TOOL_REGISTRY.length,
    registeredTools: TOOL_REGISTRY.map(t => t.name),
  });
});

module.exports = router;
