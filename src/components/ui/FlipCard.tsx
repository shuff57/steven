'use client'

import { useState, useCallback, type ReactNode } from 'react'

interface FlipCardProps {
  children: [ReactNode, ReactNode] // [FlipFront, FlipBack]
  height?: number
  className?: string
}

export function FlipCard({ children, height = 220, className = '' }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [squished, setSquished] = useState(false)

  const handleFlip = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    if (squished) return
    setSquished(true)
    setTimeout(() => {
      setFlipped(f => !f)
      setTimeout(() => setSquished(false), 180)
    }, 180)
  }, [squished])

  return (
    <div
      style={{ height }}
      className={`relative cursor-pointer select-none ${className}`}
      onClick={handleFlip}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleFlip(e) }}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={flipped ? 'Flip back to front' : 'Flip to see description'}
    >
      <div
        style={{
          height: '100%',
          transform: squished ? 'scaleX(0)' : 'scaleX(1)',
          transition: 'transform 0.18s ease-in-out',
          transformOrigin: 'center',
        }}
      >
        {flipped ? children[1] : children[0]}
      </div>
    </div>
  )
}

/* ── Shared face styles ─────────────────────────────────────────────── */

export function FlipFront({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`chalk-card h-full flex flex-col justify-between ${className}`}>
      {children}
      <span className="text-[10px] text-[var(--color-text-muted)] self-end mt-2 opacity-60 select-none">
        click to flip ↩
      </span>
    </div>
  )
}

export function FlipBack({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`h-full flex flex-col p-6 rounded-xl overflow-hidden ${className}`}
      style={{ background: 'var(--color-bg-secondary)', border: '1px solid rgba(240,192,96,0.4)' }}
    >
      <span className="text-[10px] text-[var(--color-accent)] mb-2 opacity-70 select-none">
        ↩ flip back
      </span>
      <div className="flex-1 overflow-y-auto text-sm text-[var(--color-text-secondary)] leading-relaxed pr-1">
        {children}
      </div>
    </div>
  )
}
