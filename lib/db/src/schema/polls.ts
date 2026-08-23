import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pollsTable = pgTable("polls", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pollOptionsTable = pgTable("poll_options", {
  id: serial("id").primaryKey(),
  pollId: integer("poll_id").notNull().references(() => pollsTable.id),
  text: text("text").notNull(),
  votes: integer("votes").notNull().default(0),
});

export const insertPollSchema = createInsertSchema(pollsTable).omit({ id: true, createdAt: true });
export const insertPollOptionSchema = createInsertSchema(pollOptionsTable).omit({ id: true });

export type InsertPoll = z.infer<typeof insertPollSchema>;
export type Poll = typeof pollsTable.$inferSelect;
export type PollOption = typeof pollOptionsTable.$inferSelect;
