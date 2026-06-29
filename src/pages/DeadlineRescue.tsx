import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { 
  ShieldAlert, 
  RefreshCw, 
  Play, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  HelpCircle,
  Bookmark,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';

interface BehindTask {
  id: string;
  title: string;
  description: string;
  deadline: string;
  delayText: string;
  delayColor: string;
  priority: 'High' | 'Medium' | 'Low';
  suggestion: string;
  actionText: string;
}

export const DeadlineRescue: React.FC = () => {
  const { startFocusSession, setActiveTab, addNotification, tasks } = useStore();
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [recoveryPercent, setRecoveryPercent] = useState(42);
  
  const [behindTasks, setBehindTasks] = useState<BehindTask[]>([
    { 
      id: 'task-1', 
      title: 'OS Assignment', 
      description: 'Submit PDF detailing virtual memory', 
      deadline: '25 May (2 days ago)', 
      delayText: '2 days', 
      delayColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20', 
      priority: 'High', 
      suggestion: 'Focus now for 2 hrs', 
      actionText: 'Start Now' 
    },
    { 
      id: 'task-3', 
      title: 'DBMS Project Report', 
      description: 'Final Submission with diagrams', 
      deadline: '27 May (Today)', 
      delayText: 'Due Today', 
      delayColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20', 
      priority: 'High', 
      suggestion: 'Block 3 hrs deep work', 
      actionText: 'Start Now' 
    },
    { 
      id: 'task-4', 
      title: 'Aptitude Practice', 
      description: 'Solve 50 logic questions', 
      deadline: '28 May (Tomorrow)', 
      delayText: '1 day left', 
      delayColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20', 
      priority: 'Medium', 
      suggestion: 'Schedule in evening', 
      actionText: 'Schedule' 
    }
  ]);

  const handleRecalculate = () => {
    setIsRecalculating(true);
    addNotification("AI recalculating rescue plan...");
    setTimeout(() => {
      setIsRecalculating(false);
      setRecoveryPercent(58);
      addNotification("Rescue plan recalculated! Recovery probability increased to 74%.");
    }, 1500);
  };

  const handleStartTask = (taskId: string, title: string) => {
    startFocusSession(taskId, 25);
    setActiveTab('focus');
    addNotification(`Rescue session initiated for "${title}"`);
  };

  const handleResolveTask = (taskId: string) => {
    setBehindTasks(prev => prev.filter(t => t.id !== taskId));
    setRecoveryPercent(prev => Math.min(100, prev + 15));
    addNotification("Task marked resolved! Rescue index updated.");
  };

  return (
    <div className="space-y-6">
      
      {/* Header View info */}
      <div className="pb-3 border-b border-slate-900 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-6 h-6 text-rose-500 animate-pulse" />
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Deadline Rescue Mode</h2>
            <p className="text-xs text-slate-500 mt-1">Behind schedule? AI structures an emergency rescue plan to recover.</p>
          </div>
        </div>
      </div>

      {/* Behind schedule Alert Banner */}
      <div className="p-4 rounded-2xl border border-rose-500/20 bg-gradient-to-r from-rose-950/20 via-slate-900/40 to-slate-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-rose-950/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-tight">You are behind schedule!</h4>
            <p className="text-xs text-slate-400 mt-0.5">Don't worry, our AI rescue coordinator is active. Let's get you back on track.</p>
          </div>
        </div>
        <button 
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-violet-400 ${isRecalculating ? 'animate-spin' : ''}`} />
          <span>{isRecalculating ? 'Recalculating...' : 'Recalculate Plan'}</span>
        </button>
      </div>

      {/* Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Rescue overview */}
        <GlassCard className="p-5 space-y-4 border-rose-500/10">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900">
            Rescue Overview
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase block">Tasks Behind</span>
              <p className="text-xl font-bold text-rose-400">{behindTasks.length}</p>
            </div>
            <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase block">Delay Time</span>
              <p className="text-xl font-bold text-white">8.5 hrs</p>
            </div>
            <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase block">Risk Level</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-[10px] font-bold text-rose-400 border border-rose-500/20 uppercase inline-block">High</span>
            </div>
            <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase block">Recovery Chance</span>
              <p className="text-xl font-bold text-emerald-400">67%</p>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-3 space-y-2">
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Time to Recovery</span>
            <div className="p-4 bg-gradient-to-br from-violet-950/20 to-indigo-950/20 border border-violet-500/15 rounded-xl text-center">
              <span className="block text-2xl font-extrabold text-white tracking-tight font-mono">2d 14h 30m</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase block mt-1">Est. Focus time remaining</span>
            </div>
          </div>
        </GlassCard>

        {/* Center Card: AI Action Plan */}
        <GlassCard className="p-5 flex flex-col justify-between border-violet-500/10">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-violet-400" /> AI Action Plan
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Follow this step-by-step rescue plan to stabilize your workload and catch up on deadlines.
            </p>

            <div className="space-y-2.5">
              {[
                { step: '1', title: 'Focus on critical tasks', badge: 'High Impact', color: 'text-rose-400' },
                { step: '2', title: 'Reschedule & reorganize', badge: 'Time Saved: 2.5 hrs', color: 'text-violet-400' },
                { step: '3', title: 'Eliminate low-value tasks', badge: '3 Tasks Moved', color: 'text-amber-400' },
                { step: '4', title: 'Deep work blocks', badge: '2 Focus Sessions', color: 'text-blue-400' },
                { step: '5', title: 'Daily checkpoints', badge: 'Daily Review', color: 'text-emerald-400' },
              ].map(s => (
                <div key={s.step} className="p-2.5 bg-slate-950/40 border border-slate-900 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center">
                      {s.step}
                    </div>
                    <span className="font-semibold text-slate-205">{s.title}</span>
                  </div>
                  <span className={`text-[9px] font-bold uppercase ${s.color}`}>{s.badge}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 border-t border-slate-900 pt-4 mt-4">
            <button 
              onClick={() => {
                if (behindTasks.length > 0) {
                  handleStartTask(behindTasks[0].id, behindTasks[0].title);
                } else {
                  handleStartTask('', 'General Rescue');
                }
              }}
              className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all border border-violet-400/20 cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-violet-500/10"
            >
              <Play className="w-4 h-4 text-violet-300 fill-violet-300" />
              <span>Start Rescue Plan</span>
            </button>
            <button 
              onClick={() => addNotification("Rescue schedule saved.")}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Save Plan
            </button>
          </div>
        </GlassCard>

        {/* Right Card: Stake & Tips */}
        <GlassCard className="p-5 flex flex-col justify-between border-violet-500/10">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900">
              What's at Stake?
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">2 Deadlines</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-[9px] font-bold text-rose-400 border border-rose-500/20 uppercase">High Risk</span>
              </div>
              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">15 Tasks Affected</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-[9px] font-bold text-amber-400 border border-amber-500/20 uppercase">Medium Risk</span>
              </div>
              <div className="p-3 bg-rose-950/5 border border-rose-500/10 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Productivity Score</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-[9px] font-bold text-rose-450 uppercase">May Drop</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-900">
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Tips to Catch Up Faster</span>
              <ul className="space-y-2 text-[10px] text-slate-400 leading-normal">
                <li className="flex gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Focus on exactly ONE task at a time.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Use Focus Mode for deep work sprints.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Reschedule low-priority buffer blocks.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-900 text-[10px] text-slate-500 leading-relaxed italic text-center mt-4 select-none">
            "It's not about having time, it's about making time. - Unknown"
          </div>
        </GlassCard>

      </div>

      {/* Bottom Row: Behind Schedule Table */}
      <GlassCard className="p-5 border-rose-500/10">
        <div className="flex justify-between items-center pb-3 border-b border-slate-900/80 mb-4">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-400" /> Behind Schedule Tasks
            <span className="ml-1 w-4 h-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-[9px] font-bold text-rose-400 flex items-center justify-center">
              {behindTasks.length}
            </span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase text-[9px] select-none">
                <th className="py-2.5 px-3">Task Details</th>
                <th className="py-2.5 px-3">Deadline</th>
                <th className="py-2.5 px-3">Delay Status</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">AI Recommendation</th>
                <th className="py-2.5 px-3 text-right">Emergency Action</th>
              </tr>
            </thead>
            <tbody>
              {behindTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                    Great job! All behind-schedule tasks have been recovered.
                  </td>
                </tr>
              ) : (
                behindTasks.map((task) => (
                  <tr key={task.id} className="border-b border-slate-900/60 hover:bg-slate-950/30 transition-colors">
                    <td className="py-3.5 px-3">
                      <h4 className="font-bold text-slate-100">{task.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{task.description}</p>
                    </td>
                    <td className="py-3.5 px-3 text-slate-350">{task.deadline}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${task.delayColor}`}>
                        {task.delayText}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`font-bold ${task.priority === 'High' ? 'text-rose-400' : 'text-amber-400'}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-violet-300 font-semibold">{task.suggestion}</td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleStartTask(task.id, task.title)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-md shadow-rose-500/5"
                        >
                          <Play className="w-2.5 h-2.5 text-rose-200 fill-rose-200" /> Start Focus
                        </button>
                        <button
                          onClick={() => handleResolveTask(task.id)}
                          className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-450 hover:text-white rounded-lg text-[10px] font-semibold transition-all border border-slate-800 cursor-pointer"
                        >
                          Resolve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Recovery progress slider */}
        <div className="mt-6 pt-4 border-t border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-4.5 h-4.5 text-emerald-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Overall recovery progress</span>
              <p className="text-xs font-bold text-slate-205">{recoveryPercent}% Recovered</p>
            </div>
          </div>
          
          <div className="flex-1 max-w-lg bg-slate-900 h-2.5 rounded-full overflow-hidden relative">
            <div 
              className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${recoveryPercent}%` }}
            />
          </div>
        </div>
      </GlassCard>

    </div>
  );
};
