import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { Role } from '../../db/schema'
import { estimateSpokenSeconds } from '../lib/scriptGenerator'
import { StoryboardBackdrop, TechVisual, visualForTag } from './StoryboardVisuals'

type FlowId = 'incident' | 'pulse' | 'pipeline' | 'blueprint' | 'field-guide'

const FLOWS: Record<FlowId, {
  name: string; labels: string[]; seconds: number[]; steps: string[]
  kicker: string; taskHeading: string; roadmapHeading: string
  palette: number; background: number; motion: string
}> = {
  incident: { name: 'Incident countdown', labels: ['Alert', 'Threat', 'Response', 'Hardening', 'Verdict'], seconds: [5, 8, 14, 11, 7], steps: ['Signal detected', 'Investigate', 'Contain', 'Protect'], kicker: 'Incoming security brief', taskHeading: 'The response playbook', roadmapHeading: 'Build your defenses', palette: 1, background: 4, motion: 'sb-flow-incident' },
  pulse: { name: 'Live system pulse', labels: ['Status', 'System', 'On call', 'Level up', 'Handoff'], seconds: [4, 9, 15, 11, 6], steps: ['Observe', 'Diagnose', 'Automate', 'Stabilize'], kicker: 'Production is live', taskHeading: 'When the pager fires', roadmapHeading: 'From signal to senior', palette: 2, background: 6, motion: 'sb-flow-pulse' },
  pipeline: { name: 'Moving pipeline', labels: ['Input', 'Transform', 'Ship', 'Stack', 'Output'], seconds: [4, 10, 13, 12, 6], steps: ['Raw input', 'Transform', 'Validate', 'Deliver'], kicker: 'Follow the data', taskHeading: 'Inside the pipeline', roadmapHeading: 'Build the stack', palette: 4, background: 1, motion: 'sb-flow-pipeline' },
  blueprint: { name: 'System blueprint', labels: ['Problem', 'Design', 'Build', 'Path', 'Launch'], seconds: [5, 10, 12, 12, 6], steps: ['Requirements', 'Architecture', 'Guardrails', 'Platform'], kicker: 'System design file', taskHeading: 'What gets engineered', roadmapHeading: 'Blueprint your path', palette: 3, background: 9, motion: 'sb-flow-blueprint' },
  'field-guide': { name: 'Career field guide', labels: ['Secret', 'Role', 'Daybook', 'Route', 'Next move'], seconds: [6, 9, 12, 12, 6], steps: ['Listen', 'Translate', 'Create', 'Influence'], kicker: 'A career hiding in plain sight', taskHeading: 'A day in the role', roadmapHeading: 'Your route in', palette: 5, background: 7, motion: 'sb-flow-field' },
}

function suggestedFlow(role: Role): FlowId {
  const text = `${role.slug} ${role.title} ${role.brollTags.join(' ')}`.toLowerCase()
  if (/security|forensic|privacy|red-team|lock/.test(text)) return 'incident'
  if (/reliability|sre|observability|chaos|database|release/.test(text)) return 'pulse'
  if (/data|mlops|finops|geospatial|pipeline/.test(text)) return 'pipeline'
  if (/platform|architect|cloud|api|network/.test(text)) return 'blueprint'
  return 'field-guide'
}

const PALETTES = [
  { name: 'Amber', amber: '#ffb347', lime: '#c8e854', panel: '#1b1a17' },
  { name: 'Signal', amber: '#ff8066', lime: '#f3d56b', panel: '#201716' },
  { name: 'Mint', amber: '#72d6c5', lime: '#d4ed7b', panel: '#14201e' },
  { name: 'Violet', amber: '#b7a3d6', lime: '#efc678', panel: '#1d1925' },
  { name: 'Ice', amber: '#79bdda', lime: '#e4e9b2', panel: '#151d23' },
  { name: 'Paper', amber: '#e15d44', lime: '#e7c66a', panel: '#27231e' },
  { name: 'Orchid', amber: '#d28ab4', lime: '#b9d889', panel: '#211923' },
  { name: 'Cobalt', amber: '#6fa8dc', lime: '#f0b86e', panel: '#121b2b' },
  { name: 'Moss', amber: '#a5b96a', lime: '#e5a66f', panel: '#192019' },
  { name: 'Mono', amber: '#e8e1d5', lime: '#a8a298', panel: '#1b1b1a' },
] as const

