import "server-only";
import { sql } from "drizzle-orm";
import { getDb } from "@/db";

export type ProjectListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string | null;
  techStack: string[];
  createdAt: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatarUrl: string | null;
  avgRating: number;
  ratingCount: number;
  commentCount: number;
};

export async function listProjects(): Promise<ProjectListItem[]> {
  const db = getDb();
  const result = await db.execute(sql`
    select
      p.id,
      p.slug,
      p.title,
      p.description,
      p.cover_image_url as "coverImageUrl",
      p.tech_stack as "techStack",
      p.created_at as "createdAt",
      u.id as "authorId",
      u.name as "authorName",
      u.username as "authorUsername",
      u.avatar_url as "authorAvatarUrl",
      coalesce(avg(r.score), 0)::float as "avgRating",
      count(distinct r.id)::int as "ratingCount",
      count(distinct c.id)::int as "commentCount"
    from projects p
    join users u on u.id = p.author_id
    left join ratings r on r.project_id = p.id
    left join comments c on c.project_id = p.id
    group by p.id, u.id
    order by p.created_at desc
  `);
  return result.rows as unknown as ProjectListItem[];
}

export type ProjectDetail = ProjectListItem & {
  repoUrl: string | null;
  liveUrl: string | null;
};

export async function getProjectBySlug(
  slug: string
): Promise<ProjectDetail | null> {
  const db = getDb();
  const result = await db.execute(sql`
    select
      p.id,
      p.slug,
      p.title,
      p.description,
      p.repo_url as "repoUrl",
      p.live_url as "liveUrl",
      p.cover_image_url as "coverImageUrl",
      p.tech_stack as "techStack",
      p.created_at as "createdAt",
      u.id as "authorId",
      u.name as "authorName",
      u.username as "authorUsername",
      u.avatar_url as "authorAvatarUrl",
      coalesce(avg(r.score), 0)::float as "avgRating",
      count(distinct r.id)::int as "ratingCount",
      count(distinct c.id)::int as "commentCount"
    from projects p
    join users u on u.id = p.author_id
    left join ratings r on r.project_id = p.id
    left join comments c on c.project_id = p.id
    where p.slug = ${slug}
    group by p.id, u.id
  `);
  return (result.rows[0] as unknown as ProjectDetail) ?? null;
}

export type PlatformStats = {
  projectCount: number;
  developerCount: number;
  avgRating: number;
};

export async function getStats(): Promise<PlatformStats> {
  const db = getDb();
  const result = await db.execute(sql`
    select
      (select count(*)::int from projects) as "projectCount",
      (select count(*)::int from users) as "developerCount",
      (select coalesce(avg(score), 0)::float from ratings) as "avgRating"
  `);
  return result.rows[0] as unknown as PlatformStats;
}

export type CommentItem = {
  id: string;
  body: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatarUrl: string | null;
};

export async function listComments(projectId: string): Promise<CommentItem[]> {
  const db = getDb();
  const result = await db.execute(sql`
    select
      c.id,
      c.body,
      c.created_at as "createdAt",
      u.id as "authorId",
      u.name as "authorName",
      u.username as "authorUsername",
      u.avatar_url as "authorAvatarUrl"
    from comments c
    join users u on u.id = c.author_id
    where c.project_id = ${projectId}
    order by c.created_at desc
  `);
  return result.rows as unknown as CommentItem[];
}
