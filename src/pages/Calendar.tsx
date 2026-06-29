import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { ScheduleBlock } from '../types';
import { 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  AlertCircle, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const Calendar: React.FC = () => {
  const { 
    scheduleBlocks, 
    addScheduleBlock, 
    deleteScheduleBlock, 
    userSettings, 
    addNotification,
    tasks
  } = useStore();

  const [activeView, setActiveView] = useState<'day' | 'week' | 'month' | 'agenda'>('week');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Add Block Form States
  const [blockTitle, setBlockTitle] = useState('');
  const [blockType, setBlockType] = useState<ScheduleBlock['type']>('study');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [blockTaskId, setBlockTaskId] = useState('');
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>('Tue');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
  const hoursList = Array.from({ length: 17 }).map((_, idx) => {
    const hr = idx + 6; // 6 AM to 10 PM
    const isPm = hr >= 12;
    const dispHr = hr > 12 ? hr - 12 : hr;
    const displayHour = `${dispHr}:00 ${isPm ? 'PM' : 'AM'}`;
    const valueHour = `${String(hr).padStart(2, '0')}:00`;
    return { displayHour, valueHour, hr };
  });

  // Color mapping based on block type
  const typeColors: Record<ScheduleBlock['type'], string> = {
    deep_work: '#8b5cf6', // purple
    study: '#3b82f6',     // blue
    break: '#f59e0b',     // orange / break
    workout: '#10b981',   // green / physical
    buffer: '#ec4899',    // pink
    routine: '#6366f1'    // routine indigo
  };

  // Mock initial template schedule for the week to look exactly like the screenshot
  const initialWeeklyTemplate: Record<string, Omit<ScheduleBlock, 'id' | 'date'>[]> = {
    Mon: [
      { title: 'Morning Routine', type: 'routine', startTime: '06:00', endTime: '07:00', durationMinutes: 60, color: '#10b981' },
      { title: 'Deep Work', type: 'deep_work', startTime: '08:00', endTime: '10:00', durationMinutes: 120, color: '#8b5cf6' },
      { title: 'College Classes', type: 'study', startTime: '10:30', endTime: '12:30', durationMinutes: 120, color: '#3b82f6' },
      { title: 'Lunch Break', type: 'break', startTime: '12:30', endTime: '13:30', durationMinutes: 60, color: '#f59e0b' },
      { title: 'Aptitude Practice', type: 'study', startTime: '13:30', endTime: '15:00', durationMinutes: 90, color: '#8b5cf6' },
      { title: 'Project Work', type: 'deep_work', startTime: '15:30', endTime: '17:00', durationMinutes: 90, color: '#8b5cf6' },
      { title: 'Workout', type: 'workout', startTime: '18:00', endTime: '19:00', durationMinutes: 60, color: '#10b981' },
      { title: 'Reading', type: 'study', startTime: '20:00', endTime: '21:00', durationMinutes: 60, color: '#3b82f6' }
    ],
    Tue: [
      { title: 'Morning Routine', type: 'routine', startTime: '06:00', endTime: '07:00', durationMinutes: 60, color: '#10b981' },
      { title: 'OS Assignment Deep Work', type: 'deep_work', startTime: '08:00', endTime: '10:00', durationMinutes: 120, color: '#8b5cf6' },
      { title: 'Interview Prep', type: 'study', startTime: '10:30', endTime: '12:30', durationMinutes: 120, color: '#3b82f6' },
      { title: 'Lunch Break', type: 'break', startTime: '12:30', endTime: '13:30', durationMinutes: 60, color: '#f59e0b' },
      { title: 'DSA Practice', type: 'deep_work', startTime: '13:30', endTime: '15:00', durationMinutes: 90, color: '#8b5cf6' },
      { title: 'System Design', type: 'study', startTime: '16:00', endTime: '17:30', durationMinutes: 90, color: '#8b5cf6' },
      { title: 'Reflection & Plan', type: 'routine', startTime: '20:00', endTime: '21:00', durationMinutes: 60, color: '#3b82f6' }
    ],
    Wed: [
      { title: 'Morning Routine', type: 'routine', startTime: '06:00', endTime: '07:00', durationMinutes: 60, color: '#10b981' },
      { title: 'Deep Work', type: 'deep_work', startTime: '08:00', endTime: '10:00', durationMinutes: 120, color: '#8b5cf6' },
      { title: 'College Classes', type: 'study', startTime: '10:30', endTime: '12:30', durationMinutes: 120, color: '#3b82f6' },
      { title: 'Lunch Break', type: 'break', startTime: '12:30', endTime: '13:30', durationMinutes: 60, color: '#f59e0b' },
      { title: 'Team Meeting', type: 'routine', startTime: '13:30', endTime: '15:00', durationMinutes: 90, color: '#ec4899' },
      { title: 'Project Work', type: 'deep_work', startTime: '15:30', endTime: '17:00', durationMinutes: 90, color: '#8b5cf6' },
      { title: 'Walk / Break', type: 'break', startTime: '18:00', endTime: '18:30', durationMinutes: 30, color: '#10b981' },
      { title: 'Book Reading', type: 'study', startTime: '20:00', endTime: '21:00', durationMinutes: 60, color: '#3b82f6' }
    ],
    Thu: [
      { title: 'Morning Routine', type: 'routine', startTime: '06:00', endTime: '07:00', durationMinutes: 60, color: '#10b981' },
      { title: 'Deep Work', type: 'deep_work', startTime: '08:00', endTime: '10:30', durationMinutes: 150, color: '#8b5cf6' },
      { title: 'Aptitude Test', type: 'study', startTime: '11:00', endTime: '12:00', durationMinutes: 60, color: '#3b82f6' },
      { title: 'Lunch Break', type: 'break', startTime: '12:00', endTime: '13:00', durationMinutes: 60, color: '#f59e0b' },
      { title: 'DSA Practice', type: 'deep_work', startTime: '13:30', endTime: '15:00', durationMinutes: 90, color: '#8b5cf6' },
      { title: 'Open Source Work', type: 'study', startTime: '15:30', endTime: '18:00', durationMinutes: 150, color: '#8b5cf6' },
      { title: 'Meditation', type: 'routine', startTime: '18:30', endTime: '19:00', durationMinutes: 30, color: '#10b981' },
      { title: 'Plan Tomorrow', type: 'routine', startTime: '20:00', endTime: '21:00', durationMinutes: 60, color: '#3b82f6' }
    ],
    Fri: [
      { title: 'Morning Routine', type: 'routine', startTime: '06:00', endTime: '07:00', durationMinutes: 60, color: '#10b981' },
      { title: 'Deep Work', type: 'deep_work', startTime: '08:00', endTime: '10:00', durationMinutes: 120, color: '#8b5cf6' },
      { title: 'College Classes', type: 'study', startTime: '10:30', endTime: '12:30', durationMinutes: 120, color: '#3b82f6' },
      { title: 'Lunch Break', type: 'break', startTime: '12:30', endTime: '13:30', durationMinutes: 60, color: '#f59e0b' },
      { title: 'Resume Update', type: 'routine', startTime: '13:30', endTime: '15:00', durationMinutes: 90, color: '#8b5cf6' },
      { title: 'Mentor Call', type: 'routine', startTime: '16:00', endTime: '17:30', durationMinutes: 90, color: '#ec4899' },
      { title: 'Workout', type: 'workout', startTime: '18:00', endTime: '19:00', durationMinutes: 60, color: '#10b981' },
      { title: 'Movie / Relax', type: 'break', startTime: '20:00', endTime: '21:30', durationMinutes: 90, color: '#3b82f6' }
    ],
    Sat: [
      { title: 'Weekly Review', type: 'study', startTime: '08:00', endTime: '09:30', durationMinutes: 90, color: '#10b981' },
      { title: 'Deep Work', type: 'deep_work', startTime: '10:00', endTime: '12:00', durationMinutes: 120, color: '#8b5cf6' },
      { title: 'Lunch Break', type: 'break', startTime: '12:30', endTime: '13:30', durationMinutes: 60, color: '#f59e0b' },
      { title: 'Personal Projects', type: 'deep_work', startTime: '14:00', endTime: '17:00', durationMinutes: 180, color: '#8b5cf6' },
      { title: 'Family Time', type: 'routine', startTime: '18:00', endTime: '20:00', durationMinutes: 120, color: '#10b981' }
    ],
    Sun: [
      { title: 'Plan Next Week', type: 'routine', startTime: '08:00', endTime: '09:00', durationMinutes: 60, color: '#10b981' },
      { title: 'Skill Learning', type: 'study', startTime: '09:30', endTime: '11:30', durationMinutes: 120, color: '#8b5cf6' },
      { title: 'Lunch Break', type: 'break', startTime: '12:00', endTime: '13:00', durationMinutes: 60, color: '#f59e0b' },
      { title: 'Break / Hobby', type: 'break', startTime: '14:00', endTime: '16:00', durationMinutes: 120, color: '#10b981' },
      { title: 'Digital Detox', type: 'routine', startTime: '20:00', endTime: '21:00', durationMinutes: 60, color: '#3b82f6' }
    ]
  };

  const handleAddBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockTitle.trim()) return;

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);

    if (durationMinutes <= 0) {
      alert("End time must be after start time!");
      return;
    }

    addScheduleBlock({
      title: blockTitle.trim(),
      type: blockType,
      startTime,
      endTime,
      durationMinutes,
      date: new Date().toISOString().split('T')[0],
      color: typeColors[blockType],
      taskId: blockTaskId || undefined
    });

    setBlockTitle('');
    setBlockType('study');
    setStartTime('10:00');
    setEndTime('11:00');
    setBlockTaskId('');
    setShowAddForm(false);
    
    addNotification(`Added "${blockTitle}" block on ${selectedDay}.`);
  };

  const handleAIScheduleNow = () => {
    addScheduleBlock({
      title: 'Deep Work: OS Virtual Memory',
      type: 'deep_work',
      startTime: '17:00',
      endTime: '18:00',
      durationMinutes: 60,
      date: new Date().toISOString().split('T')[0],
      color: '#8b5cf6'
    });
    addNotification("AI scheduled a Deep Work block in your free Thursday slot!");
  };

  // Recharts donut calculations
  const donutColors = ['#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];
  const donutData = [
    { name: 'Deep Work', value: 38, color: '#8b5cf6' },
    { name: 'Study', value: 29, color: '#3b82f6' },
    { name: 'Meetings', value: 12, color: '#ec4899' },
    { name: 'Breaks', value: 10, color: '#f59e0b' },
    { name: 'Personal', value: 11, color: '#10b981' }
  ];

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);

  // Timeline navigation banner
  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncStep(0);
  };

  useEffect(() => {
    if (!isSyncing) return;
    const interval = setInterval(() => {
      setSyncStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  }, [isSyncing]);

  return (
    <div className="space-y-6">
      
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-900">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Calendar & Time Blocking</h2>
          <p className="text-xs text-slate-500 mt-1">Plan your time. Block distractions. Get more done.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Day/Week/Month selector */}
          <div className="flex bg-[#0e1017] border border-slate-900 rounded-xl p-1 text-[10px] font-bold text-slate-400">
            {['day', 'week', 'month', 'agenda'].map(view => (
              <button
                key={view}
                onClick={() => setActiveView(view as any)}
                className={`px-3 py-1.5 rounded-lg transition-colors capitalize cursor-pointer ${activeView === view ? 'bg-violet-600 text-white' : 'hover:text-white'}`}
              >
                {view}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all border border-violet-400/20 cursor-pointer flex items-center gap-1 shadow-md shadow-violet-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Column: 7 Day Weekly Grid View */}
        <div className="xl:col-span-3 space-y-4">
          
          {/* Timeline navigation banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#0e1017] p-3.5 border border-slate-900 rounded-2xl gap-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">May 27 - June 2, 2025</span>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={handleTriggerSync}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-350 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-violet-400 ${isSyncing && syncStep < 4 ? 'animate-spin' : ''}`} />
                <span>Sync Calendar</span>
              </button>

              <button 
                onClick={() => addNotification("Filter presets toggled.")}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
              >
                Filter
              </button>

              <div className="h-5 w-px bg-slate-900 mx-1 hidden sm:block" />

              <button className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer text-[10px] font-bold">
                Today
              </button>
              <button className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Google Sync Overlay modal */}
          {isSyncing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
              <GlassCard className="w-full max-w-sm border-violet-500/30 p-6 space-y-4">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-900">
                  <Bot className="w-5 h-5 text-violet-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Google Calendar Sync</h4>
                    <span className="text-[9px] text-slate-500 font-semibold uppercase block">OAuth Workspace Integration</span>
                  </div>
                </div>

                <div className="space-y-2 text-[10px] font-mono bg-slate-950/80 p-4 border border-slate-900 rounded-xl">
                  {syncStep >= 0 && <div className="text-slate-350">⏳ Checking active OAuth tokens...</div>}
                  {syncStep >= 1 && <div className="text-slate-350">✓ Authenticated: arjun.sharma@gmail.com</div>}
                  {syncStep >= 2 && <div className="text-slate-350">📡 Downloading calendar feed events...</div>}
                  {syncStep >= 3 && <div className="text-slate-350">🎯 Synced: 7 blocks aligned with timetable.</div>}
                  {syncStep >= 4 && <div className="text-emerald-400 font-bold">✓ Sync process completed successfully!</div>}
                </div>

                <div className="flex justify-end pt-2">
                  {syncStep === 4 ? (
                    <button
                      onClick={() => {
                        setIsSyncing(false);
                        addNotification("Google Calendar synced successfully!");
                      }}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-all border border-violet-400/20 cursor-pointer"
                    >
                      Awesome
                    </button>
                  ) : (
                    <span className="text-[9px] font-bold text-slate-500 animate-pulse">Syncing Google Event payloads...</span>
                  )}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Timeblocking weekly agenda table grid */}
          <div className="border border-slate-900 bg-slate-950/20 rounded-2xl overflow-hidden shadow-inner">
            <div className="grid grid-cols-8 border-b border-slate-900 text-center py-3 bg-[#0a0b0e]/80 select-none">
              {/* Hour corner */}
              <div className="text-[9px] uppercase font-bold text-slate-500 text-right pr-4 pt-1 w-14">Time</div>
              {daysOfWeek.map((day, idx) => (
                <div key={day} className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400">{day}</span>
                  <span className={`text-xs font-extrabold mt-0.5 rounded-full w-5 h-5 flex items-center justify-center ${day === 'Tue' ? 'bg-violet-600 text-white' : 'text-slate-500'}`}>
                    {27 + idx}
                  </span>
                </div>
              ))}
            </div>

            {/* Grid Rows */}
            <div className="h-[600px] overflow-y-auto pr-1">
              {hoursList.map(({ displayHour, valueHour, hr }) => (
                <div key={valueHour} className="grid grid-cols-8 border-b border-slate-900/30 min-h-[50px] relative">
                  {/* Time labels column */}
                  <div className="text-[9px] text-slate-500 font-bold pr-4 text-right select-none pt-2.5 border-r border-slate-900/50 w-14 bg-[#0a0b0e]/10">
                    {displayHour}
                  </div>

                  {/* Days columns */}
                  {daysOfWeek.map((day) => {
                    // Find blocks that fall inside this day and start hour range
                    const dayBlocks = initialWeeklyTemplate[day] || [];
                    const block = dayBlocks.find(b => b.startTime === valueHour);

                    return (
                      <div 
                        key={day} 
                        className="border-r border-slate-900/20 p-1 relative flex flex-col justify-center min-h-[50px] group"
                      >
                        {block && (
                          <div 
                            className="absolute inset-1 p-2 rounded-lg border flex flex-col justify-between shadow-sm overflow-hidden select-none transition-all group-hover:scale-[1.02] z-10"
                            style={{ 
                              borderColor: `${block.color}25`, 
                              backgroundColor: `${block.color}0d`
                            }}
                            title={`${block.title} (${block.startTime} - ${block.endTime})`}
                          >
                            {/* Left accent indicator bar */}
                            <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: block.color }} />
                            
                            <h4 className="text-[9px] font-extrabold text-slate-205 leading-tight truncate pl-1">{block.title}</h4>
                            <span className="text-[8px] text-slate-500 block pl-1 truncate mt-0.5">
                              {block.startTime} - {block.endTime}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns: Sidecards panel */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Mini Calendar Widget */}
          <GlassCard className="p-4 space-y-4 border-violet-500/10">
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <span className="text-[10px] uppercase font-bold text-slate-400">May 2025</span>
              <div className="flex gap-1.5">
                <ChevronLeft className="w-3.5 h-3.5 text-slate-500 cursor-pointer" />
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 cursor-pointer" />
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-[9px] select-none">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={i} className="text-slate-500 font-bold">{d}</span>
              ))}
              {Array.from({ length: 31 }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = dayNum === 28;
                return (
                  <span 
                    key={i} 
                    className={`h-5 w-5 flex items-center justify-center rounded-full font-semibold cursor-pointer ${
                      isSelected 
                        ? 'bg-violet-600 text-white font-bold' 
                        : 'text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    {dayNum}
                  </span>
                );
              })}
            </div>
          </GlassCard>

          {/* Today's Agenda list */}
          <GlassCard className="p-4 space-y-4 border-violet-500/10">
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Today's Agenda</h3>
              <span className="text-[10px] text-slate-500 font-semibold cursor-pointer hover:underline">View All</span>
            </div>

            <div className="space-y-3">
              {[
                { time: '2:00 PM', title: 'Resume Update', duration: '1h 00m', color: 'bg-violet-500' },
                { time: '3:30 PM', title: 'Mentor Call', duration: '1h 00m', color: 'bg-emerald-500' },
                { time: '6:00 PM', title: 'Workout', duration: '1h 00m', color: 'bg-amber-500' },
                { time: '8:00 PM', title: 'Movie / Relax', duration: '1h 30m', color: 'bg-blue-500' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl flex items-center gap-3">
                  <div className={`w-1.5 h-7 rounded-full shrink-0 ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-205 truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[9px] text-slate-500">
                      <span>{item.time}</span>
                      <span>•</span>
                      <span>{item.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Time Insights Donut */}
          <GlassCard className="p-4 space-y-4 border-violet-500/10">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900">
              Time Insights
            </h3>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '11px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center select-none pointer-events-none">
                <span className="block text-xl font-bold text-white">23h 45m</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Total Planned</span>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              {donutData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-[10px]">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-400 truncate flex-1">{d.name}</span>
                  <span className="font-bold text-slate-200">{d.value}%</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* AI Suggestion box */}
          <GlassCard className="p-4 bg-gradient-to-tr from-violet-950/20 to-indigo-950/20 border-violet-500/20">
            <span className="text-[9px] uppercase font-bold text-violet-400 tracking-wider flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-violet-400" /> AI suggestion
            </span>
            <p className="text-[11px] text-slate-400 leading-normal mt-2">
              You have a free slot on **Thursday 5:00 PM - 6:00 PM**. Want to schedule Deep Work for OS Exam?
            </p>
            
            <div className="flex gap-2.5 mt-3.5">
              <button 
                onClick={handleAIScheduleNow}
                className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-all border border-violet-400/20 cursor-pointer shadow-md shadow-violet-500/5 text-center"
              >
                Schedule Now
              </button>
              <button 
                onClick={() => addNotification("AI scheduling recommendation deferred.")}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Later
              </button>
            </div>
          </GlassCard>

        </div>

      </div>

      {/* Add Block Modal dialog */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
          <GlassCard className="relative z-10 w-full max-w-sm border-violet-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Create Weekly Block</h3>
            </div>

            <form onSubmit={handleAddBlockSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Block Title</label>
                <input 
                  type="text" 
                  value={blockTitle} 
                  onChange={(e) => setBlockTitle(e.target.value)} 
                  placeholder="e.g. Revision Chapter 3"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Day</label>
                  <select 
                    value={selectedDay} 
                    onChange={(e) => setSelectedDay(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    {daysOfWeek.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Activity Type</label>
                  <select 
                    value={blockType} 
                    onChange={(e) => setBlockType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="deep_work">Deep Work Block (Focus)</option>
                    <option value="study">Study Session (Learning)</option>
                    <option value="break">Relaxation / Meal Block (Break)</option>
                    <option value="workout">Gym / Exercise Session (Workout)</option>
                    <option value="buffer">Transition Cushion (Buffer)</option>
                    <option value="routine">Habit Routine (Routine)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Time</label>
                  <input 
                    type="time" 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">End Time</label>
                  <input 
                    type="time" 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Link to Task (Optional)</label>
                <select 
                  value={blockTaskId} 
                  onChange={(e) => setBlockTaskId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="">No linked task</option>
                  {tasks.filter(t => t.status !== 'completed').map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex gap-3 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all border border-violet-400/20"
                >
                  Add Block
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

    </div>
  );
};
