import React from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from './GlassCard';
import { Play, Sparkles, Clock, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { Task } from '../types';

export const NextBestActionCard: React.FC = () => {
  const { tasks, startFocusSession, setActiveTab, setSelectedTaskId } = useStore();

  // Find the single highest-priority pending task
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  
  // Custom sorting for Next Best Action:
  // 1. Urgent_Important gets precedence
  // 2. High priority gets precedence
  // 3. Impact score descending
  // 4. Due date immediacy
  const sorted = [...pendingTasks].sort((a, b) => {
    const catPriority = {
      Urgent_Important: 4,
      Important_NotUrgent: 3,
      Urgent_NotImportant: 2,
      Neither: 1
    };
    const categoryDiff = catPriority[b.category] - catPriority[a.category];
    if (categoryDiff !== 0) return categoryDiff;

    const prioPriority = { high: 3, medium: 2, low: 1 };
    const prioDiff = prioPriority[b.priority] - prioPriority[a.priority];
    if (prioDiff !== 0) return prioDiff;

    return (b.impactScore || 0) - (a.impactScore || 0);
  });

  const nextTask: Task | undefined = sorted[0];

  if (!nextTask) {
    return (
      <GlassCard className="border-green-500/20 bg-green-950/10 p-6 flex flex-col items-center justify-center text-center">
        <CheckCircle className="w-12 h-12 text-emerald-400 mb-3" />
        <h3 className="text-lg font-semibold text-slate-100">All tasks completed!</h3>
        <p className="text-sm text-slate-400 mt-1 max-w-md">
          You are completely caught up. Take some time to relax, update your habits, or review long-term goals.
        </p>
      </GlassCard>
    );
  }

  // Calculate confidence score dynamically
  const confidenceScore = nextTask.category === 'Urgent_Important' ? 95 : 88;

  const handleStartFocus = () => {
    // Start focus session (default 25 minutes) for this task
    startFocusSession(nextTask.id, 25);
    setActiveTab('focus');
  };

  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case 'high': return 'text-rose-400 bg-rose-500/10 border border-rose-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
      default: return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
    }
  };

  return (
    <GlassCard glow className="relative overflow-hidden border-violet-500/30 p-6">
      {/* Background gradients */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/20 border border-violet-500/30 text-violet-300 flex items-center gap-1.5 uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" /> AI recommendation
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800/60 border border-slate-700/50 text-slate-300">
              Confidence {confidenceScore}%
            </span>
            {nextTask.energyRequired && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getEnergyColor(nextTask.energyRequired)}`}>
                ⚡ Energy: {nextTask.energyRequired}
              </span>
            )}
          </div>

          <h3 
            onClick={() => setSelectedTaskId(nextTask.id)}
            className="text-2xl font-bold text-white hover:text-violet-400 transition-colors cursor-pointer flex items-center gap-2 group"
          >
            {nextTask.title}
            <span className="text-xs font-normal text-slate-500 group-hover:text-violet-400 transition-colors">
              (click to view details)
            </span>
          </h3>
          
          <p className="text-slate-300 mt-2 text-sm leading-relaxed max-w-2xl">
            {nextTask.description}
          </p>

          {nextTask.aiReasoning && (
            <div className="mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-violet-300/90 leading-relaxed italic flex gap-2">
              <Zap className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <span>
                <strong>Coach explanation:</strong> {nextTask.aiReasoning}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 text-slate-400 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              Est. time: <strong className="text-slate-200">{nextTask.estimatedTime}</strong>
            </span>
            {nextTask.impactScore && (
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Impact score: <strong className="text-violet-300">{nextTask.impactScore}/100</strong>
              </span>
            )}
            {nextTask.dueDate && (
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400/80" />
                Deadline: <strong className="text-rose-300">{new Date(nextTask.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong>
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleStartFocus}
          className="w-full md:w-auto px-6 py-4 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0 group border border-violet-400/20"
        >
          <Play className="w-4 h-4 fill-white group-hover:translate-x-0.5 transition-transform" />
          <span>Start Focus Now</span>
        </button>
      </div>
    </GlassCard>
  );
};
