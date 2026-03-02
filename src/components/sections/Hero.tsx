'use client'
import { useRef } from 'react'
import { gsap } from '@/lib/gsapConfig'
import { useGSAP } from '@gsap/react'
import Link from 'next/link'
import { Squares } from '@/components/animations'
import RotatingText from '@/components/ui/RotatingText'
import PixelTransition from '@/components/ui/PixelTransition'

const statCards = [
  {
    value: '10+',
    label: 'Years Teaching',
    links: [
      { title: 'Post-Secondary', href: '/experience#section-post-secondary' },
      { title: 'Secondary', href: '/experience#section-secondary' },
      { title: 'Elementary', href: '/experience#section-elementary' },
    ],
  },
  {
    value: '20+',
    label: 'Courses Taught',
    links: [
      { title: 'Browse Catalog', href: '/courses' },
    ],
  },
  {
    value: '$300K',
    label: 'Grant Awarded',
    links: [
      { title: 'Degrees & Credentials', href: '/education#section-degrees' },
      { title: "Master's Thesis", href: '/education#section-thesis' },
      { title: 'Interests', href: '/education#section-interests' },
    ],
  },
  {
    value: '10+',
    label: 'Tools Built',
    links: [
      { title: 'Tools & Software', href: '/projects#section-tools' },
      { title: 'Achievements', href: '/projects#section-achievements' },
    ],
  },
  {
    value: '35+',
    label: 'Skills',
    links: [
      { title: 'Languages & Software', href: '/skills#section-languages' },
      { title: 'Systems & Hardware', href: '/skills#section-lms' },
      { title: 'Courses I Can Teach', href: '/skills#section-teaching' },
    ],
  },
]

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const watermarkRef = useRef<HTMLSpanElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const tl = gsap.timeline({ delay: 0.35 })

    tl.fromTo(watermarkRef.current, { opacity: 0, scale: 0.8 }, { opacity: 0.06, scale: 1, duration: 1.2, ease: 'power3.out' }, 0)
    tl.fromTo(headingRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.1)
    tl.fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.3)
    tl.fromTo(taglineRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.45)
    tl.fromTo(statsRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)' }, 0.6)
    tl.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.85)
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 px-6"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Squares speed={0.1} squareSize={36} direction="diagonal" borderColor="rgba(240, 237, 232, 0.1)" hoverFillColor="rgba(240, 192, 96, 0.15)" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span
          ref={watermarkRef}
          className="text-[14rem] sm:text-[20rem] md:text-[30rem] lg:text-[40rem] leading-none"
          style={{ color: 'var(--color-accent)', fontFamily: 'serif', opacity: 0 }}
        >
          Σ
        </span>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center space-y-12">
        <div className="space-y-6">
          <h1
            ref={headingRef}
            className="text-5xl md:text-7xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)', opacity: 0 }}
          >
            Steven Huff
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg md:text-2xl font-medium tracking-wide max-w-3xl mx-auto flex items-center justify-center"
            style={{ color: 'var(--color-bg-primary)', opacity: 0 }}
            aria-label="Roles: Math Educator, CS Teacher, Curriculum Developer, Tool Builder"
          >
            <RotatingText
              texts={['Math Educator', 'Innovator', 'CS Teacher', 'Trailblazer', 'Curriculum Developer', 'Problem Solver', 'Tool Builder', 'Change Maker']}
              mainClassName="px-5 sm:px-6 md:px-7 py-2 sm:py-2.5 md:py-3 justify-center overflow-hidden bg-[#f0c060]"
              style={{ borderRadius: '1.5rem', fontFamily: 'var(--font-handwritten)', fontSize: '1.35em' }}
              elementLevelClassName="origin-bottom"
              staggerFrom="last"
              staggerDuration={0.025}
              initial={{ y: '80%', opacity: 0, rotateZ: -8 }}
              animate={{ y: 0, opacity: 1, rotateZ: 0 }}
              exit={{ y: '-80%', opacity: 0, rotateZ: 8 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              rotationInterval={3000}
            />
          </p>

          <p
            ref={taglineRef}
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-secondary)', opacity: 0 }}
          >
            Dedicated to building bridges between abstract mathematics and student
            intuition — through innovative curriculum, technology, and
            hands-on learning at the high school and college level.
          </p>
        </div>

        {/* Key stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full opacity-0">
          {statCards.map((stat) => (
            <PixelTransition
              key={stat.label}
              height={150}
              ariaLabel={`${stat.value} ${stat.label}`}
              firstContent={
                <div className="chalk-card h-full flex flex-col items-center justify-center p-6 text-center">
                  <span
                    className="text-3xl md:text-4xl font-bold mb-1"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-xs md:text-sm uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {stat.label}
                  </span>
                </div>
              }
              secondContent={
                <div
                  className="h-full flex flex-col items-center justify-center gap-2 p-4"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid rgba(240,192,96,0.4)' }}
                >
                  {stat.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm font-medium text-center leading-tight hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              }
            />
          ))}
        </div>

        {/* Call to action */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-6 pt-4 opacity-0">
          <Link
            href="/experience"
            className="px-8 py-3 rounded-md text-base font-semibold transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-primary)', boxShadow: '0 0 15px rgba(240, 192, 96, 0.3)' }}
          >
            View My Work
          </Link>
          <Link
            href="/projects"
            className="px-8 py-3 rounded-md text-base font-semibold border transition-all hover:bg-white/5"
            style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
          >
            See Projects
          </Link>
          <a
            href="/Curriculum%20Vitae.pdf"
            download
            className="mt-4 sm:mt-0 text-sm underline hover:no-underline transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            ↓ Download CV (PDF)
          </a>
        </div>
      </div>
    </section>
  )
}
