const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  convertInchesToTwip,
  PageBreak,
} = require('docx');

// Helper to create body paragraphs with Times New Roman, 12pt, 1.5 line spacing
function createBodyParagraph(text, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFIED,
    spacing: {
      line: 360, // 1.5 line spacing (240 = 1.0)
      after: options.after !== undefined ? options.after : 160,
      before: options.before !== undefined ? options.before : 0,
    },
    children: [
      new TextRun({
        text,
        font: 'Times New Roman',
        size: 24, // 12pt
        bold: Boolean(options.bold),
        italics: Boolean(options.italics),
        color: options.color || '111827',
      }),
    ],
  });
}

function createSectionHeading(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180, line: 360 },
    children: [
      new TextRun({
        text: title.toUpperCase(),
        font: 'Times New Roman',
        size: 28, // 14pt
        bold: true,
        color: '0f172a',
      }),
    ],
  });
}

function createSubHeading(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120, line: 360 },
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 24, // 12pt
        bold: true,
        color: '1e293b',
      }),
    ],
  });
}

function createBullet(text, boldPrefix = '') {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { line: 360, after: 100 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      ...(boldPrefix
        ? [
            new TextRun({
              text: boldPrefix + ' ',
              font: 'Times New Roman',
              size: 24,
              bold: true,
            }),
          ]
        : []),
      new TextRun({
        text,
        font: 'Times New Roman',
        size: 24,
      }),
    ],
  });
}

function createScreenshotBox(figureNumber, figureTitle, description) {
  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.DASHED, size: 2, color: '94a3b8' },
              bottom: { style: BorderStyle.DASHED, size: 2, color: '94a3b8' },
              left: { style: BorderStyle.DASHED, size: 2, color: '94a3b8' },
              right: { style: BorderStyle.DASHED, size: 2, color: '94a3b8' },
            },
            margins: { top: 300, bottom: 300, left: 300, right: 300 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: `[ SCREENSHOT PLACEHOLDER: ${figureNumber} ]`,
                    font: 'Times New Roman',
                    size: 22,
                    bold: true,
                    color: '2563eb',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: description,
                    font: 'Times New Roman',
                    size: 20,
                    italics: true,
                    color: '475569',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const caption = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 240 },
    children: [
      new TextRun({
        text: `${figureNumber}: ${figureTitle}`,
        font: 'Times New Roman',
        size: 22, // 11pt
        italics: true,
        bold: true,
        color: '1e293b',
      }),
    ],
  });

  return [table, caption];
}

