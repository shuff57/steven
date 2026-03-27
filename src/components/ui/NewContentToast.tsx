'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useNewContent } from '@/lib/useNewContent'

export function NewContentToast() {
  const pathname = usePathname()
  const { isNew, markSeen, additions } = useNewContent(pathname)
  const [expanded, setExpanded] = useState(false)

  return (
    <AnimatePresence>
      {isNew && (
        <motion.div
          key="new-content-toast"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-[9999] pointer-events-auto rounded-xl overflow-hidden"
          style={{
            background: 'rgba(30, 40, 30, 0.92)',
            border: '1px solid rgba(240, 192, 96, 0.3)',
            boxShadow:
              '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(240, 192, 96, 0.08)',
            backdropFilter: 'blur(12px)',
            minWidth: '280px',
            maxWidth: '340px',
          }}
        >
          <div className="flex items-center gap-3 px-5 py-3">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
            <span
              className="text-sm font-medium flex-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              New content added
            </span>
            <div className="flex items-center gap-3 ml-2">
              {additions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setExpanded(prev => !prev)}
                  className="text-xs font-semibold transition-colors duration-150 border-none bg-transparent cursor-pointer"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                  aria-label={expanded ? 'Collapse details' : 'See what was added'}
                >
                  {expanded ? 'Hide' : "What's new"}
                </button>
              )}
              <button
                type="button"
                onClick={markSeen}
                className="text-xs font-semibold transition-colors duration-150 border-none bg-transparent cursor-pointer"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                aria-label="Dismiss notification"
              >
                Dismiss
              </button>
            </div>
          </div>

          <AnimatePresence>
            {expanded && additions.length > 0 && (
              <motion.div
                key="additions-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  className="px-5 pb-4 flex flex-col gap-3"
                  style={{
                    borderTop: '1px solid rgba(240, 192, 96, 0.12)',
                    paddingTop: '12px',
                  }}
                >
                  {additions.map((item, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold hover:underline transition-colors duration-150"
                          style={{ color: 'var(--color-accent)' }}
                        >
                          {item.label} ↗
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={markSeen}
                          className="text-sm font-semibold hover:underline transition-colors duration-150"
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
