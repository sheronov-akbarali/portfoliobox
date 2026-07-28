"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="glass-pill flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--text)] transition hover:scale-105 active:scale-95"
    >
      {mounted ? (
        isDark ? (
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
            <path
              d="M12 3v2M12 19v2M5 5l1.4 1.4M17.6 17.6L19 19M3 12h2M19 12h2M5 19l1.4-1.4M17.6 6.4L19 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
            <path
              d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"
              fill="currentColor"
            />
          </svg>
        )
      ) : (
        <span className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
