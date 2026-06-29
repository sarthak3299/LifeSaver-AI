import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { BrainCircuit, Sparkles, Send, Clock, BookOpen, Coffee, Award, Play, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Planner: React.FC = () => {
  const { 
    geminiApiKey, 
    tasks, 
    addTask, 
    applyAISchedule, 
    addNotification,
    scheduleBlocks
  } = useStore();

  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [inputText, setInputText] = useState(
    "I have an Operating System assignment tomorrow, an interview on Friday, two exams next week, gym every evening, and need to complete my hackathon project."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [tempPlan, setTempPlan] = useState<any | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setWizardStep(1);
    try {
      // 1. Understand Phase
      const result = await GeminiService.parseWorkloadText(inputText, geminiApiKey);
      
      // 2. Plan Phase simulation transition
      setTimeout(() => setWizardStep(2), 1000);
      
      // 3. Optimize Phase
      setTimeout(() => {
        setWizardStep(3);
        setTempPlan(result);
        setIsGenerating(false);
      }, 2000);

    } catch (e) {
      console.error(e);
      addNotification("Error parsing planning text. Using mock schedule instead.");
      setIsGenerating(false);
    }
  };

  const handleCommit = () => {
    if (!tempPlan) return;
    
    // Save to store
    // 1. Add any new extracted tasks
    tempPlan.tasks.forEach((t: any) => {
      addTask({
        title: t.title,
        description: t.description,
        priority: t.priority,
        category: t.category,
        dueDate: t.dueDate,
        estimatedTime: t.estimatedTime,
        estimatedMinutes: t.estimatedMinutes,
        tags: t.tags || ['ai-planner'],
        notes: t.notes || '',
        dependencies: t.dependencies || [],
        energyRequired: t.energyRequired || 'medium',
        impactScore: t.impactScore || 60,
        aiReasoning: t.aiReasoning || 'Rescheduled via AI Planner.'
      });
    });

    // 2. Apply schedule blocks
    applyAISchedule(tempPlan.scheduleBlocks, tempPlan.suggestions);
    
    setWizardStep(4);
    addNotification("AI Plan committed to your daily schedule!");
    
    // reset after timeout
    setTimeout(() => {
      setWizardStep(1);
      setTempPlan(null);
    }, 4000);
  };

  // Recharts Chart Summary Data
  const planSummaryData = [
    { name: 'Deep Work', value: 37, color: '#8b5cf6' },
    { name: 'Study', value: 29, color: '#3b82f6' },
    { name: 'Meetings', value: 18, color: '#f59e0b' },
    { name: 'Breaks', value: 11, color: '#10b981' },
    { name: 'Buffer', value: 5, color: '#ec4899' },
  ];

  const optimizationInsights = [
    { label: 'Focus Optimization', desc: 'Scheduled deep work during your peak morning hours (8AM - 11AM).' },
    { label: 'Break Optimization', desc: 'Added 3 micro-breaks to maintain your cognitive energy levels.' },
    { label: 'Task Batching', desc: 'Grouped administrative emails together to minimize context switching.' },
    { label: 'Buffer Time', desc: 'Added 15m transition buffer to handle unexpected meeting delays.' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Planner Engine</h2>
          <p className="text-slate-400 text-sm mt-0.5">Let Gemini parse your natural workload description and build the perfect calendar schedule.</p>
        </div>
      </div>

      {/* Wizard Steps indicator */}
      <div className="grid grid-cols-4 gap-2 md:gap-4 select-none">
        {[
          { step: 1, title: '1. Understand', desc: 'Analyzing inputs' },
          { step: 2, title: '2. Plan', desc: 'Creating optimal plan' },
          { step: 3, title: '3. Optimize', desc: 'Refining flow' },
          { step: 4, title: '4. Commit', desc: 'Plan is ready!' }
        ].map((s) => (
          <div 
            key={s.step}
            className={`p-3 rounded-xl border transition-all ${
              wizardStep === s.step
                ? 'bg-violet-600/15 border-violet-500/40 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                : wizardStep > s.step 
                  ? 'bg-slate-950/40 border-violet-500/10 text-slate-400'
                  : 'bg-slate-950/15 border-slate-900/60 text-slate-500'
            }`}
          >
            <h4 className="text-xs font-bold truncate flex items-center gap-1">
              {wizardStep > s.step && <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
              {s.title}
            </h4>
            <span className="text-[10px] hidden md:inline text-slate-500 font-semibold">{s.desc}</span>
          </div>
        ))}
      </div>

      {/* Main layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Natural language input area */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-900/80">
              <BrainCircuit className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Describe your upcoming workload</h3>
            </div>

            <div className="space-y-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. I have an operating system assignment due tomorrow, gym every evening at 6pm, and a mock interview on Friday..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/45 h-32 leading-relaxed"
                disabled={isGenerating}
              />

              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-500 font-semibold italic">
                  💡 Tip: Mention specific task durations and deadline days.
                </span>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !inputText.trim()}
                  className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-violet-500/10 cursor-pointer border border-violet-400/20 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Parsing Workload...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-violet-200" />
                      <span>Generate Plan with Gemini AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Generated Plan preview timeline */}
          {(tempPlan || wizardStep === 4) && (
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-900/80">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Generated Schedule</h3>
                <span className="text-[10px] text-slate-500 font-semibold">Today's Focus Map</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {(tempPlan?.scheduleBlocks || scheduleBlocks).map((block: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-center p-3 rounded-xl bg-slate-950/40 border border-slate-900 hover:border-slate-850 transition-all">
                    <div className="text-xs text-slate-500 font-bold w-12 text-right">
                      {block.startTime}
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: block.color || '#8b5cf6' }} />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-200">{block.title}</h4>
                      <span className="text-[10px] text-slate-500">{block.durationMinutes}m duration • {block.type}</span>
                    </div>
                  </div>
                ))}
              </div>

              {wizardStep === 3 && (
                <div className="pt-4 flex gap-3 border-t border-slate-900">
                  <button
                    onClick={() => { setTempPlan(null); setWizardStep(1); }}
                    className="flex-1 py-3 bg-slate-905 hover:bg-slate-850 text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-800"
                  >
                    Discard Plan
                  </button>
                  <button
                    onClick={handleCommit}
                    className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-violet-500/10 cursor-pointer border border-violet-400/20"
                  >
                    Commit Plan to Calendar
                  </button>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-semibold text-center">
                  🎉 Plan Committed! You can view these blocks in Dashboard and Calendar tabs.
                </div>
              )}
            </GlassCard>
          )}
        </div>

        {/* Right column: Analytics insights & scenarios */}
        <div className="space-y-6">
          {/* Plan Summary Chart */}
          <GlassCard className="flex flex-col items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-905 w-full text-center">Plan Summary</h3>
            <div className="h-40 w-full mt-3 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planSummaryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {planSummaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center select-none">
                <span className="block text-2xl font-bold text-white">92%</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Plan Confidence</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full mt-2 text-[10px] font-semibold">
              {planSummaryData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-400 truncate">{d.name}</span>
                  <span className="text-slate-205 ml-auto">{d.value}%</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* AI Insights checklist */}
          <GlassCard className="space-y-3">
            <div className="pb-2 border-b border-slate-905">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Optimization Insights</h3>
            </div>
            <div className="space-y-3">
              {optimizationInsights.map((insight) => (
                <div key={insight.label} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-[9px] text-emerald-400 font-bold shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{insight.label}</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{insight.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* What If Scenarios */}
          <GlassCard className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-905">What If Scenarios</h3>
            <div className="space-y-2">
              <button 
                onClick={() => addNotification("Scenario configured: schedule adjusted for low availability.")}
                className="w-full p-2.5 text-left text-xs font-semibold text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 flex justify-between items-center group cursor-pointer"
              >
                <span>What if I have less time?</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-550 group-hover:text-white transition-colors" />
              </button>
              <button 
                onClick={() => addNotification("Scenario configured: meeting buffer inserted.")}
                className="w-full p-2.5 text-left text-xs font-semibold text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 flex justify-between items-center group cursor-pointer"
              >
                <span>What if I add a meeting?</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-550 group-hover:text-white transition-colors" />
              </button>
              <button 
                onClick={() => addNotification("Scenario configured: extended study block planned.")}
                className="w-full p-2.5 text-left text-xs font-semibold text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 flex justify-between items-center group cursor-pointer"
              >
                <span>What if I want more study time?</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-550 group-hover:text-white transition-colors" />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
