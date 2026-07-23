"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroSequence({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<"loading" | "reveal" | "exit" | "done">("loading");
  const [statusTextIndex, setStatusTextIndex] = useState(0);

  const statusMessages = [
    "Reading the shelf...",
    "Calibrating Kirana inventory...",
    "Loading StockSaathi...",
  ];

  useEffect(() => {
    // 1. Check if user prefers reduced motion or has already seen intro in this session
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasSeenIntro = sessionStorage.getItem("stocksaathi_intro_played");

    if (isReducedMotion || hasSeenIntro) {
      setPhase("done");
      if (onComplete) onComplete();
      return;
    }

    // 2. Cycle status messages during Phase 1
    const textInterval = setInterval(() => {
      setStatusTextIndex((prev) => (prev + 1) % statusMessages.length);
    }, 500);

    // Phase 1 timer (~1.5s) -> Transition to Phase 2 (Reveal)
    const phase1Timer = setTimeout(() => {
      clearInterval(textInterval);
      setPhase("reveal");
    }, 1500);

    // Phase 2 timer (~0.7s) -> Transition to Phase 3 (Exit animation)
    const phase2Timer = setTimeout(() => {
      setPhase("exit");
    }, 2400);

    // Phase 3 timer (~0.6s) -> Finish intro, store session flag
    const phase3Timer = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("stocksaathi_intro_played", "true");
      if (onComplete) onComplete();
    }, 3000);

    return () => {
      clearInterval(textInterval);
      clearTimeout(phase1Timer);
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro-container"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base text-text-primary pointer-events-none select-none"
      >
        {/* Phase 1: Minimal Thin Loading Line + Status */}
        {phase === "loading" && (
          <motion.div
            key="phase1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6 max-w-xs w-full px-6"
          >
            {/* Slim filling progress bar */}
            <div className="w-full h-[2px] bg-surface-2 overflow-hidden rounded-full border-hairline">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-accent"
              />
            </div>
            
            <p className="text-xs tracking-widest uppercase text-text-secondary font-mono">
              {statusMessages[statusTextIndex]}
            </p>
          </motion.div>
        )}

        {/* Phase 2 & 3: Wordmark Reveal */}
        {(phase === "reveal" || phase === "exit") && (
          <motion.div
            key="phase2"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight"
          >
            <span className="text-text-primary">Stock</span>
            <span className="text-accent ml-1">Saathi</span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
