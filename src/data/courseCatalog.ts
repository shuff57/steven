import { experiences } from './experience'

export type CourseSubject =
  | 'math'
  | 'statistics'
  | 'computer-science'
  | 'technology'
  | 'career'

export type CourseLevel =
  | 'community-college'
  | 'university'
  | 'high-school'
  | 'middle-school'

export interface CatalogCourse {
  code: string
  name: string
  description: string
  institution: string
  level: CourseLevel
  subject: CourseSubject
}

export const SUBJECT_LABELS: Record<CourseSubject, string> = {
  math: 'Mathematics',
  statistics: 'Statistics',
  'computer-science': 'Computer Science',
  technology: 'Technology',
  career: 'Career',
}

export const LEVEL_LABELS: Record<CourseLevel, string> = {
  'community-college': 'Community College',
  university: 'University',
  'high-school': 'High School',
  'middle-school': 'Middle School',
}

function inferSubject(code: string, name: string): CourseSubject {
  const n = name.toLowerCase()
  const c = code.toLowerCase()
  if (n.includes('statistic') || n.includes(' stat') || c.includes('stat')) return 'statistics'
  if (
    n.includes('computer') ||
    n.includes('programming') ||
    n.includes('coding') ||
    c.startsWith('csci') ||
    c.startsWith('intro cs') ||
    c.startsWith('ap csp') ||
    c.startsWith('cs')
  )
    return 'computer-science'
  if (n.includes('career') || n.includes('planning')) return 'career'
  if (
    n.includes('technolog') ||
    n.includes('robotics') ||
    n.includes('machining') ||
    n.includes('modeling') ||
    n.includes('fabrication')
  )
    return 'technology'
  return 'math'
}

function inferLevel(
  institutionLevel: 'post-secondary' | 'secondary' | 'primary',
  institutionName: string,
): CourseLevel {
  if (institutionLevel === 'primary') return 'middle-school'
  if (institutionLevel === 'secondary') return 'high-school'
  if (institutionName.toLowerCase().includes('college')) return 'community-college'
  return 'university'
}

export function buildCourseCatalog(): CatalogCourse[] {
  const courses: CatalogCourse[] = []
  const seen = new Set<string>()

  for (const institution of experiences) {
    const level = inferLevel(institution.level, institution.name)
    for (const position of institution.positions) {
      for (const course of position.courses ?? []) {
        // Deduplicate by code + institution
        const key = `${course.code}|${institution.name}`
        if (seen.has(key)) continue
        seen.add(key)
        courses.push({
          code: course.code,
          name: course.name,
          description: course.description,
          institution: institution.name,
          level,
          subject: inferSubject(course.code, course.name),
        })
      }
    }
  }

  return courses
}
