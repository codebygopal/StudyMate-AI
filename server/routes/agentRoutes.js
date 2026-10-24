const express = require('express');
const router = express.Router();
const agentService = require('../services/agentService');
const { TOOL_REGISTRY } = require('../services/tools');

/**
 * GET /api/agent/tools
 * Returns registered tools for agent inspection and documentation
 */
router.get('/tools', (req, res) => {
  res.json({
    success: true,
    count: TOOL_REGISTRY.length,
    tools: TOOL_REGISTRY.map(t => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    })),
  });
});

/**
 * POST /api/agent/chat
 * Primary agentic conversation endpoint with intent detection, tool routing & trace
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [], tasks = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'A non-empty "message" string is required.',
      });
    }

    const result = await agentService.processRequest({
      message: message.trim(),
      history,
      tasks,
    });

    res.json(result);
  } catch (error) {
    console.error('[AgentRoutes] /chat error:', error.message);
    const statusCode = error.message.includes('GEMINI_API_KEY') || error.message.includes('API key') ? 503 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message || 'An unexpected error occurred while processing the agent request.',
    });
  }
});

/**
 * POST /api/agent/study-plan
 * Explicit tool endpoint for the Study Plan Generator form
 */
router.post('/study-plan', async (req, res) => {
  try {
    const { subject, topics, availableHours, days, difficulty } = req.body;

    if (!subject || !topics) {
      return res.status(400).json({
        success: false,
        error: 'Both "subject" and "topics" are required to generate a study plan.',
      });
    }

    const result = await agentService.processRequest({
      message: `Generate study plan for ${subject}`,
      explicitTool: 'generateStudyPlan',
      toolParams: {
        subject,
        topics,
        availableHours: Number(availableHours) || 2,
        days: Number(days) || 3,
        difficulty: difficulty || 'Medium',
      },
    });

    res.json(result);
  } catch (error) {
    console.error('[AgentRoutes] /study-plan error:', error.message);
    const statusCode = error.message.includes('GEMINI_API_KEY') || error.message.includes('API key') ? 503 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to generate study plan.',
    });
  }
});

/**
 * POST /api/agent/recommend
 * Explicit tool endpoint for Study Recommendations
 */
router.post('/recommend', async (req, res) => {
  try {
    const { tasks = [], studentPreferences = '', subjectFocus = '' } = req.body;

    const result = await agentService.processRequest({
      message: 'Generate personalized study recommendation',
      explicitTool: 'generateStudyRecommendation',
      toolParams: {
        tasks,
        studentPreferences,
        subjectFocus,
      },
    });

    res.json(result);
  } catch (error) {
    console.error('[AgentRoutes] /recommend error:', error.message);
    const statusCode = error.message.includes('GEMINI_API_KEY') || error.message.includes('API key') ? 503 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to generate study recommendation.',
    });
  }
});

module.exports = router;
