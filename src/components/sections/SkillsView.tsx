'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { languages, software, systems, hardware, shinyAppsUrl } from '@/data/skills'
import { AnimatedItem } from '@/components/ui/AnimatedItem'

/* ── Types ── */

type SkillCategory = 'language' | 'software' | 'system' | 'hardware'

type SkillItem = {
  name: string
  category: SkillCategory
  link?: string
}

/* ── Constants ── */

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  language: 'rgba(129, 140, 248, 0.15)',
  software: 'rgba(251, 146, 60, 0.15)',
  system:   'rgba(96, 165, 250, 0.15)',
  hardware: 'rgba(240, 192, 96, 0.15)',
}

const CATEGORY_TEXT: Record<SkillCategory, string> = {
  language: '#818cf8',
  software: '#fb923c',
  system:   '#60a5fa',
  hardware: '#f0c060',
}

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  language: 'Language',
  software: 'Software',
  system:   'System',
  hardware: 'Hardware',
}

const CATEGORY_FILTERS: Array<{ value: SkillCategory | 'all'; label: string }> = [
  { value: 'all',      label: 'All' },
  { value: 'language', label: 'Languages' },
  { value: 'software', label: 'Software' },
  { value: 'system',   label: 'Systems' },
  { value: 'hardware', label: 'Hardware' },
]

const TOC_ITEMS = [
  { label: 'Languages', id: 'section-languages' },
  { label: 'Software',  id: 'section-software'  },
  { label: 'Systems',   id: 'section-systems'   },
  { label: 'Hardware',  id: 'section-hardware'  },
]

/* ── Skill data assembly ── */

const ALL_SKILLS: SkillItem[] = [
  ...languages.map(name => ({ name, category: 'language' as SkillCategory })),
  ...software.map(name => ({
    name,
    category: 'software' as SkillCategory,
    link: name === 'Shiny Apps' ? shinyAppsUrl : undefined,
  })),
  ...systems.map(name  => ({ name, category: 'system'   as SkillCategory })),
  ...hardware.map(name => ({ name, category: 'hardware'  as SkillCategory })),
]

/* ── TOC ── */

function SkillsTOC({ visible }: { visible: boolean }) {
  const [activeId, setActiveId] = useState(TOC_ITEMS[0].id)
  const [tocWidth, setTocWidth] = useState('calc(50vw - 358px)')
  const [tocTop,   setTocTop]   = useState<number | null>(null)
  const tocHeight = TOC_ITEMS.length * 48 + 16

  useEffect(() => {
    const update = () => setTocWidth(`${Math.max(0, window.innerWidth / 2 - 358)}px`)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!visible) return
    const firstId = TOC_ITEMS[0].id

    const updateTop = () => {
      const el = document.getElementById(firstId)
      if (!el) return
      const sectionTop     = el.getBoundingClientRect().top
      const viewportHeight = window.innerHeight
      const centeredTop    = (viewportHeight - tocHeight) / 2
      setTocTop(Math.max(centeredTop, sectionTop))
    }

    updateTop()
    window.addEventListener('scroll', updateTop, { passive: true })
    window.addEventListener('resize', updateTop)
    return () => {
      window.removeEventListener('scroll', updateTop)
      window.removeEventListener('resize', updateTop)
    }
  }, [visible])

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
      { rootMargin: '-15% 0px -55% 0px', threshold: 0 },
    )
    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [visible])

  if (!visible || tocTop === null) return null

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

/* ── Skill card (used in both views) ── */

