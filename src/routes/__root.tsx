import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { Header } from '../components/Header'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Hidden IT Careers — Shorts Studio',
      },
      {
        name: 'description',
        content:
          'Build and preview short-form scripts for lesser-known IT career paths — MLOps, SRE, data engineering, platform engineering, and AI red teaming.',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="grain-overlay" />
        <Header />
        {children}
        <Scripts />
      </body>
    </html>
  )
}
