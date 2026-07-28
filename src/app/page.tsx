import Link from "next/link";
import { listProjects, getStats } from "@/lib/queries";
import { getT } from "@/lib/i18n/server";
import ProjectCard from "@/components/ProjectCard";

export default async function Home() {
  const [projects, stats, { t }] = await Promise.all([
    listProjects(),
    getStats(),
    getT(),
  ]);

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col items-center gap-8 py-6 text-center">
        <span className="glass-pill rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-[var(--accent-solid)]">
          {t.home.heroEyebrow}
        </span>

        <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-[var(--text)] sm:text-5xl md:text-6xl">
          <span className="text-gradient">{t.home.heroTitle}</span>
        </h1>

        <p className="max-w-xl text-base text-[var(--text-muted)] sm:text-lg">
          {t.home.heroSubtitle}
        </p>

        <Link
          href="/projects/new"
          className="accent-gradient inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(109,94,247,0.4)] transition hover:brightness-110 active:scale-95"
        >
          {t.home.heroCta}
        </Link>

        <div className="glass-panel mt-2 flex flex-wrap items-center justify-center gap-6 rounded-full px-8 py-4 sm:gap-10">
          <Stat value={stats.projectCount} label={t.home.statsProjects} />
          <div className="h-8 w-px bg-[var(--glass-border)]" />
          <Stat value={stats.developerCount} label={t.home.statsDevelopers} />
          <div className="h-8 w-px bg-[var(--glass-border)]" />
          <Stat
            value={stats.avgRating.toFixed(1)}
            label={t.home.statsRating}
            suffix=" ★"
          />
        </div>
      </section>

      <section className="flex flex-col gap-5">
        {projects.length > 0 && (
          <h2 className="font-display text-xl font-semibold text-[var(--text)]">
            {t.home.recentHeading}
          </h2>
        )}

        {projects.length === 0 ? (
          <p className="glass-panel rounded-3xl px-6 py-16 text-center text-[var(--text-muted)]">
            {t.home.emptyState}
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} t={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  value,
  label,
  suffix = "",
}: {
  value: string | number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="font-display text-2xl font-bold text-[var(--text)] sm:text-3xl">
        {value}
        {suffix}
      </span>
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
    </div>
  );
}
