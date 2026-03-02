'use client'

import type { Institution } from '@/data/experience'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import PixelTransition from '@/components/ui/PixelTransition'

type FlatCourse = {
  code: string
  name: string
  description: string
  positionTitle: string
  institutionName: string
  dateRange: string
  isCurrent: boolean
  level: Institution['level']
}

function flattenCourses(experiences: Institution[]): FlatCourse[] {
  return experiences.flatMap(inst =>
    inst.positions.flatMap(position =>
      (position.courses ?? []).map(course => ({
        code: course.code,
        name: course.name,
        description: course.description,
        positionTitle: position.title,
        institutionName: inst.name,
        dateRange: inst.dateEnd ? `${inst.dateStart}\u2013${inst.dateEnd}` : `${inst.dateStart}\u2013Present`,
        isCurrent: inst.status === 'current',
        level: inst.level,
      }))
    )
  )
}

function CourseCard({ course }: { course: FlatCourse }) {
  return (
    <PixelTransition
      height={200}
      ariaLabel={`${course.code} - ${course.name}`}
      firstContent={
        <div className="chalk-card h-full flex flex-col justify-between p-4">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-[var(--color-accent)]">
                {course.code}
              </span>
              {course.isCurrent && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  style={{
                    background: 'rgba(240,192,96,0.15)',
                    color: 'var(--color-accent)',
                    border: '1px solid rgba(240,192,96,0.3)',
                  }}
                >
                  Current
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] leading-snug mb-2">
              {course.name}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] leading-snug">
              {course.institutionName}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] font-mono mt-0.5">
              {course.dateRange}
            </p>
          </div>
        </div>
      }
      secondContent={
        <div
          className="h-full flex flex-col p-4 overflow-hidden"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid rgba(240,192,96,0.4)' }}
        >
          <p className="text-xs font-semibold text-[var(--color-accent)] mb-2">
            {course.positionTitle}
          </p>
          <div className="flex-1 overflow-y-auto text-sm text-[var(--color-text-secondary)] leading-relaxed pr-1">
            {course.description}
          </div>
        </div>
      }
    />
  )
}

const SECTION_LABELS: Record<Institution['level'], string> = {
  'post-secondary': 'Post-Secondary',
  'secondary': 'Secondary',
  'primary': 'Elementary',
}

export function instId(name: string): string {
  return `inst-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}


export const SECTION_IDS: Record<Institution['level'], string> = {
  'post-secondary': 'section-post-secondary',
  'secondary': 'section-secondary',
  'primary': 'section-elementary',
}

const LEVEL_ORDER: Institution['level'][] = ['post-secondary', 'secondary', 'primary']

export function Timeline({ experiences }: { experiences: Institution[] }) {
  const allCourses = flattenCourses(experiences)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <ScrollReveal animation="slide-up">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-text-primary)] mb-4">
            Teaching Experience
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            A decade of mathematics and CS education across K-12 and university levels
          </p>
        </header>
      </ScrollReveal>

      <div className="space-y-16">
        {LEVEL_ORDER.map(level => {
          const courses = allCourses.filter(c => c.level === level)
          if (courses.length === 0) return null
          return (
            <section key={level} id={SECTION_IDS[level]}>
              <ScrollReveal animation="fade-in">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl font-display font-bold text-[var(--color-accent)] whitespace-nowrap">
                    {SECTION_LABELS[level]}
                  </h2>
                  <div className="h-px bg-[rgba(240,192,96,0.3)] flex-1 max-w-xs" />
                </div>
              </ScrollReveal>

              <ScrollReveal animation="stagger" staggerSelector=".course-card">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {courses.map((course, idx) => (
                    <div key={`${course.institutionName}-${course.code}-${idx}`} className="course-card">
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </section>
          )
        })}
      </div>
    </div>
  )
}
