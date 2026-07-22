"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggle: () => {},
  setTheme: () => {},
});

/** Resolve theme: localStorage → system preference → dark */
function resolveInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("melanoscan-theme");
  if (saved === "light" || saved === "dark") return saved;
  // Detect system preference
  if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  // Sync state with DOM on mount
  useEffect(() => {
    const initial = resolveInitialTheme();
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  // Listen for system preference changes (if no manual override)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only follow system if user hasn't manually toggled
      if (!localStorage.getItem("melanoscan-theme")) {
        const next: Theme = e.matches ? "light" : "dark";
        setThemeState(next);
        applyTheme(next);
      }
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    localStorage.setItem("melanoscan-theme", t);
  };

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
