'use client'
import { useRef } from 'react'
import { gsap } from '@/lib/gsapConfig'
import { useGSAP } from '@gsap/react'
import Link from 'next/link'
import { Squares } from '@/components/animations'
import RotatingText from '@/components/ui/RotatingText'

const stats = [
  { value: '10+', label: 'Years Teaching' },
  { value: '20+', label: 'Courses Taught' },
  { value: '$300K', label: 'Grant Awarded' },
  { value: '10+', label: 'Tools Built' },
] as const

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const watermarkRef = useRef<HTMLSpanElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const tl = gsap.timeline({ delay: 0.35 }) // Start after PageTransition fade-in completes

    // Σ watermark: scale up and fade in
    tl.fromTo(
      watermarkRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 0.06, scale: 1, duration: 1.2, ease: 'power3.out' },
      0
    )

    // Name: slide up from below
    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      0.1
    )

    // Subtitle (roles): fade in
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      0.3
    )

    // Tagline: fade in
    tl.fromTo(
      taglineRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      0.45
    )

    // Stats cards: stagger
    // Stats grid: fade + slide up as a unit
    tl.fromTo(
      statsRef.current,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)' },
      0.6
    )

    // CTA buttons: slide up
    // CTA buttons: slide up as a unit
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      0.85
    )
  }, { scope: containerRef })

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 px-6"
    >
      {/* Animated grid background */}
      <div className="absolute inset-0" aria-hidden="true">
        <Squares
          speed={0.1}
          squareSize={36}
          direction="diagonal"
          borderColor="rgba(240, 237, 232, 0.1)"
          hoverFillColor="rgba(94, 206, 195, 0.15)"
        />
      </div>

      {/* Decorative watermark — large sigma symbol */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          ref={watermarkRef}
          className="text-[14rem] sm:text-[20rem] md:text-[30rem] lg:text-[40rem] leading-none"
          style={{ color: 'var(--color-accent)', fontFamily: 'serif', opacity: 0 }}
        >
          Σ
        </span>

      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center space-y-12">
        {/* Hero header */}
        <div className="space-y-6">
          <h1
            ref={headingRef}
className="text-5xl md:text-7xl font-bold tracking-tight"
style={{
fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
              opacity: 0,
            }}
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
              texts={['Math Educator', 'Innovator', 'CS Teacher', 'Limit Pusher', 'Curriculum Developer', 'Problem Solver', 'Tool Builder', 'Change Maker']}
              mainClassName="px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 justify-center rounded-full overflow-hidden bg-[#5ecec3]"
              staggerFrom="last"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-120%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              rotationInterval={3000}
            />
          </p>

          <p
            ref={taglineRef}
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-secondary)', opacity: 0 }}
          >
            Dedicated to building bridges between abstract mathematics and student
            intuition&nbsp;&mdash; through innovative curriculum, technology, and
            hands-on learning at the high school and college level.
          </p>
        </div>

        {/* Key stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full opacity-0">
          {stats.map((s) => (
            <div
              key={s.label}
              className="chalk-card flex flex-col items-center justify-center p-6 text-center"
            >
              <span
                className="text-3xl md:text-4xl font-bold mb-1"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-accent-warm)',
                }}
              >
                {s.value}
              </span>
              <span
                className="text-xs md:text-sm uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-6 pt-4 opacity-0">
          <Link
            href="/experience"
            className="px-8 py-3 rounded-md text-base font-semibold transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-bg-primary)',
              boxShadow: '0 0 15px rgba(94, 206, 195, 0.3)',
            }}
          >
            View My Work
          </Link>

          <Link
            href="/projects"
            className="px-8 py-3 rounded-md text-base font-semibold border transition-all hover:bg-white/5"
            style={{
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)',
            }}
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
