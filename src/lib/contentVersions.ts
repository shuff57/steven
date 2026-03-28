/**
 * Content versions — bump the version string for a route whenever you add
 * meaningful new content. Visitors who haven't seen that version yet will
 * get a "New content" toast on the page.
 *
 * Format: route → version string (any string; change it to trigger a toast).
 */
export const CONTENT_VERSIONS: Record<string, string> = {
  '/projects': '2026-03-27b',
  '/education': '2026-03-27b',
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
      label: 'Fine-tuned AI',
      description: 'Fine-tuned LLM for grading statistics responses',
      href: '/projects#section-tool-stat-grader',
    },
  ],
  '/education': [
    {
      label: 'AI Fluency for Education',
      description: 'Certificate of Completion — Anthropic Academy, March 2026',
      href: 'https://verify.skilljar.com/c/9qjpp6envazb',
      external: true,
    },
  ],
}
