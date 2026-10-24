// client/src/components/StudyPlanner.jsx
import React, { useState } from 'react';
import { 
  CalendarRange, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  PlusCircle, 
  Save, 
  AlertCircle,
  Copy,
  Check,
  Download
} from 'lucide-react';
import { api } from '../services/api';
import { storage } from '../services/storage';

export default function StudyPlanner({ onAddTasksFromPlan, onPlanSaved }) {
  const [subject, setSubject] = useState('Operating Systems');
  const [topics, setTopics] = useState(
    'CPU Scheduling algorithms (FCFS, SJF, Round Robin), Deadlock avoidance (Banker’s algorithm), Memory Management (Paging and Segmentation)'
  );
  const [availableHours, setAvailableHours] = useState(3);
  const [days, setDays] = useState(3);
  const [difficulty, setDifficulty] = useState('Medium');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [addedTasksSuccess, setAddedTasksSuccess] = useState(false);

  const subjectPresets = [
    {
      name: 'Operating Systems',
      sample: 'CPU Scheduling, Deadlock Detection & Banker’s Algorithm, Virtual Memory & Paging',
    },
    {
      name: 'Database Management Systems',
      sample: 'ER Model, Normalization (1NF, 2NF, 3NF, BCNF), SQL Joins & Subqueries, ACID Properties & Transactions',
    },
    {
      name: 'Computer Networks',
      sample: 'OSI vs TCP/IP model, IP Addressing & Subnetting, Routing Algorithms, TCP 3-Way Handshake & Flow Control',
    },
    {
      name: 'Data Structures & Algorithms',
      sample: 'Binary Search Trees & AVL Trees, Graph Traversals (BFS/DFS), Dynamic Programming (Knapsack), Sorting Algorithms',
    },
    {
      name: 'Software Engineering',
      sample: 'Agile & Scrum methodology, SDLC Models, Software Testing (Black Box & White Box), Requirement Engineering',
    },
  ];

  const handleApplyPreset = (preset) => {
    setSubject(preset.name);
    setTopics(preset.sample);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !topics.trim() || loading) return;

    setErrorMsg('');
    setLoading(true);
    setSavedSuccess(false);
    setAddedTasksSuccess(false);

    try {
      const res = await api.generateStudyPlan({
        subject: subject.trim(),
        topics: topics.trim(),
        availableHours: Number(availableHours),
        days: Number(days),
        difficulty,
      });

      if (res.toolOutput?.plan) {
        setGeneratedPlan(res.toolOutput.plan);
      } else {
        throw new Error('Study plan response did not contain structured timetable data.');
      }
    } catch (err) {
      console.error('Study planner error:', err);
      setErrorMsg(err.message || 'Failed to generate study plan. Please verify the backend and Gemini API configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHistory = () => {
    if (!generatedPlan) return;
    storage.saveStudyPlan(generatedPlan);
    setSavedSuccess(true);
    if (onPlanSaved) onPlanSaved();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleConvertTopicsToTasks = () => {
    if (!generatedPlan || !generatedPlan.days) return;
    const newTasks = [];
    const today = new Date();

    generatedPlan.days.forEach((day, dayIdx) => {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + day.dayNumber);
      const dueDateStr = targetDate.toISOString().split('T')[0];

      day.topics?.forEach((top, topIdx) => {
        newTasks.push({
          id: `task-${Date.now()}-${dayIdx}-${topIdx}`,
          title: `${generatedPlan.subject}: ${top.topicName}`,
          description: `${top.shortStudySuggestions} (Suggested time: ${top.suggestedDurationMinutes} mins)`,
          subject: generatedPlan.subject,
          priority: top.priority || 'Medium',
          dueDate: dueDateStr,
          completed: false,
          createdAt: new Date().toISOString(),
        });
      });
    });

    if (onAddTasksFromPlan && newTasks.length > 0) {
      onAddTasksFromPlan(newTasks);
      setAddedTasksSuccess(true);
      setTimeout(() => setAddedTasksSuccess(false), 3000);
    }
  };

  const handleCopyPlan = () => {
    if (!generatedPlan) return;
    const text = `STUDY PLAN: ${generatedPlan.subject}\n` +
      `Overview: ${generatedPlan.overview}\n` +
      `Duration: ${generatedPlan.totalDays} Days (${generatedPlan.dailyHours} hrs/day)\n\n` +
      generatedPlan.days.map((d) => 
        `DAY ${d.dayNumber}: ${d.dayTitle} (${d.recommendedHours} hrs)\n` +
        d.topics.map((t) => `  - [${t.priority} Priority] ${t.topicName} (${t.suggestedDurationMinutes} mins): ${t.shortStudySuggestions}`).join('\n')
      ).join('\n\n');

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-3 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Curriculum Breakdown</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Study Plan Generator
        </h1>
        <p className="mt-1 text-sm text-slate-500 max-w-3xl">
          Enter your academic syllabus or topics. The agentic tool calculates topic weights, allocates realistic daily durations, and builds an actionable, phased timetable.
        </p>
      </div>

      {/* Subject Presets Pills */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          Quick Academic Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {subjectPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 transition"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleGenerate} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subject Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Subject / Course Name *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Operating Systems, DBMS, Machine Learning"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 focus:bg-white transition"
            />
          </div>

          {/* Difficulty / Priority */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Study Intensity / Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 focus:bg-white transition"
            >
              <option value="Easy">Standard / Moderate Pace</option>
              <option value="Medium">Medium / Comprehensive Learning</option>
              <option value="Hard">Intensive / Deep Dive</option>
              <option value="Urgent">Fast-Track / Exam Revision Rush</option>
            </select>
          </div>
        </div>

        {/* Topics to Study */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Topics or Syllabus to Cover *
          </label>
          <textarea
            rows={3}
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="List chapters, topics, or paste your syllabus bullet points..."
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 focus:bg-white transition"
          />
        </div>

        {/* Sliders: Hours and Days */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          {/* Daily Study Hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Daily Available Study Time:</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                {availableHours} hours / day
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={availableHours}
              onChange={(e) => setAvailableHours(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1 hr</span>
              <span>5 hrs</span>
              <span>10 hrs</span>
            </div>
          </div>

          {/* Number of Days */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <CalendarRange className="w-4 h-4 text-indigo-600" />
                <span>Preparation Duration:</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">
                {days} days
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="14"
              step="1"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1 day</span>
              <span>7 days</span>
              <span>14 days</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !subject.trim() || !topics.trim()}
          className="w-full py-3.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-sm transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Agent Synthesizing Study Timetable...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Structured Study Plan with AI Agent</span>
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
            <p className="text-xs text-rose-600/80 mt-1">
              Verify that the backend is running on port 5000 and has a valid GEMINI_API_KEY.
            </p>
          </div>
        </div>
      )}

      {/* Generated Study Plan Display */}
      {generatedPlan && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
          {/* Plan Header & Overview */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                  {generatedPlan.difficulty || difficulty} Intensity
                </span>
                <span className="text-xs text-slate-500">
                  {generatedPlan.totalDays} Days • {generatedPlan.dailyHours} hrs/day ({generatedPlan.totalHours || (generatedPlan.totalDays * generatedPlan.dailyHours)} Total Hours)
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                {generatedPlan.subject} Study Schedule
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {generatedPlan.overview}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSaveToHistory}
                className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to History</span>
                  </>
                )}
              </button>

              <button
                onClick={handleConvertTopicsToTasks}
                className="px-3.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {addedTasksSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                    <span>Added to Tasks!</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add to Task Manager</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyPlan}
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Day-by-Day Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Recommended Day-by-Day Schedule</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {generatedPlan.days?.map((day) => (
                <div
                  key={day.dayNumber}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        D{day.dayNumber}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {day.dayTitle}
                      </h4>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      Target: {day.recommendedHours} hours
                    </span>
                  </div>

                  {/* Topics List */}
                  <div className="space-y-2">
                    {day.topics?.map((top, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-lg p-3.5 border border-slate-200/70 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">
                              #{top.recommendedSequence || idx + 1}
                            </span>
                            <span className="font-semibold text-sm text-slate-900">
                              {top.topicName}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                top.priority === 'High'
                                  ? 'bg-rose-100 text-rose-800'
                                  : top.priority === 'Medium'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {top.priority || 'Medium'} Priority
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 pl-4 sm:pl-5">
                            💡 {top.shortStudySuggestions}
                          </p>
                        </div>

                        <div className="shrink-0 flex items-center gap-2 sm:self-center pl-4 sm:pl-0">
                          <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                            ⏱️ {top.suggestedDurationMinutes} mins
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Strategies / Exam Tips Box */}
          {generatedPlan.studyTips && generatedPlan.studyTips.length > 0 && (
            <div className="rounded-xl p-4 bg-amber-50/70 border border-amber-200/80 text-amber-900 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-800">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>Agent Study Recommendations & Exam Strategy</span>
              </h4>
              <ul className="list-disc list-inside text-xs space-y-1 text-amber-900/90">
                {generatedPlan.studyTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
