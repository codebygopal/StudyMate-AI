const geminiService = require('./geminiService');

/**
 * Tool 1: answerAcademicQuestion
 * Explains an academic topic or solves a student doubt in clear, pedagogical terms.
 */
async function answerAcademicQuestion({ query, subject = 'General Academic', context = '' }) {
  if (!query || typeof query !== 'string') {
    throw new Error('Query parameter is required for answerAcademicQuestion.');
  }

  const systemPrompt = `You are StudyMate AI, an expert, patient, and highly encouraging college academic assistant.
Your goal is to explain concepts clearly to undergraduate Computer Science & Engineering and STEM students.

Follow this pedagogical structure:
1. **Core Concept**: 2-3 sentences explaining the intuition simply.
2. **Key Components / Working**: Clear bullet points or step-by-step breakdown.
3. **Real-world Example / Analogy**: An intuitive analogy or practical engineering scenario.
4. **Code / Syntax / Formula** (if applicable): Clean, well-commented code or formula.
5. **Quick Exam / Revision Takeaway**: A 1-sentence tip on what to remember for exams or interviews.

Subject Domain: ${subject}
Additional Context: ${context || 'None provided'}`;

  const userPrompt = `Student Question: ${query}`;
  const answer = await geminiService.generateContent(userPrompt, systemPrompt);

  return {
    tool: 'answerAcademicQuestion',
    subject,
    query,
    answer,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Tool 2: generateStudyPlan
 * Creates a structured, realistic study timetable and roadmap.
 */
async function generateStudyPlan({ subject, topics, availableHours, days, difficulty = 'Medium' }) {
  if (!subject) throw new Error('Subject is required to generate a study plan.');
  if (!topics) throw new Error('Topics are required to generate a study plan.');

  const safeHours = Number(availableHours) || 2;
  const safeDays = Number(days) || 3;

  const systemPrompt = `You are StudyMate AI's Intelligent Curriculum Planner.
You create structured, realistic, and highly practical study schedules for engineering students.
Always return output strictly as valid JSON adhering to this schema:
{
  "subject": string,
  "difficulty": string,
  "totalDays": number,
  "dailyHours": number,
  "totalHours": number,
  "overview": string,
  "days": [
    {
      "dayNumber": number,
      "dayTitle": string,
      "recommendedHours": number,
      "topics": [
        {
          "topicName": string,
          "suggestedDurationMinutes": number,
          "priority": "High" | "Medium" | "Low",
          "recommendedSequence": number,
          "shortStudySuggestions": string
        }
      ]
    }
  ],
  "studyTips": [string, string, string]
}`;

  const userPrompt = `Create a detailed ${safeDays}-day study schedule for:
Subject: ${subject}
Topics: ${Array.isArray(topics) ? topics.join(', ') : topics}
Available Study Hours per Day: ${safeHours} hours
Difficulty / Priority Level: ${difficulty}`;

  const planData = await geminiService.generateStructuredContent(userPrompt, systemPrompt);
  
  return {
    tool: 'generateStudyPlan',
    plan: planData,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Tool 3: retrieveStudentTasks
 * Inspects and filters student tasks passed from client context.
 */
function retrieveStudentTasks({ tasks = [], filter = 'all' }) {
  if (!Array.isArray(tasks)) {
    return { tasks: [], total: 0, filter };
  }

  let filtered = [...tasks];
  if (filter === 'pending') {
    filtered = filtered.filter(t => !t.completed);
  } else if (filter === 'completed') {
    filtered = filtered.filter(t => t.completed);
  } else if (filter === 'high-priority') {
    filtered = filtered.filter(t => !t.completed && (t.priority === 'High' || t.priority === 'high'));
  }

  return {
    tool: 'retrieveStudentTasks',
    filter,
    total: filtered.length,
    tasks: filtered,
    retrievedAt: new Date().toISOString(),
  };
}

/**
 * Tool 4: getPendingTasks
 * Specifically extracts pending tasks and checks for urgent deadlines.
 */
function getPendingTasks({ tasks = [] }) {
  const taskList = Array.isArray(tasks) ? tasks : [];
  const pending = taskList.filter(t => !t.completed);
  
  const now = new Date();
  const categorized = pending.map(task => {
    let isOverdue = false;
    let daysRemaining = null;
    if (task.dueDate) {
      const due = new Date(task.dueDate);
      const diffTime = due.getTime() - now.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      isOverdue = daysRemaining < 0;
    }
    return {
      ...task,
      isOverdue,
      daysRemaining,
    };
  });

  return {
    tool: 'getPendingTasks',
    pendingCount: categorized.length,
    tasks: categorized,
    highPriorityCount: categorized.filter(t => t.priority === 'High' || t.priority === 'high').length,
    overdueCount: categorized.filter(t => t.isOverdue).length,
  };
}

/**
 * Tool 5: generateStudyRecommendation
 * Generates AI-driven priority advice based on student's current workload and tasks.
 */
async function generateStudyRecommendation({ tasks = [], studentPreferences = '', subjectFocus = '' }) {
  const pendingData = getPendingTasks({ tasks });
  
  if (pendingData.pendingCount === 0) {
    return {
      tool: 'generateStudyRecommendation',
      recommendation: {
        focusArea: 'Revision or Exploration',
        urgency: 'Low',
        headline: 'All tasks completed! Great time for revision.',
        rationale: 'You currently have no pending tasks in your Task Manager. You can utilize this time to review past topics, solve previous university exam papers, or create a new study plan for upcoming semester modules.',
        actionSteps: [
          'Review notes from the most challenging subject of the week.',
          'Solve 2-3 previous year university question papers.',
          'Generate a fresh study plan for the upcoming unit using the Study Plan Generator.'
        ],
        estimatedTimeNeeded: '60-90 minutes'
      },
      taskContext: pendingData,
      generatedAt: new Date().toISOString(),
    };
  }

  const systemPrompt = `You are StudyMate AI's Academic Prioritization Coach.
You analyze a student's pending academic tasks, deadlines, and priorities to provide actionable guidance.
Return strictly valid JSON with this schema:
{
  "focusArea": string,
  "urgency": "Urgent" | "High" | "Medium" | "Normal",
  "headline": string,
  "rationale": string,
  "actionSteps": [string, string, string],
  "suggestedBreakdown": {
    "recommendedTaskTitle": string,
    "recommendedMinutes": number,
    "focusTechnique": string
  }
}`;

  const tasksSummary = pendingData.tasks.map(t => 
    `- [${t.priority || 'Medium'} Priority] ${t.title}: ${t.description || 'No description'} (Due: ${t.dueDate || 'No date'}, Overdue: ${t.isOverdue ? 'YES' : 'NO'})`
  ).join('\n');

  const userPrompt = `Student's Pending Tasks:
${tasksSummary}

Student Preferences / Message: ${studentPreferences || 'None'}
Subject Focus: ${subjectFocus || 'General'}

Provide the optimal study recommendation based on urgency, difficulty, and priority.`;

  const recommendation = await geminiService.generateStructuredContent(userPrompt, systemPrompt);

  return {
    tool: 'generateStudyRecommendation',
    recommendation,
    taskContext: {
      totalPending: pendingData.pendingCount,
      overdueCount: pendingData.overdueCount,
      highPriorityCount: pendingData.highPriorityCount,
    },
    generatedAt: new Date().toISOString(),
  };
}

// Registry metadata for the Agent Controller
const TOOL_REGISTRY = [
  {
    name: 'answerAcademicQuestion',
    description: 'Explains concepts, answers questions, or clarifies doubts on computer science and academic subjects.',
    parameters: {
      query: 'The student question or doubt (required)',
      subject: 'The academic subject or domain (optional)',
      context: 'Previous conversation context or specifics (optional)'
    },
    handler: answerAcademicQuestion,
  },
  {
    name: 'generateStudyPlan',
    description: 'Generates a structured multi-day study schedule and breakdown for given topics and hours.',
    parameters: {
      subject: 'Subject name (required)',
      topics: 'List of topics or text description of syllabus (required)',
      availableHours: 'Hours available per day (number, required)',
      days: 'Number of study days (number, required)',
      difficulty: 'Difficulty level: Low, Medium, High (optional)'
    },
    handler: generateStudyPlan,
  },
  {
    name: 'retrieveStudentTasks',
    description: 'Retrieves and filters student tasks stored in the application context.',
    parameters: {
      filter: 'Filter type: all, pending, completed, high-priority'
    },
    handler: retrieveStudentTasks,
  },
  {
    name: 'getPendingTasks',
    description: 'Extracts pending tasks, calculates days remaining, and flags overdue deadlines.',
    parameters: {},
    handler: getPendingTasks,
  },
  {
    name: 'generateStudyRecommendation',
    description: 'Analyzes student workload and generates tailored advice on what to study next.',
    parameters: {
      studentPreferences: 'Optional student request or constraints',
      subjectFocus: 'Optional focus subject'
    },
    handler: generateStudyRecommendation,
  },
];

module.exports = {
  answerAcademicQuestion,
  generateStudyPlan,
  retrieveStudentTasks,
  getPendingTasks,
  generateStudyRecommendation,
  TOOL_REGISTRY,
};
