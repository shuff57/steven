'use client'

import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { experiences } from '@/data/experience'
import type { Institution } from '@/data/experience'
import {
  buildCourseCatalog,
  SUBJECT_LABELS,
  LEVEL_LABELS,
  type CourseSubject,
  type CourseLevel,
  type CatalogCourse,
} from '@/data/courseCatalog'
import { AnimatedItem } from '@/components/ui/AnimatedItem'

type FlatCourse = {
  code: string
  name: string
  description: string
  positionTitle: string
  isCurrent: boolean
}

const sortedExperiences = [...experiences].sort(
  (a, b) => parseInt(b.dateStart) - parseInt(a.dateStart)
)

const INSTITUTION_IDS: Record<string, string> = {
  'Butte College': 'section-butte-college',
  'Pleasant Valley High School': 'section-pleasant-valley',
  'California State University, Chico': 'section-csu-chico',
  'Anderson Valley Jr./Sr. High School': 'section-anderson-valley',
  'San Leandro High School': 'section-san-leandro',
  'Clifford Elementary School': 'section-clifford',
}

function getInstitutionId(name: string): string {
  return INSTITUTION_IDS[name] ?? `section-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

function flattenCourses(institution: Institution): FlatCourse[] {
  return institution.positions.flatMap(position =>
    (position.courses ?? []).map(course => ({
      code: course.code,
      name: course.name,
      description: course.description,
      positionTitle: position.title,
      isCurrent: institution.status === 'current',
    }))
  )
}

/* ── Catalog constants ── */

const ALL_COURSES = buildCourseCatalog()

const SUBJECT_FILTERS: Array<{ value: CourseSubject | 'all'; label: string }> = [
  { value: 'all', label: 'All Subjects' },
  { value: 'math', label: 'Mathematics' },
  { value: 'statistics', label: 'Statistics' },
  { value: 'computer-science', label: 'Computer Science' },
  { value: 'technology', label: 'Technology' },
  { value: 'career', label: 'Career' },
]

const LEVEL_FILTERS: Array<{ value: CourseLevel | 'all'; label: string }> = [
  { value: 'all', label: 'All Levels' },
  { value: 'community-college', label: 'Community College' },
  { value: 'university', label: 'University' },
  { value: 'high-school', label: 'High School' },
  { value: 'middle-school', label: 'Middle School' },
]

const SUBJECT_COLORS: Record<CourseSubject, string> = {
  math: 'rgba(240, 192, 96, 0.15)',
  statistics: 'rgba(240, 208, 96, 0.15)',
  'computer-science': 'rgba(129, 140, 248, 0.15)',
  technology: 'rgba(251, 146, 60, 0.15)',
  career: 'rgba(167, 243, 208, 0.15)',
}

const SUBJECT_TEXT: Record<CourseSubject, string> = {
  math: '#f0c060',
  statistics: '#f0d060',
  'computer-science': '#818cf8',
  technology: '#fb923c',
  career: '#a7f3d0',
}

/* ── Sub-components ── */

function CourseCard({ course }: { course: FlatCourse }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="chalk-card rounded-xl border border-[var(--color-border)] overflow-hidden"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Always-visible header */}
      <div className="px-5 py-4 flex justify-between items-start">
        <div className="flex-1 min-w-0 pr-3">
          <h3 className="text-xl font-bold font-display text-[var(--color-text-primary)] truncate">
            {course.code}
          </h3>
          <p className="text-sm text-[var(--color-accent)] mt-0.5 font-medium">
            {course.name}
          </p>
        </div>
        {course.isCurrent && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 status-active">
            Current
          </span>
        )}
      </div>

      {/* Expandable body */}
      <div
        style={{
          height: isExpanded ? `${bodyRef.current?.scrollHeight ?? 200}px` : '0px',
          overflow: 'hidden',
          transition: 'height 0.3s ease-in-out',
        }}
      >
        <div ref={bodyRef} className="px-5 pb-5 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-3">
            {course.description}
          </p>
        </div>
      </div>
    </div>
  )
}

function CatalogCourseCard({ course }: { course: CatalogCourse }) {
  return (
    <div className="chalk-card rounded-xl border border-[var(--color-border)] overflow-hidden p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span
          className="inline-block text-xs font-bold px-2 py-0.5 rounded"
          style={{
            background: SUBJECT_COLORS[course.subject],
            color: SUBJECT_TEXT[course.subject],
          }}
        >
          {SUBJECT_LABELS[course.subject]}
        </span>
      </div>
      <h3 className="font-mono text-sm font-bold text-[var(--color-text-primary)] mb-1">
        {course.code}
      </h3>
      <h4 className="font-display text-base font-semibold text-[var(--color-text-primary)] leading-snug mb-2">
        {course.name}
      </h4>
      {course.description && course.description !== course.name && (
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
          {course.description}
        </p>
      )}
      <p className="text-xs text-[var(--color-text-muted)] font-mono">
        {course.institution}
      </p>
    </div>
  )
}

function ExperienceTOC({ visible }: { visible: boolean }) {
  const teachingIds = sortedExperiences.map(inst => getInstitutionId(inst.name))
  const allIds = [...teachingIds]
  const [activeId, setActiveId] = useState(allIds[0])
  const [tocWidth, setTocWidth] = useState('calc(50vw - 358px)')

  useEffect(() => {
    const update = () => setTocWidth(`${Math.max(0, window.innerWidth / 2 - 358)}px`)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!visible) return
    const observer = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter(e => e.isIntersecting)
        if (!vis.length) return
        const topmost = vis.reduce((best, e) =>
          Math.abs(e.boundingClientRect.top) < Math.abs(best.boundingClientRect.top) ? e : best
        )
        setActiveId(topmost.target.id)
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: 0 }
    )
    allIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [visible])

  if (!visible) return null

  const items = sortedExperiences.map(inst => ({
    label: inst.name,
    id: getInstitutionId(inst.name),
  }))

  return (
    <nav className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 z-40 print:hidden" style={{ width: tocWidth }}>
      <div
        className="flex flex-col gap-1 p-2 rounded-r-xl"
        style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}
      >
        {items.map(item => {
          const isActive = activeId === item.id
          return (
            <button
              key={item.id}
              onClick={() => {
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                setActiveId(item.id)
              }}
              className="flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer w-full border-none"
              title={item.label}
              style={{ background: isActive ? 'rgba(240,192,96,0.15)' : 'transparent' }}
            >
              <span
                className="text-sm font-medium leading-snug break-words transition-colors duration-200"
                style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/* ── Main view (inner — uses useSearchParams) ── */

function ExperienceViewInner() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'institution' | 'catalog'>(
    searchParams.get('view') === 'catalog' ? 'catalog' : 'institution'
  )
  const sectionRef = useRef<HTMLElement>(null)

  /* Catalog filter state */
  const [query, setQuery] = useState('')
  const [activeSubject, setActiveSubject] = useState<CourseSubject | 'all'>('all')
  const [activeLevel, setActiveLevel] = useState<CourseLevel | 'all'>('all')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return ALL_COURSES.filter((c) => {
      if (activeSubject !== 'all' && c.subject !== activeSubject) return false
      if (activeLevel !== 'all' && c.level !== activeLevel) return false
      if (q) {
        const haystack = `${c.code} ${c.name} ${c.description} ${c.institution}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [query, activeSubject, activeLevel])

  /* Scroll to top on tab switch */
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [activeTab])

  return (
    <section ref={sectionRef} className="py-20 px-4 md:px-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
          Teaching Experience
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          A decade of mathematics and CS education across K-12 and university levels
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex justify-center mb-12">
        <div
          className="inline-flex rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--color-border)' }}
        >
          <button
            onClick={() => setActiveTab('institution')}
            className="px-6 py-2.5 text-sm transition-colors duration-200 cursor-pointer border-none"
            style={{
              background: activeTab === 'institution' ? 'var(--color-accent)' : 'transparent',
              color: activeTab === 'institution' ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'institution' ? 700 : 400,
            }}
          >
            By Institution
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className="px-6 py-2.5 text-sm transition-colors duration-200 cursor-pointer border-none"
            style={{
              background: activeTab === 'catalog' ? 'var(--color-accent)' : 'transparent',
              color: activeTab === 'catalog' ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'catalog' ? 700 : 400,
            }}
          >
            Course Catalog
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'institution' ? (
        <div>
          <ExperienceTOC visible={true} />
          <div className="max-w-2xl mx-auto space-y-20">
          {sortedExperiences.map(institution => {
            const sectionId = getInstitutionId(institution.name)
            const courses = flattenCourses(institution)
            const dateRange = `${institution.dateStart} – ${institution.dateEnd ?? 'Present'}`

            return (
              <div key={institution.name} id={sectionId}>
                <h2 className="text-3xl font-bold mb-2 font-display border-b border-[var(--color-border)] pb-4 text-center">
                  {institution.name}
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8">
                  {institution.location} · {dateRange}
                </p>

                <div className="grid grid-cols-1 gap-3 w-full">
                  {courses.map((course, idx) => (
                    <AnimatedItem key={`${institution.name}-${course.code}-${idx}`}>
                      <CourseCard course={course} />
                    </AnimatedItem>
                  ))}
                </div>
              </div>
            )
          })}
          </div>

        </div>
      ) : (
        <div>
          {/* Search */}
          <div className="relative mb-6 max-w-5xl mx-auto">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: 'var(--color-text-muted)' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by course name, code, or keyword…"
              aria-label="Search courses"
              className="w-full pl-11 pr-4 py-3 rounded-lg text-sm outline-none transition-colors duration-200"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = 'var(--color-accent)')
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = 'var(--color-border)')
              }
            />
          </div>

          {/* Subject filter pills */}
          <div className="space-y-3 mb-8 max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by subject">
              {SUBJECT_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveSubject(f.value)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer"
                  style={{
                    background:
                      activeSubject === f.value
                        ? f.value === 'all'
                          ? 'var(--color-accent)'
                          : SUBJECT_COLORS[f.value as CourseSubject]
                        : 'var(--color-surface)',
                    color:
                      activeSubject === f.value
                        ? f.value === 'all'
                          ? 'var(--color-bg-primary)'
                          : SUBJECT_TEXT[f.value as CourseSubject]
                        : 'var(--color-text-muted)',
                    border: `1px solid ${
                      activeSubject === f.value
                        ? f.value === 'all'
                          ? 'var(--color-accent)'
                          : SUBJECT_TEXT[f.value as CourseSubject]
                        : 'var(--color-border)'
                    }`,
                  }}
                  aria-pressed={activeSubject === f.value}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Level filter pills */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by level">
              {LEVEL_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveLevel(f.value)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer"
                  style={{
                    background:
                      activeLevel === f.value ? 'rgba(240, 237, 232, 0.12)' : 'transparent',
                    color:
                      activeLevel === f.value
                        ? 'var(--color-text-primary)'
                        : 'var(--color-text-muted)',
                    border: `1px solid ${
                      activeLevel === f.value ? 'rgba(240, 237, 232, 0.3)' : 'var(--color-border)'
                    }`,
                  }}
                  aria-pressed={activeLevel === f.value}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Result count */}
          <p className="text-xs text-[var(--color-text-muted)] mb-5 font-mono max-w-5xl mx-auto">
            {filtered.length === ALL_COURSES.length
              ? `${filtered.length} courses`
              : `${filtered.length} of ${ALL_COURSES.length} courses`}
          </p>

          {/* Course grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-[var(--color-text-muted)]">
              <p className="text-4xl mb-4" aria-hidden="true">∅</p>
              <p>No courses match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {filtered.map((course) => (
                <CatalogCourseCard
                  key={`${course.code}|${course.institution}`}
                  course={course}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

/* ── Exported wrapper (Suspense for useSearchParams) ── */

export function ExperienceView() {
  return (
    <Suspense>
      <ExperienceViewInner />
    </Suspense>
  )
}
