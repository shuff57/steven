'use client'

import { useState, useRef } from 'react'
import type { ConferenceItem } from '@/data/conferences'
import { getUniversalStatusLabel, getUniversalStatusClass } from '@/lib/statusHelpers'

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
          <h3 className="text-lg font-bold font-display text-[var(--color-accent)] leading-snug">
            {item.title}
          </h3>
          {item.location && (
            <p className="text-xs text-[var(--color-text-primary)] mt-0.5">{item.location}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {item.date && (
            <span className="text-xs font-mono text-[var(--color-text-secondary)]">
              {item.date}
            </span>
          )}
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${getUniversalStatusClass(item.status)}`}>
            {getUniversalStatusLabel(item.status)}
          </span>
        </div>
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
