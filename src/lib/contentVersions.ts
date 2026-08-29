/**
 * Content versions — bump the version string for a route whenever you add
 * meaningful new content. Visitors who haven't seen that version yet will
 * get a "New content" toast on the page.
 *
 * Format: route → version string (any string; change it to trigger a toast).
 */
export const CONTENT_VERSIONS: Record<string, string> = {
  '/projects': '2026-08-21',
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
      label: 'shCode',
      description: 'Full-stack classroom platform for teaching JavaScript',
      href: '/projects#section-tool-shcode',
    },
    {
      label: 'Boring Clicks',
      description: 'Teach-by-example browser automation for repetitive tasks',
      href: '/projects#section-tool-boring-clicks',
    },
    {
      label: 'reSHape',
      description: 'STL/3MF meshes into true analytic CAD solids',
      href: '/projects#section-tool-reshape',
    },
    {
      label: 'earSHot',
      description: 'Self-hosted music library and discovery engine',
      href: '/projects#section-tool-earshot',
    },
    {
      label: 'Agent-Evo',
      description: 'Self-evolving agent framework for Claude Code',
      href: '/projects#section-tool-agent-evo',
    },
    {
      label: 'SLAG',
      description: 'Weld settings translated to your machine’s actual dials',
      href: '/projects#section-tool-slag',
    },
  ],
  '/education': [
    {
      label: 'AI Fluency for Education',
      description: 'Certificate of Completion — Anthropic Academy, March 2026',
      href: '/education#section-credentials',
    },
  ],
}
