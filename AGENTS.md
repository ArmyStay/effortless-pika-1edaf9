# AGENTS.md

This document describes the architecture of the Hidden IT Careers Shorts Studio
for developers and AI agents working on this codebase.

## Project overview

A web app for planning and previewing short-form ("Shorts"/Reels) video scripts
about lesser-known IT career paths (MLOps Engineer, SRE, Data Engineer,
Platform Engineer, AI Red Teaming/Evaluation Engineer). It is a scoped-down,
Netlify-deployable adaptation of a PRD that originally described a local
Python/FFmpeg video-rendering CLI. See "Why no video rendering" below for why
that part was deliberately left out of this app.

### Tech stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (file-based routing, SSR, server functions) |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4, hand-written CSS keyframes for kinetic typography |
| Database | Netlify Database (managed Postgres) via Drizzle ORM (`@beta`) |
| Language | TypeScript 5, strict mode |
| Deployment | Netlify |

## Directory structure

```
db/
├── schema.ts              # Drizzle schema: the `roles` table
└── index.ts                # Drizzle client (netlify-db adapter)
drizzle.config.ts            # Drizzle Kit config; migrations output to netlify/database/migrations
netlify/database/migrations/ # SQL migrations, applied automatically by Netlify on deploy
src/
├── components/
│   ├── Header.tsx           # Site header/nav
│   ├── RoleForm.tsx          # Shared create/edit form for role records
│   └── StoryboardPlayer.tsx  # The animated 9:16 storyboard preview (5 scenes)
├── lib/
│   ├── seedRoles.ts          # Seed content for the 5 example roles
│   ├── scriptGenerator.ts    # Pure function: Role -> plain-text narration script
│   └── roadmapContent.ts     # Pure function: Role -> full 14-section roadmap deliverable
├── server/
│   ├── roles.server.ts       # DB access (Drizzle queries), seeding logic
│   └── roles.functions.ts    # createServerFn wrappers exposed to routes/components
└── routes/
    ├── __root.tsx
    ├── index.tsx              # Roles dashboard/list
    └── roles/
        ├── new.tsx            # Create role
        ├── $id.edit.tsx        # Edit/delete role
        ├── $slug.storyboard.tsx # Animated storyboard preview + generated script
        └── $slug.roadmap.tsx    # Full shareable roadmap deliverable page
```

## Data model

The `roles` table (see `db/schema.ts`) matches the PRD's "Role Data Schema"
(section 15): `title`, `hook`, `description` (what_it_is), `tasks[]`,
`skills[]`, `roadmap[]`, `brollTags[]`, `cta`, plus a generated `slug` used in
URLs and timestamps. List fields are stored as `jsonb` arrays of strings.

The table is seeded lazily: `ensureSeeded()` in `src/server/roles.server.ts`
checks the row count and only inserts the 5 example roles
(`src/lib/seedRoles.ts`) if the table is empty. It is safe to call on every
request — it does one cheap `SELECT ... LIMIT 1` and no-ops if data exists.

## Storyboard preview

`src/components/StoryboardPlayer.tsx` renders a simulated 1080x1920 (9:16)
frame scaled to fit the page, with five scenes matching the PRD's structure:
hook, what-is-it (a vertical role → build & ship → monitor → production
diagram), three numbered responsibilities, a mini roadmap chain, and a CTA
screen. Animations (fade/slide-up, scale-in, word-by-word type-on, sequential
node reveal with connecting lines) are pure CSS keyframes defined in
`src/styles.css`, triggered by remounting scenes via a `key` prop — no canvas
or video library involved. A play/pause/scrub control steps through scenes on
a timer; base durations follow the PRD's second ranges (0-4s, 4-12s, 12-25s,
25-38s, 38-45s) but are scaled down proportionally when a role's script is
short, using a naive words-per-second estimate (`estimateSpokenSeconds` in
`src/lib/scriptGenerator.ts`).

## Script generator

`src/lib/scriptGenerator.ts` exports `generateScript(role)`, a pure function
producing a plain-text narration script annotated by scene — the MVP
equivalent of the PRD's `voice.txt` TTS input. It is displayed on the
storyboard page. No audio is generated.

## Why no video rendering, TTS, or FFmpeg

The original PRD's pipeline (role JSON → script → TTS → 5 animated Remotion
or FFmpeg scenes → burned-in captions → optional b-roll/music → rendered
1080x1920 MP4) is a CPU/GPU-bound batch job that needs a long-lived process:
FFmpeg encoding and TTS synthesis can run for tens of seconds per video and
depend on binaries and filesystem access that don't fit Netlify Functions'
model (short-lived, stateless, no persistent local disk for large media
temp files, cold-start-sensitive). Building it as serverless functions would
mean fighting the platform instead of using it well.

This MVP therefore stops at the storyboard/script layer, which is genuinely
useful on its own (planning and previewing content) and is a natural fit for
a web app. **Phase 2** — actually rendering MP4 Shorts — is intentionally
deferred to a separate, persistent Node or Python worker (e.g. a small VM,
container, or queue-driven job runner) that owns TTS + FFmpeg + captioning,
with this web app's role data and generated scripts as its input.

## Conventions

- Routes: kebab-case / TanStack Router file conventions (`$param` for dynamic
  segments, dot-notation for flat nested paths within a directory).
- Server access: only `src/server/*.server.ts` talk to the database directly;
  `src/server/*.functions.ts` are the `createServerFn` wrappers safe to call
  from loaders/components. Loaders call the `.functions.ts` wrappers, never
  the DB directly (loaders are isomorphic).
- Styling: Tailwind utility classes plus CSS custom properties in
  `src/styles.css` (`--ink`, `--paper`, `--amber`, etc.) for the shared dark,
  editorial/terminal aesthetic.
- List-shaped role fields (`tasks`, `skills`, `roadmap`, `brollTags`) are
  edited as newline-separated textareas in `RoleForm.tsx` and converted
  to/from `string[]` at the form boundary.

## Development commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
```

Database migrations are generated with `npx drizzle-kit generate --name
<description>` after changing `db/schema.ts`, and are applied automatically
by Netlify on deploy — never run `drizzle-kit migrate` or `push` locally.
