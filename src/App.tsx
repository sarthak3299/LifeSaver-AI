import { useEffect, useState, useRef } from 'react';
import { Layout } from './components/Layout';
import { useStore } from './store/useStore';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Planner } from './pages/Planner';
import { PriorityMatrix } from './pages/PriorityMatrix';
import { Calendar } from './pages/Calendar';
import { FocusMode } from './pages/FocusMode';
import { GoalsHabits } from './pages/GoalsHabits';
import { Analytics } from './pages/Analytics';
import { AIAssistant } from './pages/AIAssistant';
import { Settings } from './pages/Settings';
import { TaskDetailPanel } from './components/TaskDetailPanel';

import { VoiceTaskCapture } from './pages/VoiceTaskCapture';
import { TaskBreakdown } from './pages/TaskBreakdown';
import { DeadlineRescue } from './pages/DeadlineRescue';
import { NextBestActionView } from './pages/NextBestActionView';

function App() {
  const { activeTab, currentFocusSession, tickFocusSession, tasks } = useStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const completedCountRef = useRef(tasks.filter(t => t.status === 'completed').length);

  // Monitor task completions to trigger celebration confetti
  useEffect(() => {
    const currentCompleted = tasks.filter(t => t.status === 'completed').length;
    if (currentCompleted > completedCountRef.current) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3800);
      completedCountRef.current = currentCompleted;
      return () => clearTimeout(timer);
    } else {
      completedCountRef.current = currentCompleted;
    }
  }, [tasks]);

  // Run the focus Pomodoro timer tick globally
  useEffect(() => {
    let intervalId: any = null;
    if (currentFocusSession && currentFocusSession.isActive) {
      intervalId = setInterval(() => {
        tickFocusSession();
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentFocusSession, tickFocusSession]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <Tasks />;
      case 'planner':
        return <Planner />;
      case 'matrix':
        return <PriorityMatrix />;
      case 'calendar':
        return <Calendar />;
      case 'goals_habits':
        return <GoalsHabits />;
      case 'focus':
        return <FocusMode />;
      case 'voice_capture':
        return <VoiceTaskCapture />;
      case 'task_breakdown':
        return <TaskBreakdown />;
      case 'deadline_rescue':
        return <DeadlineRescue />;
      case 'next_best_action':
        return <NextBestActionView />;
      case 'analytics':
        return <Analytics />;
      case 'assistant':
        return <AIAssistant />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const renderConfetti = () => {
    if (!showConfetti) return null;
    const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#f43f5e', '#a855f7'];
    
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {Array.from({ length: 45 }).map((_, i) => {
          const color = colors[i % colors.length];
          const left = `${Math.random() * 100}%`;
          const size = `${Math.random() * 10 + 6}px`;
          const isCircle = Math.random() > 0.5;
          const delay = `${Math.random() * 0.6}s`;
          const isSlow = Math.random() > 0.5;
          const duration = isSlow ? 'animate-confetti-slow' : 'animate-confetti-fast';
          
          return (
            <div
              key={i}
              className={`fixed pointer-events-none ${duration}`}
              style={{
                left,
                top: '-20px',
                width: size,
                height: size,
                backgroundColor: color,
                borderRadius: isCircle ? '50%' : '2px',
                animationDelay: delay,
                boxShadow: `0 0 10px ${color}50`
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <Layout>
      {renderConfetti()}
      {renderActivePage()}
      <TaskDetailPanel />
    </Layout>
  );
}

export default App;
