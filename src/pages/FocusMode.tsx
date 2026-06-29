import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Volume2, 
  VolumeX, 
  Activity, 
  Zap, 
  Coffee,
  Smartphone,
  Sparkles,
  Trophy,
  Flame
} from 'lucide-react';

export const FocusMode: React.FC = () => {
  const { 
    currentFocusSession, 
    startFocusSession, 
    tickFocusSession, 
    pauseFocusSession, 
    endFocusSession,
    tasks
  } = useStore();

  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [sessionMinutes, setSessionMinutes] = useState(25);
  
  // Ambient Sound States
  const [ambientSound, setAmbientSound] = useState<'none' | 'lofi' | 'rain' | 'white'>('none');
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  // Distraction Blocker List
  const [blockedApps, setBlockedApps] = useState([
    { id: 'yt', name: 'YouTube', status: 'Blocked' },
    { id: 'ig', name: 'Instagram', status: 'Blocked' },
    { id: 'fb', name: 'Facebook', status: 'Blocked' },
    { id: 'tw', name: 'Twitter / X', status: 'Blocked' },
    { id: 'rd', name: 'Reddit', status: 'Blocked' },
  ]);

  // Pomodoro timer tick effect is managed globally in App.tsx to support background ticking

  const activeTask = currentFocusSession?.taskId 
    ? tasks.find(t => t.id === currentFocusSession.taskId)
    : null;

  // Format time display
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = () => {
    startFocusSession(selectedTaskId || undefined, sessionMinutes);
  };

  // Sound selection action
  const toggleAmbientSound = (sound: 'lofi' | 'rain' | 'white') => {
    if (ambientSound === sound) {
      setAmbientSound('none');
    } else {
      setAmbientSound(sound);
    }
  };

  // Timer Progress Radial calculations
  const progressPercent = currentFocusSession
    ? ((currentFocusSession.durationMinutes * 60 - currentFocusSession.timeRemaining) / (currentFocusSession.durationMinutes * 60)) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Left: Pomodoro clock & Mountain backdrop */}
      <div className="xl:col-span-2 space-y-6">
        <GlassCard className="relative overflow-hidden p-6 border-violet-500/25 bg-[#0a0b11]">
          {/* Audio Wave Visualizer animation if sound is active */}
          {ambientSound !== 'none' && (
            <div className="absolute top-4 right-4 flex items-end gap-0.5 h-6 select-none z-10 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
              <span className="text-[9px] font-bold text-violet-400 mr-1 capitalize">{ambientSound} beats</span>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="w-0.5 bg-violet-450 rounded-full animate-bounce" 
                  style={{ 
                    height: `${Math.random() * 100}%`,
                    animationDuration: `${0.6 + i * 0.15}s`
                  }} 
                />
              ))}
            </div>
          )}

          {/* SVG mountain background graphic */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-40">
            <svg viewBox="0 0 800 600" className="w-full h-full object-cover">
              {/* Starry sky */}
              <rect width="800" height="600" fill="#07080d" />
              <circle cx="100" cy="80" r="1.5" fill="#fff" opacity="0.6" className="animate-pulse" />
              <circle cx="300" cy="150" r="1" fill="#fff" opacity="0.3" />
              <circle cx="500" cy="90" r="1.8" fill="#fff" opacity="0.7" className="animate-pulse" />
              <circle cx="700" cy="180" r="1.2" fill="#fff" opacity="0.5" />
              <circle cx="200" cy="220" r="1" fill="#fff" opacity="0.4" />
              <circle cx="650" cy="250" r="1.6" fill="#fff" opacity="0.8" />

              {/* Mountains */}
              {/* Back mountain layer */}
              <polygon points="-50,600 200,320 500,600" fill="#1b1c2b" />
              <polygon points="300,600 550,280 850,600" fill="#1f2038" />
              
              {/* Mid mountain layer */}
              <polygon points="50,600 350,380 650,600" fill="#2d2254" />
              
              {/* Front mountain layer */}
              <polygon points="-100,600 150,450 400,600" fill="#3a2a6e" />
              <polygon points="450,600 650,480 900,600" fill="#3a2b72" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center py-8">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1.5 mb-6">
              <Zap className="w-3.5 h-3.5" /> Deep Work Zone
            </span>

            {/* Circular Timer Ring */}
            <div className="relative w-64 h-64 flex items-center justify-center select-none mb-8 z-10">
              {/* Radial glow background pulse when active */}
              {currentFocusSession && currentFocusSession.isActive && (
                <div className="absolute w-56 h-56 rounded-full bg-violet-600/25 animate-radial-glow pointer-events-none -z-10" />
              )}
              {/* SVG circular track */}
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  className="stroke-slate-900 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  className="stroke-violet-500 fill-none transition-all duration-1000"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 110}
                  strokeDashoffset={2 * Math.PI * 110 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                />
              </svg>

              {/* Timer Text */}
              <div className="text-center relative z-10">
                <span className="text-5xl font-extrabold text-white tracking-tight font-mono">
                  {currentFocusSession 
                    ? formatTime(currentFocusSession.timeRemaining) 
                    : `${String(sessionMinutes).padStart(2, '0')}:00`}
                </span>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                  {currentFocusSession 
                    ? (currentFocusSession.isActive ? 'Focused' : 'Paused') 
                    : 'Select parameters'}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            {currentFocusSession ? (
              <div className="flex gap-4">
                <button
                  onClick={pauseFocusSession}
                  className="px-6 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 rounded-xl font-semibold text-xs text-slate-200 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {currentFocusSession.isActive ? (
                    <>
                      <Pause className="w-4 h-4 text-violet-400" />
                      <span>Pause Session</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-violet-400 fill-violet-400" />
                      <span>Resume Focus</span>
                    </>
                  )}
                </button>

                <button
                  onClick={endFocusSession}
                  className="px-6 py-3 bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600/25 rounded-xl font-semibold text-xs text-rose-400 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Square className="w-4 h-4" />
                  <span>Quit Session</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                {/* select task */}
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="">General Deep Work (No linked task)</option>
                  {tasks.filter(t => t.status !== 'completed').map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>

                {/* select minutes */}
                <div className="flex bg-slate-950 p-1.5 border border-slate-900 rounded-xl w-full justify-between select-none">
                  {[15, 25, 45, 60].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSessionMinutes(m)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        sessionMinutes === m
                          ? 'bg-violet-600/15 border border-violet-500/20 text-violet-300'
                          : 'text-slate-500 hover:text-slate-350'
                      }`}
                    >
                      {m} Min
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleStart}
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-violet-500/10 cursor-pointer border border-violet-400/20"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Initiate Deep Work Session</span>
                </button>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Break suggestions and logs */}
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-4 flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Session Goal</span>
              <h4 className="text-xs font-bold text-slate-200 mt-1.5">Focus Goal</h4>
              <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Focus targets of 4h daily deep work.</p>
            </div>
            <button 
              onClick={() => startFocusSession(undefined, 5, true)}
              className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 font-bold transition-all cursor-pointer text-center"
            >
              Take 5m Break
            </button>
          </GlassCard>

          <GlassCard className="p-4 flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Break Recommendation</span>
              <h4 className="text-xs font-bold text-slate-200 mt-1.5">Cognitive Fatigue Rest</h4>
              <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Take a walk to reset focus metrics.</p>
            </div>
            <button 
              onClick={() => startFocusSession(undefined, 10, true)}
              className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 font-bold transition-all cursor-pointer text-center"
            >
              Take 10m Break
            </button>
          </GlassCard>
        </div>
      </div>

      {/* Right Column: Distraction Blocker list & stats */}
      <div className="space-y-6">
        
        {/* Active focus task details */}
        {activeTask && (
          <GlassCard className="border-violet-500/20 bg-gradient-to-tr from-violet-950/20 to-indigo-950/20">
            <span className="text-[9px] uppercase font-bold text-violet-400 tracking-wider">Focused Task Details</span>
            <h4 className="text-sm font-bold text-white mt-2">{activeTask.title}</h4>
            <p className="text-xs text-slate-350 mt-1 leading-relaxed truncate">{activeTask.description}</p>
            {activeTask.subtasks.length > 0 && (
              <div className="mt-3.5 space-y-2">
                <span className="text-[9px] uppercase font-bold text-slate-500">Subtask Milestones</span>
                {activeTask.subtasks.slice(0, 3).map((st) => (
                  <div key={st.id} className="flex items-center gap-2 text-xs text-slate-300">
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                      st.completed ? 'bg-violet-500/20 border-violet-500/40 text-violet-400' : 'border-slate-800'
                    }`}>
                      {st.completed && '✓'}
                    </div>
                    <span className={st.completed ? 'line-through text-slate-500' : ''}>{st.title}</span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        )}

        {/* Ambient Sounds module */}
        <GlassCard className="space-y-4">
          <div className="pb-2 border-b border-slate-900">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Focus Ambient Tracks</h3>
          </div>

          <div className="space-y-2.5">
            {[
              { id: 'lofi', name: 'Lo-Fi Study Beats', desc: 'Chill background rhythm' },
              { id: 'rain', name: 'Rainforest Rainfall', desc: 'Nature static white noise' },
              { id: 'white', name: 'Pink Noise Generator', desc: 'Binaural audio focus frequencies' },
            ].map((track) => (
              <div 
                key={track.id}
                onClick={() => toggleAmbientSound(track.id as any)}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  ambientSound === track.id
                    ? 'bg-violet-600/10 border-violet-500/40 text-violet-300 shadow-md'
                    : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold">{track.name}</h4>
                  <p className="text-[9px] text-slate-500">{track.desc}</p>
                </div>
                <div className={`p-1.5 rounded-lg border ${
                  ambientSound === track.id ? 'border-violet-500/25 bg-violet-500/15' : 'border-slate-800 bg-slate-900/60'
                }`}>
                  <Volume2 className={`w-3.5 h-3.5 ${ambientSound === track.id ? 'text-violet-400' : 'text-slate-550'}`} />
                </div>
              </div>
            ))}
          </div>

          {ambientSound !== 'none' && (
            <div className="pt-2 flex items-center gap-3 select-none">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-violet-400" />}
              </button>
              <input 
                type="range"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                min="0"
                max="100"
                className="flex-1 accent-violet-500 bg-slate-900 border border-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-bold text-slate-500 w-6 text-right">{volume}%</span>
            </div>
          )}
        </GlassCard>

        {/* Distraction Blocker status */}
        <GlassCard className="space-y-4">
          <div className="pb-2 border-b border-slate-900 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Distraction Blocker</h3>
          </div>

          <p className="text-[10px] text-slate-400 leading-normal">
            LifeSaver AI integrates with browser shield configurations to block notification pings and restrict domain browsing during sessions.
          </p>

          <div className="space-y-2">
            {blockedApps.map((app) => (
              <div key={app.id} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-900 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">{app.name}</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-[9px] font-bold text-rose-450 border border-rose-500/25">
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

    </div>
  );
};
