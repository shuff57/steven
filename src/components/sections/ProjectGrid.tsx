'use client'

import { useState, useEffect, useRef, useMemo, Suspense, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { Project } from '@/data/projects'
import { getUniversalStatusLabel, getUniversalStatusClass } from '@/lib/statusHelpers'

/* ── Types ── */

type ProjectType = Project['type']

/* ── Constants ── */

const TYPE_COLORS: Record<ProjectType, string> = {
  tool:       'rgba(129, 140, 248, 0.15)',
  grant:      'rgba(240, 192, 96,  0.15)',
  initiative: 'rgba(96,  165, 250, 0.15)',
  curriculum: 'rgba(52,  211, 153, 0.15)',
}

const TYPE_TEXT: Record<ProjectType, string> = {
  tool:       '#818cf8',
  grant:      '#f0c060',
  initiative: '#60a5fa',
  curriculum: '#34d399',
}

const TYPE_LABELS: Record<ProjectType, string> = {
  tool:       'Tool',
  grant:      'Grant',
  initiative: 'Initiative',
  curriculum: 'Curriculum',
}

const TYPE_FILTERS: Array<{ value: ProjectType | 'all'; label: string }> = [
  { value: 'all',        label: 'All'        },
  { value: 'tool',       label: 'Tools'      },
  { value: 'grant',      label: 'Grants'     },
  { value: 'initiative', label: 'Initiatives'},
  { value: 'curriculum', label: 'Curriculum' },
]

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/* ── Shared helpers ── */

function getTypeLabel(type: Project['type']) {
  switch (type) {
    case 'grant':      return 'Grant'
    case 'initiative': return 'Initiative'
    case 'curriculum': return 'Curriculum'
    default:           return type
  }
}

/* ── AnimatedItem ── */

function AnimatedItem({ children, skip }: { children: ReactNode; skip?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3, once: true })
  if (skip) {
    return <div ref={ref}>{children}</div>
  }
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

/* ── ToolCard ── */

interface ToolCardProps {
  project: Project
  isIframeExpanded: boolean
  onToggleIframe: () => void
  onCollapseIframe: () => void
}

function ToolCard({ project, isIframeExpanded, onToggleIframe, onCollapseIframe }: ToolCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isTouchExpanded, setIsTouchExpanded] = useState(false)
  const isExpanded = isHovered || isTouchExpanded

  const videoRef = useRef<HTMLVideoElement>(null)
  const hoverVideoRef = useRef<HTMLVideoElement>(null)
  const hasTouched = useRef(false)

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
      <div
        className="chalk-card rounded-xl border overflow-hidden transition-colors duration-200"
        style={{ borderColor: isExpanded ? 'var(--color-accent)' : 'var(--color-border)' }}
        onTouchStart={() => { hasTouched.current = true }}
        onMouseEnter={() => { if (!hasTouched.current) setIsHovered(true) }}
        onMouseLeave={() => { if (!hasTouched.current) setIsHovered(false) }}
      >
        <div
          className="px-5 py-4 flex justify-between items-start"
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onClick={() => setIsTouchExpanded((prev) => !prev)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsTouchExpanded((prev) => !prev) }}
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
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-xs font-mono text-[var(--color-text-secondary)]">
              {project.dateStart}{project.dateEnd ? ` – ${project.dateEnd}` : ' – Present'}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${getUniversalStatusClass(project.status)}`}>
              {getUniversalStatusLabel(project.status)}
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateRows: isExpanded ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.3s ease-in-out',
          }}
        >
          <div style={{ overflow: 'hidden', minHeight: 0 }}>
            <div className="px-5 pb-5 border-t border-[var(--color-border)]">
              {project.videoUrl ? (
                <>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-3 mb-3">
                    {project.description}
                  </p>
                  <div className="rounded-xl overflow-hidden mt-3 mb-3">
                    <video
                      ref={hoverVideoRef}
                      src={project.videoUrl ? `${BASE_PATH}${project.videoUrl}` : undefined}
                      poster={project.posterUrl ? `${BASE_PATH}${project.posterUrl}` : undefined}
                      loop
                      muted
                      playsInline
                      className="w-full block"
                      style={{ aspectRatio: '16/9', objectFit: 'contain' }}
                    />
                  </div>
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
      </div>

      {/* Expandable preview panel */}
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
                  <div className="overflow-hidden rounded-b-xl">
                    <video
                      ref={videoRef}
                      src={project.videoUrl ? `${BASE_PATH}${project.videoUrl}` : undefined}
                      poster={project.posterUrl ? `${BASE_PATH}${project.posterUrl}` : undefined}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full block"
                      style={{ aspectRatio: '16/9', objectFit: 'contain', width: '100%' }}
                    />
                  </div>
                ) : (
                  <iframe src={project.iframeUrl} title={`${project.title} preview`} className="w-full block border-0 rounded-b-xl" style={{ aspectRatio: '16/9' }} loading="lazy" />
                )
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── AchievementCard ── */

interface AchievementCardProps {
  project: Project
}

function AchievementCard({ project }: AchievementCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isTouchExpanded, setIsTouchExpanded] = useState(false)
  const hasTouched = useRef(false)
  const isExpanded = isHovered || isTouchExpanded
  const isGrant = project.id === 'golden-state-pathways-grant'

  return (
    <div
      className="chalk-card rounded-xl border overflow-hidden transition-colors duration-200"
      style={{ borderColor: isExpanded ? 'var(--color-accent)' : 'var(--color-border)' }}
      onTouchStart={() => { hasTouched.current = true }}
      onMouseEnter={() => { if (!hasTouched.current) setIsHovered(true) }}
      onMouseLeave={() => { if (!hasTouched.current) setIsHovered(false) }}
    >
      <div
        className="px-5 py-4 flex justify-between items-start"
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        onClick={() => setIsTouchExpanded((prev) => !prev)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsTouchExpanded((prev) => !prev) }}
        aria-expanded={isExpanded}
      >
        <div className="flex-1 min-w-0 pr-3">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] uppercase tracking-wider mb-2 inline-block">
            {getTypeLabel(project.type)}
          </span>
          <h3 className={`text-base font-bold font-display leading-snug ${isGrant ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'}`}>
            {project.title}
          </h3>
          {project.subtitle && (
            <p className="text-sm text-[var(--color-accent)] mt-0.5 font-medium">
              {project.subtitle}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs font-mono text-[var(--color-text-secondary)]">
            {project.dateStart}{project.dateEnd ? ` – ${project.dateEnd}` : ' – Present'}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${getUniversalStatusClass(project.status)}`}>
            {getUniversalStatusLabel(project.status)}
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateRows: isExpanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s ease-in-out',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div className="px-5 pb-5 border-t border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-3 mb-3">
              {project.description}
            </p>
            <div className="text-xs font-mono text-[var(--color-text-muted)] pt-3 border-t border-[var(--color-border)] border-dashed">
              {project.dateStart}
              {project.dateEnd ? ` – ${project.dateEnd}` : ' – Present'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Catalog card — flat card used in the catalog view ── */

function CatalogProjectCard({ project }: { project: Project }) {
  const typeColor = TYPE_COLORS[project.type]
  const typeText  = TYPE_TEXT[project.type]

  return (
    <div className="chalk-card rounded-xl border border-[var(--color-border)] overflow-hidden p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="inline-block text-xs font-bold px-2 py-0.5 rounded"
          style={{ background: typeColor, color: typeText }}
        >
          {TYPE_LABELS[project.type]}
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${getUniversalStatusClass(project.status)}`}>
          {getUniversalStatusLabel(project.status)}
        </span>
      </div>
      <p className="text-sm font-bold text-[var(--color-text-primary)] leading-snug mb-1">
        {project.title}
      </p>
      {project.subtitle && (
        <p className="text-xs text-[var(--color-accent)] mb-1 font-medium">{project.subtitle}</p>
      )}
      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3 line-clamp-3">
        {project.description}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded border transition-colors duration-200 hover:bg-white/5"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Code
          </a>
        )}
        {(project.externalUrl || project.iframeUrl) && (
          <a
            href={project.externalUrl ?? project.iframeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded transition-colors duration-200 hover:opacity-80"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-primary)' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Live
          </a>
        )}
        <span className="ml-auto text-xs font-mono text-[var(--color-text-muted)]">
          {project.dateStart}{project.dateEnd ? ` – ${project.dateEnd}` : project.status !== 'completed' ? ' – Present' : ''}
        </span>
      </div>
    </div>
  )
}

