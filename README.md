# StudyMate AI – AI-Powered Study Planner and Academic Assistant

![Project Banner](https://img.shields.io/badge/Agentic%20AI-Development%20Lab-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20Node.js%20%7C%20Gemini%20API-indigo?style=for-the-badge)

---

## 1. Project Overview

**StudyMate AI** is an intelligent, tool-driven academic assistant and study scheduler engineered for undergraduate Computer Science and Engineering students. Rather than functioning as a standard text chatbot, StudyMate AI implements an autonomous Agentic AI workflow with controlled tool routing.

It empowers students to:

1. **Clarify Academic Doubts:** Receive structured pedagogical explanations for core engineering subjects (Operating Systems, DBMS, Computer Networks, Algorithms) with code examples and exam takeaways.
2. **Generate Phased Study Schedules:** Formulate realistic multi-day study timetables based on daily available hours, syllabus topics, and priority.
3. **Manage Real Academic Tasks:** Track lab assignments, deadlines, and project milestones with persistent browser `LocalStorage`.
4. **Receive Workload Prioritization Advice:** Analyze pending deadlines to determine the optimal next task with an actionable 3-step checklist.
5. **Inspect Agent Decision Audits:** View the real-time **Agent Execution Trace** (Intent, Selected Tool, Reasoning, and Latency in milliseconds) under every agent response.

---

## 2. Key Modules & Features

| Module                       | Core Functionality                                                                                                  | Underlying Agentic Tool                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Home / Dashboard**         | Dynamic study statistics, semester progress bar, urgent deadline reminders, and quick navigation.                   | Client LocalState Engine                |
| **AI Doubt Assistant**       | Conversational chat interface with pedagogical structured answers and expandable execution trace badges.            | `answerAcademicQuestion()`              |
| **Study Plan Generator**     | Customizable timetable generator (hours/day, days, difficulty) with one-click **"Add to Task Manager"** conversion. | `generateStudyPlan()`                   |
| **Academic Task Manager**    | Working CRUD task management with priority badges, overdue alerts, search, and celebratory confetti on completion.  | LocalStorage Engine + `canvas-confetti` |
| **Study Recommendations**    | Workload evaluator analyzing deadlines and high-priority items to recommend immediate focus areas.                  | `generateStudyRecommendation()`         |
| **Study History & Archives** | Persistent archive of past generated study plans with full multi-day view and JSON export.                          | LocalStorage Engine                     |
| **Agent Inspector**          | Live inspection panel displaying the 6-stage autonomous lifecycle and live registered tool schemas.                 | `GET /api/agent/tools`                  |

---

## 3. Technology Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS (v4), Lucide React (Icons), Canvas-Confetti
- **Backend:** Node.js v24 LTS, Express.js 5, CORS, Dotenv
- **AI Platform:** Google Gemini API (`gemini-1.5-flash` / `gemini-2.0-flash`) via `@google/generative-ai`
- **Data Persistence:** Browser `LocalStorage` Web API (Zero database overhead)
- **Deployment:** Vercel (Frontend Client) & Render (Backend Web Service)
- **Document Generation:** `docx` npm library for automated Word report synthesis

---

## 4. Project Architecture

```
StudyMate-AI/
├── client/                     # Frontend Application (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation header with live server health badge
│   │   │   ├── Dashboard.jsx           # Dashboard with stats and progress tracker
│   │   │   ├── DoubtAssistant.jsx      # Chat assistant with Agent Decision Trace
│   │   │   ├── StudyPlanner.jsx        # Timetable generator & Task converter
│   │   │   ├── TaskManager.jsx         # Working task CRUD & confetti celebration
│   │   │   ├── StudyRecommendations.jsx# Workload priority advisor
│   │   │   ├── StudyHistory.jsx        # Saved plans archive & JSON exporter
│   │   │   ├── AgentInspector.jsx      # Live agent lifecycle & tool registry viewer
│   │   │   └── Footer.jsx              # Institutional credits & group details
│   │   ├── services/
│   │   │   ├── api.js                  # Centralized REST client
│   │   │   └── storage.js              # LocalStorage manager with initial starter data
│   │   ├── App.jsx                     # Root application controller
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend Application (Node.js + Express)
│   ├── routes/
│   │   ├── agentRoutes.js              # /api/agent (chat, study-plan, recommend, tools)
│   │   └── healthRoutes.js             # /api/health probe
│   ├── services/
│   │   ├── geminiService.js            # Secure Google Gemini API SDK interface
│   │   ├── tools.js                    # Registered Agent Tool implementations & schemas
│   │   └── agentService.js             # Agent controller, intent router, & trace logger
│   ├── scripts/
│   │   └── generateReportDocx.js       # Script to generate Word report conforming to college format
│   ├── .env.example                    # Template environment file
│   ├── server.js                       # Express app entrypoint
│   └── package.json
│
├── docs/                       # Project Documentation & College Report
│   ├── STUDYMATE_AI_PROJECT_REPORT.docx # Formatted DOCX report (Times New Roman, 1.5 spacing, 10-12 pages)
│   ├── PROJECT_REPORT.md               # Markdown report draft with cover page
│   ├── ARCHITECTURE.md                 # System architecture and Mermaid sequence diagrams
│   ├── TESTING_CHECKLIST.md            # Comprehensive test cases and verification results
│   ├── DEPLOYMENT_GUIDE.md             # Complete step-by-step Vercel and Render deployment guide
│   └── screenshots/
│       └── README.md                   # Screenshots capture checklist and figure mappings
│
├── package.json                # Root automation scripts
├── .gitignore                  # Git ignore rules
└── README.md                   # This project guide
```

---

## 5. Quick Start (Run Locally)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher; v24 recommended)
- A free Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Step 1: Clone or Navigate to the Project

```bash
cd c:\Users\gopal\Projects\StudyMate-AI
```

### Step 2: Configure Environment Variables

Copy `server/.env.example` to `server/.env`:

```bash
cp server/.env.example server/.env
```

Open `server/.env` and paste your Gemini API key:

```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

_(Note: Even if you run the backend before adding an API key, the server will start cleanly and the health check will indicate `geminiConfigured: false`. When a query is made, it will return a friendly instructional message.)_

### Step 3: Run the Backend Server

In your first terminal:

```bash
npm run server
```

Server starts on: **`http://localhost:5000`**

- Health probe: `http://localhost:5000/api/health`
- Tool inspection: `http://localhost:5000/api/agent/tools`

### Step 4: Run the Frontend Client

In a second terminal:

```bash
npm run client
```

Frontend opens at: **`http://localhost:5173`**

---

## 6. How the Agentic Workflow Operates

When a student enters a message in the Doubt Assistant:

1. **Input Ingestion:** The client sends the query, recent conversation history, and current task list to `POST /api/agent/chat`.
2. **Intent Analysis:** The backend agent determines whether the request requires an academic explanation, a study plan, or workload prioritization.
3. **Tool Execution:** The agent invokes the selected tool (`answerAcademicQuestion`, `generateStudyPlan`, `getPendingTasks`, or `generateStudyRecommendation`).
4. **Decision Audit Trace:** The agent attaches an execution trace:
   ```json
   {
     "intent": "Clarify academic concept or answer subject doubt",
     "toolSelected": "answerAcademicQuestion",
     "reasoning": "Query represents an academic concept explanation.",
     "executionDurationMs": 842
   }
   ```
5. **Interactive UI:** The frontend displays the rich answer along with an expandable **"Agent Execution Trace"** button that lets examiners review the agent's internal reasoning.

---

## 7. Group Contribution & Work Division

This project was developed for **Practical No. 10 (Agentic AI Development Lab)** by a two-member engineering team:

| Team Member  | Core Responsibilities                                                                                                                                                                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Member 1** | • React frontend architecture, responsive layout, and navigation<br>• Dashboard analytics, semester progress tracker, and stat counters<br>• Study Planner UI, topic sliders, and plan-to-task conversion logic<br>• College project report document formatting and styling (`.docx` and `.md`)              |
| **Member 2** | • Express.js server architecture, route handling, and CORS configuration<br>• Google Gemini API integration and structured JSON prompt design<br>• Autonomous agent controller, intent classification, and tool registry<br>• System testing, test case documentation, and cloud deployment on Render/Vercel |

_Both members participated in end-to-end integration testing and are fully prepared to demonstrate all modules during the practical lab examination._

---

## 8. Deployment Summary

- **Live Frontend (Vercel):** [https://study-mate-ai-jtvm.vercel.app](https://study-mate-ai-jtvm.vercel.app)
- **Live Backend API (Vercel):** [https://study-mate-ai-bay.vercel.app](https://study-mate-ai-bay.vercel.app)
- **API Health Check:** [https://study-mate-ai-bay.vercel.app/api/health](https://study-mate-ai-bay.vercel.app/api/health)
- **Agent Tools Inspection:** [https://study-mate-ai-bay.vercel.app/api/agent/tools](https://study-mate-ai-bay.vercel.app/api/agent/tools)

Full step-by-step instructions and architecture details are available in [`docs/DEPLOYMENT_GUIDE.md`](./docs/DEPLOYMENT_GUIDE.md).

---
