const tools = require('./tools');
const geminiService = require('./geminiService');

/**
 * StudyMate Agentic Controller
 * Orchestrates: Intent Recognition -> Tool Selection -> Tool Execution -> Result Synthesis -> Trace Logging
 */
class AgentService {
  /**
   * Dispatches a user query through the Agentic AI workflow
   */
  async processRequest({ message, history = [], tasks = [], explicitTool = null, toolParams = {} }) {
    const startTime = Date.now();
    const trace = {
      userQuery: message,
      intent: 'Analyzing intent...',
      toolSelected: null,
      toolArguments: null,
      reasoning: '',
      executionDurationMs: 0,
      timestamp: new Date().toISOString(),
    };

    // If an explicit tool was requested (e.g. from a dedicated form)
    if (explicitTool && tools[explicitTool]) {
      trace.intent = `Explicit invocation of ${explicitTool}`;
      trace.toolSelected = explicitTool;
      trace.toolArguments = toolParams;
      trace.reasoning = `The user directly requested the ${explicitTool} tool via the application interface.`;

      const toolOutput = await this.executeTool(explicitTool, { ...toolParams, tasks });
      trace.executionDurationMs = Date.now() - startTime;

      return {
        success: true,
        agentMessage: this.generateSynthesisMessage(explicitTool, toolOutput),
        toolOutput,
        trace,
      };
    }

    // Agentic routing: determine intent and tool selection
    const decision = await this.determineIntentAndTool(message, history, tasks);
    trace.intent = decision.intent;
    trace.toolSelected = decision.tool;
    trace.toolArguments = decision.parameters;
    trace.reasoning = decision.reasoning;

    // Execute the selected tool
    let toolOutput = null;
    try {
      toolOutput = await this.executeTool(decision.tool, {
        ...decision.parameters,
        tasks,
      });
    } catch (err) {
      console.error(`[AgentService] Error executing tool ${decision.tool}:`, err.message);
      // Fallback to general academic answer
      trace.reasoning += ` (Tool execution failed: ${err.message}. Gracefully falling back to answerAcademicQuestion).`;
      trace.toolSelected = 'answerAcademicQuestion';
      toolOutput = await tools.answerAcademicQuestion({
        query: message,
        subject: 'General Academic',
      });
    }

    trace.executionDurationMs = Date.now() - startTime;

    // Build the conversational synthesis message
    const agentMessage = this.generateSynthesisMessage(trace.toolSelected, toolOutput);

    return {
      success: true,
      agentMessage,
      toolOutput,
      trace,
    };
  }

