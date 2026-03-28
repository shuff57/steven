'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { CV_PDF_PATH, THESIS_PDF_PATH, DOCUMENTS_PATH } from '@/lib/pdfConfig'
import { useNewRoutes } from '@/lib/useNewContent'
import { useAutoExpand } from '@/lib/autoExpandContext'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/education', label: 'Education' },
  { href: '/skills', label: 'Skills' },
  { href: '/professional-development', label: 'Prof. Development' },
  { href: '/contact', label: 'Contact' },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)
  const newRoutes = useNewRoutes()
  const { autoExpand, setAutoExpand } = useAutoExpand()
  // Close mobile menu on Escape; close dropdown on Escape + outside click
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileOpen) setMobileOpen(false)
        if (dropdownOpen) setDropdownOpen(false)
        if (settingsOpen) setSettingsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [mobileOpen, dropdownOpen, settingsOpen])

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false)
      }
      if (settingsRef.current && !settingsRef.current.contains(target)) {
        setSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-bg-primary) 92%, transparent)',
        borderColor: 'var(--color-border)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 h-16"
        style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold transition-opacity hover:opacity-80"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-accent)',
            textDecoration: 'none',
          }}
        >
          Steven Huff
        </Link>

        {/* Desktop nav links — centered */}
        <div className="hidden lg:flex items-center justify-center gap-8">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href
            const hasNew = newRoutes.has(href)
            return (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium transition-colors duration-200"
                style={{
                  position: 'relative',
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  textDecorationLine: isActive ? 'underline' : 'none',
                  textDecorationColor: 'var(--color-accent)',
                  textUnderlineOffset: '4px',
                }}
              >
                {label}
                {hasNew && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-8px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-accent)',
                    }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right: Documents dropdown + Settings popover (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-3" style={{ justifySelf: 'end', gridColumn: 3 }}>

          <div ref={dropdownRef} className="hidden lg:block" style={{ position: 'relative' }}>
            {/* Trigger */}
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              className="text-xl font-bold transition-opacity hover:opacity-80"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                border: 'none',
                background: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                color: 'var(--color-accent)',
              }}
            >
              Documents
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
                style={{
                  transition: 'transform 0.15s',
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Dropdown panel */}
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  minWidth: '180px',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-card)',
                  overflow: 'hidden',
                  zIndex: 60,
                }}
              >
                {([
                  { label: 'View CV', href: DOCUMENTS_PATH, download: false },
                  { label: 'Download CV', href: CV_PDF_PATH, download: true },
                ] as const).map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    {...(item.download ? { download: true } : {})}
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'block',
                      padding: '8px 14px',
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      transition: 'background-color 0.1s, color 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-accent-muted)'
                      e.currentTarget.style.color = 'var(--color-accent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--color-text-secondary)'
                    }}
                  >
                    {item.label}
                  </a>
                ))}
                <div style={{ borderTop: '1px solid var(--color-border)', margin: '2px 0' }} />
                {([
                  { label: 'View Thesis', href: DOCUMENTS_PATH + '?doc=thesis', download: false },
                  { label: 'Download Thesis', href: THESIS_PDF_PATH, download: true },
                ] as const).map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    {...(item.download ? { download: true } : {})}
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'block',
                      padding: '8px 14px',
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      transition: 'background-color 0.1s, color 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-accent-muted)'
                      e.currentTarget.style.color = 'var(--color-accent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--color-text-secondary)'
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Settings / Auto-open toggle — desktop only */}
          <div ref={settingsRef} className="hidden lg:block" style={{ position: 'relative' }}>
            <button
              onClick={() => setSettingsOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={settingsOpen}
              className="text-xl font-bold transition-opacity hover:opacity-80"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                background: 'none',
                padding: '4px',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
              }}
              aria-label="Settings"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transition: 'transform 0.15s',
                  transform: settingsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>

            {settingsOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  minWidth: 'max-content',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-card)',
                  padding: '12px',
                  zIndex: 60,
                }}
              >
                <div style={{ marginBottom: '8px', fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                  Card Expand Mode
                </div>
                <div
                  className="inline-flex rounded-md overflow-hidden shrink-0"
                  style={{ border: '1px solid var(--color-border)', width: '100%' }}
                  role="group"
                  aria-label="Card expand mode"
                >
                  <button
                    type="button"
                    onClick={() => setAutoExpand(true)}
                    className="px-2.5 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer border-none flex-1"
                    style={{
                      background: autoExpand ? 'var(--color-accent)' : 'transparent',
                      color: autoExpand ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
                    }}
                    aria-pressed={autoExpand}
                    title="Cards expand on hover"
                  >
                    Auto-open
                  </button>
                  <button
                    type="button"
                    onClick={() => setAutoExpand(false)}
                    className="px-2.5 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer border-none flex-1"
                    style={{
                      background: !autoExpand ? 'var(--color-accent)' : 'transparent',
                      color: !autoExpand ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
                      borderLeft: '1px solid var(--color-border)',
                    }}
                    aria-pressed={!autoExpand}
                    title="Cards open only on click"
                  >
                    Click to open
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger button */}
          <button
            className="lg:hidden flex flex-col justify-center items-center gap-1.5 w-12 h-12 p-2 rounded-md hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >

            <span
              className="block h-0.5 rounded transition-all duration-200 origin-center"
              style={{
                backgroundColor: 'var(--color-text-primary)',
                width: '100%',
                transform: mobileOpen ? 'rotate(45deg) translate(0, 8px)' : 'none',
              }}
            />
            <span
              className="block h-0.5 rounded transition-all duration-200"
              style={{
                backgroundColor: 'var(--color-text-primary)',
                width: '100%',
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-0.5 rounded transition-all duration-200 origin-center"
              style={{
                backgroundColor: 'var(--color-text-primary)',
                width: '100%',
                transform: mobileOpen ? 'rotate(-45deg) translate(0, -8px)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: mobileOpen ? '400px' : '0',
          borderTop: mobileOpen ? '1px solid var(--color-border)' : 'none',
          backgroundColor: 'var(--color-bg-primary)',
        }}
      >
        <div className="px-4 py-6 flex flex-col gap-1 items-center">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href
            const hasNew = newRoutes.has(href)
            return (
              <Link
                key={href}
                href={href}
                className="block py-3 px-2 text-base rounded-md transition-colors duration-200 text-center w-full"
                style={{
                  position: 'relative',
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  backgroundColor: isActive ? 'var(--color-accent-muted)' : 'transparent',
                }}
                onClick={() => setMobileOpen(false)}
                tabIndex={mobileOpen ? 0 : -1}
              >
                {label}
                {hasNew && (
                  <span
                    style={{
                      display: 'inline-block',
                      marginLeft: '6px',
                      verticalAlign: 'middle',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-accent)',
                    }}
                  />
                )}
              </Link>
            )
          })}
          {/* Documents section in mobile drawer */}
          <div className="w-full" style={{ borderTop: '1px solid var(--color-border)', marginTop: '8px', paddingTop: '8px' }}>
            {([
              { label: 'View CV', href: DOCUMENTS_PATH, download: false },
              { label: 'Download CV', href: CV_PDF_PATH, download: true },
              { label: 'View Thesis', href: DOCUMENTS_PATH + '?doc=thesis', download: false },
              { label: 'Download Thesis', href: THESIS_PDF_PATH, download: true },
            ] as const).map((item) => (
              <a
                key={item.label}
                href={item.href}
                {...(item.download ? { download: true } : {})}
                className="block py-3 px-2 text-base rounded-md transition-colors duration-200 text-center"
                style={{
                  color: !item.download && pathname === '/documents' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  backgroundColor: !item.download && pathname === '/documents' ? 'var(--color-accent-muted)' : 'transparent',
                  textDecoration: 'none',
                }}
                onClick={() => setMobileOpen(false)}
                tabIndex={mobileOpen ? 0 : -1}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Settings in mobile drawer */}
          <div className="w-full" style={{ borderTop: '1px solid var(--color-border)', marginTop: '8px', paddingTop: '16px', paddingBottom: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Card Expand Mode</span>
            <div
              className="inline-flex rounded-md overflow-hidden shrink-0"
              style={{ border: '1px solid var(--color-border)' }}
              role="group"
              aria-label="Card expand mode"
            >
              <button
                type="button"
                onClick={() => setAutoExpand(true)}
                className="px-3 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer border-none"
                style={{
                  background: autoExpand ? 'var(--color-accent)' : 'transparent',
                  color: autoExpand ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
                }}
                aria-pressed={autoExpand}
                title="Cards expand on hover"
              >
                Auto-open
              </button>
              <button
                type="button"
                onClick={() => setAutoExpand(false)}
                className="px-3 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer border-none"
                style={{
                  background: !autoExpand ? 'var(--color-accent)' : 'transparent',
                  color: !autoExpand ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
                  borderLeft: '1px solid var(--color-border)',
                }}
                aria-pressed={!autoExpand}
                title="Cards open only on click"
              >
                Click to open
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navigation
