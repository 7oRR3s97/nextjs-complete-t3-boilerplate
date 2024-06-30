import { relations } from "drizzle-orm";
import { serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { users } from "./auth";

export const posts = pgTable("post", {
  id: serial("id").primaryKey(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("name", { length: 256 }).notNull(),
  content: varchar("content", { length: 256 }).notNull(),
  coverImageUrl: varchar("cover_image_url", { length: 256 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
