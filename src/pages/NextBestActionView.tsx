import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { 
  Zap, 
  Play, 
  HelpCircle, 
  CheckCircle, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  Compass, 
  Activity, 
  ArrowRight,
  ShieldCheck,
  Bot,
  Sparkles,
  Loader2
} from 'lucide-react';

export const NextBestActionView: React.FC = () => {
  const { startFocusSession, setActiveTab, addNotification, tasks, setSelectedTaskId } = useStore();
  const [showExplanation, setShowExplanation] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const heroTask = {
    id: 'task-1',
    title: 'Complete OS Assignment - Section 2',
    description: 'Solve memory fragmentation allocation algorithms.',
    deadlineText: 'Due in 2 days',
    durationText: 'Takes ~45 min',
    goalText: 'Aligns with Goal: Crack Interview',
    impactScore: 97
  };

  const handleStartFocus = () => {
    startFocusSession(heroTask.id, 45);
    setActiveTab('focus');
    addNotification(`Focus session initiated for Next Best Action: "${heroTask.title}"`);
  };

  // AI Agentic Scanning simulation steps
  const scanLogs = [
    { text: '👁️ [BACKLOG AUDIT] Reading 12 active tasks from local state store...', delay: 600 },
    { text: '📊 [COGNITIVE CHECK] Sleep: 7.5 hrs. Water: 4 cups. Peak morning energy detected.', delay: 1200 },
    { text: '🎯 [PRIORITY MATCHING] Eisenhower Matrix: "OS Assignment" has priority score 97/100.', delay: 1800 },
    { text: '🔗 [DEPENDENCY SCAN] Task blocks "Prepare OS Slides for Presentation".', delay: 2400 },
    { text: '🤖 [GEMINI LLM] Optimizing decision path using gemini-2.5-flash...', delay: 3000 },
    { text: '⚡ [LOCKED] Decision finalized: Complete OS Assignment - Section 2 is the highest impact block.', delay: 3600 }
  ];

  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanStep(0);
  };

  useEffect(() => {
    if (!isScanning) return;
    
    const interval = setInterval(() => {
      setScanStep(prev => {
        if (prev >= scanLogs.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isScanning]);

  return (
    <div className="space-y-6 relative">
      
      {/* Page Header */}
      <div className="pb-3 border-b border-slate-900 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Next Best Action</h2>
          <p className="text-xs text-slate-500 mt-1">AI suggests the single best action to move your workload forward right now.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0e1017] px-3.5 py-1.5 border border-slate-900 rounded-xl">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white">Focus Score: 85</span>
        </div>
      </div>

      {/* Top Section: Hero Card + Why this + Impact Previews */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Hero Card */}
        <GlassCard className="p-6 relative flex flex-col justify-between border-violet-500/10 xl:col-span-2">
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 animate-bounce text-violet-400" /> Your Next Best Action is
            </span>

            <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight">
              {heroTask.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-normal max-w-lg">
              This task blocks 3 other items in your roadmap. Completing this now maximizes your daily productivity coefficient.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2 select-none">
              <span className="px-2.5 py-1 rounded bg-rose-500/10 text-[10px] font-bold text-rose-400 border border-rose-500/20 uppercase">High Impact</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-[10px] font-semibold text-slate-350 border border-slate-800">{heroTask.deadlineText}</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-[10px] font-semibold text-slate-350 border border-slate-800">{heroTask.durationText}</span>
              <span className="px-2.5 py-1 rounded bg-violet-500/10 text-[10px] font-bold text-violet-400 border border-violet-500/20">{heroTask.goalText}</span>
            </div>
          </div>

          <div className="flex gap-3 border-t border-slate-900/80 pt-5 mt-6">
            <button 
              onClick={handleStartFocus}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all border border-violet-400/20 cursor-pointer flex items-center gap-1.5 shadow-lg shadow-violet-500/15"
            >
              <Play className="w-4 h-4 text-violet-300 fill-violet-300" />
              <span>Start Now</span>
            </button>
            <button 
              onClick={() => setShowExplanation(!showExplanation)}
              className="px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Why this?</span>
            </button>
          </div>

          {showExplanation && (
            <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-900 text-xs text-slate-400 leading-normal animate-fadeIn">
              <strong>Algorithmic Rationale:</strong> This task has been computed based on: (1) Due date proximity (within 48h), (2) Dependency locking (prevents OS Presentation writing), and (3) Energy levels (you are in your peak morning working window).
            </div>
          )}
        </GlassCard>

        {/* Action Impact Previews */}
        <GlassCard className="p-5 space-y-4 border-violet-500/10 xl:col-span-1">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900">
            Action Impact Preview
          </h3>

          <div className="space-y-3.5">
            {[
              { label: 'Goal Progress', value: 18, color: 'from-violet-500 to-indigo-500', rating: 'High' },
              { label: 'Task Completion', value: 25, color: 'from-emerald-500 to-teal-500', rating: 'High' },
              { label: 'Stress Reduction', value: 15, color: 'from-blue-500 to-cyan-500', rating: 'Medium' },
              { label: 'Future Workload', value: 12, color: 'from-amber-500 to-orange-500', rating: 'High' }
            ].map(m => (
              <div key={m.label} className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">{m.label}</span>
                  <span className="text-slate-205">+{m.value}% ({m.rating})</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className={`bg-gradient-to-r ${m.color} h-full rounded-full`} style={{ width: `${m.value * 3}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>

      {/* Middle Section: Algorithmic parameters grid */}
      <GlassCard className="p-5 border-violet-500/10">
        <div className="pb-3 border-b border-slate-900/80 mb-4">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-violet-400" /> How AI Picked This For You
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { title: 'Prioritization', text: "It's a High priority task from your Eisenhower Priority Matrix." },
            { title: 'Deadline Proximity', text: 'Due in 2 days. Critical threshold warnings are active.' },
            { title: 'Dependencies', text: 'Blocks 3 other tasks in your plan checklist.' },
            { title: 'Time Fit', text: 'Fits in your current 2h 30m focus schedule block.' },
            { title: 'Goal Alignment', text: 'Moves you closer to your Crack Job Interview career goal.' },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1.5">
              <h4 className="text-[10px] font-bold text-violet-400 uppercase tracking-wide">{item.title}</h4>
              <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">{item.text}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Bottom Section: Tasks table + history logs + focus indicators */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left: Important tasks list */}
        <GlassCard className="p-4 border-violet-500/10 xl:col-span-2">
          <div className="pb-3 border-b border-slate-900 mb-3 flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Upcoming Important Tasks</h3>
            <button 
              onClick={() => setActiveTab('tasks')}
              className="text-[10px] text-violet-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.filter(t => t.status !== 'completed').slice(0, 5).map(t => (
              <div 
                key={t.id}
                onClick={() => setSelectedTaskId(t.id)}
                className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl hover:border-slate-800 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-205 group-hover:text-violet-400 transition-colors">{t.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-500 font-semibold uppercase">
                    <span>{t.dueDate ? 'Due Today' : 'No deadline'}</span>
                    <span>•</span>
                    <span>{t.estimatedTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-400">
                    Impact: {t.impactScore || 50}%
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startFocusSession(t.id, 25);
                      setActiveTab('focus');
                    }}
                    className="p-1 rounded bg-violet-600/10 border border-violet-500/20 text-violet-400 hover:bg-violet-600 hover:text-white transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Right side: Action Queue + Energy Check */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Upcoming AI Queue */}
          <GlassCard className="p-4 space-y-3 border-violet-500/10">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900">
              Upcoming Actions (AI Queue)
            </h3>
            
            <div className="space-y-2.5">
              {[
                { title: 'Prepare OS Slides', time: 'Tomorrow 10:30 AM', priority: 'High' },
                { title: 'Read Chapter 5 - CN', time: 'Tomorrow 2:00 PM', priority: 'Medium' },
                { title: 'DSA Practice - Arrays', time: 'Tomorrow 6:00 PM', priority: 'Medium' },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950/40 border border-slate-900 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-300">{item.title}</h5>
                    <span className="text-[9px] text-slate-500">{item.time}</span>
                  </div>
                  <span className={`text-[9px] font-bold uppercase ${item.priority === 'High' ? 'text-rose-400' : 'text-amber-400'}`}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Energy Check */}
          <GlassCard className="p-4 space-y-4 border-violet-500/10">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900">
              Energy & Focus Check
            </h3>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex items-center justify-center border-2 border-emerald-500/20 rounded-full bg-emerald-500/5">
                <span className="text-xs font-extrabold text-emerald-400">80%</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Current Energy: High</span>
                <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                  Great time to do deep work! You have a 2h 30m focused cognitive window.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900">
              <button 
                onClick={handleTriggerScan}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Bot className="w-4 h-4 text-violet-400" />
                <span>See My Energy Pattern</span>
              </button>
            </div>
          </GlassCard>

        </div>

      </div>

      {/* Bottom Quote Banner */}
      <div className="p-4 rounded-2xl border border-violet-500/10 bg-slate-950/40 flex flex-col md:flex-row justify-between items-center gap-3 mt-4">
        <div className="flex items-center gap-2 text-xs text-slate-350">
          <span className="text-sm">💡</span>
          <span><strong>Remember:</strong> Progress comes from consistent small actions. One step at a time, one win at a time!</span>
        </div>
        <button 
          onClick={handleTriggerScan}
          className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold transition-all border border-violet-400/20 cursor-pointer shadow-md shadow-violet-500/10 flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-violet-200" />
          <span>Trust AI & Focus</span>
        </button>
      </div>

      {/* AI Agentic Scanner Overlay Modal */}
      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <GlassCard className="w-full max-w-lg border-violet-500/30 p-6 space-y-6 relative overflow-hidden">
            <div className="absolute -left-12 -top-12 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 pb-3 border-b border-slate-900">
              <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">LifeSaver AI - Agentic Audit Engine</h3>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">Google Gemini 2.5 Flash Stance Analysis</span>
              </div>
            </div>

            {/* Terminal output blocks */}
            <div className="space-y-2.5 font-mono text-[10.5px] bg-slate-950/80 border border-slate-900 p-4 rounded-xl max-h-[300px] overflow-y-auto">
              {scanLogs.slice(0, scanStep + 1).map((log, i) => (
                <div key={i} className="text-slate-300 leading-normal animate-fadeIn">
                  {log.text}
                </div>
              ))}
              {scanStep < scanLogs.length - 1 && (
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="animate-pulse">_</span>
                </div>
              )}
            </div>

            {/* Bottom Actions once scan is finished */}
            <div className="flex gap-3 pt-3 border-t border-slate-900">
              {scanStep === scanLogs.length - 1 ? (
                <>
                  <button
                    onClick={() => {
                      setIsScanning(false);
                      handleStartFocus();
                    }}
                    className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all border border-violet-400/20 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-violet-500/10"
                  >
                    <Play className="w-4 h-4 text-violet-200 fill-violet-200" />
                    <span>Launch Focus Session</span>
                  </button>
                  <button
                    onClick={() => setIsScanning(false)}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    Close Audit
                  </button>
                </>
              ) : (
                <div className="flex-1 text-center py-2 text-[10px] font-semibold text-slate-500 animate-pulse">
                  Evaluating backlog constraints and cognitive coefficients...
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}

    </div>
  );
};
