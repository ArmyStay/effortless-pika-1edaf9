import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { RoleForm, fromFormValues, toFormValues } from '../../components/RoleForm'
import { getRoleForEdit, updateRoleFn, deleteRoleFn } from '../../server/roles.functions'

export const Route = createFileRoute('/roles/$id/edit')({
  loader: async ({ params }) => {
    const role = await getRoleForEdit({ data: { id: Number(params.id) } })
    if (!role) throw new Error('Role not found')
    return { role }
  },
  component: EditRole,
})

function EditRole() {
  const { role } = Route.useLoaderData()
  const navigate = useNavigate()
  const updateFn = useServerFn(updateRoleFn)
  const deleteFn = useServerFn(deleteRoleFn)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--amber)]">
        Editing
      </p>
      <h1 className="mb-8 font-display text-4xl font-semibold text-[var(--paper)]">
        {role.title}
      </h1>
      <RoleForm
        initial={toFormValues(role)}
        submitLabel="Save changes"
        pending={pending}
        error={error}
        onSubmit={async (values) => {
          setPending(true)
          setError(null)
          try {
            const updated = await updateFn({ data: { id: role.id, ...fromFormValues(values) } })
            navigate({ to: '/roles/$slug/storyboard', params: { slug: updated.slug } })
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to save role')
            setPending(false)
          }
        }}
      />
      <button
        type="button"
        onClick={async () => {
          if (!confirm(`Delete "${role.title}"? This cannot be undone.`)) return
          await deleteFn({ data: { id: role.id } })
          navigate({ to: '/' })
        }}
        className="mt-8 text-xs text-red-400/70 underline-offset-4 hover:text-red-400 hover:underline"
      >
        Delete this role
      </button>
    </div>
  )
}
