'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/education', label: 'Education' },
  { href: '/skills', label: 'Skills' },
  { href: '/courses', label: 'Courses' },
  { href: '/contact', label: 'Contact' },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) setMobileOpen(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [mobileOpen])

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
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
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

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
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

        {/* Download CV + Mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href="/Curriculum%20Vitae.pdf"
            download
            className="hidden md:inline-flex items-center px-3 py-1.5 text-sm rounded border transition-colors duration-200 hover:opacity-80"
            style={{
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)',
            }}
          >
            ↓ Download CV
          </a>

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
          <a
            href="/Curriculum%20Vitae.pdf"
            download
            className="mt-4 block py-2.5 px-4 text-sm text-center rounded border transition-colors duration-200"
            style={{
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)',
            }}
            onClick={() => setMobileOpen(false)}
            tabIndex={mobileOpen ? 0 : -1}
          >
            ↓ Download CV (PDF)
          </a>
        </div>
      </div>
    </header>
  )
}

export default Navigation
