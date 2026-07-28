"use client";

import { useState, useTransition } from "react";
import { createProject } from "@/app/actions";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export default function NewProjectForm({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="glass-panel flex flex-col gap-5 rounded-3xl p-6"
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
              setError(t.form.errorGeneric);
            }
          }
        });
      }}
    >
      {error && (
        <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--text)]">
          {t.form.titleLabel}
        </label>
        <input
          name="title"
          required
          className="glass-input w-full rounded-xl px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
          placeholder={t.form.titlePlaceholder}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--text)]">
          {t.form.descriptionLabel}
        </label>
        <textarea
          name="description"
          required
          rows={5}
          className="glass-input w-full rounded-xl px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
          placeholder={t.form.descriptionPlaceholder}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text)]">
            {t.form.repoLabel}
          </label>
          <input
            name="repoUrl"
            type="url"
            className="glass-input w-full rounded-xl px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
            placeholder="https://github.com/..."
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text)]">
            {t.form.demoLabel}
          </label>
          <input
            name="liveUrl"
            type="url"
            className="glass-input w-full rounded-xl px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--text)]">
          {t.form.techLabel}
        </label>
        <input
          name="techStack"
          className="glass-input w-full rounded-xl px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
          placeholder={t.form.techPlaceholder}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--text)]">
          {t.form.coverLabel}
        </label>
        <input
          name="coverImage"
          type="file"
          accept="image/*"
          className="w-full text-sm text-[var(--text-muted)] file:mr-3 file:rounded-full file:border-0 file:px-3 file:py-2 file:text-sm file:font-medium file:text-[var(--accent-solid)]"
          style={{ colorScheme: "auto" }}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="accent-gradient rounded-full px-4 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(109,94,247,0.35)] transition hover:brightness-110 active:scale-95 disabled:opacity-60"
      >
        {isPending ? t.form.submitting : t.form.submit}
      </button>
    </form>
  );
}
