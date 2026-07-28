"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { locales, localeLabels, type Locale } from "@/lib/i18n/config";
import { setLocale } from "@/lib/i18n/actions";

const shortLabel: Record<Locale, string> = { uz: "UZ", en: "EN", ru: "RU" };

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="glass-pill flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-[var(--text)] transition hover:scale-105 active:scale-95 disabled:opacity-60"
      >
        {shortLabel[locale]}
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 opacity-60">
          <path
            d="M5 7.5l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="glass-panel absolute right-0 top-11 z-50 w-40 overflow-hidden rounded-2xl p-1">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setOpen(false);
                startTransition(async () => {
                  await setLocale(l);
                  router.refresh();
                });
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-[var(--glass-hover)] ${
                l === locale ? "text-[var(--accent-solid)] font-semibold" : "text-[var(--text)]"
              }`}
            >
              {localeLabels[l]}
              {l === locale && <span>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
