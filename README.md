# Hidden IT Careers — Shorts Studio

A web app for planning and previewing short-form video content about
lesser-known IT career paths (MLOps Engineer, SRE, Data Engineer, Platform
Engineer, AI Red Teaming/Evaluation Engineer). For each role you can:

- Manage a structured record (hook, description, tasks, skills, roadmap, CTA)
- Watch an animated, in-browser storyboard preview of the 5-scene Short
  structure (hook → what-is-it → responsibilities → roadmap → CTA)
- Read the generated plain-text narration script for that Short
- Open a full, shareable roadmap page — the thing you'd actually send someone
  who comments asking for the roadmap

This is a scoped MVP of a larger PRD that originally described a local
Python/FFmpeg video-rendering pipeline. This app deliberately stops before
video/audio rendering — see **AGENTS.md** for the full architecture and the
reasoning behind that scope cut ("Why no video rendering, TTS, or FFmpeg").

## Tech stack

TanStack Start + React 19 + Tailwind CSS 4, deployed on Netlify, with role
data stored in Netlify Database (managed Postgres) via Drizzle ORM.

## Running locally

```bash
npm install     # or pnpm install
npm run dev     # starts the Vite dev server
```

The database connects automatically via Netlify's local dev integration — no
connection string setup needed. On first run, the app seeds five example
roles automatically if the `roles` table is empty.

To change the schema: edit `db/schema.ts`, then run

```bash
npx drizzle-kit generate --name <description_of_change>
```

This writes a migration to `netlify/database/migrations/`, which Netlify
applies automatically on the next deploy (do not run `drizzle-kit migrate` or
`push` yourself).

```bash
npm run build   # production build
```
