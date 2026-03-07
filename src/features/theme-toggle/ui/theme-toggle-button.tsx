"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/shared/config/theme/theme-provider";

export function ThemeToggleButton() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <button
        className="hover-jolt hover-outline-scan rounded-sm border border-line p-2 text-text sm:p-2.5"
        type="button"
        aria-label="Переключить тему"
        onClick={toggleTheme}
      >
        <Moon className="theme-icon-flicker" size={17} />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      className="hover-jolt hover-outline-scan rounded-sm border border-line p-2 text-text sm:p-2.5"
      type="button"
      aria-label={isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
      onClick={toggleTheme}
    >
      <Icon className="theme-icon-flicker" size={17} />
    </button>
  );
}
