import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, Calendar, Clock, Tag, Plus, CheckSquare, Square, Trash2, Sparkles, AlertCircle, Play } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { AnimatePresence, motion } from 'framer-motion';

export const TaskDetailPanel: React.FC = () => {
  const { 
    selectedTaskId, 
    setSelectedTaskId, 
    tasks, 
    updateTask, 
    deleteTask, 
    toggleSubtask, 
    addSubtask,
    geminiApiKey,
    startFocusSession,
    setActiveTab,
    addNotification
  } = useStore();

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isBreakingDown, setIsBreakingDown] = useState(false);

  const task = tasks.find((t) => t.id === selectedTaskId);

  if (!task) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const handleToggleStatus = () => {
    const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
    updateTask(task.id, { status: nextStatus });
    addNotification(`Task "${task.title}" marked as ${nextStatus === 'completed' ? 'Completed' : 'To Do'}!`);
  };

  const handleAIDecompose = async () => {
    setIsBreakingDown(true);
    try {
      const result = await GeminiService.breakdownTask(task.title, task.description, geminiApiKey);
      
      const newSubtasks = result.subtasks.map((st, idx) => ({
        id: `sub-ai-${Date.now()}-${idx}`,
        title: st,
        completed: false
      }));

      // Update task estimated time and append subtasks
      const estimatedMinutes = Math.round(result.estimatedHours * 60);
      const hoursStr = Math.floor(result.estimatedHours);
      const minsStr = Math.round((result.estimatedHours - hoursStr) * 60);
      const estimatedTime = `${hoursStr}h ${minsStr > 0 ? `${minsStr}m` : ''}`.trim();

      updateTask(task.id, {
        subtasks: [...task.subtasks, ...newSubtasks],
        estimatedMinutes,
        estimatedTime
      });

      addNotification(`AI successfully split "${task.title}" into ${result.subtasks.length} subtasks!`);
    } catch (e) {
      console.error(e);
      addNotification(`Failed to break down task using AI. Please check your API key.`);
    } finally {
      setIsBreakingDown(false);
    }
  };

  const handleStartFocus = () => {
    startFocusSession(task.id, 25);
    setActiveTab('focus');
    setSelectedTaskId(null);
  };

  const categoryLabels: Record<string, string> = {
    Urgent_Important: 'Urgent & Important',
    Important_NotUrgent: 'Important but Not Urgent',
    Urgent_NotImportant: 'Urgent but Not Important',
    Neither: 'Neither Urgent nor Important'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedTaskId(null)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Panel Drawer */}
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg h-full bg-[#0e1017] border-l border-slate-800 shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/20">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${
                task.priority === 'high' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' :
                task.priority === 'medium' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
              }`} />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {task.priority} Priority Task
              </span>
            </div>
            <button 
              onClick={() => setSelectedTaskId(null)}
              className="p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Desc */}
            <div>
              <h2 className="text-xl font-bold text-white leading-snug">{task.title}</h2>
              <p className="text-slate-300 mt-2 text-sm leading-relaxed whitespace-pre-line">{task.description}</p>
            </div>

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-500" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-850/60">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Eisenhower Quadrant</span>
                <span className="block text-xs font-medium text-violet-300">{categoryLabels[task.category]}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Due Date</span>
                <span className="block text-xs font-medium text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'}) + ' ' + new Date(task.dueDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'No Deadline'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Est. Time</span>
                <span className="block text-xs font-medium text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {task.estimatedTime}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Time Spent</span>
                <span className="block text-xs font-medium text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {Math.floor(task.actualMinutesSpent / 60)}h {task.actualMinutesSpent % 60}m
                </span>
              </div>
            </div>

            {/* AI Reasoning */}
            {task.aiReasoning && (
              <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/15">
                <h4 className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Priority Reasoning
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{task.aiReasoning}"
                </p>
              </div>
            )}

            {/* Subtasks Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-violet-400" /> Subtasks Checklist
                </h3>
                <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} Completed
                </span>
              </div>

              {/* Progress bar */}
              {task.subtasks.length > 0 && (
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%` }}
                  />
                </div>
              )}

              {/* Subtask list */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {task.subtasks.map((sub) => (
                  <div 
                    key={sub.id} 
                    onClick={() => toggleSubtask(task.id, sub.id)}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-900/30 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/60 transition-all cursor-pointer group"
                  >
                    <button className="text-slate-500 group-hover:text-violet-400 transition-colors shrink-0 mt-0.5">
                      {sub.completed ? (
                        <CheckSquare className="w-4.5 h-4.5 text-violet-400" />
                      ) : (
                        <Square className="w-4.5 h-4.5" />
                      )}
                    </button>
                    <span className={`text-xs leading-relaxed transition-all ${
                      sub.completed ? 'line-through text-slate-500' : 'text-slate-300'
                    }`}>
                      {sub.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Subtask form */}
              <form onSubmit={handleAddSubtask} className="flex gap-2 mt-2">
                <input 
                  type="text" 
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Add a subtask..."
                  className="flex-1 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                />
                <button 
                  type="submit"
                  className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* AI breakdown widget */}
            <div className="border border-dashed border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-slate-950/10">
              <Sparkles className="w-6 h-6 text-violet-400 mb-2" />
              <h4 className="text-xs font-semibold text-white">Need a detailed execution breakdown?</h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                LifeSaver AI can automatically decompose this task into milestone subtasks and estimate the required timeline.
              </p>
              <button
                onClick={handleAIDecompose}
                disabled={isBreakingDown}
                className="mt-3 px-4 py-2 bg-violet-500/10 hover:bg-violet-500/25 border border-violet-500/30 text-violet-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isBreakingDown ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-violet-300 border-t-transparent rounded-full animate-spin" />
                    <span>Breaking down...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Break down with Gemini AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={() => {
                deleteTask(task.id);
                addNotification(`Deleted task "${task.title}"`);
              }}
              className="p-2.5 rounded-xl border border-rose-500/20 text-rose-400 hover:text-white hover:bg-rose-950/40 transition-all cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <button
              onClick={handleToggleStatus}
              className="flex-1 py-3 px-4 rounded-xl font-bold bg-slate-800 hover:bg-slate-750 text-white text-xs border border-slate-700/60 hover:border-slate-500/40 transition-all cursor-pointer"
            >
              {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Completed'}
            </button>

            {task.status !== 'completed' && (
              <button
                onClick={handleStartFocus}
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 text-white text-xs flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-all cursor-pointer border border-violet-400/20"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Focus</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