function SkillCard({ skill }: { skill: SkillItem }) {
  const colors    = CATEGORY_COLORS[skill.category]
  const textColor = CATEGORY_TEXT[skill.category]

  return (
    <div className="chalk-card rounded-xl border border-[var(--color-border)] overflow-hidden p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="inline-block text-xs font-bold px-2 py-0.5 rounded"
          style={{ background: colors, color: textColor }}
        >
          {CATEGORY_LABELS[skill.category]}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[var(--color-text-primary)] leading-snug">
          {skill.name}
        </span>
        {skill.link && (
          <a
            href={skill.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${skill.name}`}
            className="ml-auto shrink-0 transition-colors duration-150"
            style={{ color: textColor }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

/* ── By-category section ── */

function CategorySection({
  id, title, subtitle, skills,
}: {
  id: string
  title: string
  subtitle?: string
  skills: SkillItem[]
}) {
  return (
    <div id={id}>
      <h2 className="text-3xl font-bold mb-2 font-display border-b border-[var(--color-border)] pb-4 text-center">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8">{subtitle}</p>
      )}
      <div className="grid grid-cols-1 gap-3 w-full">
        {skills.map((skill, i) => (
          <AnimatedItem key={`${skill.name}-${i}`}>
            <SkillCard skill={skill} />
          </AnimatedItem>
        ))}
      </div>
    </div>
  )
}

/* ── Main inner component ── */

function SkillsViewInner() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'category' | 'search'>(
    searchParams.get('view') === 'search' ? 'search' : 'category'
  )

  const [query,          setQuery]          = useState('')
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return ALL_SKILLS.filter(skill => {
      if (activeCategory !== 'all' && skill.category !== activeCategory) return false
      if (q && !skill.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [query, activeCategory])

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
          Skills <span style={{ color: 'var(--color-accent)' }}>&amp;</span> Technology
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Programming languages, tools, systems, and hardware I work with
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
            onClick={() => setActiveTab('search')}
            className="px-6 py-2.5 text-sm transition-colors duration-200 cursor-pointer border-none"
            style={{
              background: activeTab === 'search' ? 'var(--color-accent)' : 'transparent',
              color:      activeTab === 'search' ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'search' ? 700 : 400,
            }}
          >
            Search All
          </button>
        </div>
      </div>

      {/* ── By Category view ── */}
      {activeTab === 'category' ? (
        <div>
          <SkillsTOC visible={true} />
          <div className="max-w-2xl mx-auto space-y-20">

            <CategorySection
              id="section-languages"
              title="Languages"
              subtitle="Programming and markup languages"
              skills={ALL_SKILLS.filter(s => s.category === 'language')}
            />

            <CategorySection
              id="section-software"
              title="Software"
              subtitle="Applications, platforms, and tools"
              skills={ALL_SKILLS.filter(s => s.category === 'software')}
            />

            <CategorySection
              id="section-systems"
              title="Systems"
              subtitle="Learning management and administrative platforms"
              skills={ALL_SKILLS.filter(s => s.category === 'system')}
            />

            <CategorySection
              id="section-hardware"
              title="Hardware"
              subtitle="Physical computing and fabrication equipment"
              skills={ALL_SKILLS.filter(s => s.category === 'hardware')}
            />

          </div>
        </div>

      ) : (
        /* ── Search view ── */
        <div>
          {/* Search bar */}
          <div className="relative mb-6 max-w-2xl mx-auto">
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
              placeholder="Search languages, tools, systems…"
              aria-label="Search skills"
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

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 mb-8 max-w-2xl mx-auto">
            {CATEGORY_FILTERS.map(f => {
              const isActive = activeCategory === f.value
              const colors   = f.value !== 'all' ? CATEGORY_COLORS[f.value as SkillCategory] : undefined
              const text     = f.value !== 'all' ? CATEGORY_TEXT[f.value as SkillCategory]   : undefined
              return (
                <button
                  key={f.value}
                  onClick={() => setActiveCategory(f.value)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer"
                  style={{
                    background: isActive
                      ? (f.value === 'all' ? 'var(--color-accent)' : colors)
                      : 'var(--color-surface)',
                    color: isActive
                      ? (f.value === 'all' ? 'var(--color-bg-primary)' : text)
                      : 'var(--color-text-muted)',
                    border: `1px solid ${isActive
                      ? (f.value === 'all' ? 'var(--color-accent)' : text)
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
          <p className="text-xs text-[var(--color-text-muted)] mb-5 font-mono max-w-2xl mx-auto">
            {filtered.length === ALL_SKILLS.length
              ? `${filtered.length} skills`
              : `${filtered.length} of ${ALL_SKILLS.length} skills`}
          </p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-[var(--color-text-muted)] max-w-2xl mx-auto">
              <p className="text-4xl mb-4" aria-hidden="true">∅</p>
              <p>No skills match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {filtered.map((skill, i) => (
                <SkillCard key={`${skill.name}-${i}`} skill={skill} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

/* ── Exported wrapper ── */

export function SkillsView() {
  return (
    <Suspense>
      <SkillsViewInner />
    </Suspense>
  )
}
