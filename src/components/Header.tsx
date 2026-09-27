import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--rule)] bg-[var(--ink)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <span className="rec-dot h-2.5 w-2.5 rounded-full bg-[var(--amber)]" />
          <span className="font-display text-lg font-semibold tracking-tight text-[var(--paper)]">
            Hidden IT Careers
          </span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-[var(--amber-dim)] sm:inline">
            Shorts Studio
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-xs uppercase tracking-[0.15em] text-[var(--paper)]/70">
          <Link
            to="/"
            className="transition-colors hover:text-[var(--amber)]"
            activeProps={{ className: 'text-[var(--amber)]' }}
            activeOptions={{ exact: true }}
          >
            Roles
          </Link>
          <Link
            to="/roles/new"
            className="rounded-full border border-[var(--amber-dim)] px-3 py-1.5 text-[var(--amber)] transition-colors hover:bg-[var(--amber)] hover:text-[var(--ink)]"
          >
            + New Role
          </Link>
        </nav>
      </div>
    </header>
  )
}
