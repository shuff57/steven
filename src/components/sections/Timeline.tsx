'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import type { Institution, Course } from '@/data/experience'
import { ScrollReveal } from '@/components/animations/ScrollReveal'

function ExpandableCourse({ course }: { course: Course }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="mt-3">
      <button
        className="flex items-start gap-2 cursor-pointer select-none group py-2 -my-1 rounded hover:bg-white/5 px-2 -ml-2 transition-colors w-full text-left bg-transparent border-none"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-controls={`course-desc-${course.code}`}
        aria-label={expanded ? `Hide description for ${course.name}` : `Show description for ${course.name}`}
      >
        <span
          className="text-[var(--color-accent)] transition-transform duration-200 mt-0.5 text-xs pointer-events-none"
          aria-hidden="true"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}
        >
          ▼
        </span>
        <span className="font-mono text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
          {course.code}: <span className="font-sans font-normal">{course.name}</span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <m.div id={`course-desc-${course.code}`}
            key="description"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p className="mt-2 ml-6 text-sm text-[var(--color-text-secondary)] leading-relaxed border-l-2 border-[var(--color-border)] pl-3">
              {course.description}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </div>

  )
}

function TimelineItem({ institution }: { institution: Institution }) {
  const isCurrent = institution.status === 'current'
  const dateRange = `${institution.dateStart} – ${institution.dateEnd || 'Present'}`
  
  return (
    <div className="relative pl-8 pb-12 last:pb-0 group">
      {/* Timeline Line */}
      <div 
        className="absolute left-[3px] top-2 bottom-0 w-[2px]"
        style={{ background: 'rgba(94, 206, 195, 0.3)' }}
      />
      
      {/* Timeline Dot */}
      <div 
        className={`absolute left-0 top-2.5 w-2 h-2 rounded-full border border-[var(--color-bg-primary)] transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_8px_var(--color-accent)] ${isCurrent ? 'bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]' : 'bg-[var(--color-text-muted)] group-hover:bg-[var(--color-accent)]'}`}
        style={{ transform: 'translateX(-1px)' }}
      />


      <div className="chalk-card">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-[var(--color-text-primary)]">
              {institution.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mt-1">
              <span>{institution.location}</span>
              <span>•</span>
              <span>{dateRange}</span>
            </div>
            {institution.concurrent && (
              <p className="text-xs text-[var(--color-accent)] italic mt-2 opacity-80">
                {institution.name === 'Pleasant Valley High School'
                  ? 'Concurrently: Butte College (Adjunct, 2023–Present)'
                  : '(Held concurrently with other positions)'}
              </p>
            )}
          </div>
          
          {isCurrent && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[rgba(94,206,195,0.15)] text-[var(--color-accent)] border border-[rgba(94,206,195,0.2)] self-start whitespace-nowrap">
              Current
            </span>
          )}
        </div>

        <div className="space-y-6">
          {institution.positions.map((position, idx) => (
            <div key={idx} className="relative">
              <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                {position.title}
              </h4>
              {position.notes && (
                <p className="text-sm text-[var(--color-text-muted)] italic mb-2">
                  {position.notes}
                </p>
              )}
              
              {position.courses && position.courses.length > 0 && (
                <div className="mt-3 space-y-1">
                  {position.courses.map((course, cIdx) => (
                    <ExpandableCourse key={`${course.code}-${cIdx}`} course={course} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-8 mt-12 first:mt-0">
      <h2 className="text-2xl font-display font-bold text-[var(--color-accent)] whitespace-nowrap">
        {title}
      </h2>
      <div className="h-px bg-[rgba(94,206,195,0.3)] w-full max-w-xs" />
    </div>
  )
}

export function Timeline({ experiences }: { experiences: Institution[] }) {
  const postSecondary = experiences.filter(e => e.level === 'post-secondary')
  const secondary = experiences.filter(e => e.level === 'secondary')
  const primary = experiences.filter(e => e.level === 'primary')

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
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
        {postSecondary.length > 0 && (
          <section>
            <ScrollReveal animation="fade-in">
              <SectionHeading title="Post-Secondary" />
            </ScrollReveal>
            <div className="ml-2 md:ml-4">
              {postSecondary.map((inst, idx) => (
                <ScrollReveal key={`${inst.name}-${idx}`} animation="slide-up" delay={Math.min(idx * 0.05, 0.3)}>
                  <TimelineItem institution={inst} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {secondary.length > 0 && (
          <section>
            <ScrollReveal animation="fade-in">
              <SectionHeading title="Secondary" />
            </ScrollReveal>
            <div className="ml-2 md:ml-4">
              {secondary.map((inst, idx) => (
                <ScrollReveal key={`${inst.name}-${idx}`} animation="slide-up" delay={Math.min(idx * 0.05, 0.3)}>
                  <TimelineItem institution={inst} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {primary.length > 0 && (
          <section>
            <ScrollReveal animation="fade-in">
              <SectionHeading title="Elementary" />
            </ScrollReveal>
            <div className="ml-2 md:ml-4">
              {primary.map((inst, idx) => (
                <ScrollReveal key={`${inst.name}-${idx}`} animation="slide-up" delay={Math.min(idx * 0.05, 0.3)}>
                  <TimelineItem institution={inst} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
