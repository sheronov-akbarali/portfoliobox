"use client";

import { useRef, useState, useTransition } from "react";
import { addComment, deleteComment } from "@/app/actions";
import type { CommentItem } from "@/lib/queries";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "hozir";
  if (mins < 60) return `${mins} daqiqa oldin`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} soat oldin`;
  const days = Math.floor(hours / 24);
  return `${days} kun oldin`;
}

export default function CommentSection({
  projectId,
  projectSlug,
  comments,
  currentUserId,
  isSignedIn,
}: {
  projectId: string;
  projectSlug: string;
  comments: CommentItem[];
  currentUserId: string | null;
  isSignedIn: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Izohlar ({comments.length})
      </h2>

      {isSignedIn ? (
        <form
          ref={formRef}
          className="flex flex-col gap-2"
          action={(formData) => {
            const body = String(formData.get("body") || "");
            setError(null);
            startTransition(async () => {
              try {
                await addComment(projectId, body);
                formRef.current?.reset();
              } catch (e) {
                setError(
                  e instanceof Error ? e.message : "Xatolik yuz berdi"
                );
              }
            });
          }}
        >
          <textarea
            name="body"
            required
            rows={3}
            placeholder="Loyiha haqida fikringizni yozing..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="self-start rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition disabled:opacity-60"
          >
            {isPending ? "Yuborilmoqda..." : "Izoh qoldirish"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-slate-500">
          Izoh qoldirish uchun tizimga kiring.
        </p>
      )}

      <ul className="flex flex-col gap-4 mt-2">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-slate-800">
                {comment.authorName}
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{timeAgo(comment.createdAt)}</span>
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
                      oʻchirish
                    </button>
                  </form>
                )}
              </div>
            </div>
            <p className="mt-1.5 text-sm text-slate-700 whitespace-pre-wrap">
              {comment.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
