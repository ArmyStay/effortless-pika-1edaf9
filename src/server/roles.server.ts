import { eq, asc } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { roles, type NewRole } from '../../db/schema.js'
import { seedRoles } from '../lib/seedRoles.js'

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Keep the built-in catalog present without overwriting user-edited records. */
export async function ensureSeeded() {
  await db.insert(roles).values(seedRoles).onConflictDoNothing({ target: roles.slug })
}

export async function listRoles() {
  await ensureSeeded()
  return db.select().from(roles).orderBy(asc(roles.title))
}

export async function getRoleBySlug(slug: string) {
  await ensureSeeded()
  const result = await db.select().from(roles).where(eq(roles.slug, slug))
  return result[0] ?? null
}

export async function getRoleById(id: number) {
  const result = await db.select().from(roles).where(eq(roles.id, id))
  return result[0] ?? null
}

export type RoleInput = {
  title: string
  hook: string
  description: string
  tasks: string[]
  skills: string[]
  roadmap: string[]
  brollTags: string[]
  cta: string
}

export async function createRole(input: RoleInput) {
  const baseSlug = slugify(input.title)
  let slug = baseSlug
  let n = 1
  // avoid slug collisions
  while (await getRoleBySlug(slug)) {
    slug = `${baseSlug}-${++n}`
  }
  const values: NewRole = { ...input, slug }
  const [created] = await db.insert(roles).values(values).returning()
  return created
}

export async function updateRole(id: number, input: RoleInput) {
  const [updated] = await db
    .update(roles)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(roles.id, id))
    .returning()
  return updated
}

export async function deleteRole(id: number) {
  await db.delete(roles).where(eq(roles.id, id))
  return { success: true }
}
