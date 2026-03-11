'use client'
import { useRef } from 'react'
import { gsap } from '@/lib/gsapConfig'
import { useGSAP } from '@gsap/react'
import Link from 'next/link'
import { Squares } from '@/components/animations'
import MatrixText from '@/components/ui/MatrixText'
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
      { title: 'Intro to Statistics', href: '/experience?view=catalog' },
      { title: 'Calculus I', href: '/experience?view=catalog' },
      { title: 'Intro to Programming', href: '/experience?view=catalog' },
      { title: 'Finite Math', href: '/experience?view=catalog' },
    ],
  },
  {
    value: '$300K',
    label: 'Grant Awarded',
    links: [
      { title: 'Golden State Pathways Grant', href: '/projects#section-achievements' },
    ],
  },
  {
    value: '10+',
    label: 'Tools Built',
    links: [
      { title: 'rāSHio', href: '/projects#section-tools' },
      { title: 'O.G.R.E', href: '/projects#section-tools' },
      { title: 'bookSHelf', href: '/projects#section-tools' },
    ],
  },
  {
    value: '35+',
    label: 'Skills',
    links: [
      { title: 'Languages', href: '/skills#section-languages' },
      { title: 'Software', href: '/skills#section-software' },
      { title: 'Systems', href: '/skills#section-systems' },
      { title: 'Hardware', href: '/skills#section-hardware' },
    ],
  },
]

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const watermarkRef = useRef<HTMLSpanElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const tl = gsap.timeline({ delay: 0.35 })

    tl.fromTo(watermarkRef.current, { opacity: 0, scale: 0.8 }, { opacity: 0.06, scale: 1, duration: 1.2, ease: 'power3.out' }, 0)
    tl.fromTo(headingRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.1)
    tl.fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.3)
    tl.fromTo(taglineRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.45)
    tl.fromTo(statsRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)' }, 0.6)
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

          <div
            ref={subtitleRef}
            className="text-lg md:text-2xl font-medium tracking-wide max-w-3xl mx-auto flex items-center justify-center"
            style={{ color: 'var(--color-text-primary)', opacity: 0, fontFamily: 'var(--font-handwritten)', fontSize: '1.35em' }}
            aria-label="Roles: Math Educator, Innovator, CS Teacher, Trailblazer, Curriculum Developer, Problem Solver, Tool Builder, Change Maker"
          >
            <MatrixText
              texts={['Math Educator', 'Innovator', 'CS Teacher', 'Trailblazer', 'Curriculum Developer', 'Problem Solver', 'Tool Builder', 'Change Maker']}
              initialDelay={1000}
              letterInterval={80}
              letterAnimationDuration={400}
              pauseDuration={2500}
            />
          </div>

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
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
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
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid rgba(240,192,96,0.4)', borderRadius: '1rem' }}
                >
                  {stat.links.map((link) => (
                    <Link
                      key={link.title}
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

      </div>
    </section>
  )
}
