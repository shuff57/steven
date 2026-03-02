'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Folder } from './Folder'

interface FolderItem {
  title: string
  href: string
}

interface FolderSection {
  label: string
  items: FolderItem[]
}

const FOLDER_SECTIONS: FolderSection[] = [
  {
    label: 'Experience',
    items: [
      { title: 'Post-Secondary', href: '/experience#section-post-secondary' },
      { title: 'Secondary', href: '/experience#section-secondary' },
      { title: 'Elementary', href: '/experience#section-elementary' },
    ],
  },
  {
    label: 'Projects',
    items: [
      { title: 'Tools & Software', href: '/projects#section-tools' },
      { title: 'Achievements', href: '/projects#section-achievements' },
    ],
  },
  {
    label: 'Education',
    items: [
      { title: 'Degrees & Credentials', href: '/education#section-degrees' },
      { title: "Master's Thesis", href: '/education#section-thesis' },
      { title: 'Interests', href: '/education#section-interests' },
    ],
  },
  {
    label: 'Skills',
    items: [
      { title: 'Languages & Software', href: '/skills#section-languages' },
      { title: 'Systems & Hardware', href: '/skills#section-lms' },
      { title: 'Courses I Can Teach', href: '/skills#section-teaching' },
    ],
  },
  {
    label: 'Courses',
    items: [
      { title: 'Browse Catalog', href: '/courses' },
    ],
  },
  {
    label: 'Contact',
    items: [
      { title: 'Get in Touch', href: '/contact#section-contact-info' },
      { title: 'Download CV', href: '/contact#section-download-cv' },
      { title: 'Conferences', href: '/contact#section-conferences' },
    ],
  },
]

export function FolderNav() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const router = useRouter()

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenIndex(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav
      ref={navRef}
      data-testid="folder-nav"
      className="fixed left-3 xl:left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:block print:hidden"
    >
      <div className="flex flex-col gap-6 items-start">
        {FOLDER_SECTIONS.map((section, idx) => {
          const isOpen = openIndex === idx

          const paperItems = section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[10px] font-medium p-1 w-full h-full flex items-center justify-center text-center leading-tight hover:opacity-80 transition-opacity"
              style={{ color: 'var(--color-text-primary)' }}
              onClick={(e) => {
                e.stopPropagation()
                setOpenIndex(null)
              }}
            >
              {item.title}
            </Link>
          ))

          return (
            <div key={section.label} className="flex flex-col items-center">
              <Folder
                color="#5ECEC3"
                size={0.6}
                items={paperItems}
                open={isOpen}
                onToggle={() => setOpenIndex(isOpen ? null : idx)}
                onPaperClick={(i) => {
                  router.push(section.items[i].href)
                  setOpenIndex(null)
                }}
              />
              <span
                className="text-[9px] font-medium text-center mt-1 block whitespace-nowrap"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {section.label}
              </span>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
