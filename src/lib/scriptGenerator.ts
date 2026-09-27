import type { Role } from '../../db/schema'

/**
 * Pure function: turns a role record into a plain-text narration script,
 * the MVP stand-in for the PRD's TTS "voice.txt" input. No audio is generated;
 * this text is what a human (or a future TTS worker) would read aloud.
 *
 * Mirrors the 5-scene structure from the PRD: hook, what-it-is, responsibilities,
 * roadmap, CTA.
 */
export function generateScript(role: Pick<Role, 'title' | 'hook' | 'description' | 'tasks' | 'roadmap' | 'cta'>): string {
  const lines: string[] = []

  lines.push('[SCENE 1 — HOOK, 0-4s]')
  lines.push(role.hook)
  lines.push('')

  lines.push('[SCENE 2 — WHAT IS IT, 4-12s]')
  lines.push(`This is the ${role.title}. ${role.description}`)
  lines.push('')

  lines.push('[SCENE 3 — WHAT YOU ACTUALLY DO, 12-25s]')
  role.tasks.forEach((task, i) => {
    lines.push(`${i + 1}. ${task}.`)
  })
  lines.push('')

  lines.push('[SCENE 4 — THE ROADMAP, 25-38s]')
  lines.push(`Here's how you'd actually break in, step by step.`)
  role.roadmap.forEach((step, i) => {
    lines.push(`Step ${i + 1}: ${step}.`)
  })
  lines.push('')

  lines.push('[SCENE 5 — CALL TO ACTION, 38-45s]')
  lines.push(role.cta)

  return lines.join('\n')
}

/** Rough word count -> spoken seconds estimate, used to scale the storyboard preview timers. */
export function estimateSpokenSeconds(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  // ~2.5 words/sec is a natural narration pace
  return words / 2.5
}
