// client/src/components/Footer.jsx
import React from 'react';
import { GraduationCap, Users, BookOpen, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          {/* Col 1: Project Identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-sm">StudyMate AI</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              AI-Powered Study Planner and Academic Assistant for Computer Science & Engineering students.
            </p>
            <p className="text-[11px] text-slate-400">
              Agentic AI Development Lab • Practical No. 10
            </p>
          </div>

          {/* Col 2: Institutional Affiliation */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-900 uppercase tracking-wider block">
              Institution & Department
            </span>
            <p className="font-medium text-slate-800">Department of Computer Science and Engineering</p>
            <p className="text-slate-500">Maharashtra Institute of Technology,</p>
            <p className="text-slate-500">Chhatrapati Sambhaginagar.</p>
            <p className="text-[11px] text-slate-400 pt-1">Academic Year: 2026–27</p>
          </div>

          {/* Col 3: Two-Member Team Division */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Project Team & Work Division</span>
            </span>
            <div className="space-y-1 text-[11px]">
              <div>
                <span className="font-semibold text-slate-800">Member 1:</span>
                <span className="text-slate-500"> Frontend, Dashboard, UI/UX, Study Planner & Report Formatting</span>
              </div>
              <div>
                <span className="font-semibold text-slate-800">Member 2:</span>
                <span className="text-slate-500"> Backend, Gemini API, Agent Tools, Testing & Deployment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© 2026–27 StudyMate AI. Built for Academic Demonstration.</p>
          <p className="flex items-center gap-1">
            <span>Designed for B.Tech CSE Practical Examination</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
