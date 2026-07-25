"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/src/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showText?: boolean;
}

export default function ThemeToggle({ className = "", showText = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-8 h-8 rounded-sm border border-accent/20 bg-surface-2 animate-pulse ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-sm border border-accent/30 bg-surface-2 text-accent hover:text-accent-hover hover:border-accent font-mono text-xs font-bold transition-all active:scale-95 cursor-pointer ${className}`}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-4 h-4 text-accent shrink-0" />
          {showText && <span>LIGHT MODE</span>}
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-accent shrink-0" />
          {showText && <span>DARK MODE</span>}
        </>
      )}
    </button>
  );
}
