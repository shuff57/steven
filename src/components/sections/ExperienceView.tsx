'use client'

import { useState, useMemo } from 'react'
import { experiences } from '@/data/experience'
import { Timeline, instId } from './Timeline'
import { TimelineScrubber } from './TimelineScrubber'
import { YearNav } from '@/components/ui/YearNav'

const MIN_YEAR = 2015
const MAX_YEAR = 2026

function parseYear(str: string): number {
  const m = str.match(/\d{4}/)
  return m ? parseInt(m[0]) : MIN_YEAR
}

export function ExperienceView() {
  // scrubValue: physical thumb position (always set, persists across resets)
  // activeYear: the active filter (null = show all)
  const [scrubValue, setScrubValue] = useState<number>(MAX_YEAR)
  const [activeYear, setActiveYear] = useState<number | null>(null)

  const handleScrub = (year: number) => {
    setScrubValue(year)
    setActiveYear(year)
  }

  const handleReset = () => {
    setActiveYear(null)
  }

  const filtered = useMemo(() => {
    if (activeYear === null) return experiences
    return experiences.filter(inst => {
      const start = parseYear(inst.dateStart)
      const end   = inst.dateEnd ? parseYear(inst.dateEnd) : MAX_YEAR
      return start <= activeYear && activeYear <= end
    })
  }, [activeYear])

  // Year nav items in visual scroll order: post-sec → secondary → primary
  const yearNavItems = useMemo(() => {
    const ordered = [
      ...filtered.filter(e => e.level === 'post-secondary'),
      ...filtered.filter(e => e.level === 'secondary'),
      ...filtered.filter(e => e.level === 'primary'),
    ]
    return ordered.map(inst => ({
      year: inst.dateStart.match(/\d{4}/)?.[0] ?? inst.dateStart,
      id: instId(inst.name),
    }))
  }, [filtered])

  return (
    <>
      <YearNav items={yearNavItems} />
      <TimelineScrubber
        value={scrubValue}
        activeYear={activeYear}
        onScrub={handleScrub}
        onReset={handleReset}
      />
      <Timeline experiences={filtered} />
    </>
  )
}
