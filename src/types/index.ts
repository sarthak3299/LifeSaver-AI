export type PriorityLevel = 'high' | 'medium' | 'low';
export type TaskCategory = 'Urgent_Important' | 'Important_NotUrgent' | 'Urgent_NotImportant' | 'Neither';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedHours?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  category: TaskCategory;
  dueDate: string;          // ISO string e.g. "2026-06-29T10:00:00.000Z"
  estimatedTime: string;    // e.g. "2h 30m"
  estimatedMinutes: number;
  actualMinutesSpent: number;
  status: 'todo' | 'in_progress' | 'completed';
  tags: string[];
  notes?: string;
  subtasks: SubTask[];
  dependencies: string[];   // Array of task IDs that block this task
  aiReasoning?: string;     // Why the AI categorized it this way
  energyRequired?: 'high' | 'medium' | 'low';
  impactScore?: number;     // 1-100
}

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  history: Record<string, boolean>; // e.g. { "2026-06-29": true }
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  targetDate: string;
  progress: number; // percentage
  milestones: { id: string; title: string; completed: boolean }[];
}

export interface FocusSession {
  id: string;
  taskId?: string;
  durationMinutes: number;
  date: string;
  focusScore: number;
}

export interface ScheduleBlock {
  id: string;
  taskId?: string;
  title: string;
  type: 'deep_work' | 'study' | 'break' | 'workout' | 'buffer' | 'routine';
  startTime: string; // "HH:MM" e.g. "09:00"
  endTime: string;   // "HH:MM" e.g. "10:30"
  durationMinutes: number;
  date: string;      // "YYYY-MM-DD"
  color?: string;
}

export interface UserSettings {
  name: string;
  workingHoursStart: string; // "09:00"
  workingHoursEnd: string;   // "18:00"
  focusGoalMinutes: number;  // daily target focus minutes, e.g. 240
  sleepWindowStart: string;  // "23:00"
  sleepWindowEnd: string;    // "07:00"
  theme: 'dark' | 'light' | 'glass';
  aiPreferences: {
    coachPersonality: 'strict' | 'nurturing' | 'analytical' | 'humorous';
    autoScheduleEnabled: boolean;
    rescueModeThresholdMinutes: number; // threshold in minutes before auto rescue
  };
}

export interface AISuggestion {
  id: string;
  type: 'optimization' | 'rescue' | 'encouragement' | 'warning';
  title: string;
  description: string;
  actionLabel?: string;
  actionType?: string; // e.g. 'rescue', 'start_focus', 'reorganize'
}
