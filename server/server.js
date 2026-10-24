require('dotenv').config();
const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/healthRoutes');
const agentRoutes = require('./routes/agentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable open CORS for all client origins
app.use(cors());

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to StudyMate AI API Server',
    description: 'AI-Powered Study Planner and Academic Assistant for Computer Science & Engineering',
    status: 'Running',
    version: '1.0.0',
    documentation: {
      health: '/api/health',
      agentChat: 'POST /api/agent/chat',
      studyPlan: 'POST /api/agent/study-plan',
      recommendations: 'POST /api/agent/recommend',
      tools: 'GET /api/agent/tools',
    },
  });
});

// Routes
app.use('/api', healthRoutes);
app.use('/api/agent', agentRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack || err.message);
  res.status(500).json({
    success: false,
    error: err.message || 'An internal server error occurred.',
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 StudyMate AI Server running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🤖 Agent Tools:  http://localhost:${PORT}/api/agent/tools`);
    console.log(`🔑 Gemini Configured: ${process.env.GEMINI_API_KEY ? 'YES' : 'NO (Add in server/.env)'}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
