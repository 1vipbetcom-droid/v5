import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Crown } from "lucide-react";
import { sound } from "../utils/audio";

interface TableEntryTransitionProps {
  isOpen: boolean;
  tableName: string;
  tableIcon?: string;
  onComplete?: () => void;
}

export const TableEntryTransition: React.FC<TableEntryTransitionProps> = ({
  isOpen,
  tableName,
  tableIcon = "🎯",
  onComplete,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playButtonClick();
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 850);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onComplete]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="table-door-transition"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }}
          className="fixed inset-0 z-[180] pointer-events-none flex items-center justify-center overflow-hidden [perspective:1200px]"
        >
          {/* Backdrop Blur-In Overlay */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{
              opacity: [0, 0.95, 0.95, 0],
              backdropFilter: ["blur(0px)", "blur(20px)", "blur(28px)", "blur(0px)"],
            }}
            transition={{ duration: 0.85, times: [0, 0.25, 0.75, 1], ease: "easeInOut" }}
            className="absolute inset-0 bg-neutral-950/80 z-0 pointer-events-none"
          />

          {/* Central Golden Ray Flash */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{
              opacity: [0, 0.95, 1, 0],
              scaleY: [0, 1.3, 1.8, 2.2],
              scaleX: [0.1, 0.5, 2.0, 3.5],
            }}
            transition={{ duration: 0.85, ease: "easeInOut" }}
            className="absolute inset-y-0 w-36 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent blur-3xl z-20"
          />

          {/* Left Door Panel */}
          <motion.div
            initial={{ x: "0%", rotateY: 0 }}
            animate={{ x: "-105%", rotateY: -70 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="w-1/2 h-full bg-gradient-to-r from-[#05080e] via-[#0a0f18] to-[#111726] border-r-2 border-amber-500/70 shadow-[25px_0_60px_rgba(0,0,0,0.95)] flex flex-col items-end justify-center pr-4 sm:pr-8 relative origin-left z-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.18),_transparent_70%)] pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-1 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.9)]" />

            <div className="flex flex-col items-center gap-2 opacity-90 scale-90 sm:scale-100 mr-2 sm:mr-6">
              <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                <span className="text-2xl sm:text-4xl font-black">🐉</span>
              </div>
              <span className="text-[10px] sm:text-xs font-black tracking-[0.3em] text-red-400 uppercase font-mono">
                DRAGON
              </span>
            </div>
          </motion.div>

          {/* Right Door Panel */}
          <motion.div
            initial={{ x: "0%", rotateY: 0 }}
            animate={{ x: "105%", rotateY: 70 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="w-1/2 h-full bg-gradient-to-l from-[#05080e] via-[#0a0f18] to-[#111726] border-l-2 border-amber-500/70 shadow-[-25px_0_60px_rgba(0,0,0,0.95)] flex flex-col items-start justify-center pl-4 sm:pl-8 relative origin-right z-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_70%)] pointer-events-none" />
            <div className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.9)]" />

            <div className="flex flex-col items-center gap-2 opacity-90 scale-90 sm:scale-100 ml-2 sm:ml-6">
              <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                <span className="text-2xl sm:text-4xl font-black">🐅</span>
              </div>
              <span className="text-[10px] sm:text-xs font-black tracking-[0.3em] text-amber-400 uppercase font-mono">
                TIGER
              </span>
            </div>
          </motion.div>

          {/* Central Table Name Badge with Scale-Up Animation & Blur-In */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0, filter: "blur(12px)" }}
            animate={{
              scale: [0.2, 1.35, 1.05, 1.4],
              opacity: [0, 1, 1, 0],
              filter: ["blur(12px)", "blur(0px)", "blur(0px)", "blur(10px)"],
            }}
            transition={{ duration: 0.85, times: [0, 0.35, 0.7, 1], ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-30 flex flex-col items-center justify-center text-center px-4"
          >
            <div className="px-6 py-3.5 rounded-3xl bg-neutral-950/95 border-2 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.8)] backdrop-blur-2xl flex items-center gap-3.5 transform-gpu">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-2xl shadow-inner">
                {tableIcon}
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>ENTERING ARENA</span>
                  <Crown className="w-3 h-3 text-amber-300 ml-1" />
                </div>
                <div className="text-base sm:text-lg font-black text-white tracking-wider uppercase font-mono drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]">
                  {tableName} TABLE
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
