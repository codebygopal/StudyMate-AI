// client/src/components/Dashboard.jsx
import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  CalendarRange, 
  MessageSquareText, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  BrainCircuit, 
  TrendingUp, 
  ListTodo,
  Check
} from 'lucide-react';

export default function Dashboard({ tasks = [], onToggleTask, setActiveTab, stats = {}, studyPlans = [] }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Urgent pending tasks (due within 48 hours or overdue)
  const now = new Date();
  const urgentTasks = pendingTasks.filter((t) => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-700 via-indigo-600 to-blue-800 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-100 text-xs font-semibold backdrop-blur border border-blue-400/30 mb-4">
            <BrainCircuit className="w-4 h-4 text-blue-200" />
            <span>Agentic AI Development Lab • Practical No. 10</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome to StudyMate AI
          </h1>
          <p className="mt-2 text-blue-100 text-sm sm:text-base leading-relaxed">
            Your intelligent autonomous academic companion. Generate structured multi-day study schedules, resolve engineering doubts with tool-driven AI agents, and stay ahead of university deadlines.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('doubt')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 transition shadow-sm"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Ask Academic Doubt</span>
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/60 hover:bg-blue-600 text-white font-semibold text-sm border border-blue-400/40 backdrop-blur transition"
            >
              <CalendarRange className="w-4 h-4" />
              <span>Generate Study Plan</span>
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-900 text-white font-semibold text-sm border border-indigo-400/40 backdrop-blur transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Study Recommendations</span>
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 bottom-0 -mb-10 w-60 h-60 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Tasks */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tasks</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ListTodo className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{totalTasks}</span>
            <span className="text-xs text-slate-500">recorded</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Work</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-amber-600">{pendingTasks.length}</span>
            <span className="text-xs text-slate-500">to complete</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600">{completedTasks}</span>
            <span className="text-xs text-emerald-700 font-medium">({completionRate}%)</span>
          </div>
        </div>

        {/* Study Plans */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Study Plans</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-indigo-600">{studyPlans.length}</span>
            <span className="text-xs text-slate-500">generated</span>
          </div>
        </div>
      </div>

      {/* Progress & Urgent Reminders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Bar Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Semester Progress Tracker</h2>
              <p className="text-xs text-slate-500">Overall academic task completion rate</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {completionRate}% Complete
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200">
            <div
              className="bg-linear-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>{completedTasks} completed tasks</span>
            <span>{pendingTasks.length} tasks remaining</span>
          </div>

          {/* Motivational message */}
          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-xs text-slate-700">
              {completionRate >= 75
                ? 'Outstanding progress! You are staying ahead of university submissions.'
                : completionRate >= 50
                ? 'Great consistency! Complete your upcoming lab assignments to cross the 75% mark.'
                : 'Build momentum by tackling your highest priority pending task today!'}
            </p>
          </div>
        </div>

        {/* Urgent Attention / Deadlines */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">Urgent Deadlines</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">Tasks due within the next 48 hours</p>

            {urgentTasks.length === 0 ? (
              <div className="text-center py-6 text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-xs font-medium text-slate-700">No urgent deadlines!</p>
                <p className="text-xs text-slate-400 mt-0.5">All upcoming tasks are well-spaced.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {urgentTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/70 text-xs flex items-start justify-between gap-2"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 line-clamp-1">{task.title}</p>
                      <p className="text-amber-800 text-[11px] mt-0.5">Due: {task.dueDate || 'Soon'}</p>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                      {task.priority || 'High'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('tasks')}
            className="mt-4 w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1.5"
          >
            <span>View All in Task Manager</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Core Academic Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Doubt Assistant */}
          <div
            onClick={() => setActiveTab('doubt')}
            className="group cursor-pointer bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center justify-between">
              <span>AI Doubt Assistant</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Ask questions on Operating Systems, DBMS, Networks, and Algorithms. Get clear intuitive explanations, code snippets, and exam tips.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-blue-600">
              <span>Ask a question</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 2: Study Plan Generator */}
          <div
            onClick={() => setActiveTab('planner')}
            className="group cursor-pointer bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <CalendarRange className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition flex items-center justify-between">
              <span>Study Plan Generator</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Input your syllabus topics, available daily hours, and days remaining. The agent produces a structured, timed day-by-day timetable.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-indigo-600">
              <span>Create schedule</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 3: AI Study Recommendations */}
          <div
            onClick={() => setActiveTab('recommendations')}
            className="group cursor-pointer bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition flex items-center justify-between">
              <span>AI Recommendations</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Let the agent evaluate your active assignments and pending tests to recommend exactly what to study next with a 3-step action plan.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-purple-600">
              <span>Get AI guidance</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks List */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Academic Tasks</h2>
            <p className="text-xs text-slate-500">Quickly toggle completion or view details</p>
          </div>
          <button
            onClick={() => setActiveTab('tasks')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Manage All Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No tasks added yet. Create one in the Task Manager!</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="py-3 flex items-center justify-between gap-4 group hover:bg-slate-50/50 px-2 rounded-lg transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition shrink-0 ${
                      task.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-blue-500 bg-white'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{task.subject || 'General'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      task.priority === 'High'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : task.priority === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {task.priority || 'Normal'}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-slate-500 hidden sm:inline">
                      Due: {task.dueDate}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
