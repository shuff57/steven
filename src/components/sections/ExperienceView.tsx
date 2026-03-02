'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { experiences } from '@/data/experience'
import type { Institution } from '@/data/experience'

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

function AnimatedItem({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3, once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.92, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.92, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

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

      {/* Expandable body — height animates to measured scrollHeight on hover */}
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

function ExperienceTOC() {
  const ids = sortedExperiences.map(inst => getInstitutionId(inst.name))
  const [activeId, setActiveId] = useState(ids[0])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (!visible.length) return
        const topmost = visible.reduce((best, e) =>
          Math.abs(e.boundingClientRect.top) < Math.abs(best.boundingClientRect.top) ? e : best
        )
        setActiveId(topmost.target.id)
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: 0 }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const items = sortedExperiences.map(inst => ({
    label: inst.name,
    id: getInstitutionId(inst.name),
  }))

  return (
    <nav className="fixed left-4 xl:left-8 top-1/2 -translate-y-1/2 z-30 hidden lg:block print:hidden">
      <div
        className="flex flex-col gap-1 p-2 rounded-xl"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
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
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer w-full border-none"
              style={{ background: isActive ? 'rgba(240,192,96,0.15)' : 'transparent' }}
            >
              <span
                className="block rounded-full flex-shrink-0 transition-all duration-300"
                style={{
                  width: isActive ? '10px' : '7px',
                  height: isActive ? '10px' : '7px',
                  background: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  boxShadow: isActive ? '0 0 8px var(--color-accent)' : 'none',
                  opacity: isActive ? 1 : 0.5,
                }}
              />
              <span
                className="text-sm font-medium whitespace-nowrap transition-colors duration-200"
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

export function ExperienceView() {
  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <ExperienceTOC />

      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
          Teaching Experience
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          A decade of mathematics and CS education across K-12 and university levels
        </p>
      </div>

      <div className="space-y-20">
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

              <div className="grid grid-cols-1 max-w-2xl mx-auto gap-3 w-full">
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
    </section>
  )
}
