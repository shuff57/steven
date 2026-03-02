'use client'

import { experiences } from '@/data/experience'
import { Timeline, SECTION_IDS } from './Timeline'
import { YearNav } from '@/components/ui/YearNav'

const YEAR_NAV_ITEMS = [
  { year: 'Post-Sec', id: SECTION_IDS['post-secondary'] },
  { year: 'Secondary', id: SECTION_IDS['secondary'] },
  { year: 'Elementary', id: SECTION_IDS['primary'] },
]

export function ExperienceView() {
  return (
    <>
      <YearNav items={YEAR_NAV_ITEMS} />
      <Timeline experiences={experiences} />
    </>
  )
}
