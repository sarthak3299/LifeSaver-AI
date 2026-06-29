import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Plus, 
  Bell, 
  Edit2, 
  CheckCircle, 
  Volume2, 
  TrendingUp, 
  Clock, 
  ListTodo,
  Check
} from 'lucide-react';

interface VoiceCapture {
  id: string;
  text: string;
  timestamp: string;
  status: 'Added' | 'Draft';
}

export const VoiceTaskCapture: React.FC = () => {
  const { addTask, addNotification } = useStore();
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('English (India)');
  const [autoDetect, setAutoDetect] = useState(true);
  
  const [capturedText, setCapturedText] = useState('Prepare slides for OS Assignment and practice presentation for tomorrow at 2 PM');
  const [extractedTitle, setExtractedTitle] = useState('Prepare slides for OS Assignment and practice presentation');
  const [extractedDate, setExtractedDate] = useState('Tomorrow');
  const [extractedTime, setExtractedTime] = useState('2:00 PM');
  const [extractedPriority, setExtractedPriority] = useState<'high' | 'medium' | 'low'>('high');

  const [recentCaptures, setRecentCaptures] = useState<VoiceCapture[]>([
    { id: '1', text: 'Review Cyber Security notes and solve previous year questions', timestamp: 'Today, 11:45 AM', status: 'Added' },
    { id: '2', text: 'Book tickets for Delhi trip this weekend', timestamp: 'Today, 10:20 AM', status: 'Added' },
    { id: '3', text: 'Remind me to call mom at 8 PM', timestamp: 'Today, 09:15 AM', status: 'Added' },
    { id: '4', text: 'Schedule team meeting on Friday at 3 PM', timestamp: 'Yesterday, 06:30 PM', status: 'Added' },
    { id: '5', text: 'Submit DSA assignment by Sunday', timestamp: 'Yesterday, 04:10 PM', status: 'Added' },
  ]);

  const handlePresetClick = (presetPrompt: string, title: string, date: string, time: string, priority: 'high' | 'medium' | 'low') => {
    setIsListening(false);
    setCapturedText(presetPrompt);
    setExtractedTitle(title);
    setExtractedDate(date);
    setExtractedTime(time);
    setExtractedPriority(priority);
    addNotification(`Synthesized preset voice task.`);
  };

  const handleToggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate speech detection
      setTimeout(() => {
        setCapturedText('Read Chapter 5 of Computer Networks and summarize core protocols for today at 5 PM');
        setExtractedTitle('Read Chapter 5 of Computer Networks');
        setExtractedDate('Today');
        setExtractedTime('5:00 PM');
        setExtractedPriority('medium');
        setIsListening(false);
        addNotification("Voice task captured and parsed successfully.");
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const handleAddTask = () => {
    const today = new Date();
    let dueDateStr = today.toISOString();
    if (extractedDate.toLowerCase().includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      dueDateStr = tomorrow.toISOString();
    } else if (extractedDate.toLowerCase().includes('friday')) {
      const target = new Date();
      target.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7));
      dueDateStr = target.toISOString();
    }

    addTask({
      title: extractedTitle,
      description: `Voice Captured: "${capturedText}"`,
      priority: extractedPriority,
      category: extractedPriority === 'high' ? 'Urgent_Important' : 'Important_NotUrgent',
      dueDate: dueDateStr,
      estimatedTime: '1h 00m',
      estimatedMinutes: 60,
      tags: ['voice-input'],
      dependencies: [],
      energyRequired: 'medium',
      impactScore: extractedPriority === 'high' ? 85 : 55,
      aiReasoning: 'Created via intelligent voice task transcription parsing.'
    });

    const newCapture: VoiceCapture = {
      id: String(Date.now()),
      text: capturedText,
      timestamp: 'Just Now',
      status: 'Added'
    };

    setRecentCaptures(prev => [newCapture, ...prev]);
    addNotification("Voice task added to My Tasks backlog.");
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="pb-3 border-b border-slate-900 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Voice Task Capture</h2>
          <p className="text-xs text-slate-500 mt-1">Speak naturally. AI understands. Tasks captured instantly.</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="English (India)">English (India)</option>
            <option value="English (US)">English (US)</option>
            <option value="Hindi">Hindi (हिंदी)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Columns: Speak and Transcription */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Recorder Interactive Card */}
          <GlassCard className="p-6 relative flex flex-col items-center justify-center border-violet-500/10 min-h-[300px]">
            <div className="absolute -left-12 -top-12 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Speak Your Task
            </span>

            {/* Pulsing Mic visualizer */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              {isListening && (
                <>
                  <div className="absolute w-36 h-36 rounded-full bg-violet-500/10 border border-violet-500/20 animate-ping" />
                  <div className="absolute w-28 h-28 rounded-full bg-violet-500/20 animate-pulse" />
                </>
              )}
              <button 
                onClick={handleToggleListening}
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg border cursor-pointer transition-all ${
                  isListening 
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-rose-500/10' 
                    : 'bg-violet-600 hover:bg-violet-500 border-violet-400/20 text-white shadow-violet-500/20 hover:scale-105'
                }`}
              >
                {isListening ? <MicOff className="w-10 h-10 animate-bounce" /> : <Mic className="w-10 h-10" />}
              </button>
            </div>

            <div className="text-center space-y-1 mb-6">
              <h4 className="text-sm font-bold text-white">{isListening ? 'I\'m Listening...' : 'Tap the mic to start speaking'}</h4>
              <p className="text-xs text-slate-500">AI will automatically analyze, schedule, and prioritize your workload.</p>
            </div>

            {/* Suggestions/Presets grid */}
            <div className="w-full space-y-2 mt-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 block text-center">Try saying something like:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <button
                  onClick={() => handlePresetClick(
                    'Add a task to study OS tomorrow at 10 AM',
                    'Study OS Assignment',
                    'Tomorrow',
                    '10:00 AM',
                    'high'
                  )}
                  className="p-3 text-[10px] text-slate-400 bg-slate-950/40 border border-slate-900 hover:border-slate-800 hover:text-white rounded-xl text-center transition-all cursor-pointer leading-normal"
                >
                  "Add a task to study OS tomorrow at 10 AM"
                </button>
                <button
                  onClick={() => handlePresetClick(
                    'Remind me to submit project report Friday',
                    'Submit project report',
                    'Friday',
                    '04:00 PM',
                    'high'
                  )}
                  className="p-3 text-[10px] text-slate-400 bg-slate-950/40 border border-slate-900 hover:border-slate-800 hover:text-white rounded-xl text-center transition-all cursor-pointer leading-normal"
                >
                  "Remind me to submit project report Friday"
                </button>
                <button
                  onClick={() => handlePresetClick(
                    'Schedule meeting with team at 4 PM',
                    'Meeting with team',
                    'Today',
                    '4:00 PM',
                    'medium'
                  )}
                  className="p-3 text-[10px] text-slate-400 bg-slate-950/40 border border-slate-900 hover:border-slate-800 hover:text-white rounded-xl text-center transition-all cursor-pointer leading-normal"
                >
                  "Schedule meeting with team at 4 PM"
                </button>
              </div>
            </div>

            {/* Listen controls */}
            <div className="w-full flex items-center justify-between border-t border-slate-900 mt-6 pt-4">
              <button 
                onClick={handleToggleListening}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all border border-violet-400/20 cursor-pointer"
              >
                {isListening ? 'Stop Listening' : 'Start Capture'}
              </button>
              
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <div className={`w-2 h-2 rounded-full ${autoDetect ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                <span>Auto Detect speech endpoints</span>
              </div>
            </div>

          </GlassCard>

          {/* AI Extracted preview Card */}
          <GlassCard className="p-5 border-violet-500/10">
            <div className="flex justify-between items-center pb-3 border-b border-slate-900/80 mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" /> AI Captured Output
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400">
                Confidence: 98%
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-900 p-4 rounded-xl italic text-xs text-slate-300 leading-relaxed mb-5">
              "{capturedText}"
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Extracted Title</span>
                <p className="text-[11px] font-bold text-slate-200 truncate">{extractedTitle}</p>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Date Blocked</span>
                <p className="text-[11px] font-bold text-emerald-400">{extractedDate}</p>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Assigned Time</span>
                <p className="text-[11px] font-bold text-blue-400">{extractedTime}</p>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Priority Rating</span>
                <p className={`text-[11px] font-bold uppercase ${extractedPriority === 'high' ? 'text-rose-400' : 'text-amber-400'}`}>
                  {extractedPriority} Priority
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-900">
              <button 
                onClick={handleAddTask}
                className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all border border-violet-400/20 cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-violet-500/10"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task to Queue</span>
              </button>
              
              <button 
                onClick={() => { addNotification("Reminder set for voice task."); }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Bell className="w-4 h-4 text-slate-450" />
                <span>Set Reminder</span>
              </button>
            </div>
          </GlassCard>

        </div>

        {/* Right Side Column */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Recent voice captures */}
          <GlassCard className="p-4 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Captures</h3>
              <span className="text-[10px] text-violet-400 font-semibold cursor-pointer hover:underline">View All</span>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {recentCaptures.map((cap) => (
                <div key={cap.id} className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-2 group">
                  <p className="text-[11px] text-slate-350 leading-relaxed truncate">{cap.text}</p>
                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-semibold">
                    <span>{cap.timestamp}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Added
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Stats details */}
          <GlassCard className="p-4 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900">
              Voice Capture Stats
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950/50 border border-slate-900 rounded-xl text-center">
                <span className="block text-2xl font-bold text-white">18</span>
                <span className="text-[9px] text-slate-500 font-semibold uppercase">Captured</span>
              </div>
              <div className="p-3 bg-slate-950/50 border border-slate-900 rounded-xl text-center">
                <span className="block text-2xl font-bold text-emerald-400">95%</span>
                <span className="text-[9px] text-slate-500 font-semibold uppercase">Accuracy</span>
              </div>
              <div className="p-3 bg-slate-950/50 border border-slate-900 rounded-xl text-center">
                <span className="block text-2xl font-bold text-violet-400">8.6h</span>
                <span className="text-[9px] text-slate-500 font-semibold uppercase">Time Saved</span>
              </div>
              <div className="p-3 bg-slate-950/50 border border-slate-900 rounded-xl text-center">
                <span className="block text-2xl font-bold text-blue-400">7</span>
                <span className="text-[9px] text-slate-500 font-semibold uppercase">Reminders</span>
              </div>
            </div>
          </GlassCard>

          {/* Tip of the day */}
          <GlassCard className="p-4 bg-gradient-to-tr from-violet-950/20 to-indigo-950/20 border-violet-500/20">
            <span className="text-[9px] uppercase font-bold text-violet-400 tracking-wider flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" /> Best capturing guidelines
            </span>
            <ul className="space-y-2 mt-3 text-[10px] text-slate-400 leading-normal">
              <li className="flex gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Speak clearly in natural phrasing layouts.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Mention dates, times, and priority words directly.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>You can switch language dropdowns anytime.</span>
              </li>
            </ul>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
