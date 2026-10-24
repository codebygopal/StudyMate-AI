require('dotenv').config();
const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/healthRoutes');
const agentRoutes = require('./routes/agentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(s => s.trim()) : []),
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV !== 'production' ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked request from origin ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

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

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 StudyMate AI Server running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Agent Tools:  http://localhost:${PORT}/api/agent/tools`);
  console.log(`🔑 Gemini Configured: ${process.env.GEMINI_API_KEY ? 'YES' : 'NO (Add in server/.env)'}`);
  console.log(`====================================================`);
});

module.exports = app;
