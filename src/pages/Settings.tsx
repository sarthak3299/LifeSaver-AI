import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { Save, User, Clock, Key, ShieldCheck, Sparkles, Sliders, AlertCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const { userSettings, updateUserSettings, geminiApiKey, setGeminiApiKey, addNotification } = useStore();

  const [name, setName] = useState(userSettings.name);
  const [workingStart, setWorkingStart] = useState(userSettings.workingHoursStart);
  const [workingEnd, setWorkingEnd] = useState(userSettings.workingHoursEnd);
  const [sleepStart, setSleepStart] = useState(userSettings.sleepWindowStart);
  const [sleepEnd, setSleepEnd] = useState(userSettings.sleepWindowEnd);
  const [focusGoal, setFocusGoal] = useState(userSettings.focusGoalMinutes);
  const [personality, setPersonality] = useState(userSettings.aiPreferences.coachPersonality);
  const [apiKey, setApiKey] = useState(geminiApiKey);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateUserSettings({
      name,
      workingHoursStart: workingStart,
      workingHoursEnd: workingEnd,
      sleepWindowStart: sleepStart,
      sleepWindowEnd: sleepEnd,
      focusGoalMinutes: Number(focusGoal),
      aiPreferences: {
        ...userSettings.aiPreferences,
        coachPersonality: personality
      }
    });

    setGeminiApiKey(apiKey.trim());

    addNotification('Settings and API preferences saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Settings</h2>
          <p className="text-slate-400 text-sm mt-0.5">Customize your productivity thresholds, work hours, and AI coaching preference.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile & Work Hours Settings */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <User className="w-5 h-5 text-violet-400" />
              <span>Personal Profile & Work Parameters</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">User Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/40"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Focus Goal (Minutes)</label>
                <input 
                  type="number" 
                  value={focusGoal} 
                  onChange={(e) => setFocusGoal(Number(e.target.value))} 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/40"
                  min="30"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-500" /> Start of Working Hours
                </label>
                <input 
                  type="time" 
                  value={workingStart} 
                  onChange={(e) => setWorkingStart(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/40"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-500" /> End of Working Hours
                </label>
                <input 
                  type="time" 
                  value={workingEnd} 
                  onChange={(e) => setWorkingEnd(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/40"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-500" /> Sleep Window Start
                </label>
                <input 
                  type="time" 
                  value={sleepStart} 
                  onChange={(e) => setSleepStart(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/40"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-500" /> Sleep Window End
                </label>
                <input 
                  type="time" 
                  value={sleepEnd} 
                  onChange={(e) => setSleepEnd(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/40"
                  required
                />
              </div>
            </div>
          </GlassCard>

          {/* AI Settings */}
          <GlassCard className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <span>AI Productivity Coach Options</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-4 h-4 text-slate-500" /> Coach Personality
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(['strict', 'nurturing', 'analytical', 'humorous'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPersonality(p)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                        personality === p 
                          ? 'bg-violet-600/15 border-violet-500/40 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.1)]'
                          : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:text-slate-350 hover:bg-slate-900/90'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-violet-950/15 border border-violet-500/15 text-xs text-slate-300 leading-relaxed space-y-1">
                {personality === 'strict' && (
                  <p><strong>Strict Mode:</strong> Focuses on military-grade discipline. It pushes you when you fail and reminds you of deadlines aggressively.</p>
                )}
                {personality === 'nurturing' && (
                  <p><strong>Nurturing Mode:</strong> Empathizes with fatigue, encourages minor accomplishments, and suggests scheduling wellness/rest blocks.</p>
                )}
                {personality === 'analytical' && (
                  <p><strong>Analytical Mode:</strong> Uses charts, performance data, and work-rest ratios to suggest mathematical layout adjustments.</p>
                )}
                {personality === 'humorous' && (
                  <p><strong>Humorous Mode:</strong> Adds witty alerts and light sarcasm to push you off social media and onto deep work blocks.</p>
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Gemini API Key Configuration */}
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Key className="w-5 h-5 text-violet-400" />
              <span>Gemini AI Engine</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Google Gemini API Key</label>
                <input 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                  placeholder="AI-xxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-violet-500/40 font-mono"
                />
              </div>

              {apiKey ? (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Real AI Active</strong>
                    Application is connected directly to Google Gemini models for live workspace planning and chat responses.
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Interactive Mock Mode</strong>
                    Using a built-in simulation engine. Input a valid Google Gemini API key to activate live prompt generations.
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-500 leading-normal">
                Your key is stored 100% securely inside browser LocalStorage. No database cloud servers or analytics dashboards will store this credential.
              </p>
            </div>
          </GlassCard>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-lg shadow-violet-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-violet-400/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
