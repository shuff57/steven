'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { education } from '@/data/education'
import { profile } from '@/data/profile'
import type { Credential, Education } from '@/data/education'
import { AnimatedItem } from '@/components/ui/AnimatedItem'
import { getUniversalStatusLabel, getUniversalStatusClass } from '@/lib/statusHelpers'

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
  const [tocWidth, setTocWidth] = useState('calc((50vw - 336px) / 2)')

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

  return (
    <nav
      className="hidden lg:flex fixed z-40 print:hidden items-center"
      style={{ left: 0, width: tocWidth, top: '64px', height: 'calc(100vh - 64px)' }}
    >
      <div
        className="flex flex-col gap-1 p-2 rounded-r-xl"
        style={{
          width: '100%',
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
              type="button"
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

/* ── By-Category Cards ── */

function DegreeCard({ degree }: { degree: Credential }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const showBody = isExpanded || isHovered

  return (
    <div
      className="chalk-card rounded-xl border border-[var(--color-border)] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Always-visible header */}
      <button
        type="button"
        className="px-5 py-4 flex justify-between items-start w-full text-left"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={showBody}
      >
        <div className="flex-1 min-w-0 pr-3">
          <h3 className="text-xl font-bold font-display text-[var(--color-accent)]">
            {degree.field}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 font-medium">
            {degree.degree}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs font-mono text-[var(--color-text-secondary)]">
            {degree.date}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide shrink-0 ${getUniversalStatusClass(degree.status)}`}>
            {getUniversalStatusLabel(degree.status)}
          </span>
        </div>
      </button>

      {/* Expandable body */}
      <div
        style={{
          height: showBody ? `${bodyRef.current?.scrollHeight ?? 100}px` : '0px',
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
  const [isHovered, setIsHovered] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const showBody = isExpanded || isHovered

  return (
    <div
      className="chalk-card rounded-xl border border-[var(--color-border)] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Always-visible header */}
      <button
        type="button"
        className="px-5 py-4 flex justify-between items-start w-full text-left"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={showBody}
      >
        <div className="flex-1 min-w-0 pr-3">
          <h3 className="text-xl font-bold font-display text-[var(--color-accent)] leading-snug">
            {credential.field}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 font-medium">
            {credential.degree}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs font-mono text-[var(--color-text-secondary)]">
            {credential.date}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide shrink-0 ${getUniversalStatusClass(credential.status)}`}>
            {getUniversalStatusLabel(credential.status)}
          </span>
        </div>
      </button>

      {/* Expandable body */}
      <div
        style={{
          height: showBody ? `${bodyRef.current?.scrollHeight ?? 80}px` : '0px',
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

function ThesisCard({ thesis }: { thesis: NonNullable<Education['thesis']> }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isTouchExpanded, setIsTouchExpanded] = useState(false)
  const hasTouched = useRef(false)
  const isExpanded = isHovered || isTouchExpanded

  return (
    <div
      className="chalk-card rounded-xl overflow-hidden relative group transition-colors duration-200"
      style={{ border: `1px solid ${isExpanded ? 'var(--color-accent)' : 'var(--color-border)'}` }}
      onMouseEnter={() => { if (!hasTouched.current) setIsHovered(true) }}
      onMouseLeave={() => { if (!hasTouched.current) setIsHovered(false) }}
    >
      {/* Decorative background icon */}
      <div
        className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none"
        aria-hidden="true"
      >
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-label="book icon">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </div>

      {/* Always-visible header — tap to expand on touch */}
      <button
        type="button"
        className="relative z-10 px-8 pt-8 pb-5 w-full text-left"
        style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}
        onClick={() => setIsTouchExpanded((prev) => !prev)}
        onTouchStart={() => { hasTouched.current = true }}
        aria-expanded={isExpanded}
      >
        <div className="text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
          Master&apos;s Thesis
        </div>
        <h3 className="text-2xl font-display italic mb-4 leading-tight text-[var(--color-text-primary)]">
          &ldquo;{thesis.title}&rdquo;
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {thesis.summary}
        </p>
      </button>

      {/* Expandable body — abstract + button */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isExpanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s ease-in-out',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div className="relative z-10 px-8 pb-6 border-t border-[var(--color-border)]">
            <div className="pt-4 mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Abstract</p>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {thesis.abstract}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 mt-1 mb-1">
              <a
                href="/documents?doc=thesis"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded transition-colors duration-200 hover:opacity-80"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-primary)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Read Full Thesis
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Catalog types & helpers ── */

type CatalogItemType = 'degree' | 'credential' | 'thesis' | 'research'

interface CatalogItem {
  type: CatalogItemType
  title: string
  subtitle: string
  meta: string
  detail?: string
  link?: string
}

const TYPE_LABELS: Record<CatalogItemType, string> = {
  degree:     'Degree',
  credential: 'Credential',
  thesis:     'Thesis',
  research:   'Research Interest',
}

const TYPE_BG: Record<CatalogItemType, string> = {
  degree:     'rgba(240,192,96,0.15)',
  credential: 'rgba(99,179,237,0.15)',
  thesis:     'rgba(154,117,255,0.15)',
  research:   'rgba(72,187,120,0.15)',
}

const TYPE_TEXT: Record<CatalogItemType, string> = {
  degree:     '#f0c060',
  credential: '#63b3ed',
  thesis:     '#9a75ff',
  research:   '#48bb78',
}

function buildCatalogItems(): CatalogItem[] {
  const items: CatalogItem[] = []

  for (const d of education.degrees) {
    items.push({
      type:     'degree',
      title:    d.degree,
      subtitle: d.field,
      meta:     d.date,
      detail:   d.institution + (d.notes ? ` · ${d.notes}` : ''),
    })
  }

  if (education.thesis) {
    items.push({
      type:     'thesis',
      title:    education.thesis.title,
      subtitle: 'Master\'s Thesis',
      meta:     'May 2021',
      detail:   education.thesis.summary,
      link:     '/documents?doc=thesis',
    })
  }

  for (const c of education.credentials) {
    items.push({
      type:     'credential',
      title:    c.degree,
      subtitle: c.field,
      meta:     c.date,
      detail:   c.institution,
    })
  }

  for (const r of profile.researchInterests) {
    items.push({
      type:     'research',
      title:    r,
      subtitle: 'Research Interest',
      meta:     '',
    })
  }

  return items
}

const ALL_CATALOG_ITEMS = buildCatalogItems()

const FILTER_OPTIONS: { label: string; value: CatalogItemType | 'all' }[] = [
  { label: 'All',                value: 'all'        },
  { label: 'Degrees',            value: 'degree'     },
  { label: 'Credentials',        value: 'credential' },
  { label: 'Thesis',             value: 'thesis'     },
  { label: 'Research Interests', value: 'research'   },
]

/* ── Catalog Card ── */

function CatalogEducationCard({ item }: { item: CatalogItem }) {
  return (
    <div
      className="chalk-card rounded-xl border border-[var(--color-border)] p-4 flex flex-col gap-2 transition-colors duration-200 hover:border-[var(--color-accent)]"
      style={{ minHeight: '100px' }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--color-accent)] leading-snug line-clamp-3 flex-1 min-w-0">
          {item.title}
        </p>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded shrink-0"
          style={{ background: TYPE_BG[item.type], color: TYPE_TEXT[item.type] }}
        >
          {TYPE_LABELS[item.type]}
        </span>
      </div>

      {item.meta && (
        <span className="text-xs font-mono text-[var(--color-text-muted)]">
          {item.meta}
        </span>
      )}

      {/* Detail */}
      {item.detail && item.detail !== item.subtitle && (
        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
          {item.detail}
        </p>
      )}

      {/* Link */}
      {item.link && (
        <a
          href={item.link}
          className="mt-auto text-xs font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
          style={{ color: TYPE_TEXT[item.type] }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Read Thesis
        </a>
      )}
    </div>
  )
}

/* ── Inner component (needs useSearchParams) ── */

function EducationViewInner() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'category' | 'catalog'>(
    searchParams.get('view') === 'catalog' ? 'catalog' : 'category'
  )

  // Catalog state
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<CatalogItemType | 'all'>('all')

  const filteredItems = ALL_CATALOG_ITEMS.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter
    const q = search.toLowerCase()
    const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || (item.detail ?? '').toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })

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

      {/* Toggle bar */}
      <div className="flex justify-center mb-12">
        <div
          className="inline-flex rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--color-border)' }}
        >
          <button
            type="button"
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
            type="button"
            onClick={() => setActiveTab('catalog')}
            className="px-6 py-2.5 text-sm transition-colors duration-200 cursor-pointer border-none"
            style={{
              background: activeTab === 'catalog' ? 'var(--color-accent)' : 'transparent',
              color:      activeTab === 'catalog' ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'catalog' ? 700 : 400,
              borderLeft: '1px solid var(--color-border)',
            }}
          >
            Education Catalog
          </button>
        </div>
      </div>

      {/* ── BY CATEGORY TAB ── */}
      {activeTab === 'category' && (
        <>
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
                {education.degrees.map((degree) => (
                  <AnimatedItem key={degree.field}>
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
                  <ThesisCard thesis={education.thesis} />
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
                {education.credentials.map((cred) => (
                  <AnimatedItem key={cred.field}>
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
                Research focus areas
              </p>

              <div className="grid grid-cols-1 gap-3 w-full">
                {profile.researchInterests.map((interest) => (
                  <AnimatedItem key={interest}>
                    <div className="chalk-card rounded-xl border border-[var(--color-border)] px-5 py-3">
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                        {interest}
                      </p>
                    </div>
                  </AnimatedItem>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      {/* ── CATALOG TAB ── */}
      {activeTab === 'catalog' && (
        <div className="max-w-5xl mx-auto">

          {/* Search + filters */}
          <div className="mb-8 space-y-4">
            <input
              type="text"
              placeholder="Search education…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-sm border outline-none transition-colors duration-200"
              style={{
                background:  'var(--color-surface)',
                border:      '1px solid var(--color-border)',
                color:       'var(--color-text-primary)',
              }}
            />
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map(opt => {
                const isActive = activeFilter === opt.value
                const colorKey = opt.value === 'all' ? null : opt.value as CatalogItemType
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setActiveFilter(opt.value)}
                    className="px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer border"
                    style={{
                      background:  isActive ? (colorKey ? TYPE_BG[colorKey] : 'var(--color-accent)') : 'transparent',
                      borderColor: isActive ? (colorKey ? TYPE_TEXT[colorKey] : 'var(--color-accent)') : 'var(--color-border)',
                      color:       isActive ? (colorKey ? TYPE_TEXT[colorKey] : 'var(--color-bg-primary)') : 'var(--color-text-muted)',
                      fontWeight:  isActive ? 600 : 400,
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <CatalogEducationCard key={`${item.type}-${item.title}`} item={item} />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20 text-[var(--color-text-muted)]">
              No items match your search.
            </div>
          )}
        </div>
      )}

    </section>
  )
}

/* ── Public export (Suspense boundary for useSearchParams) ── */

export function EducationView() {
  return (
    <Suspense>
      <EducationViewInner />
    </Suspense>
  )
}
