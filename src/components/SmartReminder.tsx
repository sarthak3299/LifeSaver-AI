import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Lightbulb, X, Sparkles, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const SmartReminder: React.FC = () => {
  const { notifications, clearNotifications } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (notifications.length === 0) return null;

  const currentNotification = notifications[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % notifications.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + notifications.length) % notifications.length);
  };

  const handleDismiss = () => {
    const updated = notifications.filter((_, idx) => idx !== currentIndex);
    useStore.setState({ notifications: updated });
    if (currentIndex >= updated.length && updated.length > 0) {
      setCurrentIndex(updated.length - 1);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4 }}
        className="mb-6 relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-950/40 via-indigo-950/40 to-slate-900/40 backdrop-blur-xl p-4 shadow-[0_4px_20px_rgba(139,92,246,0.1)]"
      >
        {/* Glow effect */}
        <div className="absolute -left-10 -top-10 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 shrink-0">
              {currentNotification.toLowerCase().includes('behind') || currentNotification.toLowerCase().includes('risk') ? (
                <AlertCircle className="w-5 h-5 text-rose-400" />
              ) : (
                <Lightbulb className="w-5 h-5 animate-pulse" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-violet-400 tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Smart Reminder Center
              </span>
              <p className="text-sm text-slate-200 mt-0.5 leading-relaxed font-medium">
                {currentNotification}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {notifications.length > 1 && (
              <div className="flex items-center bg-slate-900/60 border border-slate-800 rounded-xl px-2 py-1 gap-1 text-[11px] text-slate-400">
                <button
                  onClick={handlePrev}
                  className="p-0.5 rounded hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                  title="Previous Alert"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 font-bold select-none text-slate-300">
                  {currentIndex + 1} / {notifications.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-0.5 rounded hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                  title="Next Alert"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg bg-slate-800/20 hover:bg-slate-800/60 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
              title="Dismiss Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