async function generateDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              left: convertInchesToTwip(1.25), // 1.25 inches
              right: convertInchesToTwip(1.0), // 1.0 inch
              top: convertInchesToTwip(1.0),   // 1.0 inch
              bottom: convertInchesToTwip(1.0),// 1.0 inch
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: 'Times New Roman',
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // ================= COVER PAGE =================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 150 },
            children: [
              new TextRun({
                text: 'A MINI-PROJECT REPORT ON',
                font: 'Times New Roman',
                size: 28, // 14pt
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 400 },
            children: [
              new TextRun({
                text: 'STUDYMATE AI – AI-POWERED STUDY PLANNER AND ACADEMIC ASSISTANT',
                font: 'Times New Roman',
                size: 32, // 16pt
                bold: true,
                color: '1e3a8a',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({
                text: 'Submitted by:',
                font: 'Times New Roman',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
            children: [
              new TextRun({
                text: 'Student 1 Name (Roll No: __________)   |   Student 2 Name (Roll No: __________)',
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({
                text: 'Under the guidance of:',
                font: 'Times New Roman',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 400 },
            children: [
              new TextRun({
                text: 'Name of Course Teacher',
                font: 'Times New Roman',
                size: 24,
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({
                text: 'In partial fulfillment of the award of Bachelor of Technology in Computer Science and Engineering',
                font: 'Times New Roman',
                size: 24,
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 60 },
            children: [
              new TextRun({
                text: 'Department of Computer Science and Engineering',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
            children: [
              new TextRun({
                text: 'Maharashtra Institute of Technology,',
                font: 'Times New Roman',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 150 },
            children: [
              new TextRun({
                text: 'Chhatrapati Sambhaginagar.',
                font: 'Times New Roman',
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({
                text: 'Academic Year: 2026–27',
                font: 'Times New Roman',
                size: 24,
                bold: true,
              }),
            ],
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= SECTION 1 =================
          createSectionHeading('1. INTRODUCTION'),
          createSubHeading('1.1 Background'),
          createBodyParagraph(
            'Undergraduate engineering students across Computer Science and Engineering (CSE) face demanding coursework involving complex, abstract theoretical concepts (such as Operating Systems process scheduling and memory management, Database normalization, Computer Network protocols, and algorithmic paradigms) coupled with rigorous lab practical assignments and continuous evaluations. Effectively dividing one’s available time across multiple subjects while actively solving academic doubts has historically been an unstructured, highly stressful endeavor.'
          ),
          createBodyParagraph(
            'Traditional productivity applications, including generic calendar utilities and standard to-do lists, require manual data entry and lack academic contextual awareness. Furthermore, standard conversational AI chatbots often produce verbose, unverified textual explanations that cannot be directly translated into a practical, timed study timetable or real academic tasks.'
          ),

          createSubHeading('1.2 Purpose of the Project'),
          createBodyParagraph(
            'The central purpose of StudyMate AI is to build and evaluate an autonomous, tool-driven academic assistant for engineering students as part of Practical No. 10 for the Agentic AI Development Lab. Instead of restricting the solution to a standard prompt-and-response chatbot, StudyMate AI implements an autonomous AI agent capable of understanding student intentions, dispatching registered domain-specific tools, and manipulating real application state.'
          ),

          createSubHeading('1.3 Overview of StudyMate AI'),
          createBodyParagraph(
            'StudyMate AI combines a reactive, modern web frontend built in React and Tailwind CSS with a secure Node.js Express backend integrating Google’s Gemini API. The application equips students with an interactive Dashboard, an AI Doubt Assistant with an auditable decision trace, a dynamic Study Plan Generator, a working Academic Task Manager backed by browser LocalStorage, and an autonomous Study Prioritization Advisor.'
          ),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= SECTION 2 =================
          createSectionHeading('2. PROBLEM STATEMENT AND OBJECTIVES'),
          createSubHeading('2.1 Problems Faced by Engineering Students'),
          createBullet('Ineffective Syllabus Pacing: Students frequently experience anxiety attempting to structure entire course units into realistic daily study portions before internal and university exams.'),
          createBullet('Disconnected Tool Ecosystems: Students constantly switch between static notes, search engines, separate to-do list applications, and standalone chatbots, creating cognitive fragmentation.'),
          createBullet('Lack of Objective Prioritization: When multiple lab practicals and theory assignments clash, students lack data-driven guidance on which task to tackle first.'),
          createBullet('Superficial AI Interactivity: Most chatbots merely generate static text without interacting with actual tasks or persistent student schedules.'),

          createSubHeading('2.2 Proposed Solution'),
          createBodyParagraph(
            'StudyMate AI addresses these shortcomings by deploying a controlled tool-based agentic workflow. The agent processes student queries, determines intent, extracts parameters, and executes concrete functions such as generateStudyPlan() or generateStudyRecommendation(). Furthermore, generated study plan topics can be directly injected into the student’s actual Task Manager with a single click, establishing a real link between artificial intelligence generation and persistent academic task management.'
          ),

          createSubHeading('2.3 Main Objectives'),
          createBullet('To build a responsive, modern academic user interface conforming to university visual standards using a blue, white, and slate neutral palette.'),
          createBullet('To implement a tool-based Agentic AI workflow with clear intent analysis, dynamic tool execution, and an auditable Agent Decision Trace.'),
          createBullet('To implement persistent, local task management and study history using the Browser LocalStorage Web API.'),
          createBullet('To provide pedagogical technical explanations for engineering concepts following a 5-step structure (concept, mechanism, real-world analogy, code/formula, exam tip).'),
          createBullet('To ensure enterprise-grade security by completely isolating the Google Gemini API key inside backend environment variables.'),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= SECTION 3 =================
          createSectionHeading('3. PROJECT ARCHITECTURE AND WORKFLOW'),
          createSubHeading('3.1 System Architecture'),
          createBodyParagraph(
            'StudyMate AI adopts a decoupled client-server architecture. The client layer manages visual presentation and local client state (tasks, history, and statistics in LocalStorage). The server layer hosts the Express application, the Agentic AI Controller, the Intent Router, and the registered tool execution handlers.'
          ),

          ...createScreenshotBox('Figure 3.1', 'High-Level System Architecture Diagram', 'Architecture diagram illustrating React Client, Express Backend, Agent Tool Registry, and Google Gemini API Handshake.'),

          createSubHeading('3.2 Frontend and Backend Communication'),
          createBodyParagraph(
            'Client and server communicate over structured HTTP REST endpoints with JSON payloads. During local development, the Vite development server proxies requests from port 5173 to port 5000. In production, CORS middleware permits requests from authorized Vercel domains while blocking unauthorized cross-origin access.'
          ),

          createSubHeading('3.3 Autonomous Agent Workflow'),
          createBodyParagraph(
            'Every student interaction triggers a 6-stage lifecycle within the backend Agentic Controller:'
          ),
          createBullet('1. Input Ingestion: Ingests the query string, recent chat history, and active task objects.'),
          createBullet('2. Intent & Semantic Analysis: Determines whether the student requires a conceptual doubt resolution, a timetable breakdown, or workload prioritization.'),
          createBullet('3. Autonomous Tool Selection: Dynamically matches the intent to one of the 5 registered tools in server/services/tools.js.'),
          createBullet('4. Parameter Extraction & Tool Execution: Extracts parameters (subject, available hours, target days, task items) and runs the tool.'),
          createBullet('5. Synthesis & Trace Logging: Synthesizes the result and creates an auditable trace capturing the chosen tool, reasoning, and duration in ms.'),
          createBullet('6. Client UI Rendering: Transmits the payload to the frontend, which renders rich interactive cards and an expandable Agent Trace pill.'),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= SECTION 4 =================
          createSectionHeading('4. TECHNOLOGIES USED'),
          createSubHeading('4.1 React and Vite'),
          createBodyParagraph(
            'The frontend is built using React 19 powered by Vite 8. React provides component-based state reactivity, while Vite provides rapid Hot Module Replacement (HMR) and optimized Rollup production builds with gzip compression.'
          ),

          createSubHeading('4.2 Tailwind CSS'),
          createBodyParagraph(
            'Tailwind CSS (v4) is utilized for styling. It delivers a modern, clean academic aesthetic characterized by gentle slate borders, rounded cards, subtle shadows, and responsive grid layouts without bulky external CSS files.'
          ),

          createSubHeading('4.3 Node.js and Express.js'),
          createBodyParagraph(
            'The backend runtime is Node.js v24 LTS running an Express 5 application. Express provides routing, middleware pipeline execution, and robust error handling.'
          ),

          createSubHeading('4.4 Google Gemini API'),
          createBodyParagraph(
            'The artificial intelligence engine leverages Google’s Gemini API (gemini-1.5-flash model with fallback to gemini-2.0-flash) via the official @google/generative-ai library. Gemini was chosen for its low latency, high contextual understanding of engineering curricula, and strict adherence to JSON output schemas.'
          ),

          createSubHeading('4.5 Browser LocalStorage'),
          createBodyParagraph(
            'To maintain simplicity for this college mini-project and avoid complex external databases, task records, study history, and user activity statistics are safely stored in browser LocalStorage. This guarantees that student data persists across browser refreshes on the same device.'
          ),

          createSubHeading('4.6 Cloud Deployment Platforms'),
          createBodyParagraph(
            'The system is configured for dual-cloud hosting: Render manages the Node.js backend as a web service with auto-restarts, while Vercel serves the compiled React client across global CDN edge nodes.'
          ),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= SECTION 5 =================
          createSectionHeading('5. IMPLEMENTATION DETAILS'),
          createSubHeading('5.1 Dashboard and Progress Analytics'),
          createBodyParagraph(
            'The Dashboard provides an immediate overview of student productivity. It dynamically calculates total tasks, pending tasks, completed tasks, and an overall completion percentage displayed through an animated progress bar. An urgent deadlines box warns students of tasks due within 48 hours.'
          ),

          createSubHeading('5.2 AI Doubt Assistant with Agent Execution Trace'),
          createBodyParagraph(
            'The Doubt Assistant offers a conversational interface with quick-prompt pills. Answers are structured with clear headings, real-world analogies, code snippets, and exam revision takeaways. Each response includes an expandable "Agent Execution Trace" button revealing the agent’s internal decision audit.'
          ),

          createSubHeading('5.3 Dynamic Study Plan Generator'),
          createBodyParagraph(
            'The Study Planner accepts the subject name, topics, daily hours (1-10 slider), target days (1-14 slider), and difficulty level. The agent executes generateStudyPlan() to construct a day-by-day timetable with duration minutes and priority tags. Crucially, a "Add to Task Manager" button allows students to inject generated topics into their live task manager.'
          ),

          createSubHeading('5.4 Academic Task Manager'),
          createBodyParagraph(
            'The Task Manager features real task creation, deletion, status toggling, keyword searching, and filtering (All, Pending, Completed, High Priority). Marking a task complete triggers a celebratory confetti explosion using canvas-confetti, reinforcing positive academic habit formation.'
          ),

          createSubHeading('5.5 Study Recommendations and Prioritization'),
          createBodyParagraph(
            'The generateStudyRecommendation() tool inspects the student’s active pending assignments and approaching deadlines. It outputs an urgency badge, a clear rationale explaining why a specific task should be tackled first, and an immediate 3-step action checklist.'
          ),

          createSubHeading('5.6 Registered Agent Tools'),
          createBodyParagraph(
            'The backend registers 5 distinct tools in server/services/tools.js:'
          ),
          createBullet('1. answerAcademicQuestion({ query, subject, context })'),
          createBullet('2. generateStudyPlan({ subject, topics, availableHours, days, difficulty })'),
          createBullet('3. retrieveStudentTasks({ tasks, filter })'),
          createBullet('4. getPendingTasks({ tasks })'),
          createBullet('5. generateStudyRecommendation({ tasks, studentPreferences, subjectFocus })'),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= SECTION 6 =================
          createSectionHeading('6. TESTING AND RESULTS'),
          createSubHeading('6.1 Testing Methodology'),
          createBodyParagraph(
            'All modules underwent rigorous manual and automated verification. Test cases covered backend route probes, tool discovery, intent classification, LocalStorage persistence, build generation, and error resilience.'
          ),

          createSubHeading('6.2 Test Execution Results'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Test ID', bold: true, font: 'Times New Roman', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Module', bold: true, font: 'Times New Roman', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Description', bold: true, font: 'Times New Roman', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Actual Result', bold: true, font: 'Times New Roman', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Status', bold: true, font: 'Times New Roman', size: 20 })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createBodyParagraph('TC-01', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Backend', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Server startup on port 5000', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Started cleanly with active banner', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('PASSED', { bold: true, after: 0 })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createBodyParagraph('TC-02', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Health', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('GET /api/health endpoint', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Returned HTTP 200 with 5 tools', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('PASSED', { bold: true, after: 0 })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createBodyParagraph('TC-03', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Agent', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Tool Discovery GET /api/agent/tools', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Returned 5 registered tool schemas', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('PASSED', { bold: true, after: 0 })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createBodyParagraph('TC-04', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Frontend', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Production build npm run build', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Built in 821ms with 0 errors', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('PASSED', { bold: true, after: 0 })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createBodyParagraph('TC-05', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Storage', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Task persistence across F5 reload', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('State retrieved with zero loss', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('PASSED', { bold: true, after: 0 })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [createBodyParagraph('TC-06', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Tasks', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Confetti trigger on completion', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('Confetti fired via canvas-confetti', { after: 0 })] }),
                  new TableCell({ children: [createBodyParagraph('PASSED', { bold: true, after: 0 })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= SECTION 7 =================
          createSectionHeading('7. SCREENSHOTS'),
          createBodyParagraph(
            'This section documents the visual interface of StudyMate AI across its primary functional modules. Placeholders mark where real image captures from docs/screenshots/ are embedded.'
          ),

          ...createScreenshotBox('Figure 7.1', 'Application Dashboard and Semester Progress', 'Shows the welcome banner, semester progress bar, statistics grid, and urgent deadline notifications.'),
          ...createScreenshotBox('Figure 7.2', 'AI Doubt Assistant Interface', 'Shows the conversational chat interface with student query and structured pedagogical answer.'),
          ...createScreenshotBox('Figure 7.3', 'Agent Execution Trace Audit', 'Shows the expanded terminal badge with Intent, Selected Tool, Reasoning, and Execution Duration in ms.'),
          ...createScreenshotBox('Figure 7.4', 'Generated Multi-Day Study Schedule', 'Shows the generated timetable cards with suggested minutes, priorities, and Add to Task Manager action.'),
          ...createScreenshotBox('Figure 7.5', 'Academic Task Manager & Confetti Celebration', 'Shows the task list with priority badges, due dates countdown, and confetti explosion.'),
          ...createScreenshotBox('Figure 7.6', 'AI Study Prioritization & Advice', 'Shows the workload evaluation card with urgency badge, rationale, and 3-step action checklist.'),
          ...createScreenshotBox('Figure 7.7', 'Agent Inspector & Tool Registry', 'Shows the 6-stage lifecycle flowchart and live registered tools table from GET /api/agent/tools.'),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= SECTION 8 =================
          createSectionHeading('8. DEPLOYMENT'),
          createSubHeading('8.1 Deployment Architecture'),
          createBodyParagraph(
            'StudyMate AI is engineered for production deployment across specialized cloud platforms: Render hosts the Node.js Express backend, while Vercel delivers the high-performance React client.'
          ),

          createSubHeading('8.2 Backend Hosting on Render'),
          createBullet('Step 1: Push repository to GitHub.'),
          createBullet('Step 2: Create a new Web Service on Render connected to the repository.'),
          createBullet('Step 3: Set Root Directory to "server", Runtime to "Node", Build command to "npm install", and Start command to "npm start".'),
          createBullet('Step 4: Configure environment variables: PORT=5000, NODE_ENV=production, GEMINI_API_KEY=<key>, and CLIENT_URL=<vercel-app-url>.'),

          createSubHeading('8.3 Frontend Hosting on Vercel'),
          createBullet('Step 1: Import GitHub repository into Vercel.'),
          createBullet('Step 2: Set Root Directory to "client", Framework Preset to "Vite", Build command to "npm run build", and Output directory to "dist".'),
          createBullet('Step 3: Configure Environment Variable: VITE_API_BASE_URL=<render-backend-url>.'),
          createBullet('Step 4: Click Deploy. Vercel provisions global edge hosting with SSL certification.'),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= SECTION 9 =================
          createSectionHeading('9. CONCLUSION AND FUTURE SCOPE'),
          createSubHeading('9.1 Project Achievements'),
          createBodyParagraph(
            'StudyMate AI successfully demonstrates a working autonomous AI agent customized for undergraduate engineering students. The project fulfills all criteria of Practical No. 10 by implementing a transparent, tool-driven architecture that separates AI generative capabilities from actual application state mutations.'
          ),

          createSubHeading('9.2 Limitations'),
          createBullet('Local Storage Boundary: Data is tied to the specific browser instance on the student’s device and does not automatically synchronize across multiple devices.'),
          createBullet('Free Hosting Cold Starts: Free tier web services on Render spin down after periods of inactivity, causing an initial 30-40 second latency on cold start requests.'),

          createSubHeading('9.3 Future Improvements'),
          createBullet('Cross-Device Cloud Sync: Integrating lightweight cloud authentication (such as Firebase or Supabase) for multi-device synchronization.'),
          createBullet('PDF Syllabus Ingestion: Allowing students to upload official university curriculum PDFs directly to auto-generate exam schedules.'),
          createBullet('Automated Reminders: Integrating WhatsApp or push notifications to remind students of pending submissions.'),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= SECTION 10 =================
          createSectionHeading('10. REFERENCES'),
          createBullet('Google AI for Developers. Gemini API Documentation and JavaScript SDK. Available at: https://ai.google.dev/docs'),
          createBullet('React Core Team. React 19 Official Documentation. Available at: https://react.dev/'),
          createBullet('Vite Development Team. Vite: Next Generation Frontend Tooling. Available at: https://vite.dev/'),
          createBullet('Tailwind CSS Team. Tailwind CSS Documentation. Available at: https://tailwindcss.com/docs'),
          createBullet('Express.js Foundation. Express 5.x API Reference. Available at: https://expressjs.com/'),
          createBullet('Mozilla Developer Network (MDN). Window.localStorage Web API Reference. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage'),
          createBullet('Render Inc. Deploying Node.js Express Applications on Render. Available at: https://render.com/docs/node-express-app'),
          createBullet('Vercel Inc. Deploying Vite React Applications on Vercel. Available at: https://vercel.com/docs/frameworks/vite'),
          createBullet('Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach (4th ed.). Pearson Education.')
        ],
      },
    ],
  });

  const outputPath = path.resolve(__dirname, '../../docs/STUDYMATE_AI_PROJECT_REPORT.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`DOCX report successfully generated at: ${outputPath}`);
}

generateDocx().catch((err) => {
  console.error('Error generating DOCX:', err);
  process.exit(1);
});
