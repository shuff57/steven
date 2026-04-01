'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CONTENT_VERSIONS,
  CONTENT_ADDITIONS,
  type ContentAddition,
} from '@/lib/contentVersions'

const STORAGE_PREFIX = 'cv-seen-'
const SEEN_EVENT = 'cv-content-seen'

/** Collect all unseen routes and their additions */
function getUnseenContent(): { route: string; additions: ContentAddition[] }[] {
  const unseen: { route: string; additions: ContentAddition[] }[] = []
  try {
    for (const [route, version] of Object.entries(CONTENT_VERSIONS)) {
      const seen = localStorage.getItem(`${STORAGE_PREFIX}${route}`)
      if (seen !== version) {
        const items = CONTENT_ADDITIONS[route] ?? []
        unseen.push({ route, additions: items })
      }
    }
  } catch {}
  return unseen
}

function markAllSeen() {
  try {
    for (const [route, version] of Object.entries(CONTENT_VERSIONS)) {
      localStorage.setItem(`${STORAGE_PREFIX}${route}`, version)
    }
  } catch {}
  window.dispatchEvent(new Event(SEEN_EVENT))
}

/** Pretty label for a route */
function routeLabel(route: string): string {
  const labels: Record<string, string> = {
    '/projects': 'Projects',
    '/education': 'Education',
    '/experience': 'Experience',
    '/skills': 'Skills',
    '/about': 'About',
  }
  return labels[route] ?? route.replace('/', '')
}

export function NewContentToast() {
  const router = useRouter()
  const [unseen, setUnseen] = useState<{ route: string; additions: ContentAddition[] }[]>([])
  const [dismissed, setDismissed] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setUnseen(getUnseenContent())
    const refresh = () => setUnseen(getUnseenContent())
    window.addEventListener(SEEN_EVENT, refresh)
    return () => window.removeEventListener(SEEN_EVENT, refresh)
  }, [])

  const handleDismiss = useCallback(() => {
    markAllSeen()
    setDismissed(true)
    setUnseen([])
  }, [])

  const markRouteSeen = useCallback((route: string) => {
    try {
      const version = CONTENT_VERSIONS[route]
      if (version) localStorage.setItem(`${STORAGE_PREFIX}${route}`, version)
    } catch {}
    window.dispatchEvent(new Event(SEEN_EVENT))
  }, [])

  const handleNavigate = useCallback((href: string) => {
    const [path, hash] = href.split('#')
    const route = path || '/'
    router.push(href)
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 500)
    }
    markRouteSeen(route)
  }, [router, markRouteSeen])

  const isVisible = !dismissed && unseen.length > 0
  const allAdditions = unseen.flatMap((g) =>
    g.additions.map((a) => ({ ...a, route: g.route }))
  )

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="new-content-toast"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-20 right-6 z-[9999] pointer-events-auto rounded-xl overflow-hidden"
          style={{
            background: 'rgba(30, 40, 30, 0.92)',
            border: '1px solid rgba(240, 192, 96, 0.3)',
            boxShadow:
              '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(240, 192, 96, 0.08)',
            backdropFilter: 'blur(12px)',
            width: '300px',
          }}
        >
          {/* Header — click to expand/collapse */}
          <button
            type="button"
            onClick={() => setExpanded(prev => !prev)}
            className="flex items-center gap-3 px-5 py-3 w-full text-left border-none bg-transparent cursor-pointer"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0 animate-pulse"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
            <span
              className="text-sm font-medium flex-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              What&apos;s New
            </span>
            <span
              className="text-xs transition-transform duration-200"
              style={{ color: 'var(--color-text-muted)', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              ▼
            </span>
          </button>

          {/* Expandable content list */}
          <AnimatePresence>
            {expanded && allAdditions.length > 0 && (
              <motion.div
                key="additions-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  className="px-5 pb-3 flex flex-col gap-3"
                  style={{
                    borderTop: '1px solid rgba(240, 192, 96, 0.12)',
                    paddingTop: '12px',
                  }}
                >
                  {allAdditions.map((item, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: 'rgba(240, 192, 96, 0.15)', color: 'var(--color-accent)' }}
                        >
                          {routeLabel(item.route)}
                        </span>
                      </div>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold hover:underline transition-colors duration-150"
                          style={{ color: 'var(--color-accent)' }}
                          onClick={() => markRouteSeen(item.route)}
                        >
                          {item.label} ↗
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={(e) => { e.preventDefault(); handleNavigate(item.href) }}
                          className="text-sm font-semibold hover:underline transition-colors duration-150 cursor-pointer text-left"
                          style={{ color: 'var(--color-accent)' }}
                        >
                          {item.label}
                        </Link>
                      )}
                      {item.description && (
                        <span
                          className="text-xs"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {item.description}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Dismiss button at bottom of expanded content */}
                <div className="px-5 pb-3 pt-1" style={{ borderTop: '1px solid rgba(240, 192, 96, 0.08)' }}>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="text-xs font-semibold transition-colors duration-150 border-none bg-transparent cursor-pointer w-full text-center py-1"
                    style={{ color: 'var(--color-text-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
