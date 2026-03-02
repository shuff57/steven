'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function NavigationLoader() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  // Hide when navigation completes (pathname changed + component re-rendered)
  useEffect(() => {
    setLoading(false)
  }, [pathname])

  // Intercept internal link clicks to start loading state
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href') ?? ''
      const isInternal = href.startsWith('/')
      const isSamePage = href === pathname || href === window.location.pathname
      const isHash = href.startsWith('#')
      const isDownload = anchor.hasAttribute('download')
      const isBlank = anchor.target === '_blank'

      if (isInternal && !isSamePage && !isHash && !isDownload && !isBlank) {
        setLoading(true)
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [pathname])

  // SVG spinner: r=18 → circumference ≈ 113.1, arc ≈ 28 (25%)
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="nav-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none"
        >
          <div
            className="flex items-center justify-center rounded-full w-16 h-16"
            style={{
              background: 'rgba(20, 26, 20, 0.85)',
              boxShadow: '0 0 0 1px rgba(240,192,96,0.15), 0 8px 32px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <svg
              className="animate-spin"
              width="36"
              height="36"
              viewBox="0 0 40 40"
              fill="none"
              aria-hidden="true"
            >
              {/* Track */}
              <circle
                cx="20" cy="20" r="16"
                stroke="rgba(240,192,96,0.15)"
                strokeWidth="3"
              />
              {/* Arc */}
              <circle
                cx="20" cy="20" r="16"
                stroke="#f0c060"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="25 75"
              />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
