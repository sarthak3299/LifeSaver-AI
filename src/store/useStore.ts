import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Habit, Goal, FocusSession, ScheduleBlock, UserSettings, AISuggestion, PriorityLevel, TaskCategory } from '../types';

// Helper to get today's date string in YYYY-MM-DD format
export const getTodayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to format ISO string relative to today
const getRelativeISO = (daysOffset: number, hour: number = 10, minute: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const defaultSettings: UserSettings = {
  name: 'Arjun Sharma',
  workingHoursStart: '09:00',
  workingHoursEnd: '18:00',
  focusGoalMinutes: 240, // 4 hours
  sleepWindowStart: '23:00',
  sleepWindowEnd: '07:00',
  theme: 'glass',
  aiPreferences: {
    coachPersonality: 'analytical',
    autoScheduleEnabled: true,
    rescueModeThresholdMinutes: 30,
  }
};

const initialTasks = (): Task[] => [
  {
    id: 'task-1',
    title: 'OS Assignment',
    description: 'Complete all questions and submit in PDF format. Focus on virtual memory and scheduling questions.',
    priority: 'high',
    category: 'Urgent_Important',
    dueDate: getRelativeISO(0, 10, 0), // Today 10:00 AM
    estimatedTime: '2h 30m',
    estimatedMinutes: 150,
    actualMinutesSpent: 0,
    status: 'in_progress',
    tags: ['college', 'os', 'assignment'],
    notes: 'Requires reference from Galvin textbook Chapter 8 & 9.',
    subtasks: [
      { id: 'sub-1-1', title: 'Read Chapter 8 & 9 notes', completed: true },
      { id: 'sub-1-2', title: 'Solve Memory Management questions', completed: true },
      { id: 'sub-1-3', title: 'Write Virtual Memory answers', completed: false },
      { id: 'sub-1-4', title: 'Compile into PDF report', completed: false },
      { id: 'sub-1-5', title: 'Upload to portal', completed: false },
    ],
    dependencies: [],
    aiReasoning: 'This task has a hard deadline today at 10:00 AM and carries heavy academic weight. Delaying it directly impacts your OS course score.',
    energyRequired: 'high',
    impactScore: 95
  },
  {
    id: 'task-2',
    title: 'Interview Preparation',
    description: 'Practice HR & Technical questions. Review system design concepts, patterns, and dynamic programming.',
    priority: 'high',
    category: 'Urgent_Important',
    dueDate: getRelativeISO(0, 14, 0), // Today 2:00 PM
    estimatedTime: '3h 00m',
    estimatedMinutes: 180,
    actualMinutesSpent: 90,
    status: 'in_progress',
    tags: ['career', 'interview', 'coding'],
    subtasks: [
      { id: 'sub-2-1', title: 'Revise key OOP design patterns', completed: true },
      { id: 'sub-2-2', title: 'Solve 2 LeetCode Medium questions', completed: true },
      { id: 'sub-2-3', title: 'Review behavioral interview guidelines', completed: false },
    ],
    dependencies: [],
    aiReasoning: 'Your mock interview is scheduled for Friday. Immediate preparation is vital for confidence and retention of algorithmic concepts.',
    energyRequired: 'high',
    impactScore: 90
  },
  {
    id: 'task-3',
    title: 'Submit Project Report',
    description: 'Final report submission for the Software Engineering project. Include architecture diagram.',
    priority: 'high',
    category: 'Urgent_Important',
    dueDate: getRelativeISO(0, 23, 59), // Today 11:59 PM
    estimatedTime: '1h 30m',
    estimatedMinutes: 90,
    actualMinutesSpent: 0,
    status: 'todo',
    tags: ['project', 'documentation'],
    subtasks: [
      { id: 'sub-3-1', title: 'Write architecture breakdown', completed: false },
      { id: 'sub-3-2', title: 'Insert database diagrams', completed: false },
      { id: 'sub-3-3', title: 'Format PDF and share with team', completed: false },
    ],
    dependencies: [],
    aiReasoning: 'Though due at the end of the day, it blocks group submission and has strict grading rules.',
    energyRequired: 'medium',
    impactScore: 85
  },
  {
    id: 'task-4',
    title: 'Aptitude Test Preparation',
    description: 'Practice quantitative & reasoning puzzles. Solve logic worksheets for placement tests.',
    priority: 'medium',
    category: 'Important_NotUrgent',
    dueDate: getRelativeISO(2, 11, 0), // May 30 (or today + 2 days)
    estimatedTime: '2h 00m',
    estimatedMinutes: 120,
    actualMinutesSpent: 0,
    status: 'todo',
    tags: ['aptitude', 'exam'],
    subtasks: [
      { id: 'sub-4-1', title: 'Solve permutations & probability questions', completed: false },
      { id: 'sub-4-2', title: 'Try 3 mock reasoning tests', completed: false }
    ],
    dependencies: [],
    aiReasoning: 'Crucial for passing initial screen rounds. Spacing out study blocks prevents cramming.',
    energyRequired: 'medium',
    impactScore: 75
  },
  {
    id: 'task-5',
    title: 'Learn System Design',
    description: 'Study low level & high level design. Learn horizontal scaling, load balancers, and caching structures.',
    priority: 'medium',
    category: 'Important_NotUrgent',
    dueDate: getRelativeISO(3, 9, 0),
    estimatedTime: '1h 30m',
    estimatedMinutes: 90,
    actualMinutesSpent: 0,
    status: 'todo',
    tags: ['skill', 'backend'],
    subtasks: [],
    dependencies: [],
    aiReasoning: 'Foundational skill for mid/senior interviews. Low urgency today, but high long-term career returns.',
    energyRequired: 'high',
    impactScore: 80
  },
  {
    id: 'task-6',
    title: 'Work on Portfolio',
    description: 'Update projects page and case studies. Add high-fidelity screenshots and live web link.',
    priority: 'medium',
    category: 'Important_NotUrgent',
    dueDate: getRelativeISO(4, 17, 0),
    estimatedTime: '2h 00m',
    estimatedMinutes: 120,
    actualMinutesSpent: 0,
    status: 'todo',
    tags: ['personal', 'portfolio'],
    subtasks: [],
    dependencies: [],
    aiReasoning: 'Provides a showcase for recruiter reviews. Important but safe to execute during lower energy times.',
    energyRequired: 'medium',
    impactScore: 70
  },
  {
    id: 'task-7',
    title: 'Workout',
    description: 'Stay healthy and active. Gym session focusing on chest and triceps today.',
    priority: 'medium',
    category: 'Important_NotUrgent',
    dueDate: getRelativeISO(4, 7, 0),
    estimatedTime: '45m',
    estimatedMinutes: 45,
    actualMinutesSpent: 0,
    status: 'todo',
    tags: ['health', 'fitness'],
    subtasks: [],
    dependencies: [],
    aiReasoning: 'Crucial for physical health and mental clarity. Keeps focus scores optimized throughout the week.',
    energyRequired: 'high',
    impactScore: 78
  },
  {
    id: 'task-8',
    title: 'Read System Design Book',
    description: 'Read Chapter 4 & 5 of Designing Data-Intensive Applications (DDIA).',
    priority: 'medium',
    category: 'Important_NotUrgent',
    dueDate: getRelativeISO(5, 20, 30),
    estimatedTime: '1h 00m',
    estimatedMinutes: 60,
    actualMinutesSpent: 0,
    status: 'todo',
    tags: ['reading', 'education'],
    subtasks: [],
    dependencies: [],
    aiReasoning: 'Self-education habits built incrementally keep consistency scores high.',
    energyRequired: 'medium',
    impactScore: 65
  },
  {
    id: 'task-9',
    title: 'Email Follow-ups',
    description: 'Reply to pending recruitment and college project emails.',
    priority: 'low',
    category: 'Urgent_NotImportant',
    dueDate: getRelativeISO(0, 16, 0), // Today 4:00 PM
    estimatedTime: '30m',
    estimatedMinutes: 30,
    actualMinutesSpent: 30,
    status: 'completed',
    tags: ['work', 'admin'],
    subtasks: [],
    dependencies: [],
    aiReasoning: 'Needs timely response but is low cognitive overhead. Execute during post-lunch energy dip.',
    energyRequired: 'low',
    impactScore: 40
  },
  {
    id: 'task-10',
    title: 'College Group Updates',
    description: 'Check discord channel and send summary report of weekly progress.',
    priority: 'low',
    category: 'Urgent_NotImportant',
    dueDate: getRelativeISO(0, 18, 0), // Today 6:00 PM
    estimatedTime: '20m',
    estimatedMinutes: 20,
    actualMinutesSpent: 20,
    status: 'completed',
    tags: ['social', 'college'],
    subtasks: [],
    dependencies: [],
    aiReasoning: 'Low actual value, but communication is time-sensitive. Best automated or delegated if possible.',
    energyRequired: 'low',
    impactScore: 35
  },
  {
    id: 'task-11',
    title: 'Random Social Media',
    description: 'Browsing Instagram reels or Reddit feed.',
    priority: 'low',
    category: 'Neither',
    dueDate: '',
    estimatedTime: '1h 00m',
    estimatedMinutes: 60,
    actualMinutesSpent: 0,
    status: 'todo',
    tags: ['personal', 'social'],
    subtasks: [],
    dependencies: [],
    aiReasoning: 'Provides dopamine but delays primary deadlines. Recommended to lock or strictly limit.',
    energyRequired: 'low',
    impactScore: 5
  },
  {
    id: 'task-12',
    title: 'Unnecessary Browsing',
    description: 'Reading random articles, Wikipedia tabs, or tech specs.',
    priority: 'low',
    category: 'Neither',
    dueDate: '',
    estimatedTime: '30m',
    estimatedMinutes: 30,
    actualMinutesSpent: 0,
    status: 'todo',
    tags: ['personal'],
    subtasks: [],
    dependencies: [],
    aiReasoning: 'Typical procrastination mechanism. Redirect this energy back into system design learning.',
    energyRequired: 'low',
    impactScore: 10
  }
];

const initialHabits = (): Habit[] => [
  {
    id: 'habit-1',
    name: 'Reading',
    frequency: 'daily',
    streak: 16,
    history: {
      [getRelativeISO(-5).split('T')[0]]: true,
      [getRelativeISO(-4).split('T')[0]]: true,
      [getRelativeISO(-3).split('T')[0]]: true,
      [getRelativeISO(-2).split('T')[0]]: true,
      [getRelativeISO(-1).split('T')[0]]: true,
    }
  },
  {
    id: 'habit-2',
    name: 'Exercise',
    frequency: 'daily',
    streak: 8,
    history: {
      [getRelativeISO(-5).split('T')[0]]: true,
      [getRelativeISO(-4).split('T')[0]]: false,
      [getRelativeISO(-3).split('T')[0]]: true,
      [getRelativeISO(-2).split('T')[0]]: true,
      [getRelativeISO(-1).split('T')[0]]: true,
    }
  },
  {
    id: 'habit-3',
    name: 'Meditation',
    frequency: 'daily',
    streak: 4,
    history: {
      [getRelativeISO(-5).split('T')[0]]: false,
      [getRelativeISO(-4).split('T')[0]]: true,
      [getRelativeISO(-3).split('T')[0]]: true,
      [getRelativeISO(-2).split('T')[0]]: true,
      [getRelativeISO(-1).split('T')[0]]: true,
    }
  },
  {
    id: 'habit-4',
    name: 'Coding Practice',
    frequency: 'daily',
    streak: 22,
    history: {
      [getRelativeISO(-5).split('T')[0]]: true,
      [getRelativeISO(-4).split('T')[0]]: true,
      [getRelativeISO(-3).split('T')[0]]: true,
      [getRelativeISO(-2).split('T')[0]]: true,
      [getRelativeISO(-1).split('T')[0]]: true,
    }
  },
  {
    id: 'habit-5',
    name: 'Learning / Course',
    frequency: 'daily',
    streak: 12,
    history: {
      [getRelativeISO(-5).split('T')[0]]: true,
      [getRelativeISO(-4).split('T')[0]]: true,
      [getRelativeISO(-3).split('T')[0]]: false,
      [getRelativeISO(-2).split('T')[0]]: true,
      [getRelativeISO(-1).split('T')[0]]: true,
    }
  }
];

const initialGoals = (): Goal[] => [
  {
    id: 'goal-1',
    title: 'Crack Software Engineering Job Interview',
    category: 'Career',
    targetDate: getRelativeISO(60),
    progress: 60,
    milestones: [
      { id: 'mil-1-1', title: 'Complete DSA Roadmap (150 problems)', completed: true },
      { id: 'mil-1-2', title: 'Build and Deploy 3 Full-Stack projects', completed: true },
      { id: 'mil-1-3', title: 'Master System Design Fundamentals', completed: false },
      { id: 'mil-1-4', title: 'Practice 10 mock interviews', completed: false },
      { id: 'mil-1-5', title: 'Get resume reviewed by mentors', completed: false },
    ]
  },
  {
    id: 'goal-2',
    title: 'Achieve Peak Physical Fitness',
    category: 'Health',
    targetDate: getRelativeISO(90),
    progress: 40,
    milestones: [
      { id: 'mil-2-1', title: 'Gym consistency (4x a week for 1 month)', completed: true },
      { id: 'mil-2-2', title: 'Reduce body fat percentage by 3%', completed: false },
      { id: 'mil-2-3', title: 'Run a 10k under 55 minutes', completed: false },
    ]
  }
];

const initialFocusSessions = (): FocusSession[] => [
  { id: 'session-1', taskId: 'task-2', durationMinutes: 45, date: getRelativeISO(-2), focusScore: 85 },
  { id: 'session-2', taskId: 'task-2', durationMinutes: 45, date: getRelativeISO(-2), focusScore: 90 },
  { id: 'session-3', taskId: 'task-1', durationMinutes: 50, date: getRelativeISO(-1), focusScore: 80 },
  { id: 'session-4', taskId: 'task-2', durationMinutes: 60, date: getRelativeISO(-1), focusScore: 95 },
  { id: 'session-5', taskId: 'task-2', durationMinutes: 40, date: getTodayStr(), focusScore: 92 },
  { id: 'session-6', taskId: 'task-1', durationMinutes: 30, date: getTodayStr(), focusScore: 78 }
];

const initialScheduleBlocks = (): ScheduleBlock[] => [
  {
    id: 'block-1',
    taskId: '',
    title: 'Data Structures Class',
    type: 'study',
    startTime: '09:00',
    endTime: '09:45',
    durationMinutes: 45,
    date: getTodayStr(),
    color: '#8b5cf6'
  },
  {
    id: 'block-2',
    taskId: 'task-1',
    title: 'Deep Work: OS Assignment',
    type: 'deep_work',
    startTime: '10:00',
    endTime: '12:00',
    durationMinutes: 120,
    date: getTodayStr(),
    color: '#ef4444'
  },
  {
    id: 'block-3',
    taskId: '',
    title: 'Lunch Break & Relax',
    type: 'break',
    startTime: '12:30',
    endTime: '13:30',
    durationMinutes: 60,
    date: getTodayStr(),
    color: '#10b981'
  },
  {
    id: 'block-4',
    taskId: 'task-2',
    title: 'Interview Preparation',
    type: 'study',
    startTime: '14:00',
    endTime: '15:30',
    durationMinutes: 90,
    date: getTodayStr(),
    color: '#3b82f6'
  },
  {
    id: 'block-5',
    taskId: 'task-3',
    title: 'Project Work Session',
    type: 'deep_work',
    startTime: '16:00',
    endTime: '18:00',
    durationMinutes: 120,
    date: getTodayStr(),
    color: '#ec4899'
  },
  {
    id: 'block-6',
    taskId: 'task-7',
    title: 'Gym & Fitness Block',
    type: 'workout',
    startTime: '18:15',
    endTime: '19:15',
    durationMinutes: 60,
    date: getTodayStr(),
    color: '#f59e0b'
  },
  {
    id: 'block-7',
    taskId: 'task-8',
    title: 'Revise DBMS Notes',
    type: 'study',
    startTime: '20:00',
    endTime: '21:00',
    durationMinutes: 60,
    date: getTodayStr(),
    color: '#6366f1'
  }
];

const initialSuggestions: AISuggestion[] = [
  {
    id: 'sug-1',
    type: 'optimization',
    title: 'Morning Energy Alignment',
    description: 'You perform best in the morning! Your deep work session for OS Assignment is aligned with your peak productivity hours (10:00 AM - 12:00 PM). Keep it up.',
  },
  {
    id: 'sug-2',
    type: 'warning',
    title: 'High Workload Risk',
    description: 'Your schedule has 6 hours of high-cognitive tasks planned for today. There is a potential burnout indicator. Consider moving DBMS study block to tomorrow.',
    actionLabel: 'Reschedule Study Block',
    actionType: 'reorganize'
  },
  {
    id: 'sug-3',
    type: 'rescue',
    title: 'Overdue Task Threat',
    description: 'OS Assignment was scheduled to complete by 12:00 PM. AI suggests starting a Focus Session immediately to prevent missing the deadline.',
    actionLabel: 'Start OS Focus Session',
    actionType: 'start_focus'
  }
];

const initialNotifications = [
  'Welcome back! You currently have 40 free minutes in your schedule.',
  'Your OS Assignment task blocks 3 other subtasks. Complete Section 1 next.',
  'You are currently behind on today\'s scheduled OS Assignment.',
];

// Zustand Store interface
interface AppState {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  focusSessions: FocusSession[];
  scheduleBlocks: ScheduleBlock[];
  geminiApiKey: string;
  userSettings: UserSettings;
  activeTab: string;
  selectedTaskId: string | null;
  aiSuggestions: AISuggestion[];
  notifications: string[];
  currentFocusSession: {
    taskId?: string;
    isActive: boolean;
    timeRemaining: number;
    durationMinutes: number;
    focusScore: number;
    isBreak: boolean;
    streakCount: number;
  } | null;
  
  // Water and Sleep Tracking
  waterIntakeCups: number;
  sleepHoursYesterday: number;

  // Actions
  setGeminiApiKey: (key: string) => void;
  setActiveTab: (tab: string) => void;
  setSelectedTaskId: (id: string | null) => void;
  
  // Tasks CRUD
  addTask: (task: Omit<Task, 'id' | 'actualMinutesSpent' | 'status' | 'subtasks'> & { subtasks?: string[] }) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  
  // Habits CRUD
  addHabit: (name: string, frequency: 'daily' | 'weekly') => void;
  toggleHabitDate: (habitId: string, dateStr: string) => void;
  deleteHabit: (habitId: string) => void;
  
  // Goals CRUD
  addGoal: (goal: Omit<Goal, 'id' | 'progress'>) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  deleteGoal: (goalId: string) => void;

  // Schedule blocks
  setScheduleBlocks: (blocks: ScheduleBlock[]) => void;
  addScheduleBlock: (block: Omit<ScheduleBlock, 'id'>) => void;
  deleteScheduleBlock: (id: string) => void;

  // Focus Session management
  startFocusSession: (taskId?: string, duration?: number, isBreak?: boolean) => void;
  tickFocusSession: () => void;
  pauseFocusSession: () => void;
  endFocusSession: () => void;
  logFocusSession: (session: FocusSession) => void;

  // Settings
  updateUserSettings: (settings: Partial<UserSettings>) => void;

  // Analytics Logs & Reset
  incrementWater: () => void;
  setSleepHours: (hours: number) => void;
  addNotification: (message: string) => void;
  clearNotifications: () => void;
  dismissSuggestion: (id: string) => void;
  
  // Core AI Actions
  applyAISchedule: (newBlocks: ScheduleBlock[], newSuggestions?: AISuggestion[]) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: initialTasks(),
      habits: initialHabits(),
      goals: initialGoals(),
      focusSessions: initialFocusSessions(),
      scheduleBlocks: initialScheduleBlocks(),
      geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
      userSettings: defaultSettings,
      activeTab: 'dashboard',
      selectedTaskId: null,
      aiSuggestions: initialSuggestions,
      notifications: initialNotifications,
      currentFocusSession: null,
      waterIntakeCups: 4,
      sleepHoursYesterday: 7.5,

      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedTaskId: (id) => set({ selectedTaskId: id }),

      addTask: (taskData) => {
        const newTask: Task = {
          id: `task-${Date.now()}`,
          actualMinutesSpent: 0,
          status: 'todo',
          ...taskData,
          subtasks: taskData.subtasks?.map((title, idx) => ({
            id: `sub-${Date.now()}-${idx}`,
            title,
            completed: false
          })) || []
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
      })),

      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        selectedTaskId: state.selectedTaskId === taskId ? null : state.selectedTaskId
      })),

      toggleSubtask: (taskId, subtaskId) => set((state) => {
        const updatedTasks = state.tasks.map((task) => {
          if (task.id !== taskId) return task;
          const updatedSubtasks = task.subtasks.map((sub) => 
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          );
          
          // Recalculate progress/status based on subtasks
          const completedCount = updatedSubtasks.filter(s => s.completed).length;
          const hasUncompleted = updatedSubtasks.some(s => !s.completed);
          let newStatus = task.status;
          if (completedCount > 0 && hasUncompleted) {
            newStatus = 'in_progress';
          } else if (completedCount === updatedSubtasks.length && updatedSubtasks.length > 0) {
            newStatus = 'completed';
          }
          
          return {
            ...task,
            subtasks: updatedSubtasks,
            status: newStatus
          };
        });
        return { tasks: updatedTasks };
      }),

      addSubtask: (taskId, title) => set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id !== taskId) return task;
          return {
            ...task,
            subtasks: [...task.subtasks, { id: `sub-${Date.now()}`, title, completed: false }]
          };
        })
      })),

      addHabit: (name, frequency) => {
        const newHabit: Habit = {
          id: `habit-${Date.now()}`,
          name,
          frequency,
          streak: 0,
          history: {}
        };
        set((state) => ({ habits: [...state.habits, newHabit] }));
      },

      toggleHabitDate: (habitId, dateStr) => set((state) => {
        const updatedHabits = state.habits.map((habit) => {
          if (habit.id !== habitId) return habit;
          const history = { ...habit.history };
          const existed = !!history[dateStr];
          if (existed) {
            delete history[dateStr];
          } else {
            history[dateStr] = true;
          }
          
          // Calculate streak
          let streak = 0;
          const checkDate = new Date();
          while (true) {
            const dateKey = checkDate.toISOString().split('T')[0];
            if (history[dateKey]) {
              streak++;
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              break;
            }
          }

          return { ...habit, history, streak };
        });
        return { habits: updatedHabits };
      }),

      deleteHabit: (habitId) => set((state) => ({
        habits: state.habits.filter((h) => h.id !== habitId)
      })),

      addGoal: (goalData) => {
        const newGoal: Goal = {
          id: `goal-${Date.now()}`,
          progress: 0,
          ...goalData
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },

      updateGoal: (goalId, updates) => set((state) => ({
        goals: state.goals.map((g) => (g.id === goalId ? { ...g, ...updates } : g))
      })),

      toggleMilestone: (goalId, milestoneId) => set((state) => {
        const updatedGoals = state.goals.map((goal) => {
          if (goal.id !== goalId) return goal;
          const updatedMilestones = goal.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          const completedCount = updatedMilestones.filter(m => m.completed).length;
          const progress = Math.round((completedCount / updatedMilestones.length) * 100) || 0;
          return { ...goal, milestones: updatedMilestones, progress };
        });
        return { goals: updatedGoals };
      }),

      deleteGoal: (goalId) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== goalId)
      })),

      setScheduleBlocks: (blocks) => set({ scheduleBlocks: blocks }),

      addScheduleBlock: (blockData) => {
        const newBlock: ScheduleBlock = {
          id: `block-${Date.now()}`,
          ...blockData
        };
        set((state) => ({ scheduleBlocks: [...state.scheduleBlocks, newBlock] }));
      },

      deleteScheduleBlock: (id) => set((state) => ({
        scheduleBlocks: state.scheduleBlocks.filter((b) => b.id !== id)
      })),

      startFocusSession: (taskId, duration = 25, isBreak = false) => {
        set({
          currentFocusSession: {
            taskId,
            isActive: true,
            timeRemaining: duration * 60,
            durationMinutes: duration,
            focusScore: 90, // baseline
            isBreak,
            streakCount: isBreak ? 0 : 1
          }
        });
      },

      tickFocusSession: () => set((state) => {
        if (!state.currentFocusSession) return {};
        const timeRemaining = state.currentFocusSession.timeRemaining - 1;
        
        if (timeRemaining <= 0) {
          // Session is finished, log focus session
          const duration = state.currentFocusSession.durationMinutes;
          const taskId = state.currentFocusSession.taskId;
          const score = state.currentFocusSession.focusScore;
          
          if (!state.currentFocusSession.isBreak) {
            // Log it in background
            const newSession: FocusSession = {
              id: `session-${Date.now()}`,
              taskId,
              durationMinutes: duration,
              date: getTodayStr(),
              focusScore: score
            };

            // Increment actualMinutesSpent in the task
            let updatedTasks = state.tasks;
            if (taskId) {
              updatedTasks = state.tasks.map(t => 
                t.id === taskId 
                  ? { ...t, actualMinutesSpent: t.actualMinutesSpent + duration, status: 'in_progress' } 
                  : t
              );
            }

            // Create achievement notifications
            const note = `Completed a ${duration}m deep work session on ${taskId ? state.tasks.find(t => t.id === taskId)?.title : 'General Focus'}. Focus Score: ${score}%!`;
            
            return {
              tasks: updatedTasks,
              focusSessions: [...state.focusSessions, newSession],
              notifications: [note, ...state.notifications],
              currentFocusSession: null
            };
          }
          return { currentFocusSession: null };
        }
        
        return {
          currentFocusSession: {
            ...state.currentFocusSession,
            timeRemaining
          }
        };
      }),

      pauseFocusSession: () => set((state) => {
        if (!state.currentFocusSession) return {};
        return {
          currentFocusSession: {
            ...state.currentFocusSession,
            isActive: !state.currentFocusSession.isActive
          }
        };
      }),

      endFocusSession: () => set({ currentFocusSession: null }),

      logFocusSession: (session) => set((state) => ({
        focusSessions: [...state.focusSessions, session]
      })),

      updateUserSettings: (settings) => set((state) => ({
        userSettings: { ...state.userSettings, ...settings }
      })),

      incrementWater: () => set((state) => ({ waterIntakeCups: state.waterIntakeCups + 1 })),
      
      setSleepHours: (hours) => set({ sleepHoursYesterday: hours }),
      
      addNotification: (message) => set((state) => ({
        notifications: [message, ...state.notifications]
      })),

      clearNotifications: () => set({ notifications: [] }),
      
      dismissSuggestion: (id) => set((state) => ({
        aiSuggestions: state.aiSuggestions.filter(s => s.id !== id)
      })),

      applyAISchedule: (newBlocks, newSuggestions) => set((state) => ({
        scheduleBlocks: newBlocks.map((b, idx) => ({
          ...b,
          id: b.id || `block-ai-${Date.now()}-${idx}`
        })),
        aiSuggestions: newSuggestions ? newSuggestions : state.aiSuggestions,
        notifications: ['AI optimized your schedule blocks for maximum flow state!', ...state.notifications]
      }))
    }),
    {
      name: 'lifesaver-ai-store',
      partialize: (state) => ({
        tasks: state.tasks,
        habits: state.habits,
        goals: state.goals,
        focusSessions: state.focusSessions,
        scheduleBlocks: state.scheduleBlocks,
        geminiApiKey: state.geminiApiKey,
        userSettings: state.userSettings,
        waterIntakeCups: state.waterIntakeCups,
        sleepHoursYesterday: state.sleepHoursYesterday,
        notifications: state.notifications
      })
    }
  )
);
