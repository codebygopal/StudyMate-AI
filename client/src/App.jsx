// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DoubtAssistant from './components/DoubtAssistant';
import StudyPlanner from './components/StudyPlanner';
import TaskManager from './components/TaskManager';
import StudyRecommendations from './components/StudyRecommendations';
import StudyHistory from './components/StudyHistory';
import AgentInspector from './components/AgentInspector';
import Footer from './components/Footer';

import { storage } from './services/storage';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState(() => storage.getTasks());
  const [studyPlans, setStudyPlans] = useState(() => storage.getStudyPlans());
  const [stats, setStats] = useState(() => storage.getStats());

  const [serverStatus, setServerStatus] = useState('checking');
  const [geminiReady, setGeminiReady] = useState(false);

  // Check backend server & gemini connectivity on mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await api.getHealth();
        if (res.status === 'OK') {
          setServerStatus('online');
          setGeminiReady(Boolean(res.geminiConfigured));
        } else {
          setServerStatus('offline');
        }
      } catch (err) {
        console.warn('Backend ping failed:', err.message);
        setServerStatus('offline');
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Save tasks to LocalStorage whenever tasks update
  const handleAddTask = (newTask) => {
    const updated = [newTask, ...tasks];
    setTasks(updated);
    storage.saveTasks(updated);
  };

  const handleToggleTask = (id) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
    storage.saveTasks(updated);
  };

  const handleDeleteTask = (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    storage.saveTasks(updated);
  };

  const handleAddTasksFromPlan = (newTasksList) => {
    const updated = [...newTasksList, ...tasks];
    setTasks(updated);
    storage.saveTasks(updated);
  };

  // Study plans handlers
  const handlePlanSaved = () => {
    setStudyPlans(storage.getStudyPlans());
    setStats(storage.getStats());
  };

  const handleDeletePlan = (id) => {
    const updated = storage.deleteStudyPlan(id);
    setStudyPlans(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverStatus={serverStatus}
        geminiReady={geminiReady}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'dashboard' && (
          <Dashboard
            tasks={tasks}
            onToggleTask={handleToggleTask}
            setActiveTab={setActiveTab}
            stats={stats}
            studyPlans={studyPlans}
          />
        )}

        {activeTab === 'doubt' && (
          <DoubtAssistant tasks={tasks} />
        )}

        {activeTab === 'planner' && (
          <StudyPlanner
            onAddTasksFromPlan={handleAddTasksFromPlan}
            onPlanSaved={handlePlanSaved}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskManager
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === 'recommendations' && (
          <StudyRecommendations
            tasks={tasks}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'history' && (
          <StudyHistory
            studyPlans={studyPlans}
            onDeletePlan={handleDeletePlan}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'inspector' && (
          <AgentInspector />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
