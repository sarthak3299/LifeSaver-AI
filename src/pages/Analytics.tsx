import React from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, AlertTriangle, Sparkles, Clock, Calendar, CheckSquare, ShieldAlert } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { 
    focusSessions, 
    tasks, 
    habits, 
    sleepHoursYesterday,
    scheduleBlocks
  } = useStore();

  // 1. Calculations
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const completionRate = Math.round((completedTasks / tasks.length) * 100) || 78;

  // Calculate deep work total hours
  const totalFocusMins = focusSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const avgFocusScore = Math.round(focusSessions.reduce((acc, curr) => acc + curr.focusScore, 0) / focusSessions.length) || 85;

  // 2. Burnout index calculation
  // Factors: sleep hours (ideal 7-8h), total deep work blocks (ideal < 6h per day), break blocks count (ideal >= 2 per day)
  const deepWorkDuration = scheduleBlocks
    .filter(b => b.type === 'deep_work')
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const breakDuration = scheduleBlocks
    .filter(b => b.type === 'break')
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const calculateBurnoutIndex = () => {
    let score = 20; // baseline

    // sleep penalty
    if (sleepHoursYesterday < 6) score += 30;
    else if (sleepHoursYesterday < 7) score += 15;

    // workload penalty
    if (deepWorkDuration > 300) score += 35; // > 5 hours deep work
    else if (deepWorkDuration > 240) score += 20;

    // lack of breaks penalty
    if (breakDuration < 30) score += 25; // < 30m break
    else if (breakDuration < 60) score += 10;

    return Math.min(100, score);
  };

  const burnoutIndex = calculateBurnoutIndex();

  const getBurnoutLabel = (index: number) => {
    if (index > 75) return { text: 'Critical Fatigue Risk', color: 'text-rose-450 bg-rose-500/10 border-rose-500/20' };
    if (index > 45) return { text: 'Elevated Stress Warning', color: 'text-amber-450 bg-amber-500/10 border-amber-500/20' };
    return { text: 'Optimal Work-Rest Balance', color: 'text-emerald-450 bg-emerald-500/10 border-emerald-500/20' };
  };

  const burnoutStatus = getBurnoutLabel(burnoutIndex);

  // 3. Charts data
  // Daily focus duration data
  const focusTrendData = [
    { name: 'Mon', mins: 90 },
    { name: 'Tue', mins: 120 },
    { name: 'Wed', mins: 150 },
    { name: 'Thu', mins: 110 },
    { name: 'Fri', mins: 180 },
    { name: 'Sat', mins: 210 },
    { name: 'Sun', mins: totalFocusMins || 272 },
  ];

  // Consistency trend index
  const consistencyData = [
    { day: 'Day 1', index: 65 },
    { day: 'Day 5', index: 70 },
    { day: 'Day 10', index: 78 },
    { day: 'Day 15', index: 82 },
    { day: 'Day 20', index: 80 },
    { day: 'Day 25', index: 85 },
    { day: 'Day 30', index: 92 },
  ];

  // Radar categories breakdown
  const categoryBalanceData = [
    { subject: 'Deep Work', A: 90, fullMark: 100 },
    { subject: 'Study', A: 75, fullMark: 100 },
    { subject: 'Exercise', A: 60, fullMark: 100 },
    { subject: 'Reading', A: 50, fullMark: 100 },
    { subject: 'Relaxation', A: 45, fullMark: 100 },
    { subject: 'Admin/Mail', A: 30, fullMark: 100 },
  ];

  const pieChartData = [
    { name: 'Completed', value: completedTasks || 28, color: '#10b981' },
    { name: 'Pending', value: pendingTasks || 8, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Focus Logged</span>
            <h4 className="text-xl font-bold text-white mt-0.5">{Math.floor(totalFocusMins / 60)}h {totalFocusMins % 60}m</h4>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Task Completion Rate</span>
            <h4 className="text-xl font-bold text-white mt-0.5">{completionRate}%</h4>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Average Focus Quality</span>
            <h4 className="text-xl font-bold text-white mt-0.5">{avgFocusScore}%</h4>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Consistency Index</span>
            <h4 className="text-xl font-bold text-white mt-0.5">92/100</h4>
          </div>
        </GlassCard>
      </div>

      {/* Burnout Risk Assessment (Hero widget) */}
      <GlassCard className="p-6 relative overflow-hidden border-rose-500/10 bg-slate-950/20">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex-1 space-y-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> AI Burnout Risk Analysis
            </span>
            <h3 className="text-xl font-extrabold text-white">Work-Rest Balance Indicator</h3>
            <p className="text-slate-350 text-xs leading-relaxed max-w-3xl">
              We monitor sleep indicators, focus durations, and interval gaps. Your current fatigue index calculates to <strong className="text-rose-300">{burnoutIndex}%</strong>. 
              {burnoutIndex > 45 
                ? " You have scheduled a heavy set of deep work blocks with minimal break gaps. Consider adding relaxation schedule nodes to avoid focus depletion."
                : " Your work sessions are spaced optimally. Keep adhering to your current transition buffers."}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center shrink-0">
            <div className={`px-4 py-2 rounded-xl border text-xs font-extrabold ${burnoutStatus.color} shadow-lg`}>
              {burnoutStatus.text}
            </div>
            <span className="text-[10px] text-slate-500 font-semibold mt-2">Fatigue Gauge Score: {burnoutIndex}/100</span>
          </div>
        </div>
      </GlassCard>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily Focus Duration Bar Chart */}
        <GlassCard>
          <div className="pb-3 border-b border-slate-900 mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Focus Duration Trend</h3>
            <span className="text-[10px] text-slate-500">Minutes of deep focus logged daily</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#8b5cf6', fontSize: '11px' }}
                />
                <Bar dataKey="mins" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Consistency Area Chart */}
        <GlassCard>
          <div className="pb-3 border-b border-slate-900 mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Consistency Over Time</h3>
            <span className="text-[10px] text-slate-500">Rolling habit adherence consistency index</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={consistencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={[50, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#10b981', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="index" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCons)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Category Balance Radar Chart */}
        <GlassCard>
          <div className="pb-3 border-b border-slate-900 mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Focus Area Distribution</h3>
            <span className="text-[10px] text-slate-500">Workspace balance across different subjects</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={categoryBalanceData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                <Radar name="Activity Score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Task completion ratios */}
        <GlassCard>
          <div className="pb-3 border-b border-slate-900 mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Task Completion Overview</h3>
            <span className="text-[10px] text-slate-500">Completed vs pending backlog</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center select-none">
              <span className="block text-3xl font-bold text-white">{completionRate}%</span>
              <span className="text-[9px] text-slate-550 font-bold uppercase tracking-wider">Completion Rate</span>
            </div>
          </div>
        </GlassCard>
      </div>

    </div>
  );
};
