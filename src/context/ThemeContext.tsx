"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  const applyTheme = (t: Theme) => {
    setTheme(t);
    if (typeof window !== "undefined") {
      localStorage.setItem("ss-theme", t);
      document.documentElement.setAttribute("data-theme", t);
      document.body.setAttribute("data-theme", t);

      // Directly update CSS Custom Properties on :root DOM element for zero-latency theme switching
      const rootStyle = document.documentElement.style;
      if (t === "light") {
        rootStyle.setProperty("--background", "#F6F4EE");
        rootStyle.setProperty("--surface", "#FFFFFF");
        rootStyle.setProperty("--surface-2", "#EBE7DF");
        rootStyle.setProperty("--text-primary", "#181512");
        rootStyle.setProperty("--text-secondary", "#5C554E");
        rootStyle.setProperty("--accent", "#9A7B2C");
        rootStyle.setProperty("--accent-hover", "#7A5F1C");
        rootStyle.setProperty("--border-color", "rgba(24, 21, 18, 0.15)");
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        document.body.classList.add("light");
        document.body.classList.remove("dark");
      } else {
        rootStyle.setProperty("--background", "#0D0B08");
        rootStyle.setProperty("--surface", "#141210");
        rootStyle.setProperty("--surface-2", "#1C1915");
        rootStyle.setProperty("--text-primary", "#F2EDE4");
        rootStyle.setProperty("--text-secondary", "#A09890");
        rootStyle.setProperty("--accent", "#C9A84C");
        rootStyle.setProperty("--accent-hover", "#D8B85C");
        rootStyle.setProperty("--border-color", "rgba(242, 237, 228, 0.12)");
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        document.body.classList.add("dark");
        document.body.classList.remove("light");
      }
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("ss-theme") as Theme | null;
    if (savedTheme === "light" || savedTheme === "dark") {
      applyTheme(savedTheme);
    } else {
      applyTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
