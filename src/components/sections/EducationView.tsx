'use client'

import { useState, useEffect, useRef } from 'react'
import { education } from '@/data/education'
import { profile } from '@/data/profile'
import type { Credential } from '@/data/education'
import { AnimatedItem } from '@/components/ui/AnimatedItem'

/* ── TOC config ── */

const TOC_ITEMS = [
  { label: 'Degrees',          id: 'section-degrees'     },
  { label: "Master's Thesis",  id: 'section-thesis'      },
  { label: 'Credentials',      id: 'section-credentials' },
  { label: 'Interests',        id: 'section-interests'   },
]

/* ── TOC component ── */

function EducationTOC() {
  const [activeId, setActiveId] = useState(TOC_ITEMS[0].id)
  const [tocWidth, setTocWidth] = useState('calc(50vw - 358px)')
  const [tocTop, setTocTop]   = useState<number | null>(null)
  const tocHeight = TOC_ITEMS.length * 48 + 16

  useEffect(() => {
    const update = () => setTocWidth(`${Math.max(0, window.innerWidth / 2 - 358)}px`)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const firstId = TOC_ITEMS[0].id

    const updateTop = () => {
      const el = document.getElementById(firstId)
      if (!el) return
      const sectionTop   = el.getBoundingClientRect().top
      const viewportHeight = window.innerHeight
      const centeredTop  = (viewportHeight - tocHeight) / 2
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
        const vis = entries.filter(e => e.isIntersecting)
        if (!vis.length) return
        const topmost = vis.reduce((best, e) =>
          Math.abs(e.boundingClientRect.top) < Math.abs(best.boundingClientRect.top) ? e : best
        )
        setActiveId(topmost.target.id)
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: 0 },
    )
    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  if (tocTop === null) return null

  return (
    <nav
      className="hidden lg:block fixed left-0 z-40 print:hidden"
      style={{ width: tocWidth, top: `${tocTop}px` }}
    >
      <div
        className="flex flex-col gap-1 p-2 rounded-r-xl"
        style={{
          background:   'var(--color-surface)',
          borderTop:    '1px solid var(--color-border)',
          borderRight:  '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {TOC_ITEMS.map(item => {
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

/* ── Cards ── */

function DegreeCard({ degree }: { degree: Credential }) {
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
          <h3 className="text-xl font-bold font-display text-[var(--color-text-primary)]">
            {degree.degree}
          </h3>
          <p className="text-sm text-[var(--color-accent)] mt-0.5 font-medium">
            {degree.field}
          </p>
        </div>
        <span className="text-xs font-mono text-[var(--color-text-muted)] shrink-0 mt-1">
          {degree.date}
        </span>
      </div>

      {/* Expandable body */}
      <div
        style={{
          height: isExpanded ? `${bodyRef.current?.scrollHeight ?? 100}px` : '0px',
          overflow: 'hidden',
          transition: 'height 0.3s ease-in-out',
        }}
      >
        <div ref={bodyRef} className="px-5 pb-5 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-3">
            {degree.institution}
          </p>
          {degree.notes && (
            <p className="text-sm text-[var(--color-text-muted)] italic mt-1">
              {degree.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function CredentialCard({ credential }: { credential: Credential }) {
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
          <h3 className="text-xl font-bold font-display text-[var(--color-text-primary)] leading-snug">
            {credential.degree}
          </h3>
          <p className="text-sm text-[var(--color-accent)] mt-0.5 font-medium">
            {credential.field}
          </p>
        </div>
        <span className="text-xs font-mono text-[var(--color-text-muted)] shrink-0 mt-1">
          {credential.date}
        </span>
      </div>

      {/* Expandable body */}
      <div
        style={{
          height: isExpanded ? `${bodyRef.current?.scrollHeight ?? 80}px` : '0px',
          overflow: 'hidden',
          transition: 'height 0.3s ease-in-out',
        }}
      >
        <div ref={bodyRef} className="px-5 pb-5 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-3">
            {credential.institution}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Main view ── */

export function EducationView() {
  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
          Education <span style={{ color: 'var(--color-accent)' }}>&amp;</span> Credentials
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Graduate training in mathematics education and ongoing professional development
        </p>
      </div>

      <EducationTOC />

      <div className="max-w-2xl mx-auto space-y-20">

        {/* Degrees */}
        <div id="section-degrees">
          <h2 className="text-3xl font-bold mb-2 font-display border-b border-[var(--color-border)] pb-4 text-center">
            Degrees
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8">
            California State University, Chico · Department of Mathematics and Statistics
          </p>
          <div className="grid grid-cols-1 gap-3 w-full">
            {education.degrees.map((degree, i) => (
              <AnimatedItem key={i}>
                <DegreeCard degree={degree} />
              </AnimatedItem>
            ))}
          </div>
        </div>

        {/* Thesis */}
        {education.thesis && (
          <div id="section-thesis">
            <h2 className="text-3xl font-bold mb-2 font-display border-b border-[var(--color-border)] pb-4 text-center">
              Master&apos;s Thesis
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8">
              California State University, Chico · May 2021
            </p>
            <AnimatedItem>
              <div className="chalk-card border-l-4 border-l-[var(--color-accent)] rounded-xl overflow-hidden p-8 relative group">
                {/* Decorative background icon */}
                <div
                  className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none"
                  aria-hidden="true"
                >
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <div className="text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
                    Master&apos;s Thesis
                  </div>
                  <h3 className="text-2xl font-display italic mb-4 leading-tight text-[var(--color-text-primary)]">
                    &ldquo;{education.thesis.title}&rdquo;
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
                    {education.thesis.summary}
                  </p>
                  <a
                    href={education.thesis.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-opacity hover:opacity-80"
                    style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-primary)' }}
                  >
                    Read Full Thesis
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </AnimatedItem>
          </div>
        )}

        {/* Credentials */}
        <div id="section-credentials">
          <h2 className="text-3xl font-bold mb-2 font-display border-b border-[var(--color-border)] pb-4 text-center">
            Credentials
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8">
            California State University, Chico
          </p>
          <div className="grid grid-cols-1 gap-3 w-full">
            {education.credentials.map((cred, i) => (
              <AnimatedItem key={i}>
                <CredentialCard credential={cred} />
              </AnimatedItem>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div id="section-interests">
          <h2 className="text-3xl font-bold mb-2 font-display border-b border-[var(--color-border)] pb-4 text-center">
            Interests
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8">
            Research &amp; teaching focus areas
          </p>

          <div className="space-y-10">
            {/* Research interests */}
            <div>
              <h3 className="text-lg font-semibold font-display text-[var(--color-text-primary)] mb-4">
                Research
              </h3>
              <div className="grid grid-cols-1 gap-3 w-full">
                {profile.researchInterests.map((interest, i) => (
                  <AnimatedItem key={i}>
                    <div className="chalk-card rounded-xl border border-[var(--color-border)] px-5 py-3">
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                        {interest}
                      </p>
                    </div>
                  </AnimatedItem>
                ))}
              </div>
            </div>

            {/* Teaching interests */}
            <div>
              <h3 className="text-lg font-semibold font-display text-[var(--color-text-primary)] mb-4">
                Teaching
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.teachingInterests.map((interest, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-default"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
