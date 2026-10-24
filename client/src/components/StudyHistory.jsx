// client/src/components/StudyHistory.jsx
import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Calendar, 
  Clock, 
  Layers, 
  Download,
  AlertCircle
} from 'lucide-react';
import { storage } from '../services/storage';

export default function StudyHistory({ studyPlans = [], onDeletePlan, setActiveTab }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleExportJSON = (plan) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `study_plan_${plan.subject.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2 border border-slate-200">
            <History className="w-3.5 h-3.5" />
            <span>Persistent Study Archives</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Study Plans & History
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review and export your previously generated academic timetables and revision roadmaps.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('planner')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs self-start sm:self-auto"
        >
          Generate New Plan
        </button>
      </div>

      {/* Plans List */}
      {studyPlans.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No saved study plans yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When you generate a study schedule in the Study Planner, click "Save to History" to archive it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {studyPlans.map((plan) => {
            const isExpanded = expandedId === plan.id;
            return (
              <div
                key={plan.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition hover:border-slate-300"
              >
                {/* Summary Header Row */}
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                        {plan.subject}
                      </span>
                      <span className="text-xs text-slate-400">
                        Saved: {new Date(plan.savedAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {plan.totalDays} Days Schedule ({plan.dailyHours} hrs/day)
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{plan.overview}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleExportJSON(plan)}
                      title="Export Plan as JSON"
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeletePlan(plan.id)}
                      title="Delete Plan"
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleExpand(plan.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Timetable'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Breakdown */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6 space-y-4">
                    <div className="space-y-3">
                      {plan.days?.map((day) => (
                        <div
                          key={day.dayNumber}
                          className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                            <span className="font-bold text-slate-900">
                              Day {day.dayNumber}: {day.dayTitle}
                            </span>
                            <span className="text-slate-500">{day.recommendedHours} hours</span>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            {day.topics?.map((top, idx) => (
                              <div
                                key={idx}
                                className="flex items-start justify-between gap-2 text-xs"
                              >
                                <div>
                                  <span className="font-semibold text-slate-800">
                                    • {top.topicName}
                                  </span>
                                  <p className="text-[11px] text-slate-500 pl-3">
                                    {top.shortStudySuggestions}
                                  </p>
                                </div>
                                <span className="shrink-0 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                                  {top.suggestedDurationMinutes}m
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {plan.studyTips && (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                        <span className="font-bold block mb-1">Key Revision Tips:</span>
                        <ul className="list-disc list-inside space-y-0.5">
                          {plan.studyTips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
