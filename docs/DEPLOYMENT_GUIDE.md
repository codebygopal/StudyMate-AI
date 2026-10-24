# StudyMate AI - Production Deployment Guide

This guide provides step-by-step instructions to deploy **StudyMate AI** to production using **Render** for the backend server and **Vercel** for the frontend client.

---

## 1. Prerequisites

1. A [GitHub](https://github.com/) account.
2. A [Render](https://render.com/) account (free tier supports Node.js web services).
3. A [Vercel](https://vercel.com/) account (free tier supports Vite / React static hosting).
4. A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 2. GitHub Repository Setup

1. Open your terminal in the root `StudyMate-AI` directory.
2. Check git status and commit all files:
   ```bash
   git add .
   git commit -m "feat: complete StudyMate AI agentic application and documentation"
   ```
3. Create a new public or private repository on GitHub named `StudyMate-AI`.
4. Link your local repo and push to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/StudyMate-AI.git
   git branch -M main
   git push -u origin main
   ```

---

## 3. Backend Deployment on Render

1. Log in to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository `StudyMate-AI`.
3. Configure the service settings:
   - **Name:** `studymate-ai-backend` (or your preferred name)
   - **Region:** Closest region to you (e.g., Singapore / Frankfurt / Oregon)
   - **Branch:** `main`
   - **Root Directory:** `server` *(Important! Set this to `server`)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
4. Expand **Environment Variables** and add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: *(Paste your Google Gemini API key)*
   - `CLIENT_URL`: `https://<your-frontend>.vercel.app` *(You can update this after Vercel deployment)*
5. Click **Create Web Service**.
6. Wait 2-3 minutes until deployment completes. Render will provide a live URL such as:
   `https://studymate-ai-backend.onrender.com`
7. Verify backend health by visiting:
   `https://studymate-ai-backend.onrender.com/api/health`

---

## 4. Frontend Deployment on Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** -> **Project**.
2. Select your `StudyMate-AI` GitHub repository and click **Import**.
3. In the project configuration screen:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and select `client` *(Important! Set this to `client`)*
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Expand **Environment Variables** and add:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://studymate-ai-backend.onrender.com` *(Your Render backend URL without trailing slash)*
5. Click **Deploy**.
6. Vercel will build the frontend in ~45 seconds and provide your live production URL:
   `https://studymate-ai-<your-username>.vercel.app`

---

## 5. Post-Deployment CORS Update

1. Once your Vercel frontend URL is active, return to your Render service dashboard.
2. Go to **Environment** tab on Render.
3. Update `CLIENT_URL` to your exact Vercel URL (e.g. `https://studymate-ai-frontend.vercel.app`).
4. Render will automatically redeploy with the updated CORS policy.

---

## 6. Production Verification Checklist

Visit your deployed Vercel frontend URL and verify:
- [ ] Top navbar shows "Backend: Connected" (green pulsating dot).
- [ ] Top navbar shows "Gemini: Ready".
- [ ] Dashboard displays statistics and progress bar correctly.
- [ ] Ask a doubt in the AI Doubt Assistant (e.g. "What is TCP 3-way handshake?") and confirm response + Agent Execution Trace renders.
- [ ] Generate a study plan in the Study Planner and verify multi-day timetable cards appear.
- [ ] Add a new task in the Task Manager, check it as complete (confetti animation), and reload the page to confirm LocalStorage persistence.
- [ ] Click "Generate AI Study Recommendation" to confirm workload diagnosis.

---

## 7. Troubleshooting Common Issues

| Issue | Cause | Fix |
|---|---|---|
| **Backend 503 Service Unavailable** | `GEMINI_API_KEY` missing on Render | Add `GEMINI_API_KEY` in Render Web Service -> Environment Variables. |
| **CORS Error in Browser Console** | Frontend domain not allowed by backend | Ensure `CLIENT_URL` in Render matches your Vercel domain or ends in `.vercel.app`. |
| **Frontend 404 on API calls** | `VITE_API_BASE_URL` missing or wrong | In Vercel Project Settings -> Environment Variables, ensure `VITE_API_BASE_URL` equals your Render URL. Redeploy after modifying. |
| **Render Free Tier Spin-Down** | Free instances sleep after 15 min of inactivity | Initial request after inactivity may take 30-50 seconds to warm up. Subsequent requests respond instantly. |
