import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getRole } from '../../server/roles.functions'
import { StoryboardPlayer } from '../../components/StoryboardPlayer'
import { generateScript } from '../../lib/scriptGenerator'

export const Route = createFileRoute('/roles/$slug/storyboard')({
  loader: async ({ params }) => {
    const role = await getRole({ data: { slug: params.slug } })
    if (!role) throw notFound()
    return { role }
  },
  component: StoryboardPage,
})

function StoryboardPage() {
  const { role } = Route.useLoaderData()
  const script = generateScript(role)

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[var(--amber)]">
            Storyboard preview
          </p>
          <h1 className="font-display text-4xl font-semibold text-[var(--paper)]">
            {role.title}
          </h1>
        </div>
        <div className="flex gap-3 text-xs">
          <Link
            to="/roles/$slug/roadmap"
            params={{ slug: role.slug }}
            className="rounded-full border border-[var(--rule)] px-4 py-2 text-[var(--paper)]/70 hover:text-[var(--paper)]"
          >
            View full roadmap
          </Link>
          <Link
            to="/roles/$id/edit"
            params={{ id: String(role.id) }}
            className="rounded-full border border-[var(--rule)] px-4 py-2 text-[var(--paper)]/70 hover:text-[var(--paper)]"
          >
            Edit role
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr]">
        <StoryboardPlayer role={role} />

        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--amber)]">
            Narration script
          </p>
          <pre className="whitespace-pre-wrap rounded-2xl border border-[var(--rule)] bg-[var(--panel)] p-6 font-mono text-[12px] leading-relaxed text-[var(--paper)]/80">
            {script}
          </pre>
          <p className="mt-4 text-[11px] leading-relaxed text-[var(--paper)]/40">
            This is the plain-text narration script — the MVP stand-in for the
            PRD's TTS "voice.txt" step. No audio is generated in this app; see
            AGENTS.md for why the FFmpeg/TTS render pipeline is deferred to a
            future persistent-worker phase.
          </p>
        </div>
      </div>
    </div>
  )
}