/* ── ProjectTOC ── */

interface ProjectTOCProps {
  tools: Project[]
  achievements: Project[]
}

const ACHIEVEMENT_TOC_LABELS: Record<string, string> = {
  'golden-state-pathways-grant':   'Golden State Pathways Grant',
  'embedded-systems-robotics':     'Embedded Systems & Robotics',
  'cs-pathway-update':             'CS Pathway (Update)',
  'cs-pathway-original':           'CS Pathway Developer',
  'cs-curriculum-developer':       'CS Curriculum Developer',
  'csc2-lead-mentor':              'CSC² Lead Mentor',
  'csc2-stemcat':                  'CSC² STEMCAT Mentor',
  'reach-faculty-mentor':          'REACH Faculty Mentor',
  'project-math-placement':        'Project MATH Placement',
  'project-math-mentor':           'Project MATH Mentor',
  'eap-research-assistant':        'EAP Math Research Asst.',
  'early-start-curriculum':        'Early Start Curriculum',
  'avhs-steam7':                   'AVHS STEAM7',
  'si-mentor':                     'SI Student Leader Mentor',
  'qrat-tqr':                      'QRAT & TQR Instructor',
}

function ProjectTOC({ tools, achievements }: ProjectTOCProps) {
  const toolIds = tools.map((t) => `section-tool-${t.id}`)
  const achievementIds = achievements.map((a) => `section-achievement-${a.id}`)
  const allObservedIds = [...toolIds, ...achievementIds]

  const [activeId, setActiveId] = useState(toolIds[0] ?? achievementIds[0] ?? '')
  const [tocMaxHeight, setTocMaxHeight] = useState('85vh')
  const [tocWidth, setTocWidth] = useState('calc((50vw - 336px) / 2)')
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollLockRef = useRef(false)

  useEffect(() => {
    const updateMaxHeight = () => {
      const sectionEl = document.getElementById('projects-section')
      if (!sectionEl) return
      const sectionBottom = sectionEl.getBoundingClientRect().bottom
      const tocTop = 72
      const bottomMargin = 32
      const available = Math.min(
        sectionBottom - tocTop - bottomMargin,
        window.innerHeight - tocTop - bottomMargin
      )
      setTocMaxHeight(`${Math.max(available, 120)}px`)
    }

    updateMaxHeight()
    window.addEventListener('scroll', updateMaxHeight, { passive: true })
    window.addEventListener('resize', updateMaxHeight)
    return () => {
      window.removeEventListener('scroll', updateMaxHeight)
      window.removeEventListener('resize', updateMaxHeight)
    }
  }, [])

  useEffect(() => {
    const update = () => {
      const gap = Math.max(0, window.innerWidth / 2 - 336)
      setTocWidth(`${gap / 2}px`)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const syncPanelScroll = () => {
      const distFromBottom = document.body.scrollHeight - window.scrollY - window.innerHeight
      if (distFromBottom < 120) {
        container.scrollTop = container.scrollHeight
        return
      }
      const activeBtn = container.querySelector<HTMLElement>(`[data-toc-id="${activeId}"]`)
      if (!activeBtn) return
      const btnTop = activeBtn.offsetTop
      const btnBottom = btnTop + activeBtn.offsetHeight
      const containerTop = container.scrollTop
      const containerBottom = containerTop + container.clientHeight
      if (btnTop < containerTop) {
        container.scrollTop = btnTop - 8
      } else if (btnBottom > containerBottom) {
        container.scrollTop = btnBottom - container.clientHeight + 8
      }
    }

    syncPanelScroll()
    window.addEventListener('scroll', syncPanelScroll, { passive: true })
    return () => window.removeEventListener('scroll', syncPanelScroll)
  }, [activeId])

  const allObservedIdsKey = allObservedIds.join(',')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollLockRef.current) return
        const visible = entries.filter((e) => e.isIntersecting)
        if (!visible.length) return
        const topmost = visible.reduce((best, e) =>
          Math.abs(e.boundingClientRect.top) < Math.abs(best.boundingClientRect.top) ? e : best
        )
        setActiveId(topmost.target.id)
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: 0 }
    )

    const attach = () => {
      allObservedIds.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }

    attach()
    const timer = setTimeout(attach, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allObservedIdsKey])

  return (
    <nav className="hidden lg:block fixed z-40 print:hidden" style={{ left: 0, width: tocWidth, top: '64px', height: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center' }}>
      <div
        ref={scrollRef}
        className="flex flex-col p-2 rounded-r-xl"
        style={{
          width: '100%',
          background: 'var(--color-surface)',
          borderTop:    '1px solid var(--color-border)',
          borderRight:  '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          maxHeight: tocMaxHeight,
          overflowY: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        <div>
          <button
            onClick={() => {
              const firstToolId = toolIds[0]
              if (firstToolId) {
                scrollLockRef.current = true
                document.getElementById(firstToolId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                setActiveId(firstToolId)
                setTimeout(() => { scrollLockRef.current = false }, 900)
              }
            }}
            className="flex items-center px-3 py-1.5 w-full text-left border-none cursor-pointer transition-colors duration-200 rounded-md mt-1"
            style={{ background: 'transparent' }}
          >
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              Tools &amp; Software
            </span>
          </button>

          {tools.map((tool) => {
            const id = `section-tool-${tool.id}`
            const isActive = activeId === id
            return (
              <button
                key={id}
                data-toc-id={id}
                onClick={() => {
                  scrollLockRef.current = true
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  setActiveId(id)
                  setTimeout(() => { scrollLockRef.current = false }, 900)
                }}
                className="flex items-center pl-5 pr-3 py-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer w-full border-none"
                title={tool.title}
                style={{ background: isActive ? 'rgba(240,192,96,0.15)' : 'transparent' }}
              >
                <span
                  className="text-sm font-medium leading-snug break-words transition-colors duration-200"
                  style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
                >
                  {tool.title}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-1">
          <button
            onClick={() => {
              const firstId = achievementIds[0]
              if (firstId) {
                scrollLockRef.current = true
                document.getElementById(firstId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                setActiveId(firstId)
                setTimeout(() => { scrollLockRef.current = false }, 900)
              }
            }}
            className="flex items-center px-3 py-1.5 w-full text-left border-none cursor-pointer transition-colors duration-200 rounded-md"
            style={{ background: 'transparent' }}
          >
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              Achievements &amp; Initiatives
            </span>
          </button>

          {achievements.map((achievement) => {
            const id = `section-achievement-${achievement.id}`
            const isActive = activeId === id
            return (
              <button
                key={id}
                data-toc-id={id}
                onClick={() => {
                  scrollLockRef.current = true
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  setActiveId(id)
                  setTimeout(() => { scrollLockRef.current = false }, 900)
                }}
                className="flex items-center pl-5 pr-3 py-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer w-full border-none"
                title={achievement.title}
                style={{ background: isActive ? 'rgba(240,192,96,0.15)' : 'transparent' }}
              >
                <span
                  className="text-sm font-medium leading-snug transition-colors duration-200"
                  style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
                >
                  {ACHIEVEMENT_TOC_LABELS[achievement.id] ?? achievement.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

/* ── Main inner component ── */

interface ProjectGridProps {
  projects: Project[]
}

function ProjectGridInner({ projects }: ProjectGridProps) {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'category' | 'catalog'>(
    searchParams.get('view') === 'catalog' ? 'catalog' : 'category'
  )

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [skipAnimation, setSkipAnimation] = useState(false)

  // Catalog state
  const [query, setQuery] = useState('')
  const [activeType, setActiveType] = useState<ProjectType | 'all'>('all')

  const tools        = projects.filter((p) => p.type === 'tool')
  const achievements = projects.filter((p) => p.type !== 'tool')

  const filteredCatalog = useMemo(() => {
    const q = query.toLowerCase().trim()
    return projects.filter((p) => {
      if (activeType !== 'all' && p.type !== activeType) return false
      if (q && !p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false
      return true
    })
  }, [projects, query, activeType])

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    setSkipAnimation(true)
    const timer = setTimeout(() => {
      const el = document.getElementById(hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="projects-section" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
          Projects <span style={{ color: 'var(--color-accent)' }}>&amp;</span> Initiatives
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Tools, curriculum, and programs built for math and CS education
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex justify-center mb-12">
        <div
          className="inline-flex rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--color-border)' }}
        >
          <button
            onClick={() => setActiveTab('category')}
            className="px-6 py-2.5 text-sm transition-colors duration-200 cursor-pointer border-none"
            style={{
              background: activeTab === 'category' ? 'var(--color-accent)' : 'transparent',
              color:      activeTab === 'category' ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'category' ? 700 : 400,
            }}
          >
            By Category
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className="px-6 py-2.5 text-sm transition-colors duration-200 cursor-pointer border-none"
            style={{
              background: activeTab === 'catalog' ? 'var(--color-accent)' : 'transparent',
              color:      activeTab === 'catalog' ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'catalog' ? 700 : 400,
            }}
          >
            Projects Catalog
          </button>
        </div>
      </div>

      {/* ── By Category view ── */}
      {activeTab === 'category' ? (
        <div>
          <ProjectTOC tools={tools} achievements={achievements} />

          {/* Section 1: Tools & Software */}
          <div id="section-tools" className="mb-20">
            <h2 className="text-3xl font-bold mb-8 font-display border-b border-[var(--color-border)] pb-4 text-center">
              Tools &amp; Software
            </h2>
            <div className="grid grid-cols-1 max-w-2xl mx-auto gap-3 w-full">
              {tools.map((project) => {
                const isIframeExpanded = expandedId === project.id
                return (
                  <div id={`section-tool-${project.id}`} key={project.id}>
                    <AnimatedItem skip={skipAnimation}>
                      <ToolCard
                        project={project}
                        isIframeExpanded={isIframeExpanded}
                        onToggleIframe={() => setExpandedId(isIframeExpanded ? null : project.id)}
                        onCollapseIframe={() => setExpandedId(null)}
                      />
                    </AnimatedItem>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section 2: Achievements & Initiatives */}
          <div id="section-achievements">
            <h2 className="text-3xl font-bold mb-8 font-display border-b border-[var(--color-border)] pb-4 text-center">
              Achievements &amp; Initiatives
            </h2>
            <div className="grid grid-cols-1 max-w-2xl mx-auto gap-6 w-full">
              {achievements.map((project) => (
                <div id={`section-achievement-${project.id}`} key={project.id}>
                  <AnimatedItem skip={skipAnimation}>
                    <AchievementCard project={project} />
                  </AnimatedItem>
                </div>
              ))}
            </div>
          </div>
        </div>

      ) : (
        /* ── Projects Catalog view ── */
        <div>
          {/* Search bar */}
          <div className="relative mb-6 max-w-5xl mx-auto">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: 'var(--color-text-muted)' }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search projects, tools, initiatives…"
              aria-label="Search projects"
              className="w-full pl-11 pr-4 py-3 rounded-lg text-sm outline-none transition-colors duration-200"
              style={{
                background: 'var(--color-surface)',
                border:     '1px solid var(--color-border)',
                color:      'var(--color-text-primary)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
              onBlur={e  => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            />
          </div>

          {/* Type filter pills */}
          <div className="flex flex-wrap gap-2 mb-8 max-w-5xl mx-auto">
            {TYPE_FILTERS.map(f => {
              const isActive = activeType === f.value
              const bgColor  = f.value !== 'all' ? TYPE_COLORS[f.value as ProjectType] : undefined
              const txtColor = f.value !== 'all' ? TYPE_TEXT[f.value as ProjectType]   : undefined
              return (
                <button
                  key={f.value}
                  onClick={() => setActiveType(f.value)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer"
                  style={{
                    background: isActive
                      ? (f.value === 'all' ? 'var(--color-accent)' : bgColor)
                      : 'var(--color-surface)',
                    color: isActive
                      ? (f.value === 'all' ? 'var(--color-bg-primary)' : txtColor)
                      : 'var(--color-text-muted)',
                    border: `1px solid ${isActive
                      ? (f.value === 'all' ? 'var(--color-accent)' : txtColor)
                      : 'var(--color-border)'}`,
                  }}
                  aria-pressed={isActive}
                >
                  {f.label}
                </button>
              )
            })}
          </div>

          {/* Result count */}
          <p className="text-xs text-[var(--color-text-muted)] mb-5 font-mono max-w-5xl mx-auto">
            {filteredCatalog.length === projects.length
              ? `${filteredCatalog.length} projects`
              : `${filteredCatalog.length} of ${projects.length} projects`}
          </p>

          {/* Grid */}
          {filteredCatalog.length === 0 ? (
            <div className="text-center py-20 text-[var(--color-text-muted)] max-w-5xl mx-auto">
              <p className="text-4xl mb-4" aria-hidden="true">∅</p>
              <p>No projects match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {filteredCatalog.map((project) => (
                <CatalogProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

/* ── Exported wrapper ── */

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <Suspense>
      <ProjectGridInner projects={projects} />
    </Suspense>
  )
}
