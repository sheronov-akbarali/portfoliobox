import Link from "next/link";
import Image from "next/image";
import type { ProjectListItem } from "@/lib/queries";

export default function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:border-indigo-200 transition"
    >
      <div className="relative h-40 w-full bg-slate-100">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400 text-sm">
            Rasm yoʻq
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1">
          {project.title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2">
          {project.description}
        </p>

        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-sm text-slate-500">
          <span className="min-w-0 truncate">{project.authorName}</span>
          <div className="flex shrink-0 items-center gap-3">
            <span className="flex items-center gap-1 whitespace-nowrap">
              ⭐ {project.avgRating.toFixed(1)}
              <span className="text-slate-400">({project.ratingCount})</span>
            </span>
            <span className="whitespace-nowrap">💬 {project.commentCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
