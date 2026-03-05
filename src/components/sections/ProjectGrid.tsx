'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { Project } from '@/data/projects'

function AnimatedItem({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3, once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
    >
      {children}
    </motion.div>
  )
}

interface ToolCardProps {
  project: Project
  isIframeExpanded: boolean
  onToggleIframe: () => void
  onCollapseIframe: () => void
  getStatusLabel: (s: Project['status']) => string
  getStatusClass: (s: Project['status']) => string
}

function ToolCard({ project, isIframeExpanded, onToggleIframe, onCollapseIframe, getStatusLabel, getStatusClass }: ToolCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  // Touch devices have no hover — track tap-to-expand separately
  const [isTouchExpanded, setIsTouchExpanded] = useState(false)
  const isExpanded = isHovered || isTouchExpanded
  const bodyRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hoverVideoRef = useRef<HTMLVideoElement>(null)

  // Respect prefers-reduced-motion — pause autoplay video if user prefers reduced motion
  useEffect(() => {
    if (!videoRef.current) return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const applyMotionPreference = () => {
      if (mql.matches) {
        videoRef.current?.pause()
      } else {
        videoRef.current?.play().catch(() => {})
      }
    }
    applyMotionPreference()
    mql.addEventListener('change', applyMotionPreference)
    return () => mql.removeEventListener('change', applyMotionPreference)
  }, [])

  // Play/pause the inline hover video based on hover state
  useEffect(() => {
    const video = hoverVideoRef.current
    if (!video) return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (isExpanded && !mql.matches) {
      video.play().catch(() => {})
    } else {
      video.pause()
      if (!isExpanded) video.currentTime = 0
    }
  }, [isExpanded])

  return (
    <div>
      {/* Slim hover-expand card */}
      <div
        className="chalk-card rounded-xl border overflow-hidden transition-colors duration-200"
        style={{ borderColor: isExpanded ? 'var(--color-accent)' : 'var(--color-border)' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header — always visible */}
        {/* Header — always visible; tap-to-expand on touch devices */}
        <div
          className="px-5 py-4 flex justify-between items-start"
          style={{ cursor: 'pointer' }}
          onClick={() => setIsTouchExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
        >
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="text-xl font-bold font-display text-[var(--color-text-primary)] truncate">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-sm text-[var(--color-accent)] mt-0.5 font-medium">
                {project.subtitle}
              </p>
            )}
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${getStatusClass(project.status)}`}>
            {getStatusLabel(project.status)}
          </span>
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
            {project.videoUrl ? (
              <>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-3 mb-3">                  {project.description}                </p>
                <video
                  ref={hoverVideoRef}
                  src={project.videoUrl}
                  poster={project.posterUrl}
                  loop
                  muted
                  playsInline
                  className="w-full rounded-lg mt-3 mb-3"
                  style={{ aspectRatio: '16/9', objectFit: 'cover' }}
                />
                <div className="flex items-center justify-center gap-3 mt-1 mb-1">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded transition-colors duration-200 hover:opacity-80"
                      style={{ backgroundColor: '#e6edf3', color: '#24292f' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {(project.externalUrl || project.iframeUrl) && (
                    <a
                      href={project.externalUrl ?? project.iframeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded transition-colors duration-200 hover:opacity-80"
                      style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-primary)' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      {project.title}
                    </a>
                  )}
                </div>

              </>
            ) : (
              <>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-3 mb-4">
                  {project.description}
                </p>
                <div className="flex items-center gap-2">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-colors duration-200 hover:bg-white/5"
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors duration-200 hover:opacity-80"
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
                  {(project.iframeUrl || project.videoUrl) && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleIframe() }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-colors duration-200 hover:bg-white/5 ml-auto cursor-pointer"
                      style={{ borderColor: isIframeExpanded ? 'var(--color-accent)' : 'var(--color-border)', color: isIframeExpanded ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {isIframeExpanded
                          ? <><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="21" y2="3"/><line x1="3" y1="21" x2="14" y2="10"/></>
                          : <><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></>
                        }
                      </svg>
                      {isIframeExpanded ? 'Collapse' : 'Preview'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>


      {/* Expandable preview panel — video if available, iframe fallback */}
      {(project.iframeUrl || project.videoUrl) && (
        <div
          className="overflow-hidden rounded-xl"
          style={{
            maxHeight: isIframeExpanded ? '660px' : '0px',
            marginTop: isIframeExpanded ? '10px' : '0px',
            transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1), margin-top 0.3s ease',
          }}
        >
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(240,192,96,0.35)' }}>
            <div
              className="flex items-center justify-between px-4 py-2 border-b"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] opacity-80" />
                <span className="text-xs font-mono text-[var(--color-text-muted)]">{project.title} — Preview</span>
              </div>
              <div className="flex items-center gap-3">
                {project.iframeUrl && (
                  <a href={project.iframeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors duration-150">
                    Open ↗
                  </a>
                )}
                <button onClick={onCollapseIframe} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors duration-150 text-lg leading-none cursor-pointer border-none bg-transparent">
                  ×
                </button>
              </div>
            </div>
            {isIframeExpanded && (
              project.videoUrl
                ? (
                  <video
                    ref={videoRef}
                    src={project.videoUrl}
                    poster={project.posterUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full block"
                    style={{ aspectRatio: '16/9', objectFit: 'cover', width: '100%' }}
                  />
                ) : (
                  <iframe src={project.iframeUrl} title={`${project.title} preview`} className="w-full block border-0" style={{ aspectRatio: '16/9' }} loading="lazy" />
                )
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ProjectTOC() {
  const [activeId, setActiveId] = useState('section-tools')
  const [tocTop, setTocTop] = useState<number | null>(null)
  const ids = ['section-tools', 'section-achievements']
  const tocHeight = ids.length * 48 + 16 // ~112px

  // Scroll-aware vertical positioning: same pattern as ExperienceTOC.
  // Align with first section on load; lock at center once scrolled there.
  useEffect(() => {
    const firstId = ids[0]

    const updateTop = () => {
      const el = document.getElementById(firstId)
      if (!el) return

      const sectionTop = el.getBoundingClientRect().top
      const viewportHeight = window.innerHeight
      const centeredTop = (viewportHeight - tocHeight) / 2

      // Intentionally unclamped — may start off-screen if section is below fold
      setTocTop(Math.max(centeredTop, sectionTop))
    }

    updateTop()
    window.addEventListener('scroll', updateTop, { passive: true })
    window.addEventListener('resize', updateTop)

    return () => {
      window.removeEventListener('scroll', updateTop)
      window.removeEventListener('resize', updateTop)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (!visible.length) return
        const topmost = visible.reduce((best, e) =>
          Math.abs(e.boundingClientRect.top) < Math.abs(best.boundingClientRect.top) ? e : best
        )
        setActiveId(topmost.target.id)
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: 0 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  if (tocTop === null) return null

  const items = [
    { label: 'Tools & Software', id: 'section-tools' },
    { label: 'Achievements & Initiatives', id: 'section-achievements' },
  ]

  return (
    <nav className="fixed left-4 xl:left-8 z-30 hidden lg:block print:hidden" style={{ top: `${tocTop}px` }}>
      <div
        className="flex flex-col gap-1 p-2 rounded-xl"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        {items.map((item) => {
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

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
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
      <ProjectTOC />
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
          Projects & Initiatives
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Tools, curriculum, and programs built for math and CS education
        </p>
      </div>

      {/* Section 1: Tools & Software — pixel transition cards */}
      <div id="section-tools" className="mb-20">
        <h2 className="text-3xl font-bold mb-8 font-display border-b border-[var(--color-border)] pb-4 text-center">
          Tools & Software
        </h2>

        <div className="grid grid-cols-1 max-w-2xl mx-auto gap-3 w-full">
            {tools.map((project) => {
              const isIframeExpanded = expandedId === project.id
              return (
                <AnimatedItem key={project.id}>
                  <ToolCard
                    project={project}
                    isIframeExpanded={isIframeExpanded}
                    onToggleIframe={() => setExpandedId(isIframeExpanded ? null : project.id)}
                    onCollapseIframe={() => setExpandedId(null)}
                    getStatusLabel={getStatusLabel}
                    getStatusClass={getStatusClass}
                  />
                </AnimatedItem>
              )
            })}
          </div>
      </div>

      {/* Section 2: Achievements & Initiatives */}
      <div id="section-achievements">
        <h2 className="text-3xl font-bold mb-8 font-display border-b border-[var(--color-border)] pb-4 text-center">
          Achievements & Initiatives
        </h2>

        <div className="grid grid-cols-1 max-w-2xl mx-auto gap-6 w-full">
          {achievements.map((project) => {
            const isGrant = project.id === 'golden-state-pathways-grant'

            return (
              <AnimatedItem key={project.id}>
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
              </AnimatedItem>
            )
          })}
        </div>
      </div>
    </section>
  )
}
