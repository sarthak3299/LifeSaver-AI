import React from 'react';
import { useStore } from '../store/useStore';
import { 
  LayoutDashboard, 
  ListChecks, 
  BrainCircuit, 
  Grid2X2, 
  CalendarRange, 
  Target, 
  Timer, 
  BarChart3, 
  Bot, 
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  Flame,
  User,
  Clock,
  Sparkles,
  Mic,
  Workflow,
  ShieldAlert,
  Compass
} from 'lucide-react';
import { SmartReminder } from './SmartReminder';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { activeTab, setActiveTab, userSettings, currentFocusSession, tasks } = useStore();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: ListChecks },
    { id: 'planner', label: 'AI Planner', icon: BrainCircuit },
    { id: 'matrix', label: 'Priority Matrix', icon: Grid2X2 },
    { id: 'calendar', label: 'Calendar', icon: CalendarRange },
    { id: 'goals_habits', label: 'Goals & Habits', icon: Target },
    { id: 'focus', label: 'Focus Mode', icon: Timer },
    { id: 'voice_capture', label: 'Voice Task Capture', icon: Mic },
    { id: 'task_breakdown', label: 'AI Task Breakdown', icon: Workflow },
    { id: 'deadline_rescue', label: 'Deadline Rescue Mode', icon: ShieldAlert },
    { id: 'next_best_action', label: 'Next Best Action', icon: Compass },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Get active focus task if any
  const focusTask = currentFocusSession?.taskId 
    ? tasks.find(t => t.id === currentFocusSession.taskId)
    : null;

  // Format time remaining for focus session
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const activeFocusPercentage = currentFocusSession
    ? ((currentFocusSession.durationMinutes * 60 - currentFocusSession.timeRemaining) / (currentFocusSession.durationMinutes * 60)) * 100
    : 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08090c]">
      {/* Background blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Mobile Menu trigger */}
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed lg:relative inset-y-0 left-0 z-30
          flex flex-col h-full
          transition-all duration-300 ease-in-out
          border-r border-slate-900 bg-[#0c0d12]/95 lg:bg-[#0c0d12]/60 backdrop-blur-xl
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          z-40
        `}
      >
        {/* Sidebar Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-900/80">
          <div className="flex items-center gap-3 overflow-hidden select-none">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-md shadow-violet-500/20 text-white shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-tight font-display">LifeSaver AI</span>
                <span className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Productivity OS</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-900/50 transition-all cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold
                  transition-all duration-200 cursor-pointer group relative
                  ${isActive 
                    ? 'bg-violet-600/15 border border-violet-500/25 text-violet-300' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                  }
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}`} />
                {!collapsed && <span>{item.label}</span>}
                {collapsed && (
                  <div className="absolute left-16 bg-slate-950 text-slate-100 text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-slate-800 whitespace-nowrap shadow-xl z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Focus mode progress indicator */}
        {currentFocusSession && !collapsed && (
          <div className="mx-4 my-2 p-4 rounded-xl border border-violet-500/20 bg-violet-950/10 relative overflow-hidden">
            <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider flex items-center gap-1.5">
              <Clock className="w-3 h-3 animate-spin" /> In Focus Session
            </span>
            <p className="text-xs text-white font-bold truncate mt-1">
              {focusTask ? focusTask.title : 'Deep Focus'}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
              <span>{formatTime(currentFocusSession.timeRemaining)} left</span>
              <span>{Math.round(activeFocusPercentage)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-violet-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${activeFocusPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-900/80 bg-[#0a0b0e]/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700/60 overflow-hidden shrink-0 flex items-center justify-center text-slate-400">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">{userSettings.name}</p>
              <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-0.5 mt-0.5">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
                <span>16 Day Streak</span>
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Page Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Top Header bar */}
        <header className="h-16 border-b border-slate-900 px-6 flex items-center justify-between shrink-0 bg-[#08090c]/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="lg:hidden w-8 h-8" /> {/* Placeholder for mobile alignment */}
            <h1 className="text-lg font-bold text-white tracking-wide capitalize font-display">
              {activeTab.replace('_', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Quick stats indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs font-semibold text-slate-300 select-none">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />
              <span>16 Streak</span>
            </div>
            
            <div className="text-xs text-slate-500 font-medium">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Scrollable Page Wrapper */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          <div className="max-w-7xl mx-auto w-full">
            {/* Render smart reminder center on top of all pages */}
            <SmartReminder />
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
