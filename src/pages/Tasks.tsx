import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GlassCard } from '../components/GlassCard';
import { Task, PriorityLevel, TaskCategory } from '../types';
import { 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Filter, 
  MoreVertical, 
  FolderOpen, 
  Trash2, 
  CheckCircle,
  X,
  FileSpreadsheet,
  Grid,
  Sparkles,
  Play
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Tasks: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    setSelectedTaskId, 
    addNotification,
    startFocusSession,
    setActiveTab
  } = useStore();

  const [search, setSearch] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [category, setCategory] = useState<TaskCategory>('Important_NotUrgent');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('1');
  const [estimatedMins, setEstimatedMins] = useState('30');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');

  // Handle Form Submit
  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const estMins = Number(estimatedHours) * 60 + Number(estimatedMins);
    const estimatedTime = `${estimatedHours}h ${estimatedMins > '0' ? `${estimatedMins}m` : ''}`.trim();

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate).toISOString() : '',
      estimatedTime,
      estimatedMinutes: estMins,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      notes: notes.trim(),
      dependencies: [],
      energyRequired: priority === 'high' ? 'high' : priority === 'medium' ? 'medium' : 'low',
      impactScore: priority === 'high' ? 85 : priority === 'medium' ? 65 : 40,
      aiReasoning: `Task manually categorized as ${category.replace('_', ' ')}. AI suggests scheduling focused intervals to complete this goal.`
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('Important_NotUrgent');
    setDueDate('');
    setEstimatedHours('1');
    setEstimatedMins('30');
    setTagsInput('');
    setNotes('');
    setShowAddForm(false);
    
    addNotification('New task created and AI categorized successfully!');
  };

  // 1. Filtering & Search
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    // Status filter
    const now = new Date();
    const isOverdue = task.dueDate && new Date(task.dueDate) < now && task.status !== 'completed';

    switch (activeTabFilter) {
      case 'active':
        return task.status !== 'completed';
      case 'completed':
        return task.status === 'completed';
      case 'overdue':
        return !!isOverdue;
      default:
        return true;
    }
  });

  // 2. Grouping by Eisenhower Matrix category
  const groups: Record<TaskCategory, Task[]> = {
    Urgent_Important: filteredTasks.filter(t => t.category === 'Urgent_Important'),
    Important_NotUrgent: filteredTasks.filter(t => t.category === 'Important_NotUrgent'),
    Urgent_NotImportant: filteredTasks.filter(t => t.category === 'Urgent_NotImportant'),
    Neither: filteredTasks.filter(t => t.category === 'Neither')
  };

  const groupDetails = [
    { key: 'Urgent_Important' as TaskCategory, label: '🔥 Urgent & Important', color: 'border-rose-500/20 bg-rose-950/5 text-rose-400' },
    { key: 'Important_NotUrgent' as TaskCategory, label: '⭐ Important, Not Urgent', color: 'border-amber-500/20 bg-amber-950/5 text-amber-400' },
    { key: 'Urgent_NotImportant' as TaskCategory, label: '🔵 Urgent, Not Important', color: 'border-blue-500/20 bg-blue-950/5 text-blue-400' },
    { key: 'Neither' as TaskCategory, label: '🟢 Not Urgent, Not Important', color: 'border-slate-800 bg-slate-900/10 text-slate-400' }
  ];

  // 3. Task summary stats data
  const summaryChartData = [
    { name: 'Urgent & Important', value: tasks.filter(t => t.category === 'Urgent_Important').length, color: '#f43f5e' },
    { name: 'Important, Not Urgent', value: tasks.filter(t => t.category === 'Important_NotUrgent').length, color: '#f59e0b' },
    { name: 'Urgent, Not Important', value: tasks.filter(t => t.category === 'Urgent_NotImportant').length, color: '#3b82f6' },
    { name: 'Not Urgent, Not Important', value: tasks.filter(t => t.category === 'Neither').length, color: '#64748b' }
  ];

  const handleStartTaskFocus = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    startFocusSession(task.id, 25);
    setActiveTab('focus');
  };

  const handleToggleCheck = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
    updateTask(task.id, { status: nextStatus });
    addNotification(`Task "${task.title}" updated.`);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      
      {/* Left 3 columns: Tasks lists & filters */}
      <div className="xl:col-span-3 space-y-6">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks, tags..."
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/40"
            />
          </div>

          {/* Action and Filter Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <div className="flex bg-slate-950/60 border border-slate-900 p-1 rounded-xl">
              {(['all', 'active', 'completed', 'overdue'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveTabFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    activeTabFilter === filter
                      ? 'bg-violet-600/15 text-violet-300 border border-violet-500/20'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-500/10 flex items-center gap-1.5 cursor-pointer border border-violet-400/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Grouped lists */}
        <div className="space-y-6">
          {groupDetails.map(({ key, label, color }) => {
            const groupTasks = groups[key];
            if (groupTasks.length === 0) return null;

            return (
              <div key={key} className="space-y-2.5">
                <div className={`px-4 py-2 border rounded-xl flex items-center justify-between ${color}`}>
                  <span className="text-xs font-bold uppercase tracking-wider">{label} ({groupTasks.length})</span>
                </div>

                <div className="space-y-1.5">
                  {groupTasks.map((task) => {
                    const isTaskOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
                    
                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-900/60 hover:border-slate-850 hover:bg-slate-900/30 transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* check box button */}
                          <button 
                            onClick={(e) => handleToggleCheck(task, e)}
                            className="text-slate-500 hover:text-violet-400 transition-colors shrink-0 cursor-pointer"
                          >
                            <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all ${
                              task.status === 'completed' 
                                ? 'bg-violet-500/20 border-violet-500/40 text-violet-400' 
                                : 'border-slate-700 hover:border-violet-500/50'
                            }`}>
                              {task.status === 'completed' && <CheckCircle className="w-3.5 h-3.5" />}
                            </div>
                          </button>
                          
                          {/* Title & Desc */}
                          <div className="min-w-0">
                            <h4 className={`text-sm font-semibold truncate ${
                              task.status === 'completed' ? 'line-through text-slate-550' : 'text-slate-100'
                            }`}>
                              {task.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate max-w-lg mt-0.5">{task.description}</p>
                          </div>
                        </div>

                        {/* Metadata details right-aligned */}
                        <div className="flex items-center gap-4 shrink-0 font-medium text-xs text-slate-400">
                          {/* priority pill */}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            task.priority === 'high' ? 'bg-rose-500/10 text-rose-400' :
                            task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {task.priority}
                          </span>

                          {/* Est Time */}
                          <span className="hidden sm:flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {task.estimatedTime}
                          </span>

                          {/* Due Date */}
                          {task.dueDate && (
                            <span className={`flex items-center gap-1.5 ${isTaskOverdue ? 'text-rose-400 font-semibold' : ''}`}>
                              <Calendar className="w-3.5 h-3.5 text-slate-550" />
                              {new Date(task.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                            </span>
                          )}

                          {/* quick focus start */}
                          {task.status !== 'completed' && (
                            <button
                              onClick={(e) => handleStartTaskFocus(task, e)}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:scale-105 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                              title="Start Focus"
                            >
                              <Play className="w-3.5 h-3.5 fill-slate-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="py-16 text-center border border-dashed border-slate-900 rounded-2xl bg-slate-950/10 flex flex-col items-center">
            <FolderOpen className="w-12 h-12 text-slate-600 mb-3" />
            <h3 className="text-slate-350 font-bold text-sm">No tasks found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">No tasks match your search or status query. Try modifying your filters or add a new task.</p>
          </div>
        )}
      </div>

      {/* Right Column: Analytics & quick filters */}
      <div className="xl:col-span-1 space-y-6">
        
        {/* Task Summary Pie Chart */}
        <GlassCard className="flex flex-col items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-900 w-full text-center">Tasks Summary</h3>
          <div className="h-44 w-full mt-3 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summaryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {summaryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center select-none">
              <span className="block text-2xl font-bold text-white">{tasks.length}</span>
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Total Tasks</span>
            </div>
          </div>

          <div className="w-full space-y-2.5 mt-2">
            {summaryChartData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-[10px] font-semibold">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-slate-400 truncate">{d.name}</span>
                <span className="text-slate-205 ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Motivation Card */}
        <GlassCard className="p-5 border-violet-500/20 bg-gradient-to-tr from-violet-950/20 to-indigo-950/20 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-violet-500/10 rounded-full blur-xl pointer-events-none" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Keep it up!
          </h4>
          <p className="text-xs text-slate-350 leading-relaxed mt-2 italic">
            "Your productivity is **Excellent**! You completed 8 tasks this week. Keep up the high focus momentum!"
          </p>
        </GlassCard>
      </div>

      {/* Task Creation Modal Form Overlay */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
          <GlassCard className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto border-violet-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-violet-400" />
                <span>Create New Task</span>
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTaskSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Task Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Design Database Schema"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/40"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Summarize the core requirements..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/40 h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority</label>
                  <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/40"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Eisenhower Quadrant</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/40"
                  >
                    <option value="Urgent_Important">Urgent & Important (Do)</option>
                    <option value="Important_NotUrgent">Important, Not Urgent (Schedule)</option>
                    <option value="Urgent_NotImportant">Urgent, Not Important (Delegate)</option>
                    <option value="Neither">Neither (Eliminate)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Due Date</label>
                  <input 
                    type="datetime-local" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Duration</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={estimatedHours} 
                      onChange={(e) => setEstimatedHours(e.target.value)} 
                      min="0"
                      className="w-16 bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white text-center focus:outline-none focus:border-violet-500/40"
                    />
                    <span className="text-xs text-slate-500 pt-2.5">hrs</span>
                    <input 
                      type="number" 
                      value={estimatedMins} 
                      onChange={(e) => setEstimatedMins(e.target.value)} 
                      min="0"
                      max="59"
                      className="w-16 bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white text-center focus:outline-none focus:border-violet-500/40"
                    />
                    <span className="text-xs text-slate-500 pt-2.5">mins</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tags (comma-separated)</label>
                <input 
                  type="text" 
                  value={tagsInput} 
                  onChange={(e) => setTagsInput(e.target.value)} 
                  placeholder="college, coding, design..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/40"
                />
              </div>

              <div className="pt-4 flex gap-3 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all border border-violet-400/20 cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
