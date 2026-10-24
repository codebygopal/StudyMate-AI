// client/src/services/api.js

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Helper to make API requests with error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Server responded with status ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Health & Tool discovery
  getHealth: () => request('/api/health'),
  getTools: () => request('/api/agent/tools'),

  // Conversational Agent Chat
  sendAgentMessage: (message, history = [], tasks = []) =>
    request('/api/agent/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history, tasks }),
    }),

  // Explicit Tool Invocations
  generateStudyPlan: (planParams) =>
    request('/api/agent/study-plan', {
      method: 'POST',
      body: JSON.stringify(planParams),
    }),

  generateRecommendation: (tasks, studentPreferences = '', subjectFocus = '') =>
    request('/api/agent/recommend', {
      method: 'POST',
      body: JSON.stringify({ tasks, studentPreferences, subjectFocus }),
    }),
};
