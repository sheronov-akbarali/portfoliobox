import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  smallint,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user id
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    repoUrl: text("repo_url"),
    liveUrl: text("live_url"),
    coverImageUrl: text("cover_image_url"),
    techStack: text("tech_stack").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("projects_author_idx").on(table.authorId)]
);

export const ratings = pgTable(
  "ratings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    score: smallint("score").notNull(), // 1-5
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("ratings_project_user_unique").on(table.projectId, table.userId),
    index("ratings_project_idx").on(table.projectId),
  ]
);

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("comments_project_idx").on(table.projectId)]
);

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  ratings: many(ratings),
  comments: many(comments),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  author: one(users, { fields: [projects.authorId], references: [users.id] }),
  ratings: many(ratings),
  comments: many(comments),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  project: one(projects, { fields: [ratings.projectId], references: [projects.id] }),
  user: one(users, { fields: [ratings.userId], references: [users.id] }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  project: one(projects, { fields: [comments.projectId], references: [projects.id] }),
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
}));
