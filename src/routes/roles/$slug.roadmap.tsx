import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getRole } from '../../server/roles.functions'
import { buildRoadmapDeliverable } from '../../lib/roadmapContent'

export const Route = createFileRoute('/roles/$slug/roadmap')({
  loader: async ({ params }) => {
    const role = await getRole({ data: { slug: params.slug } })
    if (!role) throw notFound()
    return { role, deliverable: buildRoadmapDeliverable(role) }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: `${loaderData.role.title} roadmap — Hidden IT Careers` }]
      : [],
  }),
  component: RoadmapPage,
})

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-[var(--rule)] py-8 first:pt-0 last:border-0">
      <h2 className="mb-4 font-display text-xl font-semibold text-[var(--paper)]">
        {title}
      </h2>
      {children}
    </section>
  )
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed text-[var(--paper)]/75">
          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--amber)]" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function RoadmapPage() {
  const { role, deliverable } = Route.useLoaderData()

  return (
    <div className="min-h-screen">
      <div className="border-b border-[var(--rule)] bg-[var(--panel)]">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--amber)]">
            The complete roadmap
          </p>
          <h1 className="font-display text-5xl font-semibold leading-tight text-[var(--paper)]">
            {role.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--paper)]/70">
            {role.hook}
          </p>
          <div className="mt-8 flex gap-3 text-xs">
            <Link
              to="/roles/$slug/storyboard"
              params={{ slug: role.slug }}
              className="rounded-full border border-[var(--rule)] px-4 py-2 text-[var(--paper)]/70 hover:text-[var(--paper)]"
            >
              ← Storyboard preview
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-4">
        <Section title="Role overview">
          <p className="text-sm leading-relaxed text-[var(--paper)]/75">{deliverable.roleOverview}</p>
        </Section>

        <Section title="What you actually do">
          <List items={deliverable.actualDuties} />
        </Section>

        <Section title="Prerequisites before you start">
          <List items={deliverable.prerequisites} />
        </Section>

        <Section title="Core skills">
          <div className="flex flex-wrap gap-2">
            {deliverable.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-[var(--rule)] bg-[var(--panel-raised)] px-3 py-1 text-xs text-[var(--paper)]/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Learning sequence">
          <ol className="space-y-3">
            {deliverable.learningSequence.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-[var(--paper)]/75">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--amber)] text-[11px] font-bold text-[var(--ink)]">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Tools you'll touch">
          <List items={deliverable.tools} />
        </Section>

        <Section title="Project ideas">
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-[var(--lime)]">Beginner</p>
              <p className="text-sm leading-relaxed text-[var(--paper)]/75">{deliverable.projects.beginner}</p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-[var(--lime)]">Intermediate</p>
              <p className="text-sm leading-relaxed text-[var(--paper)]/75">{deliverable.projects.intermediate}</p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-[var(--lime)]">Advanced</p>
              <p className="text-sm leading-relaxed text-[var(--paper)]/75">{deliverable.projects.advanced}</p>
            </div>
          </div>
        </Section>

        <Section title="Portfolio requirements">
          <List items={deliverable.portfolioRequirements} />
        </Section>

        <Section title="Relevant certifications">
          <List items={deliverable.certifications} />
        </Section>

        <Section title="Job titles to search">
          <div className="flex flex-wrap gap-2">
            {deliverable.jobTitles.map((title) => (
              <span
                key={title}
                className="rounded-full bg-[var(--amber)]/10 px-3 py-1 text-xs text-[var(--amber)]"
              >
                {title}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Interview prep">
          <List items={deliverable.interviewPrep} />
        </Section>

        <Section title="Suggested resources">
          <List items={deliverable.resources} />
        </Section>

        <div className="py-10 text-center">
          <p className="font-display text-lg text-[var(--paper)]">{role.cta}</p>
        </div>
      </div>
    </div>
  )
}
