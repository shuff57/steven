'use client'

import { useState, useMemo } from 'react'
import { conferences } from '@/data/conferences'
import { ConferenceCard } from '@/components/cards/ConferenceCard'

type Category = 'all' | 'faculty-dev' | 'math-ed' | 'technical'

const CATEGORY_FILTERS: Array<{ value: Category; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'faculty-dev', label: 'Faculty Development' },
  { value: 'math-ed', label: 'Mathematics Education' },
  { value: 'technical', label: 'Technical & Industry' },
]

const FACULTY_DEV = new Set([
  'SLC Math Tutor Training Facilitator',
  'CSU Chico "GoFlex Session #1"',
  'FLC Faculty Writing Community',
  'Quality Learning and Teaching Workshops (QLT)',
  'Digital Pedagogy FLC',
  'Theory and Practice of Teaching First-Year Students FLC',
  'CSU Chico "Go Virtual Summer Institute #2"',
  'EO 1100 Co-Requisite PD Instructor',
])

const MATH_ED = new Set([
  'Mount Lassen Mathematics Conference',
  "CSU Sacramento's 2020 Quantitative Reasoning Summer Course",
  'Chico Math Project Summer Workshop',
  '2018 CPM Teacher Conference',
  'AP Calculus AB and BC Workshop',
  'AVID Certified',
])

function getCategory(title: string): Exclude<Category, 'all'> {
  if (FACULTY_DEV.has(title)) return 'faculty-dev'
  if (MATH_ED.has(title)) return 'math-ed'
  return 'technical'
}

export function ProfessionalDevelopment() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return conferences.filter((item) => {
      if (activeCategory !== 'all' && getCategory(item.title) !== activeCategory) return false
      if (q) {
        const haystack = `${item.title} ${item.description} ${item.location ?? ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [query, activeCategory])

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-text-primary)] mb-4">
          Professional Development
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          {conferences.length} conferences, workshops, and technical trainings
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
          placeholder="Search by title, keyword, or location…"
          aria-label="Search professional development"
          className="w-full pl-11 pr-4 py-3 rounded-lg text-sm outline-none transition-colors duration-200"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by category">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveCategory(f.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer"
            style={{
              background: activeCategory === f.value ? 'var(--color-accent)' : 'var(--color-surface)',
              color: activeCategory === f.value ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
              border: `1px solid ${activeCategory === f.value ? 'var(--color-accent)' : 'var(--color-border)'}`,
            }}
            aria-pressed={activeCategory === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="text-xs text-[var(--color-text-muted)] mb-5 font-mono">
        {filtered.length === conferences.length
          ? `${filtered.length} items`
          : `${filtered.length} of ${conferences.length} items`}
      </p>

      {/* Conference cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <p className="text-4xl mb-4" aria-hidden="true">∅</p>
          <p>No results match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 max-w-2xl mx-auto gap-3">
          {filtered.map((item, i) => (
            <ConferenceCard key={`${item.title}-${i}`} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
