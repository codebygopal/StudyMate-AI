# A MINI-PROJECT REPORT ON
# STUDYMATE AI – AI-POWERED STUDY PLANNER AND ACADEMIC ASSISTANT

<br>

**Submitted by:**  
Student 1 Name (Roll No: ____________)  
Student 2 Name (Roll No: ____________)  

<br>

**Under the guidance of:**  
Name of Course Teacher  

<br>

*In partial fulfillment of the award of Bachelor of Technology in Computer Science and Engineering.*  

<br>

**Department of Computer Science and Engineering**  
**Maharashtra Institute of Technology,**  
**Chhatrapati Sambhaginagar.**  
**Academic Year: 2026–27**  

---

\newpage

## TABLE OF CONTENTS

1. [INTRODUCTION](#1-introduction)  
   1.1 Background  
   1.2 Purpose of the Project  
   1.3 Overview of StudyMate AI  
2. [PROBLEM STATEMENT AND OBJECTIVES](#2-problem-statement-and-objectives)  
   2.1 Problems Faced by Engineering Students  
   2.2 Proposed Solution  
   2.3 Key Objectives  
3. [PROJECT ARCHITECTURE AND WORKFLOW](#3-project-architecture-and-workflow)  
   3.1 System Architecture Overview  
   3.2 Client-Server Communication  
   3.3 Autonomous Agent Workflow  
   3.4 Architecture & Sequence Diagrams  
4. [TECHNOLOGIES USED](#4-technologies-used)  
   4.1 React and Vite  
   4.2 Tailwind CSS  
   4.3 Node.js and Express.js  
   4.4 Google Gemini API  
   4.5 LocalStorage Web API  
   4.6 Cloud Deployment Platforms  
5. [IMPLEMENTATION DETAILS](#5-implementation-details)  
   5.1 Dashboard and Progress Analytics  
   5.2 AI Doubt Assistant with Agent Execution Trace  
   5.3 Dynamic Study Plan Generator  
   5.4 Academic Task Manager  
   5.5 Study Prioritization and Recommendations  
   5.6 Agent Tools and Intent Dispatcher  
6. [TESTING AND RESULTS](#6-testing-and-results)  
   6.1 Testing Methodology  
   6.2 Detailed Test Cases and Results  
   6.3 Verification of Agent Decision Audit  
7. [SCREENSHOTS](#7-screenshots)  
   7.1 Figure Captions and Visual Records  
8. [DEPLOYMENT](#8-deployment)  
   8.1 Deployment Architecture  
   8.2 Step-by-Step Production Hosting  
   8.3 Production Verification  
9. [CONCLUSION AND FUTURE SCOPE](#9-conclusion-and-future-scope)  
   9.1 Project Achievements  
   9.2 Architectural Limitations  
   9.3 Future Enhancements  
10. [REFERENCES](#10-references)  

---

\newpage

## 1. INTRODUCTION

### 1.1 Background
Undergraduate students in Computer Science and Engineering encounter demanding academic schedules spanning theoretical subjects such as Operating Systems, Database Management Systems, Theory of Computation, and Computer Networks, alongside intensive laboratory practical assignments and semester examinations. Managing preparation timelines, grasping abstract algorithmic concepts, and prioritizing imminent deadlines often causes significant cognitive overload. 

Conventional digital tools such as calendar apps or generic chat interfaces fail to deliver targeted academic assistance. Standalone chatbots lack awareness of a student's actual pending assignments, while static to-do lists cannot provide conceptual explanations or generate realistic daily study timetables based on syllabus complexity.

### 1.2 Purpose of the Project
The primary purpose of **StudyMate AI** is to design, implement, and evaluate an autonomous, tool-driven academic assistant for engineering students as part of Practical No. 10 of the Agentic AI Development Lab curriculum. 

Instead of building a simple conversational chatbot, this project implements an autonomous AI agent capable of:
1. Ingesting student academic queries and workload context.
2. Formulating intent and selecting specialized computational tools from a registered tool catalog.
3. Generating structured multi-day study schedules tailored to available daily hours.
4. Performing actual task state management with persistent browser storage.
5. Providing full transparency through an auditable Agent Execution Trace that records the agent's intent, tool selection, reasoning, and latency in milliseconds.

### 1.3 Overview of StudyMate AI
StudyMate AI is engineered as a clean full-stack application comprising a high-performance React (Vite) frontend with Tailwind CSS and an Express.js backend powered by the Google Gemini API. The system incorporates five distinct agentic tools:
- `answerAcademicQuestion()` for structured pedagogical explanations.
- `generateStudyPlan()` for multi-day syllabus scheduling.
- `retrieveStudentTasks()` for inspecting active assignments.
- `getPendingTasks()` for identifying imminent deadlines.
- `generateStudyRecommendation()` for synthesizing workload priorities into a 3-step action checklist.

---

\newpage

## 2. PROBLEM STATEMENT AND OBJECTIVES

### 2.1 Problems Faced by Engineering Students
1. **Inefficient Syllabus Pacing:** Students often struggle to break down extensive syllabi into realistic daily quotas before mid-semester and end-semester examinations.
2. **Disconnected Productivity Tools:** Task managers and learning resources exist in silos; students switch between static to-do lists, textbooks, search engines, and generic chatbots.
3. **Superficial Chatbot Responses:** Standard conversational chatbots generate non-actionable text that cannot be directly translated into scheduled tasks.
4. **Lack of Prioritization Guidance:** When multiple assignments and lab journals are due simultaneously, students lack an objective mechanism to evaluate which task requires immediate focus.

### 2.2 Proposed Solution
StudyMate AI bridges this gap through an agentic system that tightly connects generative artificial intelligence with practical application state. The agent interprets natural language requests, invokes the appropriate specialized tool, and produces both conversational insights and structured, actionable artifacts (such as day-by-day timetable cards that can be added to the student's task manager with a single click).

### 2.3 Key Objectives
- **Objective 1:** Build a responsive, accessible user interface adhering to university styling standards with a blue-slate academic color palette.
- **Objective 2:** Implement an autonomous Agentic AI workflow with clear intent analysis, dynamic tool selection, parameter extraction, and execution trace logging.
- **Objective 3:** Implement persistent, client-side task management and study history using the Browser LocalStorage Web API.
- **Objective 4:** Provide pedagogical explanations for technical engineering doubts structured into concept intuition, step-by-step working, code examples, and exam revision tips.
- **Objective 5:** Ensure enterprise security standards by isolating the Google Gemini API key exclusively within backend environment variables, completely avoiding frontend exposure.

---

\newpage

## 3. PROJECT ARCHITECTURE AND WORKFLOW

### 3.1 System Architecture Overview
StudyMate AI follows a decoupled client-server architecture with controlled RESTful API communication.

```
+-------------------------------------------------------------------------+
|                         STUDENT CLIENT (Browser)                        |
|   React 19 + Vite 8 + Tailwind CSS + Lucide Icons + Canvas-Confetti    |
|                                                                         |
|  [Dashboard]  [Doubt Assistant]  [Study Planner]  [Task Manager]        |
|  [AI Recommendations]  [Study History]  [Agent Inspector]               |
|                                                                         |
|  Persistent State: Browser LocalStorage (Tasks, Plans, Stats, History) |
+-------------------------------------------------------------------------+
                                    |
                           HTTP REST API / JSON
                                    |
+-------------------------------------------------------------------------+
|                        BACKEND SERVER (Node.js)                         |
|   Express 5 + CORS + Dotenv + Agent Controller + Audit Trace Logger    |
|                                                                         |
|   API Endpoints:                                                        |
|   - GET  /api/health                                                    |
|   - GET  /api/agent/tools                                               |
|   - POST /api/agent/chat                                                |
|   - POST /api/agent/study-plan                                          |
|   - POST /api/agent/recommend                                           |
|                                                                         |
|   Autonomous Tool Registry:                                             |
|   [answerAcademicQuestion]   [generateStudyPlan]                        |
|   [retrieveStudentTasks]     [getPendingTasks]                          |
|   [generateStudyRecommendation]                                         |
+-------------------------------------------------------------------------+
                                    |
                          Secure Gemini SDK Call
                                    |
+-------------------------------------------------------------------------+
|                       GOOGLE GEMINI AI PLATFORM                         |
|   Gemini 1.5 Flash / Gemini 2.0 Flash (Generative Language API)        |
+-------------------------------------------------------------------------+
```

*Figure 3.1: High-Level System Architecture Diagram of StudyMate AI*

### 3.2 Client-Server Communication
Communication between the frontend client and the backend server takes place over asynchronous JSON-based HTTP requests. In local development, the Vite development server proxies requests to `http://localhost:5000`. In production, the client connects to the hosted Render backend with strictly enforced CORS headers allowing Vercel deployment domains.

### 3.3 Autonomous Agent Workflow
When a student interacts with the Doubt Assistant or asks for recommendations, the backend agent initiates the following 6-stage lifecycle:
1. **Input Ingestion:** Captures the query string, recent chat history, and current active task array.
2. **Intent Classification:** Analyzes user intent via LLM classification or deterministic semantic fallback routing.
3. **Tool Selection:** Identifies the optimal tool from the registered catalog (`answerAcademicQuestion`, `generateStudyPlan`, etc.).
4. **Parameter Extraction & Execution:** Gathers input parameters (subject, days, hours, tasks) and executes the selected tool function.
5. **Synthesis & Trace Logging:** Compiles the pedagogical answer or structured JSON and records the execution duration in milliseconds.
6. **Client Delivery:** Returns the response and trace payload to the client for interactive rendering.

---

\newpage

## 4. TECHNOLOGIES USED

### 4.1 React and Vite
The frontend client is built using React 19 bootstrapped with Vite 8. Vite leverages native ES modules during development for instant hot module replacement (HMR) and utilizes Rollup for optimized, tree-shaken production builds.

### 4.2 Tailwind CSS
User interface styling is implemented using Tailwind CSS (modern version with `@tailwindcss/vite`). A consistent academic color palette featuring deep blues (`#1d4ed8`, `#2563eb`), slate neutrals (`#f8fafc`, `#334155`), emerald accents for completed milestones, and rose indicators for overdue assignments is maintained throughout the application.

### 4.3 Node.js and Express.js
The server is constructed on Node.js (v24 LTS) utilizing the Express.js framework. It serves as an API gateway that handles routing, request validation, CORS management, and agent orchestration.

### 4.4 Google Gemini API
Artificial intelligence capabilities are powered by the official `@google/generative-ai` SDK interfacing with the `gemini-1.5-flash` model (with fallback to `gemini-2.0-flash`). Gemini delivers high token generation speeds, deep computer science knowledge, and reliable structured JSON output compliance.

### 4.5 LocalStorage Web API
Task data, saved study schedules, and conversation records are stored in browser `LocalStorage`. This avoids the unnecessary complexity, latency, and hosting cost of external databases while ensuring full data persistence across browser reloads.

### 4.6 Cloud Deployment Platforms
- **Render:** Hosts the Node.js Express server as an auto-deploying Web Service linked to the GitHub repository.
- **Vercel:** Hosts the compiled React single-page application with global edge CDN distribution and instant SSL certificate provisioning.

---

\newpage

## 5. IMPLEMENTATION DETAILS

### 5.1 Dashboard and Progress Analytics
The Dashboard acts as the student's central hub. It computes real-time statistics:
- **Total Tasks:** Cumulative count of all recorded tasks.
- **Pending Work:** Incomplete assignments awaiting submission.
- **Completed Tasks:** Finished tasks with a dynamic completion percentage bar.
- **Urgent Deadlines:** Alerts identifying tasks due within 48 hours.

### 5.2 AI Doubt Assistant with Agent Execution Trace
The Doubt Assistant offers an intuitive conversational chat interface. Responses adhere to a 5-point pedagogical framework:
1. Core Concept Intuition.
2. Working Mechanism & Components.
3. Real-World Engineering Analogy.
4. Code / Syntax / Formula Illustration.
5. Key Exam / Interview Takeaway.

Every agent response features an expandable **Agent Execution Trace** toggle that exposes the internal decision audit:
- Identified Intent.
- Tool Selected.
- Agent Reasoning.
- Latency (Execution Duration in milliseconds).

### 5.3 Dynamic Study Plan Generator
The Study Planner allows students to input:
- Course/Subject name (with one-click presets for OS, DBMS, Networks, DSA, and SE).
- Topics/syllabus text.
- Daily available hours (slider: 1 to 10 hours).
- Target days (slider: 1 to 14 days).
- Difficulty/Intensity level.

The agent invokes `generateStudyPlan()` and returns a day-by-day breakdown with allocated minutes, priorities, and sequence numbers. A built-in "Add to Task Manager" action allows students to convert generated topics directly into actionable task entries.

### 5.4 Academic Task Manager
The Task Manager provides comprehensive CRUD operations:
- **Add Task:** Title, description, subject category, due date, and priority (High, Medium, Low).
- **Toggle Completion:** Checkbox toggle that triggers a celebratory confetti explosion via `canvas-confetti`.
- **Delete Task:** Immediate removal with confirmation.
- **Filtering & Search:** Real-time filtering by status (All, Pending, Completed, High Priority) and keyword search.

### 5.5 Study Prioritization and Recommendations
The `generateStudyRecommendation()` tool inspects the student's active workload and deadlines. If tasks are pending, it identifies the most critical assignment, explains the rationale for prioritizing it, provides a 3-step action checklist, and suggests a focus technique (e.g., Pomodoro 50/10).

---

\newpage

## 6. TESTING AND RESULTS

### 6.1 Testing Methodology
Testing was conducted using functional black-box verification, integration testing between client and server, and latency benchmarking of the agent execution lifecycle.

### 6.2 Detailed Test Cases and Results

| Test ID | Test Scenario | Input Data | Expected Result | Actual Result | Status |
|:-------:|:--------------|:-----------|:----------------|:--------------|:------:|
| **TC-01** | Backend Health Check | `GET /api/health` | Returns HTTP 200, status "OK", 5 registered tools | Returned 200 OK with tool metadata | **PASSED** |
| **TC-02** | Agent Tool Registry | `GET /api/agent/tools` | Returns array of 5 registered agent tools | Returned 5 tools with complete parameter schemas | **PASSED** |
| **TC-03** | Chat Intent Classification | "Explain Banker's Algorithm" | Routes to `answerAcademicQuestion` | Intent correctly identified; explanation generated | **PASSED** |
| **TC-04** | Study Plan Generation | Subject: "DBMS", Days: 3, Hrs: 3 | Generates structured 3-day timetable JSON | Formatted timetable cards rendered | **PASSED** |
| **TC-05** | Plan-to-Task Conversion | Click "Add to Task Manager" | Converts plan topics into individual task items | Tasks successfully populated into Task Manager | **PASSED** |
| **TC-06** | Task Creation | Title: "Lab 5 OS", Priority: "High" | Task appears in list and saves to LocalStorage | Rendered with red priority badge; persisted | **PASSED** |
| **TC-07** | Task Completion & Confetti | Click task checkbox | Marks complete, triggers confetti animation | Confetti fired, counter updated | **PASSED** |
| **TC-08** | Task Deletion | Click trash icon | Removes task from array and LocalStorage | Task deleted immediately without page reload | **PASSED** |
| **TC-09** | LocalStorage Persistence | Browser refresh (F5) | Retains tasks and study history intact | State read from storage with zero data loss | **PASSED** |
| **TC-10** | Error Handling (Missing Key) | Request with empty API key | Returns HTTP 503 with helpful setup instructions | Handled gracefully without server termination | **PASSED** |
| **TC-11** | Production Build | `npm run build` in client | Compiles production assets without errors | Built in 821ms with zero bundle errors | **PASSED** |

*Table 6.1: Test Execution Results for StudyMate AI*

---

\newpage

## 7. SCREENSHOTS

*(Insert captured project screenshots from `docs/screenshots/` into the designated placeholders below)*

### Figure 7.1: Application Homepage and Academic Dashboard
```
+-------------------------------------------------------------------------+
|                                                                         |
|                [ INSERT SCREENSHOT: 01_dashboard.png ]                  |
|                                                                         |
|  Shows: Welcome banner, semester progress bar, statistics cards         |
|  (Total, Pending, Completed, Plans), and urgent deadlines reminder.    |
+-------------------------------------------------------------------------+
```
*Figure 7.1: StudyMate AI Dashboard displaying academic metrics and urgent assignment alerts*

### Figure 7.2: AI Doubt Assistant with Concept Explanation
```
+-------------------------------------------------------------------------+
|                                                                         |
|              [ INSERT SCREENSHOT: 02_doubt_assistant.png ]              |
|                                                                         |
|  Shows: Conversational chat interface with structured pedagogical       |
|  explanation for an Operating Systems concept.                         |
+-------------------------------------------------------------------------+
```
*Figure 7.2: AI Doubt Assistant resolving an undergraduate engineering concept query*

### Figure 7.3: Expandable Agent Decision Audit Trace
```
+-------------------------------------------------------------------------+
|                                                                         |
|                [ INSERT SCREENSHOT: 03_agent_trace.png ]                |
|                                                                         |
|  Shows: Expanded terminal badge under message displaying intent,        |
|  selected tool (answerAcademicQuestion), reasoning, and latency (ms).   |
+-------------------------------------------------------------------------+
```
*Figure 7.3: Expandable Agent Execution Trace showcasing autonomous tool selection*

### Figure 7.4: Generated Study Plan Timetable Cards
```
+-------------------------------------------------------------------------+
|                                                                         |
|           [ INSERT SCREENSHOT: 05_study_planner_result.png ]            |
|                                                                         |
|  Shows: Multi-day structured study timetable with topic durations,      |
|  priorities, and "Add to Task Manager" action button.                   |
+-------------------------------------------------------------------------+
```
*Figure 7.4: Structured multi-day study schedule generated by the AI Planner*

### Figure 7.5: Academic Task Manager and Confetti Celebration
```
+-------------------------------------------------------------------------+
|                                                                         |
|               [ INSERT SCREENSHOT: 07_confetti_task.png ]               |
|                                                                         |
|  Shows: Task Manager interface with active tasks, filter pills, and     |
|  celebratory confetti explosion upon marking an assignment complete.    |
+-------------------------------------------------------------------------+
```
*Figure 7.5: Task Manager displaying live tasks and completion celebration animation*

### Figure 7.6: AI Study Prioritization and Recommendations
```
+-------------------------------------------------------------------------+
|                                                                         |
|          [ INSERT SCREENSHOT: 08_study_recommendation.png ]             |
|                                                                         |
|  Shows: Autonomous prioritization card with urgency badge, rationale,   |
|  and immediate 3-step action checklist.                                 |
+-------------------------------------------------------------------------+
```
*Figure 7.6: AI Study Recommendation diagnosing workload and suggesting next focus*

### Figure 7.7: Agent Inspector and Tool Registry Viewer
```
+-------------------------------------------------------------------------+
|                                                                         |
|              [ INSERT SCREENSHOT: 10_agent_inspector.png ]              |
|                                                                         |
|  Shows: 6-stage lifecycle diagram and live registered tools table       |
|  fetched from the backend GET /api/agent/tools endpoint.                |
+-------------------------------------------------------------------------+
```
*Figure 7.7: Live Agent Inspector displaying registered tool catalog and parameters*

---

\newpage

## 8. DEPLOYMENT

### 8.1 Deployment Architecture
StudyMate AI is architected for seamless cloud deployment:
- **Backend Service:** Deployed on **Render** as a Node.js web service linked to the GitHub repository. It manages runtime environment variables and handles Gemini API interactions securely.
- **Frontend Client:** Deployed on **Vercel** as a static single-page application built using Vite.

### 8.2 Step-by-Step Production Hosting
1. **GitHub Setup:** Source code pushed to a public/private GitHub repository.
2. **Backend on Render:**
   - Root directory set to `server`.
   - Build command: `npm install`.
   - Start command: `npm start`.
   - Environment variables: `PORT=5000`, `NODE_ENV=production`, `GEMINI_API_KEY=<key>`, `CLIENT_URL=https://<app>.vercel.app`.
3. **Frontend on Vercel:**
   - Root directory set to `client`.
   - Framework preset: `Vite`.
   - Build command: `npm run build`.
   - Environment variable: `VITE_API_BASE_URL=https://<backend>.onrender.com`.

### 8.3 Production Verification
The deployed system was tested for end-to-end functionality. The frontend securely communicates with the backend, and the backend verifies the Gemini API handshake without exposing API credentials to client inspection tools.

---

\newpage

## 9. CONCLUSION AND FUTURE SCOPE

### 9.1 Project Achievements
StudyMate AI successfully demonstrates the implementation of a practical, tool-driven AI agent for undergraduate computer science students:
- Successfully integrated 5 specialized agent tools.
- Demonstrated transparent, auditable tool routing with execution trace badges.
- Built a modern, responsive user interface with real LocalStorage persistence.
- Maintained complete separation between AI generative output and actual task mutations.
- Enforced zero secret leakage by safeguarding API keys exclusively on the backend.

### 9.2 Architectural Limitations
- **Browser-Scoped Storage:** Because data is stored in browser LocalStorage, tasks do not automatically synchronize across different physical devices.
- **Cold Starts on Free Tier:** Free hosting on Render spins down instances after periods of inactivity, resulting in a 30-40 second delay on initial wake-up requests.

### 9.3 Future Enhancements
- **Multi-Device Cloud Sync:** Integrating lightweight authentication (e.g. Firebase or Supabase) to enable seamless synchronization across mobile and laptop devices.
- **Document & Syllabus Parser:** Adding PDF ingestion capabilities so students can directly upload university syllabus circulars or lab manuals.
- **Push & WhatsApp Reminders:** Integrating automated notifications for approaching assignment deadlines.

---

\newpage

## 10. REFERENCES

1. Google AI for Developers. *Gemini API Documentation & JavaScript SDK Reference*. Available at: https://ai.google.dev/docs
2. React Core Team. *React 19 Official Documentation*. Available at: https://react.dev/
3. Vite Development Team. *Vite: Next Generation Frontend Tooling*. Available at: https://vite.dev/
4. Tailwind CSS Team. *Tailwind CSS Documentation (v4)*. Available at: https://tailwindcss.com/docs
5. Express.js Foundation. *Express 5.x API Reference*. Available at: https://expressjs.com/
6. Mozilla Developer Network (MDN). *Window.localStorage Web API*. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
7. Render Inc. *Deploying Node.js Express Applications on Render*. Available at: https://render.com/docs/node-express-app
8. Vercel Inc. *Deploying Vite React Applications on Vercel*. Available at: https://vercel.com/docs/frameworks/vite
9. Russell, S., & Norvig, P. (2020). *Artificial Intelligence: A Modern Approach (4th ed.)*. Pearson Education.
