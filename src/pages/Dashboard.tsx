import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { NextBestActionCard } from '../components/NextBestActionCard';
import { 
  CheckCircle2, 
  Clock, 
  Flame, 
  Activity, 
  TrendingUp, 
  ArrowRight, 
  Play, 
  Bot, 
  ChevronRight, 
  Send,
  Calendar,
  Sparkles,
  Trophy,
  Award,
  Zap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { 
    userSettings, 
    tasks, 
    habits, 
    focusSessions, 
    scheduleBlocks, 
    setActiveTab, 
    setSelectedTaskId,
    startFocusSession,
    aiSuggestions,
    dismissSuggestion,
    notifications,
    addNotification,
    waterIntakeCups,
    incrementWater
  } = useStore();

  const [aiChatInput, setAiChatInput] = useState('');

  // 1. Calculations for stats
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const totalTasksCount = tasks.length;
  
  // Tasks Today: filter dynamically by matching today's date
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTaskIds = new Set(
    scheduleBlocks.filter(b => b.date === todayStr && b.taskId).map(b => b.taskId)
  );
  const todayTasks = tasks.filter(t => {
    const isDueToday = t.dueDate && t.dueDate.split('T')[0] === todayStr;
    const isScheduledToday = todayTaskIds.has(t.id);
    return isDueToday || isScheduledToday;
  });

  const tasksTodayCount = todayTasks.length || 8; // fallback to 8 to keep UI populated
  const completedTodayCount = todayTasks.filter(t => t.status === 'completed').length;

  // Calculate deep work focus hours
  const totalFocusMins = focusSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const focusHours = Math.floor(totalFocusMins / 60);
  const focusMins = totalFocusMins % 60;

  // 2. Charts Data
  const productivityTrendData = [
    { name: 'Mon', score: 72 },
    { name: 'Tue', score: 78 },
    { name: 'Wed', score: 85 },
    { name: 'Thu', score: 82 },
    { name: 'Fri', score: 90 },
    { name: 'Sat', score: 88 },
    { name: 'Sun', score: 92 },
  ];

  const taskCompletionData = [
    { name: 'Completed', value: completedTasksCount, color: '#10b981' },
    { name: 'Pending', value: pendingTasks.length, color: '#8b5cf6' },
    { name: 'Overdue', value: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length || 1, color: '#ef4444' },
  ];

  const timeDistributionData = [
    { name: 'Deep Work', value: 65, color: '#8b5cf6' },
    { name: 'Study', value: 20, color: '#3b82f6' },
    { name: 'Meetings', value: 10, color: '#f59e0b' },
    { name: 'Breaks', value: 5, color: '#10b981' },
  ];

  // 3. Eisenhower Mini Grid list mapping
  const urgentImportantTasks = tasks.filter(t => t.category === 'Urgent_Important' && t.status !== 'completed');
  const importantNotUrgentTasks = tasks.filter(t => t.category === 'Important_NotUrgent' && t.status !== 'completed');
  const urgentNotImportantTasks = tasks.filter(t => t.category === 'Urgent_NotImportant' && t.status !== 'completed');
  const neitherTasks = tasks.filter(t => t.category === 'Neither' && t.status !== 'completed');

  // Handle Quick Chat Submit
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatInput.trim()) return;
    // Set chat message and redirect to assistant tab
    setActiveTab('assistant');
  };

  const handleStartQuickFocus = () => {
    const firstUrgent = urgentImportantTasks[0];
    if (firstUrgent) {
      startFocusSession(firstUrgent.id, 25);
    } else {
      startFocusSession(undefined, 25);
    }
    setActiveTab('focus');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            Good Morning, {userSettings.name}! 👋
          </h2>
          <p className="text-slate-400 text-sm mt-1">Let's make today count. You have some high impact tasks to complete.</p>
        </div>
      </div>

      {/* Hero: Next Best Action Panel */}
      <NextBestActionCard />

      {/* Stats Widgets Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <GlassCard className="p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Tasks Today</span>
            <CheckCircle2 className="w-4 h-4 text-violet-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white leading-tight">{tasksTodayCount}</h3>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
              <span>{completedTodayCount} Completed</span>
              <span>{tasksTodayCount - completedTodayCount} Pending</span>
            </div>
            {/* mini progress */}
            <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-violet-500 h-full" style={{ width: `${(completedTodayCount / tasksTodayCount) * 100}%` }} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Focus Score</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white leading-tight">84%</h3>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-1">Great Focus!</span>
            <div className="h-6 mt-1 flex items-end gap-0.5">
              {[30, 45, 60, 50, 75, 80, 84].map((v, i) => (
                <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm" style={{ height: `${v}%` }} />
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Productivity Rate</span>
            <TrendingUp className="w-4 h-4 text-violet-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white leading-tight">92%</h3>
            <span className="text-[10px] text-violet-300 font-semibold block mt-1">Excellent</span>
            <div className="h-6 mt-1 flex items-end gap-0.5">
              {[40, 50, 45, 65, 70, 85, 92].map((v, i) => (
                <div key={i} className="flex-1 bg-violet-500/20 rounded-t-sm" style={{ height: `${v}%` }} />
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Focus Time</span>
            <Clock className="w-4 h-4 text-blue-450" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white leading-tight">
              {focusHours}h {focusMins}m
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">Deep Work Logged</span>
            <div className="h-6 mt-1 flex items-end gap-0.5">
              {[20, 60, 40, 90, 120, 150, 272].map((v, i) => (
                <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm" style={{ height: `${(v / 272) * 100}%` }} />
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Consistency</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white leading-tight">16 Days</h3>
            <span className="text-[10px] text-orange-400 font-semibold block mt-1">Daily streak active!</span>
            <div className="h-6 mt-1 flex items-end gap-0.5">
              {[50, 60, 70, 65, 80, 90, 100].map((v, i) => (
                <div key={i} className="flex-1 bg-orange-500/20 rounded-t-sm" style={{ height: `${v}%` }} />
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Middle Grid: Schedule + Eisenhower Grid + AI Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Schedule timeline */}
        <GlassCard className="lg:col-span-1 flex flex-col max-h-[480px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-900/80">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-violet-400" /> Today's Schedule
            </h3>
            <button 
              onClick={() => setActiveTab('calendar')}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Calendar</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1 scrollbar-thin">
            {scheduleBlocks.map((block, idx) => (
              <div key={block.id || `dash-block-${block.title}-${idx}`} className="flex gap-4 relative group">
                {/* timeline line */}
                {idx !== scheduleBlocks.length - 1 && (
                  <div className="absolute left-[37px] top-[24px] bottom-[-24px] w-0.5 bg-slate-900" />
                )}
                {/* time stamp */}
                <div className="text-[10px] text-slate-500 font-bold w-12 text-right pt-1 select-none">
                  {block.startTime}
                </div>
                {/* marker dot */}
                <div className="relative mt-1">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#0c0d12] border-2 border-slate-800 flex items-center justify-center relative z-10 group-hover:border-violet-500 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: block.color || '#8b5cf6' }} />
                  </div>
                </div>
                {/* block card */}
                <div className="flex-1 p-3 rounded-xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 transition-all flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{block.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800/80 text-[9px] uppercase font-bold text-slate-400 capitalize">
                        {block.type}
                      </span>
                      <span className="text-[10px] text-slate-500">{block.durationMinutes}m duration</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => {
              setActiveTab('planner');
              addNotification("AI Planner optimization initiated.");
            }}
            className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold bg-violet-600/10 hover:bg-violet-600/25 border border-violet-500/30 text-violet-300 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Optimize My Day with AI</span>
          </button>
        </GlassCard>

        {/* AI Priority Matrix Mini Preview */}
        <GlassCard className="lg:col-span-1 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-900/80">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-violet-400" /> AI Priority Matrix
            </h3>
            <button 
              onClick={() => setActiveTab('matrix')}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-0.5 cursor-pointer"
            >
              <span>View Matrix</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 flex-1">
            {/* Urgent & Important */}
            <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-950/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-1.5 border-b border-rose-500/10">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wide">Do Now</span>
                  <span className="w-4 h-4 rounded-full bg-rose-500/15 border border-rose-500/25 text-[9px] font-bold text-rose-400 flex items-center justify-center">
                    {urgentImportantTasks.length}
                  </span>
                </div>
                <div className="mt-2 space-y-1.5 max-h-24 overflow-y-auto">
                  {urgentImportantTasks.length === 0 ? (
                    <span className="text-[10px] text-slate-500 italic block">No active tasks</span>
                  ) : (
                    urgentImportantTasks.map(t => (
                      <span 
                        key={t.id} 
                        onClick={() => setSelectedTaskId(t.id)}
                        className="block text-[10px] font-medium text-slate-200 hover:text-rose-350 cursor-pointer truncate"
                      >
                        • {t.title}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <button onClick={handleStartQuickFocus} className="text-[9px] font-bold text-rose-400 hover:underline flex items-center gap-0.5 mt-2 justify-end cursor-pointer">
                <span>Start Session</span>
                <ChevronRight className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Important but Not Urgent */}
            <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-950/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-1.5 border-b border-amber-500/10">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">Schedule</span>
                  <span className="w-4 h-4 rounded-full bg-amber-500/15 border border-amber-500/25 text-[9px] font-bold text-amber-400 flex items-center justify-center">
                    {importantNotUrgentTasks.length}
                  </span>
                </div>
                <div className="mt-2 space-y-1.5 max-h-24 overflow-y-auto">
                  {importantNotUrgentTasks.length === 0 ? (
                    <span className="text-[10px] text-slate-500 italic block">No active tasks</span>
                  ) : (
                    importantNotUrgentTasks.map(t => (
                      <span 
                        key={t.id} 
                        onClick={() => setSelectedTaskId(t.id)}
                        className="block text-[10px] font-medium text-slate-200 hover:text-amber-350 cursor-pointer truncate"
                      >
                        • {t.title}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <button onClick={() => setActiveTab('calendar')} className="text-[9px] font-bold text-amber-400 hover:underline flex items-center gap-0.5 mt-2 justify-end cursor-pointer">
                <span>Go schedule</span>
                <ChevronRight className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Urgent but Not Important */}
            <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-950/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-1.5 border-b border-blue-500/10">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">Delegate</span>
                  <span className="w-4 h-4 rounded-full bg-blue-500/15 border border-blue-500/25 text-[9px] font-bold text-blue-400 flex items-center justify-center">
                    {urgentNotImportantTasks.length}
                  </span>
                </div>
                <div className="mt-2 space-y-1.5 max-h-24 overflow-y-auto">
                  {urgentNotImportantTasks.length === 0 ? (
                    <span className="text-[10px] text-slate-500 italic block">No active tasks</span>
                  ) : (
                    urgentNotImportantTasks.map(t => (
                      <span 
                        key={t.id} 
                        onClick={() => setSelectedTaskId(t.id)}
                        className="block text-[10px] font-medium text-slate-200 hover:text-blue-355 cursor-pointer truncate"
                      >
                        • {t.title}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <button onClick={() => setActiveTab('tasks')} className="text-[9px] font-bold text-blue-400 hover:underline flex items-center gap-0.5 mt-2 justify-end cursor-pointer">
                <span>Manage list</span>
                <ChevronRight className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Neither */}
            <div className="p-3 rounded-xl border border-slate-700/40 bg-slate-900/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Eliminate</span>
                  <span className="w-4 h-4 rounded-full bg-slate-850 border border-slate-700/60 text-[9px] font-bold text-slate-400 flex items-center justify-center">
                    {neitherTasks.length}
                  </span>
                </div>
                <div className="mt-2 space-y-1.5 max-h-24 overflow-y-auto">
                  {neitherTasks.length === 0 ? (
                    <span className="text-[10px] text-slate-500 italic block">No active tasks</span>
                  ) : (
                    neitherTasks.map(t => (
                      <span 
                        key={t.id} 
                        onClick={() => setSelectedTaskId(t.id)}
                        className="block text-[10px] font-medium text-slate-400 hover:text-rose-350 cursor-pointer truncate"
                      >
                        • {t.title}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <button onClick={() => setActiveTab('matrix')} className="text-[9px] font-bold text-slate-400 hover:underline flex items-center gap-0.5 mt-2 justify-end cursor-pointer">
                <span>Explain details</span>
                <ChevronRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* AI Assistant Panel */}
        <GlassCard className="lg:col-span-1 flex flex-col justify-between border-violet-500/10">
          {(() => {
            const personality = userSettings.aiPreferences?.coachPersonality || 'analytical';
            const urgentCount = urgentImportantTasks.length;
            
            const getCoachSpeech = () => {
              switch (personality) {
                case 'strict':
                  return {
                    avatar: '😠',
                    title: 'Coach Major (Strict)',
                    status: 'NO EXCUSES ACTIVE',
                    quote: `Good morning, Arjun. You have ${urgentCount} urgent tasks lingering. Procrastination is a form of self-sabotage. Open "OS Assignment" and start a Focus block NOW. No distractions, no excuses.`
                  };
                case 'nurturing':
                  return {
                    avatar: '🌸',
                    title: 'Coach Lily (Nurturing)',
                    status: 'Here to support you',
                    quote: `Hello Arjun! Let's take a deep breath. You have ${urgentCount} important items today. Remember to break them down into small, sweet steps and take a tea break. You've got this, dear.`
                  };
                case 'humorous':
                  return {
                    avatar: '🎭',
                    title: 'Coach Jester (Humorous)',
                    status: 'Injecting dopamine...',
                    quote: `Hey Arjun! Legend has it that doing ${urgentCount} tasks in a row grants you temporary immortality. Or at least, prevents your professors from emailing your parents. Let's conquer "OS Assignment" before Reddit steals your soul!`
                  };
                case 'analytical':
                default:
                  return {
                    avatar: '📊',
                    title: 'Coach ADA (Analytical)',
                    status: 'Data optimization active',
                    quote: `Good morning, Arjun. High energy levels detected. OS Assignment represents 95% of your remaining daily workload impact. Scheduling focus block from 10:00 - 12:00 yields an estimated 92% efficiency rating.`
                  };
              }
            };

            const coach = getCoachSpeech();

            return (
              <>
                <div className="flex items-center pb-3 border-b border-slate-900/80">
                  <span className="text-2xl mr-2.5 select-none animate-bounce">{coach.avatar}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{coach.title}</h3>
                    <span className="text-[9px] text-violet-400 font-bold uppercase tracking-wider">{coach.status}</span>
                  </div>
                </div>

                <div className="my-4 space-y-3 flex-1 flex flex-col justify-center">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 text-xs text-slate-350 leading-relaxed italic relative">
                    <div className="absolute -left-1.5 top-5 w-3 h-3 bg-slate-950/60 border-l border-b border-slate-900 rotate-45" />
                    "{coach.quote}"
                  </div>
                  
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => { setActiveTab('planner'); }} 
                      className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-left text-xs font-semibold text-slate-300 hover:bg-slate-800/60 flex justify-between items-center group cursor-pointer"
                    >
                      <span>Plan my day</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-550 group-hover:text-white transition-colors" />
                    </button>
                    <button 
                      onClick={() => { setActiveTab('analytics'); }} 
                      className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-left text-xs font-semibold text-slate-300 hover:bg-slate-800/60 flex justify-between items-center group cursor-pointer"
                    >
                      <span>Analyze my productivity</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-550 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    placeholder={`Ask ${coach.title.split(' ')[1]} anything...`}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            );
          })()}
        </GlassCard>
      </div>

      {/* Charts Grid: Area chart + Pie chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Productivity trend Area Chart */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-900/80 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Productivity Trend</h3>
              <span className="text-[10px] text-slate-500 font-medium">Weekly consistency score</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/25 text-[10px] font-bold text-violet-300">
              Weekly avg: 84%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={[50, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} 
                  labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#a78bfa', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorProd)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Time distribution Donut chart */}
        <GlassCard className="lg:col-span-1">
          <div className="pb-3 border-b border-slate-900/80 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Time Distribution</h3>
            <span className="text-[10px] text-slate-500 font-medium">Deep work vs overhead ratio</span>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {timeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center select-none">
              <span className="block text-2xl font-bold text-white">6h 45m</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Total today</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-4">
            {timeDistributionData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-slate-400 truncate">{d.name}</span>
                <span className="font-bold text-slate-200 ml-auto">{d.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Bottom Grid: Deadlines + Achievements + Water Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Critical Deadlines */}
        <GlassCard className="lg:col-span-1">
          <div className="pb-3 border-b border-slate-900/80 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Critical Deadlines</h3>
            <span className="text-[10px] text-slate-500 font-medium">Due in the next 24 hours</span>
          </div>

          <div className="space-y-3">
            {tasks.filter(t => t.dueDate && t.status !== 'completed').slice(0, 3).map(t => (
              <div 
                key={t.id} 
                onClick={() => setSelectedTaskId(t.id)}
                className="p-3 rounded-xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-violet-400 transition-colors">{t.title}</h4>
                  <p className="text-[10px] text-rose-400 mt-0.5 font-semibold">
                    Due Today at {new Date(t.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/25 text-[9px] font-bold text-rose-400 uppercase">
                  High Risk
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Achievements Grid */}
        <GlassCard className="lg:col-span-1">
          <div className="pb-3 border-b border-slate-900/80 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Achievements</h3>
            <span className="text-[10px] text-slate-500 font-medium">Unlocked badges and streaks</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-500/15 text-orange-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">16 Streak</h4>
                <p className="text-[9px] text-slate-500">Day Streak</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-violet-500/15 text-violet-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Early Bird</h4>
                <p className="text-[9px] text-slate-500">10 tasks before 9AM</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Focus Master</h4>
                <p className="text-[9px] text-slate-500">6h+ focus hours</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Task Crusher</h4>
                <p className="text-[9px] text-slate-500">100 total completed</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quick Log Widgets (Water and Sleep) */}
        <GlassCard className="lg:col-span-1 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-900/80 mb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Hydration</h3>
            <span className="text-[10px] text-slate-500 font-medium">Log water and hydration logs</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/10 border border-blue-500/15">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-400 block">Hydration Target</span>
              <p className="text-lg font-bold text-slate-100 mt-0.5">{waterIntakeCups} / 8 cups</p>
            </div>
            <button 
              onClick={() => {
                incrementWater();
                addNotification("Logged 1 cup of water hydration.");
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              + Log 1 Cup
            </button>
          </div>

          <div className="flex gap-1.5 mt-3 select-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-6 rounded-md border transition-all ${
                  i < waterIntakeCups 
                    ? 'bg-blue-500/20 border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                    : 'bg-slate-900/60 border-slate-800'
                }`} 
              />
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
