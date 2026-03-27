/**
 * Content versions — bump the version string for a route whenever you add
 * meaningful new content. Visitors who haven't seen that version yet will
 * get a "New content" toast on the page.
 *
 * Format: route → version string (any string; change it to trigger a toast).
 */
export const CONTENT_VERSIONS: Record<string, string> = {
  '/projects': '2026-03-27',
  '/skills': '2026-03-27',
  '/experience': '2026-03-27',
  '/education': '2026-03-27',
  '/professional-development': '2026-03-27',
}

export interface ContentAddition {
  /** Short label shown in the toast (e.g. item title) */
  label: string
  /** Optional one-line description shown below the label */
  description?: string
  /** In-page anchor or external URL — shown as the "View" link */
  href: string
  /** Whether href is an external URL (opens in new tab) */
  external?: boolean
}

/**
 * What was added for each route — shown when the toast is expanded.
 * Keep in sync with CONTENT_VERSIONS (bump both together when adding content).
 */
export const CONTENT_ADDITIONS: Record<string, ContentAddition[]> = {
  '/projects': [
    {
      label: 'O.G.R.E',
      description: 'AI-powered grading desktop app for educators',
      href: '/projects#section-tool-ogre',
    },
    {
      label: 'D.A.D',
      description: 'Dynamic Assessment Developer — MOM question writing tool',
      href: '/projects#section-tool-dad',
    },
    {
      label: 'Fine-tuned AI',
      description: 'Fine-tuned LLM for grading statistics responses',
      href: '/projects#section-tool-stat-grader',
    },
  ],
  '/skills': [
    {
      label: 'FreeCAD 1.1',
      description: 'Added to Software',
      href: '/skills#section-software',
    },
    {
      label: 'Python',
      description: 'Added to Languages',
      href: '/skills#section-languages',
    },
  ],
  '/experience': [
    {
      label: 'Pleasant Valley High School',
      description: 'Dual Enrollment Instructor — Stats & CS (2024–Present)',
      href: '/experience#section-pleasant-valley',
    },
    {
      label: 'Butte College',
      description: 'Adjunct Instructor — Calculus I added',
      href: '/experience#section-butte-college',
    },
  ],
  '/education': [
    {
      label: 'AI Fluency for Education',
      description: 'Certificate of Completion — Anthropic Academy, March 2026',
      href: 'https://verify.skilljar.com/c/9qjpp6envazb',
      external: true,
    },
    {
      label: 'CTE: ICT Supplementary Authorization',
      description: 'Supplementary Authorization Credential — Spring 2026',
      href: '/education#section-credentials',
    },
  ],
  '/professional-development': [
    {
      label: 'Norfield CNC Training',
      description: '90+ hrs on Haas Mills — Summer 2025',
      href: '/professional-development',
    },
  ],
}
