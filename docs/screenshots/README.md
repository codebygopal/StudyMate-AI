# StudyMate AI - Project Screenshots Guide

This directory contains the required screenshot captures for **StudyMate AI – AI-Powered Study Planner and Academic Assistant** for submission in the Practical No. 10 Examination and Project Report.

## Required Screenshots Checklist

When running the application locally (`npm run server` and `npm run client`), capture each of the following screens and save them into this folder using the designated filename:

| # | Screenshot Filename | View / Module | What to Show on Screen | Relevant Report Section |
|---|---------------------|---------------|------------------------|-------------------------|
| 1 | `01_dashboard.png` | **Dashboard / Home** | Welcome banner, semester progress bar (e.g. 50%), statistics cards (Total, Pending, Completed, Plans), and urgent deadlines reminder. | Section 7: Figure 7.1 |
| 2 | `02_doubt_assistant.png` | **AI Doubt Assistant** | Conversational chat interface showing student asking a CS question (e.g., "Explain Paging vs Segmentation in OS") and the structured pedagogical AI response. | Section 7: Figure 7.2 |
| 3 | `03_agent_trace.png` | **Agent Decision Audit** | Click "Agent Execution Trace" on any AI chat message showing the expanded terminal badge with Intent, Tool Selected (`answerAcademicQuestion`), and Execution Duration in milliseconds. | Section 7: Figure 7.3 |
| 4 | `04_study_planner_form.png` | **Study Planner (Input Form)** | Input form filled with Subject (e.g. "Operating Systems"), Topics, 3 hours/day slider, 3 days slider, and difficulty selector. | Section 7: Figure 7.4 |
| 5 | `05_study_planner_result.png` | **Generated Study Timetable** | The resulting timetable cards showing Day 1, Day 2, Day 3 breakdowns with duration minutes, priority badges, and study tips. | Section 7: Figure 7.5 |
| 6 | `06_task_manager.png` | **Task Manager** | List of academic tasks with priority badges (High, Medium, Low), countdown due dates (e.g. "Due in 2 days"), and filter pills. | Section 7: Figure 7.6 |
| 7 | `07_confetti_task.png` | **Task Completion Confetti** | Click the completion checkbox on a task showing the celebratory confetti explosion animation and updated counter. | Section 7: Figure 7.7 |
| 8 | `08_study_recommendation.png` | **Study Recommendations** | AI Prioritization card showing the headline, urgency level, rationale explaining *why* to do the task first, and 3-step action plan. | Section 7: Figure 7.8 |
| 9 | `09_study_history.png` | **Study History & Archives** | Saved study plans list with "View Timetable" expanded and JSON export button. | Section 7: Figure 7.9 |
| 10 | `10_agent_inspector.png` | **Agent Inspector** | The 6-stage autonomous lifecycle diagram and live registered tools table from `/api/agent/tools`. | Section 7: Figure 7.10 |
| 11 | `11_backend_terminal.png` | **Backend Server Console** | Terminal showing `🚀 StudyMate AI Server running on http://localhost:5000` with health check and tool status. | Section 7: Figure 7.11 |

## Capturing Instructions (Windows)
1. Use `Windows + Shift + S` (Snipping Tool) to capture high-resolution window screenshots.
2. Save each PNG file directly inside `docs/screenshots/` with the exact filenames listed above.
3. In Microsoft Word or Google Docs, open `docs/STUDYMATE_AI_PROJECT_REPORT.docx`, navigate to **Section 7: SCREENSHOTS**, right-click the corresponding placeholder box, and choose **Replace Image** / **Insert Picture from File**.
