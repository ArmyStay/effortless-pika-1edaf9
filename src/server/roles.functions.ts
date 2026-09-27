import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import {
  listRoles,
  getRoleBySlug,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from './roles.server.js'

const RoleInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  hook: z.string().min(1, 'Hook is required'),
  description: z.string().min(1, 'Description is required'),
  tasks: z.array(z.string()).min(1, 'At least one task is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  roadmap: z.array(z.string()).min(1, 'At least one roadmap step is required'),
  brollTags: z.array(z.string()).default([]),
  cta: z.string().min(1, 'CTA is required'),
})

export const getRoles = createServerFn({ method: 'GET' }).handler(async () => {
  return listRoles()
})

export const getRole = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    return getRoleBySlug(data.slug)
  })

export const getRoleForEdit = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    return getRoleById(data.id)
  })

export const createRoleFn = createServerFn({ method: 'POST' })
  .inputValidator(RoleInputSchema)
  .handler(async ({ data }) => {
    return createRole(data)
  })

export const updateRoleFn = createServerFn({ method: 'POST' })
  .inputValidator(RoleInputSchema.extend({ id: z.number() }))
  .handler(async ({ data }) => {
    const { id, ...rest } = data
    return updateRole(id, rest)
  })

export const deleteRoleFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    return deleteRole(data.id)
  })
