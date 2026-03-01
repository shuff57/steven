'use client'

import { useState, useMemo } from 'react'
import { experiences } from '@/data/experience'
import { Timeline } from './Timeline'
import { TimelineScrubber } from './TimelineScrubber'

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

  return (
    <>
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
