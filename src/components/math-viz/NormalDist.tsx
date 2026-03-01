'use client'
import { useState } from 'react'

type Region = null | '1sigma' | '2sigma' | '3sigma'

const W = 500
const H = 140
const PADDING = 20

// Generate the bell curve path from -4σ to +4σ
function bellPath(): string {
  const points: string[] = []
  const steps = 200
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 8 - 4 // -4 to +4
    const y = Math.exp(-0.5 * t * t) / Math.sqrt(2 * Math.PI)
    const svgX = PADDING + (i / steps) * (W - 2 * PADDING)
    const svgY = H - PADDING - y * (H - 2 * PADDING) * 2.35
    points.push(`${i === 0 ? 'M' : 'L'}${svgX.toFixed(2)},${svgY.toFixed(2)}`)
  }
  // Close path to baseline
  points.push(`L${(W - PADDING).toFixed(2)},${H - PADDING}`)
  points.push(`L${PADDING},${H - PADDING}`)
  points.push('Z')
  return points.join(' ')
}

// Generate area path for a σ range
function areaPath(sigmaMin: number, sigmaMax: number): string {
  const points: string[] = []
  const steps = 100
  const tMin = sigmaMin
  const tMax = sigmaMax
  for (let i = 0; i <= steps; i++) {
    const t = tMin + (i / steps) * (tMax - tMin)
    const y = Math.exp(-0.5 * t * t) / Math.sqrt(2 * Math.PI)
    const svgX = PADDING + ((t + 4) / 8) * (W - 2 * PADDING)
    const svgY = H - PADDING - y * (H - 2 * PADDING) * 2.35
    points.push(`${i === 0 ? 'M' : 'L'}${svgX.toFixed(2)},${svgY.toFixed(2)}`)
  }
  // Close to baseline
  const xEnd = PADDING + ((sigmaMax + 4) / 8) * (W - 2 * PADDING)
  const xStart = PADDING + ((sigmaMin + 4) / 8) * (W - 2 * PADDING)
  points.push(`L${xEnd.toFixed(2)},${(H - PADDING).toFixed(2)}`)
  points.push(`L${xStart.toFixed(2)},${(H - PADDING).toFixed(2)}`)
  points.push('Z')
  return points.join(' ')
}

const REGION_DATA = [
  {
    id: '3sigma' as Region,
    label: '99.7%',
    sublabel: 'within 3σ',
    min: -3,
    max: 3,
    color: 'rgba(94, 206, 195, 0.12)',
  },
  {
    id: '2sigma' as Region,
    label: '95%',
    sublabel: 'within 2σ',
    min: -2,
    max: 2,
    color: 'rgba(94, 206, 195, 0.22)',
  },
  {
    id: '1sigma' as Region,
    label: '68%',
    sublabel: 'within 1σ',
    min: -1,
    max: 1,
    color: 'rgba(94, 206, 195, 0.40)',
  },
]

export function NormalDist({ className }: { className?: string }) {
  const [hovered, setHovered] = useState<Region>(null)

  const activeData = REGION_DATA.find((r) => r.id === hovered)

  return (
    <div className={`flex flex-col items-center gap-3 ${className ?? ''}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-md h-auto"
        aria-label="Normal distribution bell curve showing the 68-95-99.7 rule"
      >
        {/* Filled σ regions — render largest first */}
        {REGION_DATA.map((r) => (
          <path
            key={r.id}
            d={areaPath(r.min, r.max)}
            fill={hovered === null || hovered === r.id ? r.color : 'rgba(94,206,195,0.05)'}
            style={{ transition: 'fill 0.25s ease', cursor: 'pointer' }}
            tabIndex={0}
            role="button"
            aria-label={`${r.label} of values fall ${r.sublabel}`}
            onMouseEnter={() => setHovered(r.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(r.id)}
            onBlur={() => setHovered(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setHovered(r.id === hovered ? null : r.id)
              }
            }}
          />
        ))}

        {/* Bell curve outline */}
        <path
          d={bellPath()}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          opacity="0.6"
          pointerEvents="none"
        />

        {/* Baseline */}
        <line
          x1={PADDING}
          y1={H - PADDING}
          x2={W - PADDING}
          y2={H - PADDING}
          stroke="var(--color-border)"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* σ tick labels */}
        {[-3, -2, -1, 0, 1, 2, 3].map((sigma) => {
          const x = PADDING + ((sigma + 4) / 8) * (W - 2 * PADDING)
          return (
            <text
              key={sigma}
              x={x}
              y={H - 4}
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-muted)"
              fontFamily="monospace"
            >
              {sigma === 0 ? 'μ' : `${sigma}σ`}
            </text>
          )
        })}
      </svg>

      {/* Legend / interaction hint */}
      <div className="text-center min-h-[2.5rem]">
        {activeData ? (
          <p className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>
            <span className="text-2xl">{activeData.label}</span>{' '}
            <span className="text-[var(--color-text-muted)] font-normal">{activeData.sublabel}</span>
          </p>
        ) : (
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Hover the curve to explore the 68–95–99.7 rule
          </p>
        )}
      </div>
    </div>
  )
}
