import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { GeminiService } from '../services/gemini';
import { 
  Sparkles, 
  Workflow, 
  Clock, 
  Award, 
  Plus, 
  Layers, 
  ListCollapse, 
  CheckSquare, 
  Square, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Play
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Phase {
  id: string;
  title: string;
  description: string;
  stepsCount: number;
  hours: number;
  completedPercent: number;
  expanded?: boolean;
  steps: { id: string; title: string; completed: boolean }[];
}

export const TaskBreakdown: React.FC = () => {
  const { geminiApiKey, addNotification } = useStore();
  const [taskInput, setTaskInput] = useState('Prepare for OS (Operating System) University Exam');
  const [deadline, setDeadline] = useState('2025-06-15');
  const [timeAvailable, setTimeAvailable] = useState('2 hrs/day');
  const [focusArea, setFocusArea] = useState('Understanding + PYQs');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

  // Hardcoded default phases matching mockup to initialize page beautifully
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: 'ph-1',
      title: 'Phase 1: Understand Basics',
      description: 'Build strong concepts foundation',
      stepsCount: 4,
      hours: 6,
      completedPercent: 100,
      steps: [
        { id: 'st-1-1', title: 'Review processes, threads, concurrency principles', completed: true },
        { id: 'st-1-2', title: 'Study CPU scheduling algorithms & criteria', completed: true },
        { id: 'st-1-3', title: 'Learn memory management paging & segmentation', completed: true },
        { id: 'st-1-4', title: 'Solve critical section deadlock questions', completed: true }
      ]
    },
    {
      id: 'ph-2',
      title: 'Phase 2: Core Concepts Deep Dive',
      description: 'Understand important OS concepts deeply',
      stepsCount: 4,
      hours: 6,
      completedPercent: 75,
      steps: [
        { id: 'st-2-1', title: 'Analyze Virtual Memory & demand paging details', completed: true },
        { id: 'st-2-2', title: 'Learn Page replacement FIFO, LRU, Optimal calculations', completed: true },
        { id: 'st-2-3', title: 'Understand file systems & allocation strategies', completed: true },
        { id: 'st-2-4', title: 'Study Disk scheduling SSTF, SCAN, LOOK exercises', completed: false }
      ]
    },
    {
      id: 'ph-3',
      title: 'Phase 3: Practice & Application',
      description: 'Solve questions and apply concepts',
      stepsCount: 4,
      hours: 7,
      completedPercent: 25,
      steps: [
        { id: 'st-3-1', title: 'Practice semaphore synchronization code problems', completed: true },
        { id: 'st-3-2', title: 'Write programs for classic producer-consumer patterns', completed: false },
        { id: 'st-3-3', title: 'Study memory fragmentation allocation simulation', completed: false },
        { id: 'st-3-4', title: 'Review virtual memory page tables paging exercises', completed: false }
      ]
    },
    {
      id: 'ph-4',
      title: 'Phase 4: Previous Year Questions',
      description: 'Solve PYQs and analyze patterns',
      stepsCount: 2,
      hours: 3,
      completedPercent: 0,
      steps: [
        { id: 'st-4-1', title: 'Solve last 5 years university questions on page replacement', completed: false },
        { id: 'st-4-2', title: 'Attempt short note questions on memory partitions', completed: false }
      ]
    },
    {
      id: 'ph-5',
      title: 'Phase 5: Revision & Final Prep',
      description: 'Quick revision and final preparation',
      stepsCount: 2,
      hours: 2,
      completedPercent: 0,
      steps: [
        { id: 'st-5-1', title: 'Revise cheat sheet formulas & scheduling charts', completed: false },
        { id: 'st-5-2', title: 'Take a self-assessment mock test under exam limit', completed: false }
      ]
    }
  ]);

  const [motivationQuote, setMotivationQuote] = useState('The way to get started is to quit talking and begin doing. - Walt Disney');

  const quotesList = [
    'The way to get started is to quit talking and begin doing. - Walt Disney',
    'Focus on being productive instead of busy. - Tim Ferriss',
    'Productivity is never an accident. It is always the result of a commitment to excellence. - Paul J. Meyer',
    'Action is the foundational key to all success. - Pablo Picasso',
    'Your talent determines what you can do. Your motivation determines how much you are willing to do. - Lou Holtz'
  ];

  const handleMotivateMe = () => {
    const nextIdx = Math.floor(Math.random() * quotesList.length);
    setMotivationQuote(quotesList[nextIdx]);
    addNotification("AI Motivational quote updated!");
  };

  const handleToggleStep = (phaseId: string, stepId: string) => {
    const updatedPhases = phases.map(p => {
      if (p.id !== phaseId) return p;
      const updatedSteps = p.steps.map(s => 
        s.id === stepId ? { ...s, completed: !s.completed } : s
      );
      const completedCount = updatedSteps.filter(s => s.completed).length;
      const completedPercent = Math.round((completedCount / updatedSteps.length) * 100);
      return {
        ...p,
        steps: updatedSteps,
        completedPercent
      };
    });
    setPhases(updatedPhases);
    addNotification("Task breakdown progress updated.");
  };

  const handleExpandPhase = (phaseId: string) => {
    setPhases(prev => prev.map(p => 
      p.id === phaseId ? { ...p, expanded: !p.expanded } : p
    ));
  };

  const handleBreakdownSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    setIsAnalyzing(true);
    addNotification("AI is analyzing and partitioning your task...");

    try {
      // Call breakdown task generator
      const res = await GeminiService.breakdownTask(taskInput, `Preferences: Deadline ${deadline}, Available ${timeAvailable}, Focus ${focusArea}`, geminiApiKey);
      
      // Transform incoming subtasks into 5 logical phases
      const sub = res.subtasks;
      const totalHours = Math.round(res.estimatedHours || 12);
      
      const p1 = sub.slice(0, Math.ceil(sub.length / 5));
      const p2 = sub.slice(p1.length, p1.length + Math.ceil(sub.length / 5));
      const p3 = sub.slice(p1.length + p2.length, p1.length + p2.length + Math.ceil(sub.length / 5));
      const p4 = sub.slice(p1.length + p2.length + p3.length, p1.length + p2.length + p3.length + Math.ceil(sub.length / 5));
      const p5 = sub.slice(p1.length + p2.length + p3.length + p4.length);

      const hourSplits = [
        Math.max(1, Math.round(totalHours * 0.25)),
        Math.max(1, Math.round(totalHours * 0.25)),
        Math.max(1, Math.round(totalHours * 0.3)),
        Math.max(1, Math.round(totalHours * 0.12)),
        Math.max(1, Math.round(totalHours * 0.08))
      ];

      const newPhases: Phase[] = [
        {
          id: `ph-gen-1`,
          title: 'Phase 1: Research & Core Foundations',
          description: 'Establish basic context parameters',
          stepsCount: p1.length,
          hours: hourSplits[0],
          completedPercent: 0,
          steps: p1.map((s, i) => ({ id: `st-gen-1-${i}`, title: s, completed: false }))
        },
        {
          id: `ph-gen-2`,
          title: 'Phase 2: Deep Dive Setup',
          description: 'Explore critical modules and structures',
          stepsCount: p2.length,
          hours: hourSplits[1],
          completedPercent: 0,
          steps: p2.map((s, i) => ({ id: `st-gen-2-${i}`, title: s, completed: false }))
        },
        {
          id: `ph-gen-3`,
          title: 'Phase 3: Logic Implementation',
          description: 'Construct active features and interfaces',
          stepsCount: p3.length,
          hours: hourSplits[2],
          completedPercent: 0,
          steps: p3.map((s, i) => ({ id: `st-gen-3-${i}`, title: s, completed: false }))
        },
        {
          id: `ph-gen-4`,
          title: 'Phase 4: Integrations & Testing',
          description: 'Conduct boundary test scenarios',
          stepsCount: p4.length,
          hours: hourSplits[3],
          completedPercent: 0,
          steps: p4.map((s, i) => ({ id: `st-gen-4-${i}`, title: s, completed: false }))
        },
        {
          id: `ph-gen-5`,
          title: 'Phase 5: Deploy & Review',
          description: 'Finalize documentations and wrap up',
          stepsCount: p5.length,
          hours: hourSplits[4],
          completedPercent: 0,
          steps: p5.map((s, i) => ({ id: `st-gen-5-${i}`, title: s, completed: false }))
        }
      ];

      setPhases(newPhases);
      addNotification("AI Task Breakdown created! Focus steps active.");
    } catch (err) {
      console.error(err);
      addNotification("Connection issues. Using local task breakdown template.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculations for dashboard
  const totalStepsCount = phases.reduce((acc, p) => acc + p.steps.length, 0);
  const completedStepsCount = phases.reduce((acc, p) => acc + p.steps.filter(s => s.completed).length, 0);
  const totalHoursCount = phases.reduce((acc, p) => acc + p.hours, 0);
  
  const nextStep = phases
    .flatMap(p => p.steps.map(s => ({ ...s, phaseId: p.id })))
    .find(s => !s.completed);

  // Recharts Pie/Donut breakdown chart data
  const colors = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];
  const chartData = phases.map((p, idx) => ({
    name: p.title.replace('Phase ', '').split(':')[0],
    value: p.hours,
    color: colors[idx % colors.length],
    percentage: Math.round((p.hours / totalHoursCount) * 100)
  }));

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="pb-3 border-b border-slate-900 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">AI Task Breakdown</h2>
          <p className="text-xs text-slate-500 mt-1">AI breaks down macro tasks into smaller, manageable step schedules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Column: Form + stats breakdown */}
        <div className="xl:col-span-1 space-y-6">
          <GlassCard className="p-4 space-y-4 border-violet-500/10">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
              <Workflow className="w-3.5 h-3.5 text-violet-400" /> Enter Your Task
            </span>
            <form onSubmit={handleBreakdownSubmit} className="space-y-4">
              <div className="space-y-1">
                <textarea 
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="e.g. Prepare for OS University Exam"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 h-20 placeholder-slate-650"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500">Deadline Target</label>
                  <input 
                    type="date" 
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500">Hours Available</label>
                  <select
                    value={timeAvailable}
                    onChange={(e) => setTimeAvailable(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="1 hr/day">1 hr/day</option>
                    <option value="2 hrs/day">2 hrs/day</option>
                    <option value="3 hrs/day">3 hrs/day</option>
                    <option value="4+ hrs/day">4+ hrs/day</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500">Focus Area (Optional)</label>
                  <input 
                    type="text" 
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    placeholder="e.g. Memory structures"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none placeholder-slate-600"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all border border-violet-400/20 cursor-pointer shadow-md shadow-violet-500/10 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-violet-300 animate-pulse" />
                <span>{isAnalyzing ? 'Analyzing with AI...' : 'Break Down with AI'}</span>
              </button>
            </form>
          </GlassCard>

          {/* Complete specs info box */}
          <GlassCard className="p-4 space-y-4 border-violet-500/10">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900">
              Breakdown Complete! 🎉
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl">
                <span className="block text-xl font-bold text-white">{totalStepsCount}</span>
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Total Steps</span>
              </div>
              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl">
                <span className="block text-xl font-bold text-white">{phases.length}</span>
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Phases</span>
              </div>
              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl">
                <span className="block text-xl font-bold text-white">~{totalHoursCount} hrs</span>
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Total Time</span>
              </div>
              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl">
                <span className="block text-xl font-bold text-emerald-400">High</span>
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Achievability</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 text-[10px] text-slate-400 italic leading-relaxed text-center">
              "{motivationQuote}"
            </div>
          </GlassCard>
        </div>

        {/* Center Panel: Task Breakdown Phase Lists */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-[#0e1017] p-4 border border-slate-900 rounded-2xl">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Breakdown Phases Progress</span>
            </div>

            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-[10px] font-semibold text-slate-400">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-violet-600 text-white' : 'hover:text-white'}`}
              >
                List View
              </button>
              <button 
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'timeline' ? 'bg-violet-600 text-white' : 'hover:text-white'}`}
              >
                Timeline View
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {phases.map((phase) => {
              const isExpanded = !!phase.expanded;
              return (
                <div 
                  key={phase.id} 
                  className={`border rounded-2xl transition-all overflow-hidden ${
                    phase.completedPercent === 100 
                      ? 'border-emerald-500/10 bg-emerald-950/2' 
                      : 'border-slate-900 bg-slate-950/20'
                  }`}
                >
                  {/* Phase main bar */}
                  <div 
                    onClick={() => handleExpandPhase(phase.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg text-xs font-bold ${
                        phase.completedPercent === 100 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-violet-500/10 text-violet-400 border border-violet-500/15'
                      }`}>
                        {phase.completedPercent === 100 ? '✓' : '•'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{phase.title}</h4>
                        <span className="text-[10px] text-slate-500 font-medium block">{phase.description}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-slate-500 font-bold">{phase.stepsCount} steps • {phase.hours}h</span>
                      <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                        phase.completedPercent === 100 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : phase.completedPercent > 0 
                            ? 'bg-violet-500/10 text-violet-400 animate-pulse' 
                            : 'bg-slate-900 text-slate-500'
                      }`}>
                        {phase.completedPercent}%
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expansion list detail */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-950/60 border-t border-slate-900 space-y-2">
                      {phase.steps.map(step => (
                        <div 
                          key={step.id} 
                          onClick={() => handleToggleStep(phase.id, step.id)}
                          className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/40 hover:bg-slate-900/80 border border-slate-900/60 cursor-pointer transition-colors"
                        >
                          {step.completed ? (
                            <CheckSquare className="w-4 h-4 text-violet-400 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-700 shrink-0" />
                          )}
                          <span className={`text-[11px] ${step.completed ? 'line-through text-slate-550' : 'text-slate-300'}`}>
                            {step.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Column */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Pie/Donut distribution chart */}
          <GlassCard className="p-4 space-y-4 border-violet-500/10">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900">
              Task Overview
            </h3>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
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
                <span className="block text-2xl font-bold text-white">{totalHoursCount}</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Total Hours</span>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              {chartData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-[10px]">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-400 truncate flex-1">{d.name}</span>
                  <span className="font-bold text-slate-200">{d.value}h ({d.percentage}%)</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Upcoming actions checklist */}
          <GlassCard className="p-4 space-y-4 border-violet-500/10">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900 flex justify-between items-center">
              <span>Upcoming Steps</span>
              <span className="text-[10px] text-violet-400 font-bold uppercase">Next</span>
            </h3>

            {nextStep ? (
              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-2">
                <p className="text-xs font-bold text-slate-200 leading-normal">{nextStep.title}</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                  <span className="text-[9px] text-slate-500 font-semibold uppercase">Pending execution</span>
                  <button 
                    onClick={() => handleToggleStep(nextStep.phaseId, nextStep.id)}
                    className="px-2.5 py-1 bg-violet-600/25 hover:bg-violet-600 hover:text-white text-violet-300 text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-0.5"
                  >
                    <Play className="w-3 h-3 text-violet-400 fill-violet-400" /> Mark Complete
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic text-center py-2">All breakdown steps completed!</p>
            )}

            <div className="pt-2">
              <button 
                onClick={handleMotivateMe}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />
                <span>Motivate Me</span>
              </button>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
