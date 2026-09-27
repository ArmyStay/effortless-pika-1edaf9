import { createFileRoute, Link } from '@tanstack/react-router'
import { getRoles } from '../server/roles.functions'

export const Route = createFileRoute('/')({
  loader: async () => {
    const roles = await getRoles()
    return { roles }
  },
  component: Home,
})

function Home() {
  const { roles } = Route.useLoaderData()

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--amber)]">
            Role library
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-[var(--paper)] sm:text-5xl">
            Careers nobody puts on a career-day poster.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--paper)]/60">
            Pick a role to storyboard its 45-second Short, or open the full
            roadmap you'd send to someone who comments on it.
          </p>
        </div>

        {roles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role, i) => (
              <RoleCard key={role.id} role={role} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RoleCard({
  role,
  index,
}: {
  role: { id: number; slug: string; title: string; hook: string; skills: string[] }
  index: number
}) {
  return (
    <div
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--panel)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--amber-dim)]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
        style={{ background: 'var(--amber)' }}
      />
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--amber-dim)]">
          Role {String(index + 1).padStart(2, '0')}
        </p>
        <h2 className="font-display text-2xl font-semibold text-[var(--paper)]">
          {role.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--paper)]/60">
          {role.hook}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {role.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-[var(--rule)] px-2 py-0.5 text-[10px] text-[var(--paper)]/50"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3 text-xs">
        <Link
          to="/roles/$slug/storyboard"
          params={{ slug: role.slug }}
          className="rounded-full bg-[var(--amber)] px-3 py-1.5 font-medium text-[var(--ink)] transition-colors hover:bg-[var(--lime)]"
        >
          Storyboard →
        </Link>
        <Link
          to="/roles/$slug/roadmap"
          params={{ slug: role.slug }}
          className="text-[var(--paper)]/60 underline-offset-4 transition-colors hover:text-[var(--amber)] hover:underline"
        >
          Full roadmap
        </Link>
        <Link
          to="/roles/$id/edit"
          params={{ id: String(role.id) }}
          className="ml-auto text-[var(--paper)]/40 transition-colors hover:text-[var(--paper)]"
        >
          Edit
        </Link>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--rule)] p-14 text-center">
      <p className="font-display text-2xl text-[var(--paper)]">No roles yet.</p>
      <p className="mt-2 text-sm text-[var(--paper)]/50">
        Roles seed automatically on first load — refresh, or{' '}
        <Link to="/roles/new" className="text-[var(--amber)] underline">
          create one manually
        </Link>
        .
      </p>
    </div>
  )
}
