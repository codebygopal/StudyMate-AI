# StudyMate AI - System Architecture & Agent Workflow

## 1. High-Level Architecture Overview

StudyMate AI is designed following a modular client-server architecture with an autonomous Agentic AI layer positioned at the backend. The design cleanly decouples user interface state management from the agent's intent-routing and tool execution pipeline.

```mermaid
graph TD
    subgraph ClientLayer["Frontend Client (React + Vite + Tailwind CSS)"]
        UI[Student Interface & Navigation]
        Dash[Dashboard & Stats]
        Doubt[AI Doubt Assistant UI]
        PlanUI[Study Plan Generator Form]
        TaskUI[Task Manager CRUD]
        RecUI[Recommendations View]
        HistUI[Study History & Archives]
        AgentUI[Agent Inspector & Tool Viewer]
        LStore[(Browser LocalStorage)]
        
        UI --> Dash & Doubt & PlanUI & TaskUI & RecUI & HistUI & AgentUI
        TaskUI <--> LStore
        HistUI <--> LStore
        Dash <--> LStore
    end

    subgraph APILayer["REST API Communication (HTTP/JSON + CORS)"]
        ChatEP["POST /api/agent/chat"]
        PlanEP["POST /api/agent/study-plan"]
        RecEP["POST /api/agent/recommend"]
        HealthEP["GET /api/health"]
        ToolsEP["GET /api/agent/tools"]
    end

    subgraph ServerLayer["Backend Server (Node.js + Express.js)"]
        AgentCtrl[Agentic AI Controller]
        IntentRouter[Intent Classifier & Fallback Router]
        AuditTrace[Agent Execution Trace Logger]
        
        subgraph ToolRegistry["Registered Agent Tools"]
            T1["answerAcademicQuestion()"]
            T2["generateStudyPlan()"]
            T3["retrieveStudentTasks()"]
            T4["getPendingTasks()"]
            T5["generateStudyRecommendation()"]
        end
        
        GeminiService[Gemini API Client Service]
    end

    subgraph ExternalServices["External AI Provider"]
        GeminiAPI["Google Gemini 1.5 / 2.0 Flash API"]
    end

    Doubt --> ChatEP
    PlanUI --> PlanEP
    RecUI --> RecEP
    AgentUI --> ToolsEP
    UI --> HealthEP

    ChatEP --> AgentCtrl
    PlanEP --> AgentCtrl
    RecEP --> AgentCtrl
    HealthEP --> GeminiService
    ToolsEP --> ToolRegistry

    AgentCtrl --> IntentRouter
    IntentRouter --> ToolRegistry
    ToolRegistry --> GeminiService
    GeminiService <--> GeminiAPI
    AgentCtrl --> AuditTrace
    AuditTrace --> ClientLayer
```

---

## 2. Agentic Workflow Lifecycle

The AI Agent follows a 6-phase autonomous cycle for every request:

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student
    participant Frontend as React Client
    participant Controller as Agent Controller (Express)
    participant Router as Intent Router
    participant Tool as Selected Agent Tool
    participant Gemini as Google Gemini API

    Student->>Frontend: Enters query / clicks action
    Frontend->>Controller: POST /api/agent/chat (Message + Task Context)
    Note over Controller: Start latency timer
    Controller->>Router: Analyze intent & parameters
    Router->>Gemini: Intent classification prompt
    Gemini-->>Router: Tool chosen & extracted params
    Router-->>Controller: Return Decision (Tool, Params, Reasoning)
    
    Controller->>Tool: Execute selected tool(params, tasks)
    alt Tool requires AI generation (T1, T2, T5)
        Tool->>Gemini: Pedagogical / Timetable / Prioritization prompt
        Gemini-->>Tool: Structured text or JSON payload
    else Tool is deterministic (T3, T4)
        Tool->>Tool: Filter local tasks & compute overdue flags
    end
    Tool-->>Controller: Return Tool Output
    
    Controller->>Controller: Synthesize response & build Agent Trace
    Controller-->>Frontend: Return { success, agentMessage, toolOutput, trace }
    Frontend-->>Student: Render rich cards, timetable & expandable Agent Trace badge
```

---

## 3. Registered Tool Specifications

| Tool Name | Type | Purpose | Parameters | Returns |
|-----------|------|---------|------------|---------|
| `answerAcademicQuestion` | Generative / Pedagogical | Explains technical concepts, algorithms, and theory using 5-point pedagogical structure. | `query` (string), `subject` (string), `context` (string) | Conceptual breakdown, real-world example, code snippet, exam takeaway. |
| `generateStudyPlan` | Generative / Structured JSON | Formulates a multi-day study schedule with recommended duration per topic and sequence. | `subject`, `topics`, `availableHours`, `days`, `difficulty` | Structured JSON with day-by-day topics, durations, priorities, and study tips. |
| `retrieveStudentTasks` | Deterministic State Tool | Filters student tasks based on status ('all', 'pending', 'completed', 'high-priority'). | `tasks` (array), `filter` (string) | Filtered task list and match count. |
| `getPendingTasks` | Deterministic State Tool | Identifies uncompleted tasks and calculates days remaining until deadline. | `tasks` (array) | List of pending tasks, overdue count, and urgency flags. |
| `generateStudyRecommendation` | Hybrid (State + AI) | Evaluates pending assignments against deadlines to recommend what to study next. | `tasks`, `studentPreferences`, `subjectFocus` | Top priority topic headline, rationale ("Why first?"), and 3-step action checklist. |

---

## 4. Architectural Separation: AI vs. Application Actions

A critical tenet of this Agentic AI Development Lab project is the strict boundary between AI generation and actual application operations:

1. **State Mutation is Real:** When a student creates, checks off, or deletes a task in the Task Manager, the change is committed directly to browser `LocalStorage`. The AI does not simulate these actions through fake text.
2. **Tool-Driven Scheduling:** When the `generateStudyPlan` tool outputs topics, a dedicated "Add to Task Manager" button converts the generated topics into actual task records stored in `LocalStorage`.
3. **Trace Transparency:** Every agent interaction includes an `executionDurationMs` timestamp and decision rationale, allowing examiners to inspect how and why a tool was selected.
