import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { Task, TaskCategory } from '../types';
import { Sparkles, Calendar, Clock, ArrowRight, Play, AlertCircle, HelpCircle } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const PriorityMatrix: React.FC = () => {
  const { 
    tasks, 
    updateTask, 
    setSelectedTaskId, 
    startFocusSession, 
    setActiveTab, 
    geminiApiKey,
    addNotification
  } = useStore();

  const [isOptimizing, setIsOptimizing] = useState(false);

  // Group tasks by category
  const urgentImportant = tasks.filter(t => t.category === 'Urgent_Important' && t.status !== 'completed');
  const importantNotUrgent = tasks.filter(t => t.category === 'Important_NotUrgent' && t.status !== 'completed');
  const urgentNotImportant = tasks.filter(t => t.category === 'Urgent_NotImportant' && t.status !== 'completed');
  const neither = tasks.filter(t => t.category === 'Neither' && t.status !== 'completed');

  const handleAIDistribute = async () => {
    setIsOptimizing(true);
    try {
      const classifications = await GeminiService.classifyTasksEisenhower(tasks, geminiApiKey);
      
      // Update each task in store
      Object.entries(classifications).forEach(([id, val]) => {
        updateTask(id, {
          category: val.category,
          aiReasoning: val.reasoning
        });
      });

      addNotification("AI optimized Eisenhower Matrix categorization successfully!");
    } catch (e) {
      console.error(e);
      addNotification("Could not categorize tasks with AI. Check settings API key.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleStartTaskFocus = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    startFocusSession(task.id, 25);
    setActiveTab('focus');
  };

  // Matrix Summary Chart data
  const matrixSummaryData = [
    { name: 'Urgent & Important', value: tasks.filter(t => t.category === 'Urgent_Important').length, color: '#f43f5e' },
    { name: 'Important, Not Urgent', value: tasks.filter(t => t.category === 'Important_NotUrgent').length, color: '#f59e0b' },
    { name: 'Urgent, Not Important', value: tasks.filter(t => t.category === 'Urgent_NotImportant').length, color: '#3b82f6' },
    { name: 'Not Urgent, Not Important', value: tasks.filter(t => t.category === 'Neither').length, color: '#10b981' }
  ];

  // Pick top priority task
  const topTask = urgentImportant[0] || importantNotUrgent[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Priority Matrix</h2>
          <p className="text-slate-400 text-sm mt-0.5">Categorize tasks into the Eisenhower quadrant automatically using AI scheduling flow.</p>
        </div>
        <button
          onClick={handleAIDistribute}
          disabled={isOptimizing}
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-500/10 flex items-center gap-1.5 transition-all border border-violet-400/20 cursor-pointer disabled:opacity-50"
        >
          {isOptimizing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Tasks...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimize with Gemini AI</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left: 2x2 Matrix */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Quadrant 1: Urgent & Important */}
          <GlassCard className="border-rose-500/25 bg-rose-950/5 p-4 flex flex-col h-[320px]">
            <div className="flex items-center justify-between pb-2 border-b border-rose-500/15">
              <div>
                <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  🚨 Urgent & Important
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold block">Do immediately</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-rose-500/15 text-xs text-rose-400 font-bold flex items-center justify-center border border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.2)]">
                {urgentImportant.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto mt-3.5 space-y-2 pr-1 scrollbar-thin">
              {urgentImportant.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-550 italic">
                  All urgent tasks completed!
                </div>
              ) : (
                urgentImportant.map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-900/60 hover:border-slate-800 hover:bg-slate-900/20 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-rose-450 transition-colors truncate">{task.title}</h4>
                      <span className="text-[9px] text-slate-500">{task.estimatedTime} estimate</span>
                    </div>
                    <button 
                      onClick={(e) => handleStartTaskFocus(task, e)}
                      className="p-1 rounded-md bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <Play className="w-3 h-3 fill-slate-400" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          {/* Quadrant 2: Important, Not Urgent */}
          <GlassCard className="border-amber-500/25 bg-amber-950/5 p-4 flex flex-col h-[320px]">
            <div className="flex items-center justify-between pb-2 border-b border-amber-500/15">
              <div>
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  ⭐ Important, Not Urgent
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold block">Schedule blocks</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-amber-500/15 text-xs text-amber-400 font-bold flex items-center justify-center border border-amber-500/30">
                {importantNotUrgent.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto mt-3.5 space-y-2 pr-1 scrollbar-thin">
              {importantNotUrgent.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-550 italic">
                  No active strategic tasks
                </div>
              ) : (
                importantNotUrgent.map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-900/60 hover:border-slate-800 hover:bg-slate-900/20 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-450 transition-colors truncate">{task.title}</h4>
                      <span className="text-[9px] text-slate-500">Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'No Deadline'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          {/* Quadrant 3: Urgent, Not Important */}
          <GlassCard className="border-blue-500/25 bg-blue-950/5 p-4 flex flex-col h-[320px]">
            <div className="flex items-center justify-between pb-2 border-b border-blue-500/15">
              <div>
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  🔵 Urgent, Not Important
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold block">Delegate / Automate</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-blue-500/15 text-xs text-blue-400 font-bold flex items-center justify-center border border-blue-500/30">
                {urgentNotImportant.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto mt-3.5 space-y-2 pr-1 scrollbar-thin">
              {urgentNotImportant.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-550 italic">
                  No pending administrative tasks
                </div>
              ) : (
                urgentNotImportant.map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-900/60 hover:border-slate-800 hover:bg-slate-900/20 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-blue-450 transition-colors truncate">{task.title}</h4>
                      <span className="text-[9px] text-slate-500">Due Today at {task.dueDate ? new Date(task.dueDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'No Deadline'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          {/* Quadrant 4: Neither */}
          <GlassCard className="border-slate-800 bg-slate-900/10 p-4 flex flex-col h-[320px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  🟢 Not Urgent, Not Important
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold block">Limit / Eliminate</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-slate-800 text-xs text-slate-400 font-bold flex items-center justify-center border border-slate-700/60">
                {neither.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto mt-3.5 space-y-2 pr-1 scrollbar-thin">
              {neither.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-550 italic">
                  No distraction tasks! Excellent.
                </div>
              ) : (
                neither.map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-900/60 hover:border-slate-800 hover:bg-slate-900/20 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors truncate">{task.title}</h4>
                      <span className="text-[9px] text-slate-650">No Deadline</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

        </div>

        {/* Right: Insights & Recommendations */}
        <div className="space-y-6">
          {/* Pie Chart of Distribution */}
          <GlassCard className="flex flex-col items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-905 w-full text-center">Matrix Summary</h3>
            
            <div className="h-40 w-full mt-3 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={matrixSummaryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {matrixSummaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center select-none">
                <span className="block text-2xl font-bold text-white">{tasks.length}</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Total Tasks</span>
              </div>
            </div>

            <div className="w-full space-y-2 mt-2">
              {matrixSummaryData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-[10px] font-semibold">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-400 truncate">{d.name}</span>
                  <span className="text-slate-205 ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* AI Recommendation Banner */}
          {topTask && (
            <GlassCard className="p-4 border-violet-500/20 bg-gradient-to-tr from-violet-950/20 to-indigo-950/20">
              <span className="text-[9px] uppercase font-bold text-violet-400 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" /> AI Recommendation
              </span>
              <h4 className="text-sm font-bold text-white mt-2">Start with your top priority</h4>
              <p className="text-xs text-slate-350 mt-1 leading-normal">
                Focus on <strong>{topTask.title}</strong> right now. It has the highest impact ranking in your matrix today.
              </p>
              <button
                onClick={() => {
                  startFocusSession(topTask.id, 25);
                  setActiveTab('focus');
                }}
                className="w-full mt-3 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-violet-500/10 cursor-pointer border border-violet-400/20 text-center"
              >
                Start Now
              </button>
            </GlassCard>
          )}

          {/* Productivity Quote */}
          <GlassCard className="p-4 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Productivity Tip</span>
            <p className="text-xs text-slate-300 italic mt-2">
              "Don't prioritize what's on your schedule, schedule your priorities."
            </p>
            <span className="block text-[10px] text-slate-500 font-semibold mt-1">— Stephen Covey</span>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};
