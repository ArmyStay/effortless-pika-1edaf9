import { useEffect, useMemo, useRef, useState } from 'react'
import type { Role } from '../../db/schema'
import { estimateSpokenSeconds } from '../lib/scriptGenerator'

const BASE_RANGES = [
  [0, 4],
  [4, 12],
  [12, 25],
  [25, 38],
  [38, 45],
] as const

const SCENE_LABELS = ['Hook', 'What is it', 'The job', 'Roadmap', 'Call to action']

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
  const [sceneIndex, setSceneIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [replayKey, setReplayKey] = useState(0)
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

  const durations = useMemo(
    () => BASE_RANGES.map(([start, end]) => (end - start) * scale),
    [scale],
  )

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
        className="relative overflow-hidden rounded-[28px] border border-[var(--rule)] bg-[var(--panel)] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]"
        style={{ width: 'min(340px, 80vw)', aspectRatio: '9 / 16' }}
      >
        {/* progress segments, IG-story style */}
        <div className="absolute left-3 right-3 top-3 z-20 flex gap-1">
          {SCENE_LABELS.map((_, i) => (
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

        <div key={replayKey} className="absolute inset-0 flex items-center justify-center p-7">
          {sceneIndex === 0 && <SceneHook role={role} />}
          {sceneIndex === 1 && <SceneWhatIsIt role={role} />}
          {sceneIndex === 2 && <SceneTasks role={role} />}
          {sceneIndex === 3 && <SceneRoadmap role={role} />}
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
        {SCENE_LABELS.map((label, i) => (
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
      <style>{`@keyframes sb-progress { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  )
}

function SceneHook({ role }: { role: Role }) {
  return (
    <div className="text-center">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--amber)]">
        {role.title}
      </p>
      <p className="font-display text-2xl font-semibold leading-snug text-[var(--paper)]">
        <TypeOnWords text={role.hook} />
        <span className="sb-caret text-[var(--amber)]">|</span>
      </p>
    </div>
  )
}

function SceneWhatIsIt({ role }: { role: Role }) {
  const steps = ['Role', 'Build & ship', 'Monitor', 'Production']
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

function SceneTasks({ role }: { role: Role }) {
  return (
    <div className="w-full">
      <p className="sb-fade-up mb-5 text-center font-display text-lg font-semibold text-[var(--paper)]">
        What you actually do
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

function SceneRoadmap({ role }: { role: Role }) {
  const steps = role.roadmap.slice(0, 6)
  return (
    <div className="flex h-full w-full flex-col">
      <p className="sb-fade-up mb-4 text-center font-display text-lg font-semibold text-[var(--paper)]">
        The roadmap
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
