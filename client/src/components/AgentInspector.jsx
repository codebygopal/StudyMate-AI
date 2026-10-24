// client/src/components/AgentInspector.jsx
import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Workflow, 
  CheckCircle2, 
  Terminal, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Database,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export default function AgentInspector() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTools() {
      try {
        const res = await api.getTools();
        setTools(res.tools || []);
      } catch (err) {
        setError('Could not fetch agent tool registry. Ensure backend is running.');
      } finally {
        setLoading(false);
      }
    }
    loadTools();
  }, []);

  const workflowSteps = [
    {
      step: '1',
      title: 'User Input Ingestion',
      desc: 'Receives student query, conversation history, and local task context.',
      icon: Terminal,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      step: '2',
      title: 'Intent & Semantic Analysis',
      desc: 'Evaluates whether user seeks conceptual doubts, study timetables, or workload prioritization.',
      icon: Sparkles,
      color: 'bg-indigo-100 text-indigo-700',
    },
    {
      step: '3',
      title: 'Autonomous Tool Selection',
      desc: 'Matches user intent to one of the 5 registered tools in the agent registry.',
      icon: Cpu,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      step: '4',
      title: 'Parameter Extraction & Execution',
      desc: 'Extracts subjects, hours, deadlines, and invokes the selected tool.',
      icon: Layers,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      step: '5',
      title: 'Result Synthesis & Trace Logging',
      desc: 'Structures pedagogical response and generates an auditable execution trace with latency.',
      icon: CheckCircle2,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      step: '6',
      title: 'Client UI Rendering',
      desc: 'Renders response with interactive timetable cards, action buttons, and trace view.',
      icon: Workflow,
      color: 'bg-rose-100 text-rose-700',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-3 border border-blue-200">
          <Cpu className="w-3.5 h-3.5" />
          <span>Agentic AI Lab Architecture & Tool Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Agent Workflow & Tool Inspector
        </h1>
        <p className="mt-1 text-sm text-slate-500 max-w-3xl">
          StudyMate AI is engineered as an autonomous agent with controlled tool routing. This panel demonstrates how requests are analyzed, routed, executed, and audited.
        </p>
      </div>

      {/* 6-Step Agent Workflow Diagram */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Autonomous Agent Execution Lifecycle</h2>
            <p className="text-xs text-slate-500">End-to-end processing pipeline from user prompt to tool execution</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            6 Pipeline Stages
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowSteps.map((ws) => {
            const Icon = ws.icon;
            return (
              <div
                key={ws.step}
                className="p-5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3 relative overflow-hidden hover:border-blue-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${ws.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">STAGE 0{ws.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{ws.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ws.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Tool Registry (from Backend API) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Registered Agent Tools</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-slate-500">
              Live inspection of tools declared in <code className="bg-slate-100 px-1 py-0.5 rounded">server/services/tools.js</code>
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            {tools.length} Tools Registered
          </span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400 py-6 text-center">Loading registered tools from server...</p>
        ) : error ? (
          <p className="text-xs text-rose-600 py-4">{error}</p>
        ) : (
          <div className="space-y-4">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <code className="text-sm font-bold text-blue-700 font-mono">
                      {tool.name}()
                    </code>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium self-start sm:self-auto">
                    Type: Agentic Action Tool
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{tool.description}</p>

                {/* Parameters Schema */}
                <div className="p-3 bg-white rounded-lg border border-slate-200/80 text-xs font-mono text-slate-700 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block font-sans uppercase tracking-wider">
                    Parameters Schema:
                  </span>
                  {Object.keys(tool.parameters || {}).length === 0 ? (
                    <span className="text-slate-400 italic">No required parameters (reads context).</span>
                  ) : (
                    Object.entries(tool.parameters).map(([param, desc]) => (
                      <div key={param} className="flex gap-2">
                        <span className="text-purple-600 font-semibold">{param}:</span>
                        <span className="text-slate-500 font-sans">{desc}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Honest Architectural Separation Note */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-6 text-blue-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-blue-800">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span>Honest Agentic Separation & Safety Principles</span>
        </div>
        <p className="text-xs text-blue-900/90 leading-relaxed">
          In strict compliance with the Agentic AI Development Lab guidelines:
        </p>
        <ul className="list-disc list-inside text-xs text-blue-900/80 space-y-1">
          <li>
            <strong>Real Task Execution:</strong> Adding, completing, and deleting tasks are actual state operations handled by the local task management system, not fabricated text responses.
          </li>
          <li>
            <strong>Zero Secret Exposure:</strong> The Gemini API key is guarded exclusively in backend environment variables (<code className="bg-blue-100 px-1 py-0.5 rounded">server/.env</code>) and is never accessible to the frontend client.
          </li>
          <li>
            <strong>Auditable Execution Trace:</strong> Every agent response produces an auditable trace capturing the identified intent, selected tool, execution duration, and reasoning.
          </li>
        </ul>
      </div>
    </div>
  );
}
