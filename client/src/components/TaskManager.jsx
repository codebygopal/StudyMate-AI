// client/src/components/TaskManager.jsx
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Search, 
  Filter, 
  Tag, 
  Check, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TaskManager({ tasks = [], onAddTask, onToggleTask, onDeleteTask }) {
  const [filter, setFilter] = useState('all'); // all, pending, completed, high
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Operating Systems');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('High');

  const subjectOptions = [
    'Operating Systems',
    'Database Management Systems',
    'Computer Networks',
    'Data Structures & Algorithms',
    'Software Engineering',
    'Theory of Computation',
    'Machine Learning',
    'Other / General',
  ];

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      subject,
      dueDate: dueDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsAdding(false);
  };

  const handleToggle = (id, currentStatus) => {
    if (!currentStatus) {
      // Trigger confetti celebration when completing a task!
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2563eb', '#3b82f6', '#10b981', '#f59e0b'],
      });
    }
    onToggleTask(id);
  };

  // Filter & Search
  const now = new Date();
  const filteredTasks = tasks.filter((task) => {
    // Filter condition
    if (filter === 'pending' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'high' && task.priority !== 'High') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = (task.description || '').toLowerCase().includes(q);
      const matchSubject = (task.subject || '').toLowerCase().includes(q);
      return matchTitle || matchDesc || matchSubject;
    }
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Task Manager
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Organize lab practicals, syllabus milestones, and exam submissions. Persisted in LocalStorage.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm shadow-blue-500/25 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Add New Task'}</span>
        </button>
      </div>

      {/* Add Task Expandable Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateTask}
          className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Create New Academic Task</h2>
            <span className="text-xs text-slate-400">LocalStorage Connected</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Task Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete Operating Systems Banker's Algorithm Lab Practical"
                required
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Academic Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 focus:bg-white"
              >
                {subjectOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 focus:bg-white"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Task Description / Notes
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include reference book pages, lab manual guidelines, or specific requirements..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition shadow-xs"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              filter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              filter === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              filter === 'high'
                ? 'bg-rose-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            High Priority
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No tasks found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `No tasks matched your search "${searchQuery}".`
                : 'You have no tasks matching this filter. Click "Add New Task" to create one!'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            // Check overdue
            let isOverdue = false;
            let daysRemaining = null;
            if (task.dueDate) {
              const due = new Date(task.dueDate);
              const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              daysRemaining = diff;
              if (diff < 0 && !task.completed) isOverdue = true;
            }

            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl p-4 sm:p-5 border transition-all duration-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                  task.completed
                    ? 'border-slate-200/60 bg-slate-50/50 opacity-75'
                    : isOverdue
                    ? 'border-rose-300 bg-rose-50/20 shadow-xs'
                    : 'border-slate-200/80 hover:border-blue-300 shadow-xs'
                }`}
              >
                {/* Left: Checkbox + Title + Meta */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <button
                    onClick={() => handleToggle(task.id, task.completed)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${
                      task.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-blue-500 bg-white'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    {task.description && (
                      <p
                        className={`text-xs ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-500'
                        } line-clamp-2`}
                      >
                        {task.description}
                      </p>
                    )}

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <span>{task.subject || 'General'}</span>
                      </span>

                      {task.dueDate && (
                        <span
                          className={`flex items-center gap-1 px-2 py-0.5 rounded font-medium ${
                            isOverdue
                              ? 'bg-rose-100 text-rose-800 font-bold'
                              : daysRemaining !== null && daysRemaining <= 2 && !task.completed
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          <span>
                            {isOverdue
                              ? `Overdue (${task.dueDate})`
                              : daysRemaining === 0
                              ? 'Due Today!'
                              : daysRemaining === 1
                              ? 'Due Tomorrow'
                              : `Due in ${daysRemaining} days`}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Priority Badge & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      task.priority === 'High'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : task.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {task.priority || 'Normal'}
                  </span>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    title="Delete Task"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
