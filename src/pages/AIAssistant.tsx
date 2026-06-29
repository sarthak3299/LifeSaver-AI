import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { Bot, Send, User, Sparkles, Brain, Clock, Zap, ShieldAlert, Award, ArrowRight } from 'lucide-react';
import { GeminiService } from '../services/gemini';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const AIAssistant: React.FC = () => {
  const { 
    geminiApiKey, 
    tasks, 
    habits, 
    userSettings, 
    addNotification,
    startFocusSession,
    setSelectedTaskId,
    setActiveTab
  } = useStore();

  const getCoachProfile = () => {
    const personality = userSettings.aiPreferences?.coachPersonality || 'analytical';
    switch (personality) {
      case 'strict':
        return {
          emoji: '😠',
          name: 'Coach Major',
          role: 'Strict Overseer',
          motto: 'No excuses, only executions.',
          color: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
          progress: 98,
          mood: 'Strictly Focused'
        };
      case 'nurturing':
        return {
          emoji: '🌸',
          name: 'Coach Lily',
          role: 'Mindful Supporter',
          motto: 'Step-by-step, warm tea in hand.',
          color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
          progress: 85,
          mood: 'Extremely Empathetic'
        };
      case 'humorous':
        return {
          emoji: '🎭',
          name: 'Coach Jester',
          role: 'Dopamine Booster',
          motto: 'Conquer deadlines before they conquer your sanity.',
          color: 'text-amber-450 border-amber-500/20 bg-amber-500/5',
          progress: 90,
          mood: 'High Dopamine'
        };
      case 'analytical':
      default:
        return {
          emoji: '📊',
          name: 'Coach ADA',
          role: 'Data Optimizer',
          motto: 'Maximize focal sprints, minimize context overhead.',
          color: 'text-violet-400 border-violet-500/20 bg-violet-500/5',
          progress: 95,
          mood: 'Analyzing Workload'
        };
    }
  };

  const coach = getCoachProfile();

  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'ai', 
      text: `Hello, Arjun! I am your **LifeSaver AI Productivity Coach**.\n\nI have analyzed your **16-day consistency streak** and today's tasks. Your highest impact priority is the **OS Assignment** due today.\n\nHow can I help you plan, optimize your day, or fight procrastination today?` 
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = { sender: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      // Map history for Gemini API standard structure
      const apiHistory = messages.map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: m.text }]
      }));

      // Call Gemini Chat
      const reply = await GeminiService.chatWithCoach(
        text.trim(),
        apiHistory,
        { tasks, habits, settings: userSettings },
        geminiApiKey
      );

      // Add AI reply
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: `I experienced a connection issue, but my advice remains: minimize context-switching and focus on your active **OS Assignment** deep work block!` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(chatInput);
  };

  const templates = [
    { label: 'Plan My Day', prompt: 'Plan my day based on my current task priorities and estimated times.' },
    { label: 'Beat Procrastination', prompt: 'I feel unmotivated and am procrastinating. Help me get started.' },
    { label: 'Analyze Workload', prompt: 'Analyze my current tasks list. Do I have any overload risk?' },
    { label: 'Optimize Schedule', prompt: 'Help me optimize my working hours to balance study and fitness.' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-10rem)]">
      
      {/* Left panel: Prompt templates & Coach specs */}
      <div className="lg:col-span-1 flex flex-col gap-6 h-full">
        {/* Coach Profile Card */}
        <GlassCard className="p-4 space-y-4 border-violet-500/10">
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none animate-bounce">{coach.emoji}</span>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">{coach.name}</h3>
              <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block">{coach.mood}</span>
            </div>
          </div>
          <div className="space-y-2 border-t border-slate-900 pt-3">
            <div className="flex justify-between text-[10px] text-slate-500 font-bold">
              <span>Strategy Style:</span>
              <span className="text-slate-300 capitalize">{coach.role}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-bold">
              <span>Motivation Factor:</span>
              <span className="text-slate-300">{coach.progress}%</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full" style={{ width: `${coach.progress}%` }} />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed italic bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
            "{coach.motto}"
          </p>
        </GlassCard>

        {/* Prompt Templates */}
        <GlassCard className="p-4 space-y-3 flex-1 overflow-y-auto border-violet-500/10">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Coach Prompts</span>
          <div className="space-y-2.5">
            {templates.map((t) => (
              <button
                key={t.label}
                onClick={() => handleSendMessage(t.prompt)}
                disabled={isTyping}
                className="w-full p-3 rounded-xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 text-left text-xs font-semibold text-slate-300 hover:text-white transition-all flex flex-col gap-1.5 group cursor-pointer disabled:opacity-50"
              >
                <span className="text-[10px] text-violet-400 group-hover:underline flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  {t.label}
                </span>
                <p className="text-[10px] text-slate-450 leading-relaxed font-normal">{t.prompt}</p>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Right panel: Chat UI */}
      <GlassCard className="lg:col-span-3 flex flex-col h-full overflow-hidden p-5 border-violet-500/10">
        
        {/* Chat Header */}
        <div className="pb-3 border-b border-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Conversational Terminal</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/25 text-[9px] font-bold text-violet-300">
            Coach: {coach.name} ({userSettings.aiPreferences.coachPersonality})
          </span>
        </div>

        {/* Message Bubble Container */}
        <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2 scrollbar-thin">
          {messages.map((m, idx) => {
            const isAI = m.sender === 'ai';
            
            // Search text for task title mention to display action buttons
            const matchedTasks = tasks.filter(t => 
              m.text.toLowerCase().includes(t.title.toLowerCase()) && 
              t.status !== 'completed'
            );

            return (
              <div 
                key={idx}
                className={`flex gap-3 max-w-[85%] ${isAI ? '' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-slate-800 select-none ${
                  isAI ? 'bg-violet-600/10 text-violet-400' : 'bg-slate-900 text-slate-350'
                }`}>
                  {isAI ? <span className="text-sm">{coach.emoji}</span> : <User className="w-4 h-4" />}
                </div>

                {/* Message Box */}
                <div className="flex flex-col gap-2">
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isAI 
                      ? 'bg-slate-950/50 border border-slate-900 text-slate-205 rounded-tl-sm shadow-[0_4px_12px_rgba(0,0,0,0.2)]' 
                      : 'bg-violet-600 border border-violet-500/20 text-white rounded-tr-sm shadow-[0_4px_12px_rgba(139,92,246,0.15)]'
                  }`}>
                    {/* format bold text in message markdown */}
                    <p className="whitespace-pre-line">
                      {m.text.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className={isAI ? "text-violet-300 font-bold" : "text-white font-bold"}>{chunk}</strong> : chunk)}
                    </p>
                  </div>

                  {/* Task Quick Actions Linker */}
                  {isAI && matchedTasks.length > 0 && (
                    <div className="flex gap-2 flex-wrap items-center bg-slate-950/20 border border-slate-900 p-2 rounded-xl mt-1">
                      <span className="text-[9px] uppercase font-bold text-slate-500 px-1.5">Action Pills:</span>
                      {matchedTasks.map(t => (
                        <div key={t.id} className="flex gap-1.5">
                          <button
                            onClick={() => {
                              startFocusSession(t.id, 25);
                              setActiveTab('focus');
                              addNotification(`Deep focus block launched for "${t.title}"`);
                            }}
                            className="px-2.5 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-[9px] font-bold transition-all border border-violet-400/20 cursor-pointer flex items-center gap-1 shadow-md shadow-violet-500/5"
                          >
                            <Zap className="w-2.5 h-2.5 text-violet-300 fill-violet-300" />
                            <span>Focus: {t.title}</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTaskId(t.id);
                            }}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-[9px] font-bold transition-all border border-slate-800 cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[50%]">
              <div className="w-8 h-8 rounded-full bg-violet-600/10 text-violet-400 border border-slate-800 flex items-center justify-center shrink-0">
                <span className="text-sm animate-bounce">{coach.emoji}</span>
              </div>
              <div className="p-3 bg-slate-950/50 border border-slate-900 rounded-2xl rounded-tl-sm flex items-center gap-1.5 select-none">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-450 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-violet-450 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-violet-450 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleFormSubmit} className="flex gap-3 border-t border-slate-900 pt-4 shrink-0">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={`Message ${coach.name}... describe a task, habit, code, or burnout problem...`}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !chatInput.trim()}
            className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-violet-500/10 cursor-pointer border border-violet-400/20 disabled:opacity-50 shrink-0"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>

      </GlassCard>

    </div>
  );
};
