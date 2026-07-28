import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";

export async function getCurrentDbUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  const db = getDb();
  return db.query.users.findFirst({ where: eq(users.id, clerkUser.id) });
}

export async function requireDbUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Siz tizimga kirmagansiz");

  const db = getDb();
  const existing = await db.query.users.findFirst({
    where: eq(users.id, clerkUser.id),
  });
  if (existing) return existing;

  const baseUsername = (
    clerkUser.username ||
    clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] ||
    `dev-${clerkUser.id.slice(-8)}`
  ).toLowerCase().replace(/[^a-z0-9_-]/g, "");

  let username = baseUsername || `dev-${clerkUser.id.slice(-8)}`;
  let suffix = 0;
  while (
    await db.query.users.findFirst({ where: eq(users.username, username) })
  ) {
    suffix += 1;
    username = `${baseUsername}${suffix}`;
  }

  const name =
    clerkUser.fullName?.trim() ||
    clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] ||
    username;

  const [created] = await db
    .insert(users)
    .values({
      id: clerkUser.id,
      name,
      username,
      avatarUrl: clerkUser.imageUrl,
    })
    .onConflictDoNothing({ target: users.id })
    .returning();

  if (created) return created;

  const raced = await db.query.users.findFirst({
    where: eq(users.id, clerkUser.id),
  });
  if (!raced) throw new Error("Foydalanuvchini yaratib bo'lmadi");
  return raced;
}
