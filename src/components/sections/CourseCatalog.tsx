'use client'

import { useState, useMemo } from 'react'
import {
  buildCourseCatalog,
  SUBJECT_LABELS,
  LEVEL_LABELS,
  type CourseSubject,
  type CourseLevel,
} from '@/data/courseCatalog'
import PixelTransition from '@/components/ui/PixelTransition'

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
  math: 'rgba(94, 206, 195, 0.15)',
  statistics: 'rgba(240, 208, 96, 0.15)',
  'computer-science': 'rgba(129, 140, 248, 0.15)',
  technology: 'rgba(251, 146, 60, 0.15)',
  career: 'rgba(167, 243, 208, 0.15)',
}

const SUBJECT_TEXT: Record<CourseSubject, string> = {
  math: '#5ecec3',
  statistics: '#f0d060',
  'computer-science': '#818cf8',
  technology: '#fb923c',
  career: '#a7f3d0',
}

export function CourseCatalog() {
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-text-primary)] mb-4">
          Course Catalog
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          {ALL_COURSES.length} courses taught across community college, university, and K–12 settings
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
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

      {/* Filters */}
      <div className="space-y-3 mb-8">
        {/* Subject filters */}
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

        {/* Level filters */}
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
      <p className="text-xs text-[var(--color-text-muted)] mb-5 font-mono">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course) => {
            const id = `${course.code}|${course.institution}`
            const hasDesc = course.description && course.description !== course.name
            return (
              <PixelTransition
                key={id}
                height={220}
                ariaLabel={`${course.code} - ${course.name}`}
                firstContent={
                  <div className="chalk-card h-full flex flex-col justify-between p-4">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span
                          className="inline-block text-xs font-bold px-2 py-0.5 rounded"
                          style={{
                            background: SUBJECT_COLORS[course.subject],
                            color: SUBJECT_TEXT[course.subject],
                          }}
                        >
                          {SUBJECT_LABELS[course.subject]}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded shrink-0"
                          style={{
                            background: 'rgba(240, 237, 232, 0.07)',
                            color: 'var(--color-text-muted)',
                            border: '1px solid var(--color-border)',
                          }}
                        >
                          {LEVEL_LABELS[course.level]}
                        </span>
                      </div>
                      <h3 className="font-mono text-sm font-bold text-[var(--color-text-primary)] mb-1">
                        {course.code}
                      </h3>
                      <h4 className="font-display text-base font-semibold text-[var(--color-text-primary)] leading-snug">
                        {course.name}
                      </h4>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] font-mono">
                      {course.institution}
                    </p>
                  </div>
                }
                secondContent={
                  <div
                    className="h-full flex flex-col p-4 overflow-hidden"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid rgba(94,206,195,0.4)' }}
                  >
                    {hasDesc ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-semibold text-[var(--color-accent)] font-mono">
                          {course.code} · {course.institution}
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--color-text-muted)] italic">
                        No additional description available.
                      </p>
                    )}
                  </div>
                }
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
