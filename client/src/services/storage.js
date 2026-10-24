// client/src/services/storage.js

const KEYS = {
  TASKS: 'studymate_tasks',
  STUDY_PLANS: 'studymate_study_plans',
  CHAT_HISTORY: 'studymate_chat_history',
  STATS: 'studymate_stats',
};

// Initial starter tasks for a realistic college CS student experience
const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Study B-Trees and B+ Trees in DBMS',
    description: 'Understand node structure, indexing mechanisms, and time complexity for search/insertion.',
    subject: 'Database Management Systems',
    priority: 'High',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Implement Banker\'s Algorithm in C++',
    description: 'Lab practical assignment for deadlock avoidance in Operating Systems.',
    subject: 'Operating Systems',
    priority: 'High',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day from now
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Review TCP 3-Way Handshake & Sliding Window',
    description: 'Prepare notes for Unit Test 2 Computer Networks syllabus.',
    subject: 'Computer Networks',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Solve LeetCode Top 5 Dynamic Programming Problems',
    description: 'Longest Common Subsequence, 0/1 Knapsack, Coin Change problem.',
    subject: 'Design & Analysis of Algorithms',
    priority: 'Low',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

export const storage = {
  // Tasks
  getTasks: () => {
    try {
      const data = localStorage.getItem(KEYS.TASKS);
      if (!data) {
        localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
        return INITIAL_TASKS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading tasks from localStorage:', e);
      return [];
    }
  },

  saveTasks: (tasks) => {
    try {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks to localStorage:', e);
    }
  },

  // Study Plans History
  getStudyPlans: () => {
    try {
      const data = localStorage.getItem(KEYS.STUDY_PLANS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading study plans from localStorage:', e);
      return [];
    }
  },

  saveStudyPlan: (plan) => {
    try {
      const current = storage.getStudyPlans();
      const updated = [
        {
          id: `plan-${Date.now()}`,
          savedAt: new Date().toISOString(),
          ...plan,
        },
        ...current,
      ];
      localStorage.setItem(KEYS.STUDY_PLANS, JSON.stringify(updated));
      storage.incrementStat('plansCreated');
      return updated;
    } catch (e) {
      console.error('Error saving study plan to localStorage:', e);
      return [];
    }
  },

  deleteStudyPlan: (id) => {
    try {
      const current = storage.getStudyPlans();
      const updated = current.filter((p) => p.id !== id);
      localStorage.setItem(KEYS.STUDY_PLANS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error deleting study plan from localStorage:', e);
      return [];
    }
  },

  // Chat History
  getChatHistory: () => {
    try {
      const data = localStorage.getItem(KEYS.CHAT_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading chat history from localStorage:', e);
      return [];
    }
  },

  saveChatHistory: (messages) => {
    try {
      localStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving chat history to localStorage:', e);
    }
  },

  clearChatHistory: () => {
    localStorage.removeItem(KEYS.CHAT_HISTORY);
  },

  // Stats
  getStats: () => {
    try {
      const data = localStorage.getItem(KEYS.STATS);
      return data ? JSON.parse(data) : { questionsAsked: 0, plansCreated: 0, recommendationsViewed: 0 };
    } catch (e) {
      return { questionsAsked: 0, plansCreated: 0, recommendationsViewed: 0 };
    }
  },

  incrementStat: (statKey) => {
    try {
      const stats = storage.getStats();
      stats[statKey] = (stats[statKey] || 0) + 1;
      localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    } catch (e) {}
  },
};
