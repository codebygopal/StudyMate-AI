// client/src/components/DoubtAssistant.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Trash2, 
  Sparkles, 
  Bot, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Clock, 
  Copy, 
  Check, 
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { api } from '../services/api';
import { storage } from '../services/storage';

export default function DoubtAssistant({ tasks = [] }) {
  const [messages, setMessages] = useState(() => {
    const saved = storage.getChatHistory();
    if (saved && saved.length > 0) return saved;
    return [
      {
        id: 'welcome-1',
        sender: 'agent',
        text: "Hello! I am your StudyMate AI Academic Assistant. I can help clarify computer science concepts, explain algorithms step-by-step, generate code examples, or design a custom study schedule. What would you like to learn or solve today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        trace: {
          intent: 'Session initialization',
          toolSelected: 'answerAcademicQuestion',
          reasoning: 'System greeted student and registered academic readiness.',
          executionDurationMs: 12,
        },
      },
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Analyzing question...');
  const [copiedId, setCopiedId] = useState(null);
  const [expandedTraceId, setExpandedTraceId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    storage.saveChatHistory(messages);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    'Explain Paging vs Segmentation in Operating Systems with a diagram breakdown.',
    'What is ACID property in DBMS with real banking examples?',
    'How does Dijkstra’s Shortest Path Algorithm work?',
    'Explain TCP 3-Way Handshake step by step.',
    'What should I study next based on my current pending tasks?',
  ];

  const handleSend = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : input;
    if (!query.trim() || loading) return;

    setErrorMsg('');
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setLoadingStep('Agent analyzing user intent...');

    const timer1 = setTimeout(() => setLoadingStep('Agent selecting registered tool...'), 400);
    const timer2 = setTimeout(() => setLoadingStep('Executing tool & generating explanation...'), 1000);

    try {
      const historyContext = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await api.sendAgentMessage(query.trim(), historyContext, tasks);

      clearTimeout(timer1);
      clearTimeout(timer2);

      const agentMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: res.agentMessage || 'Explanation generated successfully.',
        trace: res.trace || {
          intent: 'Academic Assistance',
          toolSelected: 'answerAcademicQuestion',
          reasoning: 'Tool executed successfully',
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMessage]);
      storage.incrementStat('questionsAsked');
    } catch (err) {
      console.error('Agent chat error:', err);
      clearTimeout(timer1);
      clearTimeout(timer2);
      setErrorMsg(err.message || 'Failed to connect to agent server. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      const initial = [
        {
          id: `welcome-${Date.now()}`,
          sender: 'agent',
          text: 'Chat cleared. How can I assist your studies now?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      setMessages(initial);
      storage.clearChatHistory();
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleTrace = (id) => {
    setExpandedTraceId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-8.5rem)] flex flex-col">
      {/* Header Bar */}
      <div className="bg-white rounded-t-2xl p-4 border border-slate-200/80 border-b-0 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">AI Doubt Assistant</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Agentic Router Active
              </span>
            </div>
            <p className="text-xs text-slate-500">Autonomous tool execution & concept explanations</p>
          </div>
        </div>

        <button
          onClick={handleClear}
          title="Clear Chat History"
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-slate-50/60 overflow-y-auto p-4 sm:p-6 border-x border-slate-200/80 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white ${
                  isUser ? 'bg-indigo-600' : 'bg-blue-600'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div className="space-y-1.5 max-w-[85%] sm:max-w-[88%]">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Footer bar: Timestamp & Copy */}
                <div
                  className={`flex items-center gap-2 text-[11px] text-slate-400 px-1 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-slate-600 transition flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Agent Execution Trace Toggle (for agent responses) */}
                {!isUser && msg.trace && (
                  <div className="mt-2">
                    <button
                      onClick={() => toggleTrace(msg.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                    >
                      <Cpu className="w-3 h-3 text-blue-600" />
                      <span>Agent Execution Trace: {msg.trace.toolSelected || 'Tool'}</span>
                      {expandedTraceId === msg.id ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    {/* Expandable Trace Details */}
                    {expandedTraceId === msg.id && (
                      <div className="mt-2 p-3 rounded-lg bg-slate-900 text-slate-200 text-xs font-mono space-y-2 border border-slate-800 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1">
                          <span className="font-bold text-blue-400">AGENT DECISION AUDIT</span>
                          {msg.trace.executionDurationMs !== undefined && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {msg.trace.executionDurationMs} ms
                            </span>
                          )}
                        </div>
                        <p>
                          <span className="text-purple-400">Intent:</span> {msg.trace.intent}
                        </p>
                        <p>
                          <span className="text-emerald-400">Tool Selected:</span>{' '}
                          <code>{msg.trace.toolSelected}</code>
                        </p>
                        <p>
                          <span className="text-amber-400">Agent Reasoning:</span> {msg.trace.reasoning}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 mr-auto max-w-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-xs bg-white border border-slate-200/80 shadow-xs text-sm text-slate-600 space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>{loadingStep}</span>
              </div>
              <p className="text-xs text-slate-400">
                StudyMate Agent is evaluating parameters and dispatching the academic tool...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Banner if API failed */}
      {errorMsg && (
        <div className="p-3 bg-rose-50 border-x border-rose-200 text-rose-700 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{errorMsg}</p>
            <p className="text-rose-600/80 mt-0.5">
              Make sure your GEMINI_API_KEY is configured in <code className="bg-rose-100 px-1 py-0.5 rounded">server/.env</code> and the backend server is running.
            </p>
          </div>
        </div>
      )}

      {/* Quick Prompts Bar */}
      <div className="bg-white border-x border-t border-slate-200/80 px-4 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Try:</span>
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 transition text-[11px]"
          >
            {prompt.length > 40 ? `${prompt.slice(0, 40)}...` : prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-b-2xl p-4 border border-slate-200/80 border-t-0 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask an academic doubt, algorithm explanation, or syllabus question..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm transition flex items-center gap-2 shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Agent</span>
          </button>
        </form>
      </div>
    </div>
  );
}
