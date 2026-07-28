import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { ratings } from "@/db/schema";
import { getProjectBySlug, listComments } from "@/lib/queries";
import { getCurrentDbUser } from "@/lib/user";
import StarRating from "@/components/StarRating";
import CommentSection from "./CommentSection";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [comments, currentUser] = await Promise.all([
    listComments(project.id),
    getCurrentDbUser(),
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
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div>
        <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-100 mb-6">
          {project.coverImageUrl ? (
            <Image
              src={project.coverImageUrl}
              alt={project.title}
              fill
              className="object-cover"
              sizes="768px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              Rasm yoʻq
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <span>
            Muallif:{" "}
            <span className="font-medium text-slate-700">
              {project.authorName}
            </span>
          </span>
        </div>

        {project.techStack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <p className="mt-5 whitespace-pre-wrap text-slate-700 leading-relaxed">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {project.repoUrl && (
            <Link
              href={project.repoUrl}
              target="_blank"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              GitHub
            </Link>
          )}
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition"
            >
              Demo koʻrish
            </Link>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Oʻrtacha baho</p>
            <p className="text-2xl font-bold text-slate-900">
              {project.avgRating.toFixed(1)}{" "}
              <span className="text-sm font-normal text-slate-500">
                ({project.ratingCount} ta baho)
              </span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-slate-500">
              {currentUser ? "Sizning bahoyingiz" : "Baholash uchun kiring"}
            </span>
            <StarRating
              projectId={project.id}
              initialScore={myScore}
              canRate={Boolean(currentUser)}
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
      />
    </div>
  );
}
