"use client";
import { useThemeStore } from "../stores/themeStorage";
import { useEffect } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.style.setProperty("--bg-color", isDark ? "#1a202c" : "#ffffff");
    root.style.setProperty("--text-color", isDark ? "#ffffff" : "#1a202c");
  }, [isDark]);

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full p-1 transition-all duration-500 bg-gray-200 dark:bg-gray-700 focus:outline-none"
    >
      <div className="absolute inset-0 flex items-center justify-between px-1.5">
        <SunIcon className="h-5 w-5 text-gray-600" />
        <MoonIcon className="h-5 w-5 text-gray-600" />
      </div>

      <div
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          isDark ? "translate-x-8" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <MoonIcon className="h-4 w-4 mx-auto mt-1 text-gray-600" />
        ) : (
          <SunIcon className="h-4 w-4 mx-auto mt-1 text-gray-600" />
        )}
      </div>
    </button>
  );
};
