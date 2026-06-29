import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { 
  Plus, 
  Target, 
  CheckSquare, 
  Square, 
  Flame, 
  Calendar, 
  Award, 
  Trash2, 
  Sparkles,
  Smartphone,
  ChevronRight,
  TrendingUp,
  Moon,
  Droplet
} from 'lucide-react';
import { getTodayStr } from '../store/useStore';

export const GoalsHabits: React.FC = () => {
  const { 
    habits, 
    addHabit, 
    toggleHabitDate, 
    deleteHabit,
    goals, 
    addGoal, 
    toggleMilestone, 
    deleteGoal,
    sleepHoursYesterday,
    setSleepHours,
    waterIntakeCups,
    incrementWater,
    addNotification
  } = useStore();

  const [newHabitName, setNewHabitName] = useState('');
  const [habitFreq, setHabitFreq] = useState<'daily' | 'weekly'>('daily');

  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState('Career');
  const [goalMilestones, setGoalMilestones] = useState('');
  const [goalDate, setGoalDate] = useState('');

  const todayStr = getTodayStr();

  // Handle Add Habit Submit
  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName.trim(), habitFreq);
    setNewHabitName('');
    addNotification(`Habit "${newHabitName}" registered successfully!`);
  };

  // Handle Add Goal Submit
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const milestonesList = goalMilestones
      .split(',')
      .map(m => m.trim())
      .filter(Boolean)
      .map((m, idx) => ({
        id: `mil-${Date.now()}-${idx}`,
        title: m,
        completed: false
      }));

    addGoal({
      title: goalTitle.trim(),
      category: goalCategory,
      targetDate: goalDate ? new Date(goalDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      milestones: milestonesList
    });

    setGoalTitle('');
    setGoalMilestones('');
    setGoalDate('');
    setShowGoalForm(false);
    
    addNotification(`Goal "${goalTitle}" established!`);
  };

  // Generate date array for the habit heatmaps (last 28 days)
  const getLast28Days = () => {
    const dates: string[] = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }
    return dates;
  };

  const last28Days = getLast28Days();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Habits Column: check-off, streaks, heatmaps */}
      <div className="xl:col-span-2 space-y-6">
        <GlassCard className="space-y-4">
          <div className="pb-2 border-b border-slate-900 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" /> Habit Tracker Logs
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold">Track daily routine streaks</span>
          </div>

          <div className="space-y-4">
            {habits.map((habit) => {
              const isCompletedToday = !!habit.history[todayStr];
              
              return (
                <div key={habit.id} className="p-4 rounded-xl bg-slate-950/40 border border-slate-900 flex flex-col gap-3.5 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          toggleHabitDate(habit.id, todayStr);
                          addNotification(`Habit "${habit.name}" logged.`);
                        }}
                        className="text-slate-500 hover:text-violet-400 transition-all cursor-pointer"
                      >
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          isCompletedToday 
                            ? 'bg-violet-500/20 border-violet-500/40 text-violet-400' 
                            : 'border-slate-700 hover:border-violet-500/50'
                        }`}>
                          {isCompletedToday && '✓'}
                        </div>
                      </button>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{habit.name}</h4>
                        <span className="text-[9px] text-slate-500 uppercase font-semibold">{habit.frequency} frequency</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 font-medium text-xs">
                      <span className="flex items-center gap-0.5 text-orange-400 font-bold">
                        <Flame className="w-4 h-4 text-orange-500 fill-orange-500/10" />
                        {habit.streak}d streak
                      </span>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-450 hover:bg-slate-800 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Habit Heatmap (Grid of last 28 days) */}
                  <div className="space-y-1 select-none">
                    <div className="flex justify-between text-[9px] text-slate-600 font-semibold px-0.5">
                      <span>4 weeks ago</span>
                      <span>Today</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {last28Days.map((date) => {
                        const isDone = !!habit.history[date];
                        return (
                          <div 
                            key={date}
                            className={`h-4.5 rounded-sm transition-all border ${
                              isDone
                                ? 'bg-violet-500/30 border-violet-500/40 shadow-[0_0_6px_rgba(139,92,246,0.15)]'
                                : 'bg-slate-950/80 border-slate-900'
                            }`}
                            title={`${date}: ${isDone ? 'Completed' : 'Missed'}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Habit inline Form */}
          <form onSubmit={handleAddHabit} className="flex gap-3 border-t border-slate-900 pt-4">
            <input 
              type="text" 
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="e.g. Read 10 Pages"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-550 focus:outline-none focus:border-violet-500/40"
              required
            />
            <select
              value={habitFreq}
              onChange={(e) => setHabitFreq(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 text-xs text-slate-300 focus:outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <button 
              type="submit"
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all border border-violet-400/20 cursor-pointer"
            >
              Add Habit
            </button>
          </form>
        </GlassCard>

        {/* Quick Logs: Sleep and Hydration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Sleep Logger */}
          <GlassCard className="p-4 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900 flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-violet-400" /> Sleep Log Tracker
            </h3>
            <div className="text-center">
              <span className="block text-2xl font-bold text-white">{sleepHoursYesterday} hrs</span>
              <span className="text-[10px] text-slate-500">Sleep hours logged yesterday</span>
            </div>
            <div className="flex gap-2 justify-center">
              <button 
                onClick={() => setSleepHours(Math.max(4, sleepHoursYesterday - 0.5))}
                className="w-10 py-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-350 cursor-pointer"
              >
                -0.5h
              </button>
              <button 
                onClick={() => setSleepHours(Math.min(12, sleepHoursYesterday + 0.5))}
                className="w-10 py-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-350 cursor-pointer"
              >
                +0.5h
              </button>
            </div>
          </GlassCard>

          {/* Water Logger */}
          <GlassCard className="p-4 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900 flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-blue-450" /> Daily Hydration
            </h3>
            <div className="text-center">
              <span className="block text-2xl font-bold text-white">{waterIntakeCups} / 8 cups</span>
              <span className="text-[10px] text-slate-500">Log hydration status</span>
            </div>
            <button
              onClick={() => { incrementWater(); addNotification("Hydration logged."); }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all border border-blue-400/20 cursor-pointer"
            >
              + Log 1 Cup
            </button>
          </GlassCard>

        </div>
      </div>

      {/* Goals Column: Projects, Milestones */}
      <div className="xl:col-span-1 space-y-6">
        <GlassCard className="space-y-4 flex flex-col h-full justify-between">
          <div className="space-y-4">
            <div className="pb-2 border-b border-slate-900 flex justify-between items-center">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-violet-400" /> Strategic Goals
              </h3>
              <button
                onClick={() => setShowGoalForm(true)}
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-450 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                title="Establish Goal"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {goals.map((goal) => (
                <div key={goal.id} className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-900 space-y-3 group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{goal.title}</h4>
                      <span className="text-[9px] text-slate-500 font-semibold uppercase">{goal.category}</span>
                    </div>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-450 hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Progress slider bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>

                  {/* milestones list */}
                  <div className="space-y-1.5 pt-1.5 border-t border-slate-900/60">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Milestones</span>
                    {goal.milestones.map((m) => (
                      <div 
                        key={m.id} 
                        onClick={() => {
                          toggleMilestone(goal.id, m.id);
                          addNotification(`Milestone updated.`);
                        }}
                        className="flex items-center gap-2 text-[10px] text-slate-350 cursor-pointer"
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                          m.completed ? 'bg-violet-500/20 border-violet-500/40 text-violet-400' : 'border-slate-800'
                        }`}>
                          {m.completed && '✓'}
                        </div>
                        <span className={m.completed ? 'line-through text-slate-550' : ''}>{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <GlassCard className="p-4 border-violet-500/10 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Coach advice</span>
            <p className="text-[11px] text-slate-400 leading-normal italic mt-1.5">
              "Focusing on 2 milestones this week will advance your **Interview Preparation** goal progress by 15%."
            </p>
          </GlassCard>
        </GlassCard>
      </div>

      {/* Goal creation modal */}
      {showGoalForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowGoalForm(false)} />
          <GlassCard className="relative z-10 w-full max-w-sm border-violet-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Establish New Goal</h3>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Goal Title</label>
                <input 
                  type="text" 
                  value={goalTitle} 
                  onChange={(e) => setGoalTitle(e.target.value)} 
                  placeholder="e.g. Land Junior Developer Internship"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                  <select 
                    value={goalCategory} 
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Career">Career</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Date</label>
                  <input 
                    type="date" 
                    value={goalDate} 
                    onChange={(e) => setGoalDate(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Milestones (comma-separated)</label>
                <textarea 
                  value={goalMilestones} 
                  onChange={(e) => setGoalMilestones(e.target.value)} 
                  placeholder="e.g. Master React, Solve 50 DP questions, Polish Resume..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none h-16"
                  required
                />
              </div>

              <div className="pt-3 flex gap-3 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all border border-violet-400/20"
                >
                  Establish
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
