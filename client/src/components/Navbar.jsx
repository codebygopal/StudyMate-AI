// client/src/components/Navbar.jsx
import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  MessageSquareText, 
  CalendarRange, 
  CheckSquare, 
  Sparkles, 
  History, 
  Cpu, 
  Activity 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, serverStatus, geminiReady }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'doubt', label: 'AI Doubt Assistant', icon: MessageSquareText },
    { id: 'planner', label: 'Study Planner', icon: CalendarRange },
    { id: 'tasks', label: 'Task Manager', icon: CheckSquare },
    { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
    { id: 'history', label: 'Study History', icon: History },
    { id: 'inspector', label: 'Agent Inspector', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">StudyMate</span>
                <span className="text-xs px-2 py-0.5 font-semibold bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                  AI AGENT
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Academic Assistant & Study Planner</p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600 border border-slate-200">
              <span className={`w-2 h-2 rounded-full ${serverStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span>Backend: {serverStatus === 'online' ? 'Connected' : 'Offline'}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full text-xs font-medium text-blue-700 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Gemini: {geminiReady ? 'Ready' : 'Setup Key'}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
