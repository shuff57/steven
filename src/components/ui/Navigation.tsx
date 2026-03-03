'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { CV_PDF_PATH, THESIS_PDF_PATH } from '@/lib/pdfConfig'

const navLinks = [
  { href: '/', label: 'Home' },
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
  const dropdownRef = useRef<HTMLDivElement>(null)
  // Close mobile menu on Escape; close dropdown on Escape + outside click
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileOpen) setMobileOpen(false)
        if (dropdownOpen) setDropdownOpen(false)
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [mobileOpen, dropdownOpen])

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
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
        <div className="hidden md:flex items-center justify-center gap-8">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium transition-colors duration-200"
                style={{
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  textDecorationLine: isActive ? 'underline' : 'none',
                  textDecorationColor: 'var(--color-accent)',
                  textUnderlineOffset: '4px',
                }}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right: Documents dropdown (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-3" style={{ justifySelf: 'end' }}>
          <div ref={dropdownRef} className="hidden md:block" style={{ position: 'relative' }}>
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
                  { label: 'View CV', href: '/documents', download: false },
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
                  { label: 'View Thesis', href: '/documents?doc=thesis', download: false },
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

          {/* Hamburger button */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-12 h-12 p-2 rounded-md hover:bg-white/5 transition-colors"
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
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: mobileOpen ? '400px' : '0',
          borderTop: mobileOpen ? '1px solid var(--color-border)' : 'none',
          backgroundColor: 'var(--color-bg-primary)',
        }}
      >
        <div className="px-4 py-6 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="block py-3 px-2 text-base rounded-md transition-colors duration-200"
                style={{
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  backgroundColor: isActive ? 'var(--color-accent-muted)' : 'transparent',
                }}
                onClick={() => setMobileOpen(false)}
                tabIndex={mobileOpen ? 0 : -1}
              >
                {label}
              </Link>
            )
          })}
          {/* Documents section in mobile drawer */}
          <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '8px', paddingTop: '8px' }}>
            {([
              { label: 'View CV', href: '/documents', download: false },
              { label: 'Download CV', href: CV_PDF_PATH, download: true },
              { label: 'View Thesis', href: '/documents?doc=thesis', download: false },
              { label: 'Download Thesis', href: THESIS_PDF_PATH, download: true },
            ] as const).map((item) => (
              <a
                key={item.label}
                href={item.href}
                {...(item.download ? { download: true } : {})}
                className="block py-3 px-2 text-base rounded-md transition-colors duration-200"
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
        </div>
      </div>
    </header>
  )
}

export default Navigation