  /**
   * Intelligently selects tool using Gemini, with deterministic regex/semantic fallback
   */
  async determineIntentAndTool(userMessage, history = [], tasks = []) {
    // If Gemini is configured, use LLM-based intent and parameter extraction
    if (geminiService.isConfigured()) {
      try {
        const systemPrompt = `You are the Intent Router for StudyMate AI, an academic assistant agent.
Your job is to analyze the student's message and select ONE of the following registered tools:
1. "generateStudyPlan" - User wants a schedule, timetable, study breakdown, or roadmap for subjects/topics.
2. "generateStudyRecommendation" - User asks what to study next, how to prioritize tasks, or asks for study advice based on pending work.
3. "getPendingTasks" - User asks specifically about their tasks, deadlines, or what assignments are due.
4. "retrieveStudentTasks" - User wants to review or filter their tasks.
5. "answerAcademicQuestion" - User asks an academic concept question, doubt, code explanation, math question, or syllabus inquiry.

Return strictly valid JSON with this schema:
{
  "intent": string,
  "tool": "generateStudyPlan" | "generateStudyRecommendation" | "getPendingTasks" | "retrieveStudentTasks" | "answerAcademicQuestion",
  "reasoning": string,
  "parameters": object
}`;

        const prompt = `Student Message: "${userMessage}"
Recent History: ${JSON.stringify(history.slice(-3))}
Available Task Count: ${tasks.length}`;

        const result = await geminiService.generateStructuredContent(prompt, systemPrompt);
        if (result && result.tool && tools[result.tool]) {
          const params = result.parameters || {};
          if (result.tool === 'answerAcademicQuestion') {
            params.query = params.query || params.question || params.doubt || userMessage;
            params.subject = params.subject || this.extractSubject((userMessage || '').toLowerCase()) || 'Computer Science';
          }
          return {
            intent: result.intent || 'Academic assistance',
            tool: result.tool,
            reasoning: result.reasoning || 'Identified via LLM Intent Classification',
            parameters: params,
          };
        }
      } catch (err) {
        console.warn('[AgentService] LLM intent routing failed, falling back to heuristic routing:', err.message);
      }
    }

    // Heuristic Fallback Router (Deterministic, reliable, fast)
    const lower = (userMessage || '').toLowerCase();

    // 1. Study Plan Intent
    if (
      lower.includes('study plan') ||
      lower.includes('schedule') ||
      lower.includes('timetable') ||
      lower.includes('roadmap') ||
      lower.includes('plan for')
    ) {
      return {
        intent: 'Generate structured academic study plan',
        tool: 'generateStudyPlan',
        reasoning: 'User inquiry explicitly requests a study schedule or breakdown.',
        parameters: {
          subject: this.extractSubject(lower) || 'Computer Science',
          topics: userMessage,
          availableHours: 3,
          days: 3,
          difficulty: 'Medium',
        },
      };
    }

    // 2. Study Recommendation Intent
    if (
      lower.includes('what should i study') ||
      lower.includes('recommend') ||
      lower.includes('what next') ||
      lower.includes('priority') ||
      lower.includes('advice')
    ) {
      return {
        intent: 'Generate personalized study recommendation',
        tool: 'generateStudyRecommendation',
        reasoning: 'Student is seeking guidance on what academic task or topic to prioritize.',
        parameters: {
          studentPreferences: userMessage,
          subjectFocus: this.extractSubject(lower),
        },
      };
    }

    // 3. Pending Tasks Intent
    if (
      lower.includes('pending task') ||
      lower.includes('what is due') ||
      lower.includes('my tasks') ||
      lower.includes('deadline') ||
      lower.includes('assignments')
    ) {
      return {
        intent: 'Inspect pending student tasks and deadlines',
        tool: 'getPendingTasks',
        reasoning: 'Student is asking to review their pending academic workload and deadlines.',
        parameters: {},
      };
    }

    // 4. Default: Academic Explanation Intent
    return {
      intent: 'Clarify academic concept or answer subject doubt',
      tool: 'answerAcademicQuestion',
      reasoning: 'Query represents an academic concept explanation or doubt inquiry.',
      parameters: {
        query: userMessage,
        subject: this.extractSubject(lower) || 'Computer Science & Engineering',
      },
    };
  }

  /**
   * Helper to detect subjects mentioned in natural language
   */
  extractSubject(text) {
    const subjects = [
      'Operating Systems',
      'Database Management Systems',
      'Computer Networks',
      'Data Structures',
      'Algorithms',
      'Software Engineering',
      'Artificial Intelligence',
      'Machine Learning',
      'Web Development',
      'Object Oriented Programming',
      'Theory of Computation',
      'Compiler Design',
      'Mathematics',
      'Physics',
    ];
    for (const sub of subjects) {
      if (text.includes(sub.toLowerCase())) return sub;
    }
    return 'Computer Science';
  }

  /**
   * Executes the registered tool
   */
  async executeTool(toolName, params) {
    if (typeof tools[toolName] !== 'function') {
      throw new Error(`Tool "${toolName}" is not registered in StudyMate Agent.`);
    }
    return await tools[toolName](params);
  }

  /**
   * Creates a friendly agent summary message based on the tool executed
   */
  generateSynthesisMessage(toolName, output) {
    switch (toolName) {
      case 'answerAcademicQuestion':
        return output?.answer || 'Here is the explanation for your academic doubt:';
      case 'generateStudyPlan':
        return `I have formulated a structured study plan for **${output?.plan?.subject || 'your subject'}** covering ${output?.plan?.totalDays || 3} days. Check the detailed breakdown below!`;
      case 'generateStudyRecommendation':
        return `Based on your academic workload, here is your personalized study recommendation: **${output?.recommendation?.headline || 'Focus on priority tasks'}**.`;
      case 'getPendingTasks':
        return `You have **${output?.pendingCount || 0} pending task(s)** (${output?.highPriorityCount || 0} high priority, ${output?.overdueCount || 0} overdue).`;
      case 'retrieveStudentTasks':
        return `Found **${output?.total || 0} task(s)** matching filter "${output?.filter}".`;
      default:
        return 'Operation completed successfully.';
    }
  }
}

module.exports = new AgentService();
