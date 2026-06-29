import { GoogleGenerativeAI } from '@google/generative-ai';
import { Task, ScheduleBlock, AISuggestion, TaskCategory, Habit, UserSettings } from '../types';
import { getTodayStr } from '../store/useStore';

// Function to helper-extract JSON content from markdown block safely
const extractJSON = (text: string) => {
  try {
    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (err) {
    console.error("Failed to parse JSON directly from Gemini text:", text, err);
    // Attempt regex extraction
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (nestedErr) {
        console.error("Regex JSON extraction also failed:", nestedErr);
      }
    }
    throw new Error("Invalid JSON structure returned by model");
  }
};

// Mock Response Engine when API key is missing or invalid
const getMockPlannerResponse = (text: string) => {
  const normalized = text.toLowerCase();
  const todayStr = getTodayStr();

  // Create list of extracted items
  const tasks: any[] = [];
  const scheduleBlocks: any[] = [];
  const suggestions: AISuggestion[] = [];

  if (normalized.includes('operating system') || normalized.includes('os')) {
    tasks.push({
      title: 'OS Assignment Submission',
      description: 'Extracted from your plan text: Study virtual memory and compiler components.',
      priority: 'high',
      category: 'Urgent_Important',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      estimatedTime: '2h 00m',
      estimatedMinutes: 120,
      tags: ['college', 'os'],
      subtasks: ['Read Chapter 8 & 9', 'Solve exercise problems', 'Submit PDF'],
      dependencies: [],
      energyRequired: 'high',
      impactScore: 92,
      aiReasoning: 'Operating System deadlines carry strict scoring and requires deep focus.'
    });

    scheduleBlocks.push({
      title: 'Study OS Virtual Memory',
      type: 'deep_work',
      startTime: '10:00',
      endTime: '12:00',
      durationMinutes: 120,
      date: todayStr,
      color: '#ef4444'
    });
  }

  if (normalized.includes('interview')) {
    tasks.push({
      title: 'Mock Interview Prep',
      description: 'Extracted from plan text: Review coding patterns and behavioral answers.',
      priority: 'high',
      category: 'Urgent_Important',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedTime: '3h 00m',
      estimatedMinutes: 180,
      tags: ['career', 'interview'],
      subtasks: ['Practice system design diagram', 'Review behavioral STAR responses'],
      dependencies: [],
      energyRequired: 'high',
      impactScore: 90,
      aiReasoning: 'Preparing for interviews has high immediate impact on your career roadmap.'
    });

    scheduleBlocks.push({
      title: 'Technical Interview Prep',
      type: 'study',
      startTime: '14:00',
      endTime: '15:30',
      durationMinutes: 90,
      date: todayStr,
      color: '#3b82f6'
    });
  }

  if (normalized.includes('exam') || normalized.includes('test')) {
    tasks.push({
      title: 'Revise Exam Materials',
      description: 'Practice sample papers and lecture slides.',
      priority: 'high',
      category: 'Urgent_Important',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedTime: '4h 00m',
      estimatedMinutes: 240,
      tags: ['study', 'exams'],
      subtasks: ['Review lecture formulas', 'Attempt past year papers'],
      dependencies: [],
      energyRequired: 'high',
      impactScore: 88,
      aiReasoning: 'Exam study blocks are best scheduled in active intervals throughout the week.'
    });

    scheduleBlocks.push({
      title: 'Exam Syllabus Practice',
      type: 'study',
      startTime: '16:00',
      endTime: '18:00',
      durationMinutes: 120,
      date: todayStr,
      color: '#6366f1'
    });
  }

  if (normalized.includes('gym') || normalized.includes('workout')) {
    scheduleBlocks.push({
      title: 'Gym Workout Session',
      type: 'workout',
      startTime: '18:30',
      endTime: '19:30',
      durationMinutes: 60,
      date: todayStr,
      color: '#f59e0b'
    });
  }

  // Fallback default tasks if nothing matched
  if (tasks.length === 0) {
    tasks.push({
      title: 'AI Scheduled Task',
      description: 'Extracted from natural text: ' + text.substring(0, 60) + '...',
      priority: 'medium',
      category: 'Important_NotUrgent',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      estimatedTime: '1h 30m',
      estimatedMinutes: 90,
      tags: ['ai-capture'],
      subtasks: ['Initial task planning', 'First milestones draft'],
      dependencies: [],
      energyRequired: 'medium',
      impactScore: 60,
      aiReasoning: 'AI created this task to represent your planned work based on text analysis.'
    });

    scheduleBlocks.push({
      title: 'AI Organized Focus Block',
      type: 'deep_work',
      startTime: '11:00',
      endTime: '12:30',
      durationMinutes: 90,
      date: todayStr,
      color: '#8b5cf6'
    });
  }

  // Always add some suggestions
  suggestions.push({
    id: `sug-${Date.now()}-1`,
    type: 'optimization',
    title: 'AI Workload Distribution',
    description: 'We grouped your topics into focused sprint blocks to prevent context-switching fatigue.'
  });

  suggestions.push({
    id: `sug-${Date.now()}-2`,
    type: 'encouragement',
    title: 'Flow-State Enabled',
    description: 'Your blocks are spaced with 15m transitions to maximize attention spans.'
  });

  return { tasks, scheduleBlocks, suggestions };
};

