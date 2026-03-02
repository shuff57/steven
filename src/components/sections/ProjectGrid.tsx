'use client'

import { Project } from '@/data/projects'
import Link from 'next/link'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { YearNav } from '@/components/ui/YearNav'
import PixelTransition from '@/components/ui/PixelTransition'

const PROJECT_YEAR_NAV = [
  { year: '2026', id: 'section-tools' },
  { year: '2022', id: 'section-achievements' },
]

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const tools = projects.filter((p) => p.type === 'tool')
  const achievements = projects.filter((p) => p.type !== 'tool')

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'active':      return 'Active'
      case 'in-progress': return 'In Progress'
      case 'concept':     return 'Concept'
      case 'completed':   return 'Completed'
      default:            return status
    }
  }

  const getStatusClass = (status: Project['status']) => {
    switch (status) {
      case 'active':      return 'status-active'
      case 'in-progress': return 'status-progress'
      case 'concept':     return 'status-concept'
      case 'completed':   return 'status-completed'
      default:            return 'bg-gray-800 text-gray-400'
    }
  }

  const getTypeLabel = (type: Project['type']) => {
    switch (type) {
      case 'grant':      return 'Grant'
      case 'initiative': return 'Initiative'
      case 'curriculum': return 'Curriculum'
      default:           return type
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

      {/* Section 1: Tools & Software — pixel transition cards */}
      <div id="section-tools" className="mb-20">
        <ScrollReveal animation="fade-in">
          <h2 className="text-3xl font-bold mb-8 font-display border-b border-[var(--color-border)] pb-4 inline-block">
            Tools & Software
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="stagger" staggerSelector=".flip-project-card">
          <div className="grid grid-cols-1 max-w-2xl mx-auto gap-6 w-full">
            {tools.map((project) => (
              <div key={project.id} className="flip-project-card">
                <PixelTransition
                  height={260}
                  ariaLabel={project.title}
                  firstContent={
                    <div className="chalk-card h-full flex flex-col justify-between p-6">
                      <div>
                        <div className="flex justify-between items-start mb-3">
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
                        <p className="text-[var(--color-text-secondary)] text-sm line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      {/* date shown at bottom of front */}
                      <div className="font-mono text-xs text-[var(--color-text-muted)] mt-2">
                        {project.dateStart}{project.dateEnd ? ` – ${project.dateEnd}` : ' – Present'}
                      </div>
                    </div>
                  }
                  secondContent={
                    <div
                      className="h-full flex flex-col p-6"
                      style={{ background: 'var(--color-bg-secondary)', border: '1px solid rgba(94,206,195,0.4)' }}
                    >
                      <div className="flex flex-col h-full gap-3">
                        <h3 className="text-base font-bold font-display text-[var(--color-text-primary)]">
                          {project.title}
                        </h3>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex-1 overflow-y-auto pr-1">
                          {project.description}
                        </p>
                        {/* Action links */}
                        <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)] shrink-0">
                          {project.repoUrl && (
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`Source code for ${project.title}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-colors duration-200 cursor-pointer hover:bg-white/5"
                              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                              </svg>
                              Code
                            </a>
                          )}
                          {project.externalUrl && (
                            <a
                              href={project.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
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
                  }
                />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Section 2: Achievements & Initiatives — unchanged */}
      <div id="section-achievements">
        <ScrollReveal animation="fade-in">
          <h2 className="text-3xl font-bold mb-8 font-display border-b border-[var(--color-border)] pb-4 inline-block">
            Achievements & Initiatives
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 max-w-2xl mx-auto gap-6 w-full">
          {achievements.map((project, idx) => {
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
