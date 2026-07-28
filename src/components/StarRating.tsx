"use client";

import { useState, useTransition } from "react";
import { rateProject } from "@/app/actions";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-6 w-6 ${filled ? "fill-amber-400" : "fill-slate-200"}`}
    >
      <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
    </svg>
  );
}

export default function StarRating({
  projectId,
  initialScore,
  canRate,
}: {
  projectId: string;
  initialScore: number;
  canRate: boolean;
}) {
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
          aria-label={`${n} yulduz baholash`}
          disabled={isPending}
          onMouseEnter={() => setHover(n)}
          onClick={() => {
            setScore(n);
            startTransition(() => {
              rateProject(projectId, n);
            });
          }}
        >
          <Star filled={n <= display} />
        </button>
      ))}
    </div>
  );
}