const BACKGROUNDS = [
  { name: 'Datacenter', src: '/backgrounds/datacenter.svg' },
  { name: 'Data stream', src: '/backgrounds/data-stream.svg' },
  { name: 'Terminal', src: '/backgrounds/terminal-grid.svg' },
  { name: 'Network', src: '/backgrounds/network-night.svg' },
  { name: 'Security', src: '/backgrounds/security-lab.svg' },
  { name: 'Cloud atlas', src: '/backgrounds/cloud-atlas.svg' },
  { name: 'Control room', src: '/backgrounds/control-room.svg' },
  { name: 'Editorial desk', src: '/backgrounds/editorial-desk.svg' },
  { name: 'Circuit field', src: '/backgrounds/circuit-field.svg' },
  { name: 'Wireframe city', src: '/backgrounds/wireframe-city.svg' },
] as const

function TypeOnWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(/\s+/)
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className="sb-fade-up inline-block"
          style={{ animationDelay: `${i * 45}ms` }}
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}

export function StoryboardPlayer({ role }: { role: Role }) {
  const suggested = suggestedFlow(role)
  const [flowId, setFlowId] = useState<FlowId>(suggested)
  const flow = FLOWS[flowId]
  const [sceneIndex, setSceneIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [replayKey, setReplayKey] = useState(0)
  const [paletteIndex, setPaletteIndex] = useState(FLOWS[suggested].palette)
  const [backgroundIndex, setBackgroundIndex] = useState(FLOWS[suggested].background)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Scale the base 0-45s ranges proportionally to how long this role's script
  // would actually take to narrate, so short content doesn't sit on a timer
  // built for a much longer script.
  const scale = useMemo(() => {
    const fullScript = [
      role.hook,
      role.description,
      ...role.tasks,
      ...role.roadmap,
      role.cta,
    ].join(' ')
    const estimated = estimateSpokenSeconds(fullScript)
    const target = Math.max(estimated, 12) // never compress below 12s total
    return Math.min(1, target / 45)
  }, [role])

  const durations = useMemo(() => flow.seconds.map((seconds) => seconds * scale), [flow, scale])

  function chooseFlow(id: FlowId) {
    setFlowId(id)
    setPaletteIndex(FLOWS[id].palette)
    setBackgroundIndex(FLOWS[id].background)
    setSceneIndex(0)
    setReplayKey((key) => key + 1)
    setPlaying(false)
  }

  useEffect(() => {
    if (!playing) return
    const ms = Math.max(durations[sceneIndex] * 1000, 800)
    timerRef.current = setTimeout(() => {
      setSceneIndex((i) => {
        if (i >= 4) {
          setPlaying(false)
          return i
        }
        return i + 1
      })
    }, ms)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [playing, sceneIndex, durations])

  function goTo(i: number) {
    setSceneIndex(i)
    setReplayKey((k) => k + 1)
  }

  function togglePlay() {
    if (!playing && sceneIndex === 4) {
      setSceneIndex(0)
    }
    setReplayKey((k) => k + 1)
    setPlaying((p) => !p)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className={`relative overflow-hidden rounded-[28px] border border-[var(--rule)] bg-[var(--panel)] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] ${flow.motion}`}
        style={{
          width: 'min(340px, 80vw)',
          aspectRatio: '9 / 16',
          '--amber': PALETTES[paletteIndex].amber,
          '--lime': PALETTES[paletteIndex].lime,
          '--panel': PALETTES[paletteIndex].panel,
        } as CSSProperties}
      >
        <img
          src={BACKGROUNDS[backgroundIndex].src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--panel)]/35 via-[var(--panel)]/75 to-[var(--panel)]" />
        {/* progress segments, IG-story style */}
        <div className="absolute left-3 right-3 top-3 z-20 flex gap-1">
          {flow.labels.map((_, i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full bg-[var(--amber)]"
                style={{
                  width: i < sceneIndex ? '100%' : i === sceneIndex ? undefined : '0%',
                  animation:
                    i === sceneIndex && playing
                      ? `sb-progress ${Math.max(durations[i], 0.8)}s linear forwards`
                      : undefined,
                }}
              />
            </div>
          ))}
        </div>

        <StoryboardBackdrop kind={visualForTag(role.brollTags[sceneIndex] ?? '')} />
        <div key={`${replayKey}-${flowId}`} className="absolute inset-0 z-10 flex items-center justify-center p-7">
          {sceneIndex === 0 && <SceneHook role={role} kicker={flow.kicker} />}
          {sceneIndex === 1 && <SceneWhatIsIt role={role} steps={flow.steps} />}
          {sceneIndex === 2 && <SceneTasks role={role} heading={flow.taskHeading} />}
          {sceneIndex === 3 && <SceneRoadmap role={role} heading={flow.roadmapHeading} />}
          {sceneIndex === 4 && <SceneCta role={role} />}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => goTo(Math.max(0, sceneIndex - 1))}
          disabled={sceneIndex === 0}
          className="rounded-full border border-[var(--rule)] px-3 py-1.5 text-xs text-[var(--paper)]/70 disabled:opacity-30"
        >
          ← Prev
        </button>
        <button
          onClick={togglePlay}
          className="rounded-full bg-[var(--amber)] px-5 py-1.5 text-xs font-medium text-[var(--ink)] hover:bg-[var(--lime)]"
        >
          {playing ? 'Pause' : sceneIndex === 4 ? 'Replay' : 'Play'}
        </button>
        <button
          onClick={() => goTo(Math.min(4, sceneIndex + 1))}
          disabled={sceneIndex === 4}
          className="rounded-full border border-[var(--rule)] px-3 py-1.5 text-xs text-[var(--paper)]/70 disabled:opacity-30"
        >
          Next →
        </button>
      </div>

      <div className="flex gap-2">
        {flow.labels.map((label, i) => (
          <button
            key={label}
            onClick={() => {
              setPlaying(false)
              goTo(i)
            }}
            className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wide transition-colors ${
              i === sceneIndex
                ? 'bg-[var(--amber)] text-[var(--ink)]'
                : 'border border-[var(--rule)] text-[var(--paper)]/50 hover:text-[var(--paper)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="w-full max-w-[340px] space-y-4 rounded-2xl border border-[var(--rule)] bg-[var(--panel)] p-4">
        <fieldset>
          <legend className="mb-2 text-[9px] uppercase tracking-[0.22em] text-[var(--paper)]/45">Story flow · suggested for this role</legend>
          <select value={flowId} onChange={(event) => chooseFlow(event.target.value as FlowId)} className="w-full rounded-lg border border-[var(--rule)] bg-[var(--ink)] px-3 py-2 text-[11px] text-[var(--paper)] outline-none focus:border-[var(--amber)]">
            {(Object.entries(FLOWS) as [FlowId, typeof FLOWS[FlowId]][]).map(([id, item]) => <option key={id} value={id}>{item.name}{id === suggested ? ' · suggested' : ''}</option>)}
          </select>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-[9px] uppercase tracking-[0.22em] text-[var(--paper)]/45">Color palette</legend>
          <div className="grid grid-cols-5 gap-2">
            {PALETTES.map((palette, index) => (
              <button
                key={palette.name}
                type="button"
                onClick={() => setPaletteIndex(index)}
                aria-label={`Use ${palette.name} palette`}
                aria-pressed={paletteIndex === index}
                className={`h-8 flex-1 rounded-lg border p-1 transition-transform hover:-translate-y-0.5 ${paletteIndex === index ? 'border-[var(--paper)]' : 'border-[var(--rule)]'}`}
              >
                <span className="block h-full rounded" style={{ background: `linear-gradient(135deg, ${palette.amber} 0 50%, ${palette.lime} 50%)` }} />
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-[9px] uppercase tracking-[0.22em] text-[var(--paper)]/45">Background image</legend>
          <div className="grid grid-cols-5 gap-2">
            {BACKGROUNDS.map((background, index) => (
              <button
                key={background.name}
                type="button"
                onClick={() => setBackgroundIndex(index)}
                aria-label={`Use ${background.name} background`}
                aria-pressed={backgroundIndex === index}
                className={`aspect-[9/12] overflow-hidden rounded-md border transition-transform hover:-translate-y-0.5 ${backgroundIndex === index ? 'border-[var(--amber)]' : 'border-[var(--rule)]'}`}
              >
                <img src={background.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <p className="mt-2 text-[9px] text-[var(--paper)]/35">{BACKGROUNDS[backgroundIndex].name} · {PALETTES[paletteIndex].name}</p>
        </fieldset>
      </div>
      <style>{`@keyframes sb-progress { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  )
}

function SceneHook({ role, kicker }: { role: Role; kicker: string }) {
  return (
    <div className="text-center">
      <div className="sb-scale-in mx-auto mb-5 h-20 w-28 text-[var(--amber)] opacity-80">
        <TechVisual kind={visualForTag(role.brollTags[0] ?? '')} />
      </div>
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--amber)]">
        {kicker}
      </p>
      <p className="font-display text-2xl font-semibold leading-snug text-[var(--paper)]">
        <TypeOnWords text={role.hook} />
        <span className="sb-caret text-[var(--amber)]">|</span>
      </p>
    </div>
  )
}

function SceneWhatIsIt({ role, steps }: { role: Role; steps: string[] }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <p className="sb-fade-up mb-6 text-center font-display text-lg font-semibold text-[var(--paper)]">
        What is a {role.title}?
      </p>
      <div className="relative flex flex-col items-center">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className="sb-node-pop flex h-12 w-40 items-center justify-center rounded-xl border border-[var(--amber-dim)] bg-[var(--panel-raised)] text-xs font-medium text-[var(--paper)]"
              style={{ animationDelay: `${i * 350}ms` }}
            >
              {step}
            </div>
            {i < steps.length - 1 && (
              <div
                className="sb-draw-line my-1 h-6 w-px bg-[var(--amber-dim)]"
                style={{ animationDelay: `${i * 350 + 150}ms` }}
              />
            )}
          </div>
        ))}
      </div>
      <p className="sb-fade-up mt-6 px-2 text-center text-[11px] leading-relaxed text-[var(--paper)]/60" style={{ animationDelay: '1400ms' }}>
        {role.description}
      </p>
    </div>
  )
}

function SceneTasks({ role, heading }: { role: Role; heading: string }) {
  return (
    <div className="w-full">
      <div className="sb-fade-up mx-auto mb-3 h-20 w-32 text-[var(--lime)] opacity-60">
        <TechVisual kind={visualForTag(role.brollTags[2] ?? '', 'dashboard-graphs')} />
      </div>
      <p className="sb-fade-up mb-5 text-center font-display text-lg font-semibold text-[var(--paper)]">
        {heading}
      </p>
      <ol className="space-y-4">
        {role.tasks.slice(0, 3).map((task, i) => (
          <li
            key={i}
            className="sb-slide-in-left flex items-start gap-3"
            style={{ animationDelay: `${i * 300}ms` }}
          >
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--amber)] text-[11px] font-bold text-[var(--ink)]">
              {i + 1}
            </span>
            <span className="text-xs leading-relaxed text-[var(--paper)]/85">{task}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function SceneRoadmap({ role, heading }: { role: Role; heading: string }) {
  const steps = role.roadmap.slice(0, 6)
  return (
    <div className="flex h-full w-full flex-col">
      <p className="sb-fade-up mb-4 text-center font-display text-lg font-semibold text-[var(--paper)]">
        {heading}
      </p>
      <div className="flex-1 space-y-0 overflow-hidden">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="sb-node-pop flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-[var(--lime)] bg-[var(--panel)] text-[10px] font-bold text-[var(--lime)]"
                style={{ animationDelay: `${i * 220}ms` }}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className="sb-draw-line h-6 w-px flex-shrink-0 bg-[var(--rule)]"
                  style={{ animationDelay: `${i * 220 + 100}ms` }}
                />
              )}
            </div>
            <p
              className="sb-fade-up pb-3 text-[11px] leading-snug text-[var(--paper)]/80"
              style={{ animationDelay: `${i * 220 + 80}ms` }}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SceneCta({ role }: { role: Role }) {
  return (
    <div className="text-center">
      <div className="sb-scale-in mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--amber)]">
        <span className="text-2xl">↓</span>
      </div>
      <p className="sb-fade-up font-display text-xl font-semibold text-[var(--paper)]" style={{ animationDelay: '150ms' }}>
        {role.cta}
      </p>
      <p className="sb-fade-up mt-4 text-[11px] uppercase tracking-[0.2em] text-[var(--paper)]/40" style={{ animationDelay: '350ms' }}>
        Follow for more hidden IT careers
      </p>
    </div>
  )
}
