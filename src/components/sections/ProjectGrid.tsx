'use client'

import { useState } from 'react'
import { Project } from '@/data/projects'
import Link from 'next/link'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { AnimatePresence, m } from 'framer-motion'
import { YearNav } from '@/components/ui/YearNav'

const PROJECT_YEAR_NAV = [
  { year: '2026', id: 'section-tools' },
  { year: '2022', id: 'section-achievements' },
]

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const tools = projects.filter((p) => p.type === 'tool')
  const achievements = projects.filter((p) => p.type !== 'tool')

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'in-progress':
        return 'In Progress'
      case 'concept':
        return 'Concept'
      case 'completed':
        return 'Completed'
      default:
        return status
    }
  }

  const getStatusClass = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'status-active'
      case 'in-progress':
        return 'status-progress'
      case 'concept':
        return 'status-concept'
      case 'completed':
        return 'status-completed'
      default:
        return 'bg-gray-800 text-gray-400'
    }
  }

  const getTypeLabel = (type: Project['type']) => {
    switch (type) {
      case 'grant':
        return 'Grant'
      case 'initiative':
        return 'Initiative'
      case 'curriculum':
        return 'Curriculum'
      default:
        return type
    }
  }

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <YearNav items={PROJECT_YEAR_NAV} />
      <ScrollReveal animation="slide-up">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
            Projects & Initiatives
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Tools, curriculum, and programs built for math and CS education
          </p>
        </div>
      </ScrollReveal>

      {/* Section 1: Tools & Software */}
      <div id="section-tools" className="mb-20">
        <ScrollReveal animation="fade-in">
          <h2 className="text-3xl font-bold mb-8 font-display border-b border-[var(--color-border)] pb-4 inline-block">
            Tools & Software
          </h2>
        </ScrollReveal>
        
        <ScrollReveal animation="stagger" staggerSelector=".chalk-card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
            {tools.map((project) => {
              const isExpanded = expandedId === project.id
              const isFeatured = project.featured

              return (
                <div
                  key={project.id}
                  className={`chalk-card flex flex-col relative group transition-transform duration-200 hover:scale-[1.02] hover:-translate-y-1 ${
                    isFeatured ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'
                  }`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="text-2xl font-bold font-display text-[var(--color-text-primary)] truncate">
                        {project.title}
                      </h3>
                      {project.subtitle && (
                        <p className="text-sm text-[var(--color-accent)] mt-1 font-medium">
                          {project.subtitle}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${getStatusClass(project.status)}`}
                    >
                      {getStatusLabel(project.status)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <div className="relative">
                      <AnimatePresence initial={false} mode="wait">
                        {isExpanded ? (
                          <m.div
                            key="expanded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-[var(--color-text-secondary)]"
                          >
                            {project.description}
                          </m.div>
                        ) : (
                          <m.div
                            key="collapsed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-[var(--color-text-secondary)] line-clamp-2"
                          >
                            {project.description}
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      onClick={() => toggleExpand(project.id)}
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? `Show less about ${project.title}` : `Read more about ${project.title}`}
                      className="text-[var(--color-accent)] text-sm font-bold mt-2 hover:text-[var(--color-accent-hover)] focus:outline-none flex items-center gap-1 transition-colors px-2 py-2 -ml-2 rounded hover:bg-white/5 w-fit cursor-pointer"
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                      <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true">▼</span>
                    </button>
                  </div>

                  {/* Footer: date + action links */}
                  <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex justify-between items-center gap-3">
                    <div className="font-mono text-sm text-[var(--color-text-muted)]">
                      {project.dateStart}
                      {project.dateEnd ? ` – ${project.dateEnd}` : ' – Present'}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* GitHub / source link */}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Source code for ${project.title}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-colors duration-200 cursor-pointer hover:bg-white/5"
                          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                        >
                          {/* GitHub icon */}
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                          Code
                        </a>
                      )}

                      {/* Live demo link */}
                      {project.externalUrl && (
                        <a
                          href={project.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open live demo of ${project.title}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors duration-200 cursor-pointer hover:opacity-80"
                          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-primary)' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollReveal>
      </div>

      {/* Section 2: Achievements & Initiatives */}
      <div id="section-achievements">
        <ScrollReveal animation="fade-in">
          <h2 className="text-3xl font-bold mb-8 font-display border-b border-[var(--color-border)] pb-4 inline-block">
            Achievements & Initiatives
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((project, idx) => {
            // Special styling for the Golden State Pathways Grant
            const isGrant = project.id === 'golden-state-pathways-grant'
            
            return (
              <ScrollReveal key={project.id} animation="slide-up" delay={Math.min(idx * 0.05, 0.3)}>
                <div
                  className={`chalk-card flex flex-col h-full ${
                    isGrant ? 'border-[var(--color-accent)] border-opacity-50 shadow-[var(--shadow-glow)]' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] uppercase tracking-wider">
                      {getTypeLabel(project.type)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusClass(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>

                  <h3 className={`text-xl font-bold font-display mb-2 ${isGrant ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'}`}>
                    {project.title}
                  </h3>

                  <p className="text-[var(--color-text-secondary)] text-sm mb-4 flex-grow">
                    {project.description}
                  </p>

                  <div className="text-xs font-mono text-[var(--color-text-muted)] mt-auto pt-3 border-t border-[var(--color-border)] border-dashed">
                    {project.dateStart}
                    {project.dateEnd ? ` – ${project.dateEnd}` : ' – Present'}
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
