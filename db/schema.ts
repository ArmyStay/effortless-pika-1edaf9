import { pgTable, serial, text, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const roles = pgTable('roles', {
  id: serial().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  hook: text('hook').notNull(),
  description: text('description').notNull(),
  tasks: jsonb('tasks').$type<string[]>().notNull().default([]),
  skills: jsonb('skills').$type<string[]>().notNull().default([]),
  roadmap: jsonb('roadmap').$type<string[]>().notNull().default([]),
  brollTags: jsonb('broll_tags').$type<string[]>().notNull().default([]),
  cta: text('cta').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Role = typeof roles.$inferSelect
export type NewRole = typeof roles.$inferInsert
