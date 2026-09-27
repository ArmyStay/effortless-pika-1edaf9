import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { RoleForm, fromFormValues, toFormValues } from '../../components/RoleForm'
import { createRoleFn } from '../../server/roles.functions'

export const Route = createFileRoute('/roles/new')({
  component: NewRole,
})

function NewRole() {
  const navigate = useNavigate()
  const createFn = useServerFn(createRoleFn)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--amber)]">
        New role
      </p>
      <h1 className="mb-8 font-display text-4xl font-semibold text-[var(--paper)]">
        Add a hidden career
      </h1>
      <RoleForm
        initial={toFormValues()}
        submitLabel="Create role"
        pending={pending}
        error={error}
        onSubmit={async (values) => {
          setPending(true)
          setError(null)
          try {
            const role = await createFn({ data: fromFormValues(values) })
            navigate({ to: '/roles/$slug/storyboard', params: { slug: role.slug } })
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to create role')
            setPending(false)
          }
        }}
      />
    </div>
  )
}
