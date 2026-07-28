"use client";

import { useState, useTransition } from "react";
import { rateProject } from "@/app/actions";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-7 w-7 transition ${
        filled
          ? "fill-[var(--amber)] drop-shadow-[0_0_6px_rgba(245,165,36,0.6)]"
          : "fill-[var(--glass-hover)]"
      }`}
    >
      <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
    </svg>
  );
}

export default function StarRating({
  projectId,
  initialScore,
  canRate,
  locale,
}: {
  projectId: string;
  initialScore: number;
  canRate: boolean;
  locale: Locale;
}) {
  const t = getDictionary(locale);
  const [score, setScore] = useState(initialScore);
  const [hover, setHover] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const display = hover ?? score;

  if (!canRate) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} filled={n <= Math.round(display)} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex gap-1 ${isPending ? "opacity-60" : ""}`}
      onMouseLeave={() => setHover(null)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={t.project.rateAria(n)}
          disabled={isPending}
          onMouseEnter={() => setHover(n)}
          onClick={() => {
            setScore(n);
            startTransition(() => {
              rateProject(projectId, n);
            });
          }}
          className="transition hover:scale-110 active:scale-95"
        >
          <Star filled={n <= display} />
        </button>
      ))}
    </div>
  );
}
