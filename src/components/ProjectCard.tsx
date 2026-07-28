import Link from "next/link";
import Image from "next/image";
import type { ProjectListItem } from "@/lib/queries";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import LiquidRatingMeter from "./LiquidRatingMeter";

export default function ProjectCard({
  project,
  t,
}: {
  project: ProjectListItem;
  t: Dictionary;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="glass-panel group flex flex-col overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(109,94,247,0.25)]"
    >
      <div className="relative h-40 w-full overflow-hidden bg-[var(--glass-hover)]">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={project.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
            {t.card.noImage}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display font-semibold text-[var(--text)] group-hover:text-[var(--accent-solid)] transition line-clamp-1">
          {project.title}
        </h3>
        <p className="text-sm text-[var(--text-muted)] line-clamp-2">
          {project.description}
        </p>

        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full px-2 py-0.5 font-mono text-[11px] font-medium text-[var(--accent-solid)]"
                style={{ background: "var(--glass-hover)" }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-sm text-[var(--text-muted)]">
          <span className="min-w-0 truncate">{project.authorName}</span>
          <div className="flex shrink-0 items-center gap-2.5">
            <LiquidRatingMeter score={project.avgRating} size="sm" />
            <span className="whitespace-nowrap font-mono text-xs">
              {project.avgRating.toFixed(1)}
            </span>
            <span className="whitespace-nowrap font-mono text-xs">
              💬 {project.commentCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
