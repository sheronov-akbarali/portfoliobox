"use client";

import { useState, useTransition } from "react";
import { createProject } from "@/app/actions";

export default function NewProjectForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6"
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          try {
            await createProject(formData);
          } catch (e) {
            if (e instanceof Error && e.message !== "NEXT_REDIRECT") {
              setError(e.message);
            } else if (
              typeof e === "object" &&
              e !== null &&
              "digest" in e &&
              String((e as { digest?: unknown }).digest).startsWith(
                "NEXT_REDIRECT"
              )
            ) {
              throw e;
            } else {
              setError("Xatolik yuz berdi, qayta urinib koʻring");
            }
          }
        });
      }}
    >
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Loyiha nomi
        </label>
        <input
          name="title"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Masalan: TaskFlow — vazifalarni boshqarish"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Tavsif
        </label>
        <textarea
          name="description"
          required
          rows={5}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Loyiha nima qiladi, qanday muammoni yechadi..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            GitHub havolasi
          </label>
          <input
            name="repoUrl"
            type="url"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="https://github.com/..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Demo havolasi
          </label>
          <input
            name="liveUrl"
            type="url"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Texnologiyalar (vergul bilan ajrating)
        </label>
        <input
          name="techStack"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Next.js, TypeScript, Postgres"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Muqova rasmi
        </label>
        <input
          name="coverImage"
          type="file"
          accept="image/*"
          className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition disabled:opacity-60"
      >
        {isPending ? "Joylanmoqda..." : "Loyihani joylash"}
      </button>
    </form>
  );
}
