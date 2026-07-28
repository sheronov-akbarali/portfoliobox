import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { ratings } from "@/db/schema";
import { getProjectBySlug, listComments } from "@/lib/queries";
import { getCurrentDbUser } from "@/lib/user";
import { getT } from "@/lib/i18n/server";
import StarRating from "@/components/StarRating";
import LiquidRatingMeter from "@/components/LiquidRatingMeter";
import CommentSection from "./CommentSection";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [comments, currentUser, { locale, t }] = await Promise.all([
    listComments(project.id),
    getCurrentDbUser(),
    getT(),
  ]);

  let myScore = 0;
  if (currentUser) {
    const db = getDb();
    const mine = await db.query.ratings.findFirst({
      where: and(
        eq(ratings.projectId, project.id),
        eq(ratings.userId, currentUser.id)
      ),
    });
    myScore = mine?.score ?? 0;
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div>
        <div className="glass-panel relative mb-6 h-56 w-full overflow-hidden rounded-3xl sm:h-72">
          {project.coverImageUrl ? (
            <Image
              src={project.coverImageUrl}
              alt={project.title}
              fill
              className="object-cover"
              sizes="768px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--text-muted)]">
              {t.card.noImage}
            </div>
          )}
        </div>

        <h1 className="font-display text-3xl font-bold text-[var(--text)] sm:text-4xl">
          {project.title}
        </h1>
        <div className="mt-2 flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <span>
            {t.project.author}:{" "}
            <span className="font-medium text-[var(--text)]">
              {project.authorName}
            </span>
          </span>
        </div>

        {project.techStack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full px-2.5 py-1 font-mono text-xs font-medium text-[var(--accent-solid)]"
                style={{ background: "var(--glass-hover)" }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <p className="mt-5 whitespace-pre-wrap leading-relaxed text-[var(--text)]">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {project.repoUrl && (
            <Link
              href={project.repoUrl}
              target="_blank"
              className="glass-pill inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:scale-105 active:scale-95"
            >
              {t.project.viewRepo}
            </Link>
          )}
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              className="accent-gradient inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white shadow-[0_4px_14px_rgba(109,94,247,0.35)] transition hover:brightness-110 active:scale-95"
            >
              {t.project.viewDemo}
            </Link>
          )}
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="text-sm text-[var(--text-muted)]">{t.project.avgRating}</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="font-display text-2xl font-bold text-[var(--text)]">
                {project.avgRating.toFixed(1)}
              </span>
              <LiquidRatingMeter score={project.avgRating} />
            </div>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {t.project.ratingsCount(project.ratingCount)}
            </p>
          </div>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <span className="text-xs text-[var(--text-muted)]">
              {currentUser ? t.project.yourRating : t.project.signInToRate}
            </span>
            <StarRating
              projectId={project.id}
              initialScore={myScore}
              canRate={Boolean(currentUser)}
              locale={locale}
            />
          </div>
        </div>
      </div>

      <CommentSection
        projectId={project.id}
        projectSlug={project.slug}
        comments={comments}
        currentUserId={currentUser?.id ?? null}
        isSignedIn={Boolean(currentUser)}
        locale={locale}
      />
    </div>
  );
}
