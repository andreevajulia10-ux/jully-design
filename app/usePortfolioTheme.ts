"use client";

import { useEffect, useSyncExternalStore } from "react";

const THEME_STORAGE_KEY = "jully-portfolio-theme";
const THEME_EVENT = "jully-portfolio-theme-change";

function subscribeToTheme(onThemeChange: () => void) {
  window.addEventListener("storage", onThemeChange);
  window.addEventListener(THEME_EVENT, onThemeChange);

  return () => {
    window.removeEventListener("storage", onThemeChange);
    window.removeEventListener(THEME_EVENT, onThemeChange);
  };
}

function getThemeSnapshot() {
  return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark"
    ? "dark"
    : "light";
}

function getServerThemeSnapshot() {
  return "light";
}

export function usePortfolioTheme() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const dark = theme === "dark";

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, dark ? "light" : "dark");
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return { dark, toggleTheme };
}
