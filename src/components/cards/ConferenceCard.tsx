'use client'

import { useState, useRef } from 'react'
import type { ConferenceItem } from '@/data/conferences'

export function ConferenceCard({ item }: { item: ConferenceItem }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="chalk-card rounded-xl border border-[var(--color-border)] overflow-hidden"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="px-5 py-4 flex justify-between items-start">
        <div className="flex-1 min-w-0 pr-3">
          <h3 className="text-lg font-bold font-display text-[var(--color-text-primary)] leading-snug">
            {item.title}
          </h3>
          {item.location && (
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.location}</p>
          )}
        </div>
        {item.date && (
          <span className="text-xs font-mono text-[var(--color-text-muted)] shrink-0 mt-0.5 whitespace-nowrap">
            {item.date}
          </span>
        )}
      </div>

      <div
        style={{
          height: isExpanded ? `${bodyRef.current?.scrollHeight ?? 120}px` : '0px',
          overflow: 'hidden',
          transition: 'height 0.3s ease-in-out',
        }}
      >
        <div ref={bodyRef} className="px-5 pb-5 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-3">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  )
}
