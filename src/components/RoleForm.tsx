import { useState } from 'react'

export type RoleFormValues = {
  title: string
  hook: string
  description: string
  tasks: string
  skills: string
  roadmap: string
  brollTags: string
  cta: string
}

export function toFormValues(role?: {
  title: string
  hook: string
  description: string
  tasks: string[]
  skills: string[]
  roadmap: string[]
  brollTags: string[]
  cta: string
}): RoleFormValues {
  return {
    title: role?.title ?? '',
    hook: role?.hook ?? '',
    description: role?.description ?? '',
    tasks: (role?.tasks ?? []).join('\n'),
    skills: (role?.skills ?? []).join('\n'),
    roadmap: (role?.roadmap ?? []).join('\n'),
    brollTags: (role?.brollTags ?? []).join('\n'),
    cta: role?.cta ?? '',
  }
}

export function fromFormValues(values: RoleFormValues) {
  const toList = (s: string) =>
    s
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean)
  return {
    title: values.title.trim(),
    hook: values.hook.trim(),
    description: values.description.trim(),
    tasks: toList(values.tasks),
    skills: toList(values.skills),
    roadmap: toList(values.roadmap),
    brollTags: toList(values.brollTags),
    cta: values.cta.trim(),
  }
}

const fieldLabel =
  'mb-1.5 block text-xs uppercase tracking-[0.2em] text-[var(--amber-dim)]'
const inputClass =
  'w-full rounded-lg border border-[var(--rule)] bg-[var(--panel-raised)] px-3.5 py-2.5 text-sm text-[var(--paper)] placeholder:text-[var(--paper)]/30 outline-none transition-colors focus:border-[var(--amber)]'

export function RoleForm({
  initial,
  onSubmit,
  submitLabel,
  pending,
  error,
}: {
  initial: RoleFormValues
  onSubmit: (values: RoleFormValues) => void
  submitLabel: string
  pending?: boolean
  error?: string | null
}) {
  const [values, setValues] = useState(initial)

  const set = (key: keyof RoleFormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setValues((v) => ({ ...v, [key]: e.target.value }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(values)
      }}
      className="space-y-6"
    >
      <div>
        <label className={fieldLabel} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          className={inputClass}
          value={values.title}
          onChange={set('title')}
          placeholder="e.g. Platform Engineer"
          required
        />
      </div>

      <div>
        <label className={fieldLabel} htmlFor="hook">
          Hook (scene 1, 0-4s)
        </label>
        <textarea
          id="hook"
          className={inputClass}
          rows={2}
          value={values.hook}
          onChange={set('hook')}
          placeholder="The line that stops the scroll."
          required
        />
      </div>

      <div>
        <label className={fieldLabel} htmlFor="description">
          What it is (scene 2)
        </label>
        <textarea
          id="description"
          className={inputClass}
          rows={4}
          value={values.description}
          onChange={set('description')}
          required
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={fieldLabel} htmlFor="tasks">
            Tasks — one per line (scene 3)
          </label>
          <textarea
            id="tasks"
            className={inputClass}
            rows={4}
            value={values.tasks}
            onChange={set('tasks')}
            placeholder={'Automate X\nDeploy Y\nMonitor Z'}
            required
          />
        </div>
        <div>
          <label className={fieldLabel} htmlFor="skills">
            Skills — one per line
          </label>
          <textarea
            id="skills"
            className={inputClass}
            rows={4}
            value={values.skills}
            onChange={set('skills')}
            placeholder={'Python\nDocker\nSQL'}
            required
          />
        </div>
      </div>

      <div>
        <label className={fieldLabel} htmlFor="roadmap">
          Roadmap steps — one per line (scene 4)
        </label>
        <textarea
          id="roadmap"
          className={inputClass}
          rows={6}
          value={values.roadmap}
          onChange={set('roadmap')}
          placeholder={'Learn X\nBuild Y\nShip Z'}
          required
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={fieldLabel} htmlFor="brollTags">
            B-roll tags — one per line (optional)
          </label>
          <textarea
            id="brollTags"
            className={inputClass}
            rows={3}
            value={values.brollTags}
            onChange={set('brollTags')}
            placeholder={'server-racks\nterminal-typing'}
          />
        </div>
        <div>
          <label className={fieldLabel} htmlFor="cta">
            CTA (scene 5)
          </label>
          <textarea
            id="cta"
            className={inputClass}
            rows={3}
            value={values.cta}
            onChange={set('cta')}
            placeholder="Comment X and I'll send you the roadmap."
            required
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-800/50 bg-red-950/30 px-3.5 py-2.5 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[var(--amber)] px-6 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--lime)] disabled:opacity-50"
      >
        {pending ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
