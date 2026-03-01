'use client'

import { useId } from 'react'
import { experiences } from '@/data/experience'

const MIN_YEAR = 2015
const MAX_YEAR = 2026
const TOTAL_YEARS = MAX_YEAR - MIN_YEAR

function parseYear(str: string): number {
  const m = str.match(/\d{4}/)
  return m ? parseInt(m[0]) : MIN_YEAR
}

const toPercent = (year: number) => ((year - MIN_YEAR) / TOTAL_YEARS) * 100

const LEVEL_COLORS: Record<string, { bar: string; label: string }> = {
  'post-secondary': { bar: 'rgba(94, 206, 195, 0.65)',  label: '#5ecec3' },
  'secondary':      { bar: 'rgba(240, 208, 96, 0.65)',  label: '#f0d060' },
  'primary':        { bar: 'rgba(168, 176, 158, 0.65)', label: '#a8b09e' },
}

const ABBREV: Record<string, string> = {
  'Butte College':                          'Butte CC',
  'California State University, Chico':     'CSU Chico',
  'Pleasant Valley High School':            'PV High',
  'Anderson Valley Jr./Sr. High School':    'AV High',
  'San Leandro High School':                'SL High',
  'Clifford Elementary School':             'Clifford',
}

// Even years only to avoid crowding
const YEAR_LABELS = [2015, 2017, 2019, 2021, 2023, 2025]

interface Props {
  value: number
  activeYear: number | null
  onScrub: (year: number) => void
  onReset: () => void
}

export function TimelineScrubber({ value, activeYear, onScrub, onReset }: Props) {
  const id = useId()
  const fillPct = toPercent(value)

  const bars = experiences.map(inst => ({
    key: inst.name,
    abbrev: ABBREV[inst.name] ?? inst.name,
    start: parseYear(inst.dateStart),
    end: inst.dateEnd ? parseYear(inst.dateEnd) : MAX_YEAR,
    colors: LEVEL_COLORS[inst.level] ?? LEVEL_COLORS['primary'],
  }))

  const lit = (bar: (typeof bars)[0]) =>
    activeYear === null || (bar.start <= activeYear && activeYear <= bar.end)

  return (
    <div
      className="sticky top-16 z-40 border-b"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-bg-primary) 96%, transparent)',
        borderColor: 'var(--color-border)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-4">

        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Year Filter
            </span>
            {activeYear !== null && (
              <span
                className="px-2 py-0.5 rounded font-mono text-xs font-bold"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg-primary)' }}
              >
                {activeYear}
              </span>
            )}
          </div>
          {activeYear !== null && (
            <button
              onClick={onReset}
              className="text-[11px] px-2.5 py-1 rounded cursor-pointer transition-colors hover:bg-white/5"
              style={{ color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
            >
              × Show All
            </button>
          )}
        </div>

        {/* Gantt + scrubber */}
        <div className="flex gap-3 items-start">

          {/* Institution labels — hidden on small screens */}
          <div className="hidden sm:block shrink-0" style={{ width: '70px' }}>
            {bars.map(bar => (
              <div key={bar.key} className="flex items-center mb-1.5" style={{ height: '12px' }}>
                <span
                  className="text-[9px] font-mono leading-none truncate transition-all duration-300"
                  style={{
                    color: lit(bar) ? bar.colors.label : 'var(--color-text-muted)',
                    opacity: lit(bar) ? 1 : 0.3,
                  }}
                >
                  {bar.abbrev}
                </span>
              </div>
            ))}
          </div>

          {/* Bars + range input */}
          <div className="flex-1 min-w-0">

            {/* Gantt bars */}
            {bars.map(bar => {
              const left  = toPercent(bar.start)
              const width = Math.max(toPercent(bar.end) - toPercent(bar.start), 2)
              return (
                <div key={bar.key} className="relative mb-1.5" style={{ height: '12px' }}>
                  {/* Track */}
                  <div
                    className="absolute inset-0 rounded-sm"
                    style={{ background: 'rgba(240,237,232,0.05)' }}
                  />
                  {/* Institution span */}
                  <div
                    className="absolute h-full rounded-sm transition-opacity duration-300"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      background: bar.colors.bar,
                      opacity: lit(bar) ? 1 : 0.1,
                    }}
                  />
                  {/* Active-year hairline */}
                  {activeYear !== null && (
                    <div
                      className="absolute top-0 h-full w-px pointer-events-none"
                      style={{
                        left: `${toPercent(activeYear)}%`,
                        background: 'var(--color-text-primary)',
                        opacity: 0.45,
                      }}
                    />
                  )}
                </div>
              )
            })}

            {/* Range slider */}
            <input
              id={id}
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={1}
              value={value}
              onChange={e => onScrub(parseInt(e.target.value))}
              className="timeline-scrubber w-full mt-2"
              style={{
                background:
                  activeYear !== null
                    ? `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${fillPct}%, rgba(240,237,232,0.12) ${fillPct}%, rgba(240,237,232,0.12) 100%)`
                    : 'rgba(240,237,232,0.12)',
              }}
              aria-label={`Filter timeline by year. ${activeYear !== null ? `Showing ${activeYear}` : 'Showing all years'}`}
              aria-valuetext={activeYear !== null ? String(activeYear) : 'All years'}
            />

            {/* Year tick labels */}
            <div className="relative mt-1" style={{ height: '14px' }}>
              {YEAR_LABELS.map(year => (
                <button
                  key={year}
                  onClick={() => onScrub(year)}
                  className="absolute -translate-x-1/2 text-[9px] font-mono leading-none transition-all duration-150 hover:opacity-100 cursor-pointer"
                  style={{
                    left: `${toPercent(year)}%`,
                    color: year === activeYear ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    fontWeight: year === activeYear ? 700 : 400,
                    opacity: year === activeYear ? 1 : 0.6,
                    background: 'none',
                    border: 'none',
                    padding: 0,
                  }}
                  aria-label={`Jump to ${year}`}
                >
                  {year}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
