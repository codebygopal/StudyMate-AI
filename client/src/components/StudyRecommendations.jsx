// client/src/components/StudyRecommendations.jsx
import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  BrainCircuit, 
  Lightbulb, 
  Zap, 
  Flame,
  ListTodo
} from 'lucide-react';
import { api } from '../services/api';
import { storage } from '../services/storage';

export default function StudyRecommendations({ tasks = [], setActiveTab }) {
  const [preferences, setPreferences] = useState('');
  const [subjectFocus, setSubjectFocus] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [taskContext, setTaskContext] = useState(null);
  const [checkedSteps, setCheckedSteps] = useState({});

  const pendingTasks = tasks.filter((t) => !t.completed);
  const highPriorityCount = pendingTasks.filter((t) => t.priority === 'High').length;
  
  const now = new Date();
  const overdueCount = pendingTasks.filter((t) => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate).getTime() < now.getTime();
  }).length;

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg('');
    setCheckedSteps({});

    try {
      const res = await api.generateRecommendation(tasks, preferences, subjectFocus);
      if (res.toolOutput?.recommendation) {
        setRecommendation(res.toolOutput.recommendation);
        setTaskContext(res.toolOutput.taskContext);
        storage.incrementStat('recommendationsViewed');
      } else {
        throw new Error('Recommendation data was not structured properly.');
      }
    } catch (err) {
      console.error('Recommendation error:', err);
      setErrorMsg(err.message || 'Failed to generate recommendation. Check backend status.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (index) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3 border border-purple-200">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Autonomous Prioritization Tool</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Study Prioritization & Advice
        </h1>
        <p className="mt-1 text-sm text-slate-500 max-w-3xl">
          The agent evaluates your pending academic workload, approaching deadlines, and difficulty levels to recommend what to tackle next for maximum academic impact.
        </p>
      </div>

      {/* Workload Status Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ListTodo className="w-4 h-4 text-blue-600" />
          <span>Active Academic Workload Snapshot</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs text-slate-500 font-medium">Pending Tasks</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{pendingTasks.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Stored in LocalStorage</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70">
            <span className="text-xs text-amber-800 font-medium">High Priority</span>
            <p className="text-2xl font-bold text-amber-700 mt-1">{highPriorityCount}</p>
            <p className="text-[11px] text-amber-800/80 mt-0.5">Requires immediate focus</p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/70">
            <span className="text-xs text-rose-800 font-medium">Overdue / Imminent</span>
            <p className="text-2xl font-bold text-rose-700 mt-1">{overdueCount}</p>
            <p className="text-[11px] text-rose-800/80 mt-0.5">Critical attention needed</p>
          </div>
        </div>
      </div>

      {/* Preferences & Trigger Form */}
      <form onSubmit={handleGenerate} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Custom Guidance Preferences (Optional)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Focus Subject (Optional)
            </label>
            <input
              type="text"
              value={subjectFocus}
              onChange={(e) => setSubjectFocus(e.target.value)}
              placeholder="e.g. Operating Systems or leave blank for all"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Time Available / Constraint
            </label>
            <input
              type="text"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g. I have 1 hour before dinner; prefer practical coding"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm transition shadow-md shadow-purple-500/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Agent Evaluating Workload & Deadlines...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Analyze Workload & Generate AI Study Recommendation</span>
            </>
          )}
        </button>
      </form>

      {/* Error Notice */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{errorMsg}</p>
            <p className="text-xs text-rose-600/80 mt-1">Check backend server and Gemini API key status.</p>
          </div>
        </div>
      )}

      {/* Recommendation Results Card */}
      {recommendation && (
        <div className="bg-white rounded-2xl border border-purple-200 shadow-md p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    recommendation.urgency === 'Urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : recommendation.urgency === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {recommendation.urgency || 'Priority'} Urgency
                </span>
                <span className="text-xs text-slate-400">
                  Focus Area: {recommendation.focusArea || 'Core Academic Topic'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {recommendation.headline}
              </h2>
            </div>

            <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
              <Clock className="w-4 h-4" />
              <span>Est. {recommendation.estimatedTimeNeeded || '45-60 mins'}</span>
            </div>
          </div>

          {/* Rationale */}
          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200/60 text-slate-700 text-sm leading-relaxed space-y-1">
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block">
              💡 Agent Rationale (Why this task first?):
            </span>
            <p>{recommendation.rationale}</p>
          </div>

          {/* Suggested Breakdown / Focus Technique */}
          {recommendation.suggestedBreakdown && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-500 font-medium">Recommended Task</span>
                <p className="text-sm font-bold text-slate-900">
                  {recommendation.suggestedBreakdown.recommendedTaskTitle || 'Selected Assignment'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs">
                  <span className="text-slate-500">Suggested Duration:</span>{' '}
                  <span className="font-bold text-blue-600">
                    {recommendation.suggestedBreakdown.recommendedMinutes || 45} mins
                  </span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500">Technique:</span>{' '}
                  <span className="font-bold text-indigo-600">
                    {recommendation.suggestedBreakdown.focusTechnique || 'Pomodoro 50/10'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3-Step Action Plan */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span>Immediate 3-Step Action Checklist</span>
            </h3>

            <div className="space-y-2.5">
              {recommendation.actionSteps?.map((step, idx) => {
                const isChecked = Boolean(checkedSteps[idx]);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`cursor-pointer p-3.5 rounded-xl border transition flex items-center gap-3 ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 line-through opacity-80'
                        : 'bg-white border-slate-200 hover:border-purple-300 shadow-2xs'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold text-slate-400">{idx + 1}</span>}
                    </div>
                    <span className="text-sm font-medium">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setActiveTab('tasks')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              <span>Go to Task Manager & Start Working</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
