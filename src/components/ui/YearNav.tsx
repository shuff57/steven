'use client'

import { useEffect, useState } from 'react'

export interface YearNavItem {
  year: string | number
  id: string
}

interface Props {
  items: YearNavItem[]
}

export function YearNav({ items }: Props) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')

  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length === 0) return
        // Pick the one whose top edge is closest to (but below) the viewport top
        const topmost = visible.reduce((best, entry) =>
          Math.abs(entry.boundingClientRect.top) < Math.abs(best.boundingClientRect.top)
            ? entry
            : best
        )
        setActiveId(topmost.target.id)
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: 0 },
    )

    const elements = items
      .map(item => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[]

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveId(id)
  }

  if (items.length === 0) return null

  return (
    <nav
      className="fixed left-3 xl:left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:block select-none"
      aria-label="Jump to year"
    >
      <ol className="relative flex flex-col items-start m-0 p-0 list-none">
        {/* Vertical connector */}
        <li
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            top: '9px',
            bottom: '9px',
            left: '5px',
            width: '1px',
            background: 'var(--color-border)',
          }}
        />

        {items.map((item, i) => {
          const isActive = activeId === item.id
          return (
            <li
              key={item.id}
              style={{ paddingBottom: i < items.length - 1 ? '18px' : 0 }}
            >
              <button
                onClick={() => scrollTo(item.id)}
                aria-label={`Jump to ${item.year}`}
                aria-current={isActive ? 'location' : undefined}
                className="flex items-center gap-2 group cursor-pointer bg-transparent border-none p-0"
              >
                {/* Dot */}
                <span
                  className="block rounded-full flex-shrink-0 z-10 relative transition-all duration-300"
                  style={{
                    width: isActive ? '11px' : '7px',
                    height: isActive ? '11px' : '7px',
                    marginLeft: isActive ? '-2px' : '0',
                    background: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    boxShadow: isActive ? '0 0 8px var(--color-accent)' : 'none',
                    opacity: isActive ? 1 : 0.45,
                  }}
                />
                {/* Year label */}
                <span
                  className="text-[10px] font-mono leading-none whitespace-nowrap transition-all duration-300"
                  style={{
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    opacity: isActive ? 1 : 0,
                    fontWeight: isActive ? 700 : 400,
                    // Only show label when active — hover reveals it too
                  }}
                >
                  {item.year}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
