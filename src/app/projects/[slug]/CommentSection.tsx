"use client";

import { useRef, useState, useTransition } from "react";
import { addComment, deleteComment } from "@/app/actions";
import type { CommentItem } from "@/lib/queries";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

function timeAgo(iso: string, t: Dictionary) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return t.time.now;
  if (mins < 60) return t.time.minutesAgo(mins);
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t.time.hoursAgo(hours);
  const days = Math.floor(hours / 24);
  return t.time.daysAgo(days);
}

export default function CommentSection({
  projectId,
  projectSlug,
  comments,
  currentUserId,
  isSignedIn,
  locale,
}: {
  projectId: string;
  projectSlug: string;
  comments: CommentItem[];
  currentUserId: string | null;
  isSignedIn: boolean;
  locale: Locale;
}) {
  const t = getDictionary(locale);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg font-semibold text-[var(--text)]">
        {t.comments.title(comments.length)}
      </h2>

      {isSignedIn ? (
        <form
          ref={formRef}
          className="glass-panel flex flex-col gap-3 rounded-2xl p-4"
          action={(formData) => {
            const body = String(formData.get("body") || "");
            setError(null);
            startTransition(async () => {
              try {
                await addComment(projectId, body);
                formRef.current?.reset();
              } catch (e) {
                setError(e instanceof Error ? e.message : t.form.errorGeneric);
              }
            });
          }}
        >
          <textarea
            name="body"
            required
            rows={3}
            placeholder={t.comments.placeholder}
            className="glass-input w-full rounded-xl px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="accent-gradient self-start rounded-full px-4 py-2 text-sm font-medium text-white shadow-[0_4px_14px_rgba(109,94,247,0.35)] transition hover:brightness-110 active:scale-95 disabled:opacity-60"
          >
            {isPending ? t.comments.submitting : t.comments.submit}
          </button>
        </form>
      ) : (
        <p className="glass-panel rounded-2xl px-4 py-3 text-sm text-[var(--text-muted)]">
          {t.comments.signInPrompt}
        </p>
      )}

      {comments.length === 0 ? (
        <p className="text-center text-sm text-[var(--text-muted)] py-6">
          {t.comments.empty}
        </p>
      ) : (
        <ul className="mt-2 flex flex-col gap-4">
          {comments.map((comment) => (
            <li key={comment.id} className="glass-panel rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text)]">
                  {comment.authorName}
                </span>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <span>{timeAgo(comment.createdAt, t)}</span>
                  {currentUserId === comment.authorId && (
                    <form
                      action={() => {
                        startTransition(() => {
                          deleteComment(comment.id, projectSlug);
                        });
                      }}
                    >
                      <button
                        type="submit"
                        className="text-red-500 hover:underline"
                      >
                        {t.comments.delete}
                      </button>
                    </form>
                  )}
                </div>
              </div>
              <p className="mt-1.5 whitespace-pre-wrap text-sm text-[var(--text)]">
                {comment.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
