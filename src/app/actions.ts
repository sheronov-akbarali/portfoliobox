"use server";

import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { getDb } from "@/db";
import { comments, projects, ratings } from "@/db/schema";
import { requireDbUser } from "@/lib/user";
import { slugify } from "@/lib/slug";

export async function createProject(formData: FormData) {
  const user = await requireDbUser();
  const db = getDb();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const repoUrl = String(formData.get("repoUrl") || "").trim();
  const liveUrl = String(formData.get("liveUrl") || "").trim();
  const techStackRaw = String(formData.get("techStack") || "").trim();
  const coverImage = formData.get("coverImage");

  if (!title || !description) {
    throw new Error("Sarlavha va tavsif majburiy");
  }

  const techStack = techStackRaw
    ? techStackRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  let coverImageUrl: string | null = null;
  if (coverImage instanceof File && coverImage.size > 0) {
    const blob = await put(
      `projects/${Date.now()}-${coverImage.name}`,
      coverImage,
      { access: "public" }
    );
    coverImageUrl = blob.url;
  }

  const base = slugify(title) || "loyiha";
  let slug = base;
  let suffix = 0;
  while (
    await db.query.projects.findFirst({ where: eq(projects.slug, slug) })
  ) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  await db.insert(projects).values({
    authorId: user.id,
    title,
    slug,
    description,
    repoUrl: repoUrl || null,
    liveUrl: liveUrl || null,
    coverImageUrl,
    techStack,
  });

  revalidatePath("/");
  redirect(`/projects/${slug}`);
}

export async function rateProject(projectId: string, score: number) {
  if (score < 1 || score > 5) throw new Error("Noto'g'ri baho");
  const user = await requireDbUser();
  const db = getDb();

  await db
    .insert(ratings)
    .values({ projectId, userId: user.id, score })
    .onConflictDoUpdate({
      target: [ratings.projectId, ratings.userId],
      set: { score },
    });

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });
  if (project) revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/");
}

export async function addComment(projectId: string, body: string) {
  const text = body.trim();
  if (!text) throw new Error("Izoh bo'sh bo'lishi mumkin emas");
  const user = await requireDbUser();
  const db = getDb();

  await db.insert(comments).values({
    projectId,
    authorId: user.id,
    body: text,
  });

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });
  if (project) revalidatePath(`/projects/${project.slug}`);
}

export async function deleteComment(commentId: string, projectSlug: string) {
  const user = await requireDbUser();
  const db = getDb();
  await db
    .delete(comments)
    .where(and(eq(comments.id, commentId), eq(comments.authorId, user.id)));
  revalidatePath(`/projects/${projectSlug}`);
}