// Core Gemini Service Class
export const GeminiService = {
  // Initialize model helper
  getModel: (apiKey: string) => {
    if (!apiKey) return null;
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    } catch (e) {
      console.error("Failed to initialize GoogleGenerativeAI:", e);
      return null;
    }
  },

  // 1. Natural Language Planner
  parseWorkloadText: async (
    text: string,
    apiKey: string
  ): Promise<{
    tasks: any[];
    scheduleBlocks: any[];
    suggestions: AISuggestion[];
  }> => {
    const model = GeminiService.getModel(apiKey);
    if (!model) {
      // Return simulated mock response immediately
      return new Promise((resolve) => {
        setTimeout(() => resolve(getMockPlannerResponse(text)), 1000);
      });
    }

    const todayStr = getTodayStr();
    const prompt = `
You are LifeSaver AI, an elite executive assistant productivity system. 
The user describes their upcoming workload, commitments, goals, and schedule:
"${text}"

Current Today's Date: ${todayStr}

Tasks:
Analyze the input text and extract tasks. For each task, output a JSON structure:
- title: string
- description: string
- priority: "high" | "medium" | "low"
- category: "Urgent_Important" | "Important_NotUrgent" | "Urgent_NotImportant" | "Neither"
- dueDate: ISO string representing when it is due (relative to ${todayStr})
- estimatedTime: string (e.g. "2h 00m", "45m")
- estimatedMinutes: number
- tags: string[]
- subtasks: string[] (checklists to complete this task)
- dependencies: string[] (empty array)
- energyRequired: "high" | "medium" | "low"
- impactScore: number (1 to 100)
- aiReasoning: string (Explain why this task got its priority/category and how it fits their day)

ScheduleBlocks:
Construct a daily schedule for TODAY (${todayStr}) placing blocks around these tasks and activities (like class, workout, meals). Output JSON structure:
- title: string
- type: "deep_work" | "study" | "break" | "workout" | "buffer" | "routine"
- startTime: "HH:MM" 24h format
- endTime: "HH:MM" 24h format
- durationMinutes: number
- date: "${todayStr}"
- color: HEX color code string matching the item type (e.g. deep_work: red/purple, break: green, workout: orange, study: blue)

AISuggestions:
Generate 2-3 tailored scheduling/focus suggestions based on their text:
- type: "optimization" | "rescue" | "encouragement" | "warning"
- title: string
- description: string

Return ONLY a single valid JSON object containing exactly three keys: "tasks", "scheduleBlocks", "suggestions".
Do NOT write markdown conversational text, code comments, or trailing text. Return ONLY the JSON object.
`;

    try {
      const result = await model.generateContent(prompt);
      const resText = result.response.text();
      return extractJSON(resText);
    } catch (e) {
      console.error("Gemini API call failed in parseWorkloadText, falling back to mock:", e);
      return getMockPlannerResponse(text);
    }
  },

  // 2. Classify tasks into Eisenhower quadrants
  classifyTasksEisenhower: async (
    tasks: Task[],
    apiKey: string
  ): Promise<Record<string, { category: TaskCategory; reasoning: string }>> => {
    const model = GeminiService.getModel(apiKey);
    if (!model) {
      // Simulate categorization mock
      return new Promise((resolve) => {
        const classifications: Record<string, { category: TaskCategory; reasoning: string }> = {};
        tasks.forEach(t => {
          classifications[t.id] = {
            category: t.category,
            reasoning: t.aiReasoning || "This task categorization is optimized for work-life balance and long-term career growth."
          };
        });
        setTimeout(() => resolve(classifications), 500);
      });
    }

    const tasksBrief = tasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      dueDate: t.dueDate,
      currentCategory: t.category
    }));

    const prompt = `
Given the following user tasks:
${JSON.stringify(tasksBrief, null, 2)}

Classify each task into one of the four Eisenhower Matrix categories:
- "Urgent_Important": High immediacy, severe impact of delay.
- "Important_NotUrgent": Core goals, strategic, study blocks, health, relationships.
- "Urgent_NotImportant": Low value but time-sensitive (notifications, administrative, emails).
- "Neither": Wasteful, distraction, procrastination items.

For each task, provide the category and a concise 1-2 sentence AI Reasoning explaining exactly why it belongs there and the impact of completing or delaying it.

Return ONLY a JSON object where the keys are task IDs and the values are objects with:
{
  "category": "Urgent_Important" | "Important_NotUrgent" | "Urgent_NotImportant" | "Neither",
  "reasoning": "your explanation"
}
Return ONLY valid JSON. No markdown wrappings other than clean text.
`;

    try {
      const result = await model.generateContent(prompt);
      const resText = result.response.text();
      return extractJSON(resText);
    } catch (e) {
      console.error("Gemini Eisenhower classification failed, using mock:", e);
      const classifications: Record<string, { category: TaskCategory; reasoning: string }> = {};
      tasks.forEach(t => {
        classifications[t.id] = { category: t.category, reasoning: t.aiReasoning || "Optimized category classification." };
      });
      return classifications;
    }
  },

  // 3. AI Task Breakdown
  breakdownTask: async (
    title: string,
    description: string,
    apiKey: string
  ): Promise<{ subtasks: string[]; estimatedHours: number }> => {
    const model = GeminiService.getModel(apiKey);
    if (!model) {
      // Mock breakdown
      return new Promise((resolve) => {
        const mockSubtasks = [
          'Research core concepts and requirements',
          'Outline project files and database architecture',
          'Create component layouts and CSS styles',
          'Implement core backend integrations',
          'Test layouts, check for boundary errors',
          'Prepare slide decks and deploy'
        ];
        setTimeout(() => resolve({ subtasks: mockSubtasks, estimatedHours: 4.5 }), 800);
      });
    }

    const prompt = `
Break down the task "${title}" ("${description}") into 5 to 8 clear, actionable checklist subtasks for a student or developer.
Estimate the total time required in hours.

Return ONLY a JSON object containing:
{
  "subtasks": ["Subtask 1", "Subtask 2", ...],
  "estimatedHours": number
}
No other text.
`;

    try {
      const result = await model.generateContent(prompt);
      const resText = result.response.text();
      return extractJSON(resText);
    } catch (e) {
      console.error("Gemini breakdown failed, falling back to mock:", e);
      return {
        subtasks: ['Phase 1: Initial research', 'Phase 2: UI implementation', 'Phase 3: Logic configuration', 'Phase 4: Verification checks'],
        estimatedHours: 3.5
      };
    }
  },

  // 4. Deadline Rescue Mode
  generateRescuePlan: async (
    tasks: Task[],
    currentSchedule: ScheduleBlock[],
    apiKey: string
  ): Promise<{
    updatedSchedule: ScheduleBlock[];
    emergencyPlan: string;
    focusHoursRequired: number;
    recoveryProbability: number;
  }> => {
    const model = GeminiService.getModel(apiKey);
    const todayStr = getTodayStr();

    if (!model) {
      // Mock rescue plan
      return new Promise((resolve) => {
        // Find overdue or urgent tasks
        const urgentTasks = tasks.filter(t => t.category === 'Urgent_Important');
        const emergencyPlan = `AI Rescue activated! We detected ${urgentTasks.length} urgent tasks due soon. We have rescheduled lower priority tasks (like administrative emails and browsing) to tomorrow, and extended your current Deep Work block to give you undivided focus time. Take a 5-minute breathing break after each hour. You can do this!`;
        
        // Return updated schedule (reordered blocks)
        const updatedSchedule = currentSchedule.map(block => {
          if (block.type === 'study' || block.type === 'deep_work') {
            return { ...block, title: `🚨 RESCUE: ${block.title}` };
          }
          if (block.type === 'routine' || block.type === 'workout') {
            return { ...block, title: `💤 Postponed: ${block.title}`, durationMinutes: block.durationMinutes / 2 };
          }
          return block;
        });

        setTimeout(() => resolve({
          updatedSchedule,
          emergencyPlan,
          focusHoursRequired: 4.5,
          recoveryProbability: 88
        }), 1000);
      });
    }

    const prompt = `
You are the LifeSaver AI Productivity Coach. The user is in DEADLINE RESCUE MODE. They are overloaded with work and risk missing deadlines.
Current Tasks: ${JSON.stringify(tasks.map(t => ({ id: t.id, title: t.title, category: t.category, estimatedMinutes: t.estimatedMinutes, status: t.status, dueDate: t.dueDate })), null, 2)}
Current Schedule Blocks: ${JSON.stringify(currentSchedule, null, 2)}
Today's Date: ${todayStr}

Goal:
1. Revamp the schedule blocks for TODAY to prioritize Urgent & Important tasks.
2. Shorten or postpone low-importance tasks (e.g. routine, Neither, study blocks that are not urgent).
3. Create an emergency action plan text (2-3 sentences) explaining the shifts.
4. Calculate the required Focus Hours needed to finish these urgent tasks today.
5. Estimate a Recovery Probability percentage (1 to 100) based on their availability.

Return ONLY a JSON object containing:
{
  "updatedSchedule": [ Array of updated schedule blocks for today matching format of inputs ],
  "emergencyPlan": "string explaining how AI rescued the day",
  "focusHoursRequired": number,
  "recoveryProbability": number
}
No markdown text other than JSON.
`;

    try {
      const result = await model.generateContent(prompt);
      const resText = result.response.text();
      return extractJSON(resText);
    } catch (e) {
      console.error("Gemini rescue call failed, falling back to mock:", e);
      return {
        updatedSchedule: currentSchedule,
        emergencyPlan: 'System overloaded. Focus on your highest priority task (OS Assignment) first and disable notifications.',
        focusHoursRequired: 3.5,
        recoveryProbability: 75
      };
    }
  },

  // 5. Conversational Coach Chat
  chatWithCoach: async (
    message: string,
    history: { role: 'user' | 'model'; parts: { text: string }[] }[],
    context: { tasks: Task[]; habits: Habit[]; settings: UserSettings },
    apiKey: string
  ): Promise<string> => {
    const model = GeminiService.getModel(apiKey);
    const todayStr = getTodayStr();

    if (!model) {
      // Smart Mock replies based on message content and coach personality
      const msg = message.toLowerCase();
      const personality = context.settings.aiPreferences?.coachPersonality || 'analytical';
      const pendingList = context.tasks.filter(t => t.status !== 'completed');
      const urgentTask = context.tasks.find(t => t.category === 'Urgent_Important' && t.status !== 'completed');
      
      return new Promise((resolve) => {
        let baseReply = "";
        
        // Find if user asked about a task in their active task list
        const matchedTask = context.tasks.find(t => msg.includes(t.title.toLowerCase()));
        
        if (matchedTask) {
          baseReply = `Ah, you are asking about **${matchedTask.title}**. This task is currently categorized as **${matchedTask.category.replace('_', ' ')}** with an estimated duration of **${matchedTask.estimatedTime}**.\n\nLet's break this down into three simple steps:\n1. Open your notes and write a 1-sentence outline.\n2. Start a 25-minute Pomodoro timer in **Focus Mode**.\n3. Turn off your notifications. Shall we launch Focus Mode for this task?`;
        } else if (msg.includes('plan') || msg.includes('schedule') || msg.includes('agenda')) {
          baseReply = `Let's analyze your day. You have **${pendingList.length} pending tasks** in your backlog. Your highest impact priority is **${urgentTask ? urgentTask.title : 'General Focus'}**.\n\nI recommend starting with a 90-minute Deep Work session for this task. I have structured your timetable with optimized buffer periods to prevent fatigue. Let's execute!`;
        } else if (msg.includes('procrastinate') || msg.includes('focus') || msg.includes('lazy') || msg.includes('motivation')) {
          baseReply = `Procrastination is just decision fatigue. Your brain is trying to protect you from complex work. Let's bypass it. Focus on exactly ONE task, start a 25-minute Pomodoro block, and promise yourself you will work for just 10 minutes. Action precedes motivation. Let's do it!`;
        } else if (msg.includes('burnout') || msg.includes('tired') || msg.includes('stress') || msg.includes('exhausted')) {
          baseReply = `Warning: High fatigue indicators detected. Your streak is at **16 days**, but rest is a weapon. I suggest shortening your remaining deep work sessions by 20%, scheduling a **15-minute hydration break**, and turning off screen lights by 10:30 PM.`;
        } else if (msg.includes('code') || msg.includes('bug') || msg.includes('develop') || msg.includes('programming') || msg.includes('git') || msg.includes('error')) {
          baseReply = `Understood. Technical debugging requires structured analytical thinking. \n\n1. Isolate the error block.\n2. Write a minimal reproducible script.\n3. Avoid context-switching. I suggest starting a dedicated 45-minute deep focus block for your coding tasks.`;
        } else if (msg.includes('math') || msg.includes('calculate') || msg.includes('formula')) {
          baseReply = `Let's tackle this step-by-step. For mathematical/quantitative problems, solve simple sub-equations first before scaling to the full structure. If you need dedicated analysis, schedule a study block in the calendar.`;
        } else if (msg.includes('habit') || msg.includes('streak') || msg.includes('routine')) {
          baseReply = `Your longest streak is **22 days (Coding Practice)** and your current habit logs show strong consistency. Building habits is about making the cue obvious and the friction low. What habit are you working on next?`;
        } else if (msg.includes('goal') || msg.includes('milestone') || msg.includes('target')) {
          baseReply = `You have **2 strategic goals** in progress. Your interview preparation goal is at **60% progress**. Focusing on completing 2 milestones this week will advance this by another 15%. Let's review the sub-milestones.`;
        } else if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
          baseReply = `Hello, Arjun! I am ready to guide you. You have **${pendingList.length} active tasks** to conquer. How can I help you plan, debug, or optimize your workload today?`;
        } else {
          baseReply = `Interesting query! Let's connect that back to your productivity strategy. I recommend breaking this issue down into actionable items. What specific milestone or task does this relate to? Let's write it down and schedule it.`;
        }

        // Apply personality wrap
        let personalizedReply = "";
        switch (personality) {
          case 'strict':
            personalizedReply = `😠 **[Coach Major - Strict Mode]**\n\n${baseReply.replace("Let's", "You must").replace("I recommend", "I demand").replace("got this", "will execute without excuses")}\n\n*Execute now. Zero distractions allowed.*`;
            break;
          case 'nurturing':
            personalizedReply = `🌸 **[Coach Lily - Nurturing Mode]**\n\nHello dear! ${baseReply}\n\n*Remember to drink a warm cup of tea and take care of yourself!*`;
            break;
          case 'humorous':
            personalizedReply = `🎭 **[Coach Jester - Humorous Mode]**\n\nBEEP BOOP! ${baseReply}\n\n*Fun fact: Putting off tasks is the leading cause of "staring-blankly-at-fridge" syndrome. Let's beat it!*`;
            break;
          case 'analytical':
          default:
            personalizedReply = `📊 **[Coach ADA - Analytical Mode]**\n\n**Data Analysis Output:**\n${baseReply}\n\n*Productivity Rating: 94%. Cognitive Load: Balanced.*`;
            break;
        }

        setTimeout(() => resolve(personalizedReply), 600);
      });
    }

    const activeTasks = context.tasks.filter(t => t.status !== 'completed').map(t => ({ title: t.title, category: t.category, estimatedTime: t.estimatedTime }));
    const activeHabits = context.habits.map(h => ({ name: h.name, streak: h.streak }));

    const systemInstruction = `
You are LifeSaver AI, an elite productivity coach and executive assistant.
You do NOT act like a simple conversational chatbot. You are a coaching partner that is motivating, analytical, clear, and direct.
Current User Context:
- User Name: ${context.settings.name}
- Working Hours: ${context.settings.workingHoursStart} to ${context.settings.workingHoursEnd}
- Sleep Schedule: ${context.settings.sleepWindowStart} to ${context.settings.sleepWindowEnd}
- Coach Personality: ${context.settings.aiPreferences.coachPersonality}
- Current Active Tasks: ${JSON.stringify(activeTasks)}
- Active Habits: ${JSON.stringify(activeHabits)}
- Today's Date: ${todayStr}

Keep replies concise, structured, and action-oriented. Use bold markdown for key actions. Emphasize what they should do RIGHT NOW. Provide reasoning based on their schedule.
`;

    try {
      const chat = model.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 500,
        },
      });
      const contentPrompt = `${systemInstruction}\n\nUser message: ${message}`;
      const result = await chat.sendMessage(contentPrompt);
      return result.response.text();
    } catch (e) {
      console.error("Gemini Chat failed, using mock:", e);
      return "I encountered a connection error, but as your coach, my advice remains: focus on your **OS Assignment** immediately to avoid breaking your streak!";
    }
  }
};
