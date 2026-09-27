import type { CSSProperties } from 'react'

export type VisualKind =
  | 'server-racks'
  | 'terminal-typing'
  | 'dashboard-graphs'
  | 'network-diagram'
  | 'flowing-data-lines'
  | 'lock-icon'
  | 'pipeline-diagram'
  | 'code-scrolling'

export const VISUAL_LABELS: Record<VisualKind, string> = {
  'server-racks': 'Server racks',
  'terminal-typing': 'Terminal',
  'dashboard-graphs': 'Live metrics',
  'network-diagram': 'Network map',
  'flowing-data-lines': 'Data stream',
  'lock-icon': 'Security shield',
  'pipeline-diagram': 'Pipeline',
  'code-scrolling': 'Source code',
}

const tagAliases: Record<string, VisualKind> = {
  'server-racks': 'server-racks',
  'city-night-datacenter': 'server-racks',
  'terminal-typing': 'terminal-typing',
  'docker-logo': 'terminal-typing',
  'kubernetes-logo': 'network-diagram',
  'dashboard-graphs': 'dashboard-graphs',
  'graph-spike': 'dashboard-graphs',
  'pager-alert': 'dashboard-graphs',
  'network-diagram': 'network-diagram',
  'flowing-data-lines': 'flowing-data-lines',
  'pipeline-diagram': 'pipeline-diagram',
  'lock-icon': 'lock-icon',
  'code-scrolling': 'code-scrolling',
  'night-shift-desk': 'terminal-typing',
}

export function visualForTag(tag: string, fallback: VisualKind = 'terminal-typing') {
  return tagAliases[tag] ?? fallback
}

export function StoryboardBackdrop({ kind, className = '' }: { kind: VisualKind; className?: string }) {
  return (
    <div className={`sb-visual-backdrop ${className}`} aria-hidden="true">
      <TechVisual kind={kind} />
    </div>
  )
}

export function TechVisual({
  kind,
  className = '',
  style,
}: {
  kind: VisualKind
  className?: string
  style?: CSSProperties
}) {
  const common = { className: `h-full w-full ${className}`, style, viewBox: '0 0 320 220', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }
  const grid = <path d="M20 44H300M20 88H300M20 132H300M20 176H300M76 20V200M132 20V200M188 20V200M244 20V200" stroke="currentColor" strokeOpacity=".08" />

  if (kind === 'server-racks') return <svg {...common}>{grid}<g className="sb-vector-drift" stroke="currentColor"><rect x="62" y="35" width="82" height="150" rx="8" fill="currentColor" fillOpacity=".06"/><rect x="176" y="35" width="82" height="150" rx="8" fill="currentColor" fillOpacity=".06"/>{[55,82,109,136,163].map((y) => <g key={y}><rect x="75" y={y} width="56" height="16" rx="3"/><circle cx="83" cy={y+8} r="2" fill="var(--lime)"/><rect x="189" y={y} width="56" height="16" rx="3"/><circle cx="197" cy={y+8} r="2" fill="var(--amber)"/></g>)}</g></svg>
  if (kind === 'terminal-typing' || kind === 'code-scrolling') return <svg {...common}>{grid}<g className="sb-code-shift"><rect x="35" y="38" width="250" height="145" rx="10" fill="currentColor" fillOpacity=".06" stroke="currentColor"/><path d="M35 64H285" stroke="currentColor" opacity=".35"/><circle cx="51" cy="51" r="3" fill="var(--amber)"/><circle cx="63" cy="51" r="3" fill="var(--lime)"/><path d="M62 87l13 10-13 10M84 107h29M62 127h72M62 147h44M151 87h70M123 107h42M116 147h76" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity=".76"/><rect className="sb-terminal-caret" x="199" y="140" width="4" height="13" fill="var(--amber)" stroke="none"/></g></svg>
  if (kind === 'dashboard-graphs') return <svg {...common}>{grid}<g stroke="currentColor"><rect x="35" y="35" width="250" height="150" rx="10" fill="currentColor" fillOpacity=".05"/><path className="sb-chart-line" d="M55 147l38-32 30 13 36-65 32 40 28-16 46 30" stroke="var(--amber)" strokeWidth="5" strokeLinejoin="round"/><path d="M55 157H265M55 55V157" opacity=".4"/><circle className="sb-pulse-dot" cx="159" cy="63" r="7" fill="var(--lime)" stroke="none"/></g></svg>
  if (kind === 'lock-icon') return <svg {...common}>{grid}<g className="sb-node-pop" stroke="currentColor" strokeWidth="6"><path d="M102 96V76a58 58 0 01116 0v20"/><path d="M82 98l78-26 78 26v46c0 30-31 52-78 66-47-14-78-36-78-66V98z" fill="currentColor" fillOpacity=".08"/><circle cx="160" cy="133" r="11" fill="var(--amber)" stroke="none"/><path d="M160 144v22"/></g></svg>
  if (kind === 'flowing-data-lines' || kind === 'pipeline-diagram') return <svg {...common}>{grid}<g stroke="currentColor" strokeWidth="3"><path className="sb-flow-line" d="M31 68C98 68 87 110 153 110s55-42 136-42"/><path className="sb-flow-line" style={{animationDelay: '.4s'}} d="M31 110h258"/><path className="sb-flow-line" style={{animationDelay: '.8s'}} d="M31 152c67 0 56-42 122-42s55 42 136 42"/><g fill="var(--panel)" strokeWidth="4">{[[45,68],[106,110],[160,110],[218,110],[275,152]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="10"/>)}</g></g></svg>
  return <svg {...common}>{grid}<g stroke="currentColor" strokeWidth="3"><path className="sb-draw-network" d="M62 132L112 67l53 53 45-73 51 85M62 132l103-12 96 12M112 67l98-20" opacity=".7"/>{[[62,132],[112,67],[165,120],[210,47],[261,132]].map(([x,y], i) => <g className="sb-node-pop" style={{animationDelay: `${i*.12}s`}} key={x}><circle cx={x} cy={y} r="16" fill="var(--panel)"/><circle cx={x} cy={y} r="5" fill={i % 2 ? 'var(--lime)' : 'var(--amber)'} stroke="none"/></g>)}</g></svg>
}
