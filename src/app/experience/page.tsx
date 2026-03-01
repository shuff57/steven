import { experiences } from '@/data/experience'
import { Timeline } from '@/components/sections/Timeline'

export default function ExperiencePage() {
  return <Timeline experiences={experiences} />
}
