'use client'

import { useRef, type ReactNode } from 'react'
import { gsap } from '@/lib/gsapConfig'
import { useGSAP } from '@gsap/react'
import Link from 'next/link'
import { AnimatedItem } from '@/components/ui/AnimatedItem'
import { profile } from '@/data/profile'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Pillar {
  title: string
  accent: string
  summary: string
  icon: ReactNode
}

// ─── Identity Pillars ─────────────────────────────────────────────────────────

const pillars: Pillar[] = [
  {
    title: 'Educator',
    accent: '#f0c060',
    summary:
      '10+ years spanning middle school, high school, university, and community college — from algebra foundations to Calculus I, intro CS to AP Computer Science Principles.',
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    title: 'Builder',
    accent: '#7dd3fc',
    summary:
      'Writes tools that solve real classroom problems — rāSHio, bookSHelf, O.G.R.E., D.A.D. Each project starts with a frustration felt at the whiteboard.',
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: 'Researcher',
    accent: '#86efac',
    summary:
      'MS thesis on how students perceive and use tutoring services. Interests include problem-based learning, inquiry-based learning, and multimodal mathematics.',
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: 'Maker',
    accent: '#fb923c',
    summary:
      'Norfield-trained on Haas CNC mills. Programs Arduino microcontrollers. Involved in securing a $300K grant to build a high school robotics and embedded systems pathway.',
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function AboutView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const watermarkRef = useRef<HTMLSpanElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const bioP1Ref = useRef<HTMLParagraphElement>(null)
  const bioP2Ref = useRef<HTMLParagraphElement>(null)
  const bioP3Ref = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        gsap.set([watermarkRef.current, headingRef.current, subtitleRef.current, bioP1Ref.current, bioP2Ref.current, bioP3Ref.current], { opacity: 1, y: 0 })
        return
      }

      const tl = gsap.timeline({ delay: 0.2 })
      tl.fromTo(watermarkRef.current, { opacity: 0 }, { opacity: 0.05, duration: 1.2, ease: 'power2.out' }, 0)
      tl.fromTo(headingRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.1)
      tl.fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.3)
      tl.fromTo(bioP1Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.45)
      tl.fromTo(bioP2Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.57)
      tl.fromTo(bioP3Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.69)
    },
    { scope: containerRef },
  )

  return (
    <section ref={containerRef} className="relative py-20 px-4 md:px-8 overflow-hidden">

      {/* Sigma watermark */}
      <div
        className="absolute inset-0 flex items-start justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          ref={watermarkRef}
          className="leading-none"
          style={{
            color: 'var(--color-accent)',
            fontFamily: 'serif',
            fontSize: 'clamp(16rem, 40vw, 32rem)',
            opacity: 0,
            marginTop: '-3rem',
          }}
        >
          Σ
        </span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-16 text-center">
          <h1
            ref={headingRef}
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-display)', opacity: 0 }}
          >
            About <span style={{ color: 'var(--color-accent)' }}>Me</span>
          </h1>
          <p
            ref={subtitleRef}
            style={{
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-handwritten)',
              fontSize: '1.45rem',
              opacity: 0,
            }}
          >
            Educator · Builder · Researcher · Maker
          </p>
        </div>

        {/* ── Bio ── */}
        <div className="space-y-5 mb-20 max-w-2xl mx-auto">
          <p
            ref={bioP1Ref}
            className="text-base md:text-lg leading-relaxed"
            style={{ color: 'var(--color-text-secondary)', opacity: 0 }}
          >
            I&apos;m a mathematics and computer science educator based in Chico, California. Over{' '}
            <Link href="/experience" style={{ color: 'var(--color-accent)' }} className="hover:underline">ten years</Link> of teaching at every level, middle school through community
            college, I&apos;ve brought the same curiosity to an{' '}
            <Link href="/experience#section-pleasant-valley" style={{ color: 'var(--color-accent)' }} className="hover:underline">AP Computer Science</Link> course as to a
            first-year statistics lecture. Right now I split my time between Pleasant Valley High
            School, where I teach Integrated Math, CS, and dual-enrollment statistics, and Butte
            College, where I teach as an adjunct across statistics, calculus, and finite
            mathematics.
          </p>
          <p
            ref={bioP2Ref}
            className="text-base md:text-lg leading-relaxed"
            style={{ color: 'var(--color-text-secondary)', opacity: 0 }}
          >
            I build tools. When a problem shows up in my classroom and the existing solutions
            don&apos;t fit, I write code.{' '}
            <Link href="/projects#section-tool-rashio" style={{ color: 'var(--color-accent)' }} className="hover:underline">rāSHio</Link> is a clean, student-focused statistics
            calculator.{' '}
            <Link href="/projects#section-tool-bookshelf" style={{ color: 'var(--color-accent)' }} className="hover:underline">bookSHelf</Link> automates textbook remastering into modern, accessible formats.{' '}
            <Link href="/projects#section-tool-ogre" style={{ color: 'var(--color-accent)' }} className="hover:underline">O.G.R.E.</Link> is a native desktop app that grades 30+ student written responses in minutes using AI, with scores and feedback written back to the page before anything is submitted. Each project starts with a frustration felt at the whiteboard and ends with
            working software.
          </p>
          <p
            ref={bioP3Ref}
            className="text-base md:text-lg leading-relaxed"
            style={{ color: 'var(--color-text-secondary)', opacity: 0 }}
          >
            My research examines how students perceive and use tutoring and support services,
            and what gets in the way of them asking for help. That same curiosity drives involvement
            in a{' '}
            <Link href="/projects#section-achievement-golden-state-pathways-grant" style={{ color: 'var(--color-accent)' }} className="hover:underline">$300K grant</Link>, development of a{' '}
            <Link href="/projects#section-achievement-embedded-systems-robotics" style={{ color: 'var(--color-accent)' }} className="hover:underline">robotics course and computer
            science pathway</Link>, a{' '}
            <Link href="/professional-development" style={{ color: 'var(--color-accent)' }} className="hover:underline">CNC internship</Link>, and a career shaped by one persistent
            question.
          </p>
        </div>

        {/* ── Pull Quote ── */}
        <AnimatedItem>
          <div className="pull-quote text-center my-16 max-w-2xl mx-auto">
            <p
              style={{
                fontFamily: 'var(--font-handwritten)',
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                color: 'var(--color-text-primary)',
                lineHeight: 1.3,
              }}
            >
              &ldquo;What would actually help?&rdquo;
            </p>
          </div>
        </AnimatedItem>

        {/* ── What I Do ── */}
        <div className="mb-20">
          <AnimatedItem>
            <h2
              className="text-2xl md:text-3xl font-bold mb-10 text-center border-b pb-4"
              style={{ fontFamily: 'var(--font-display)', borderColor: 'var(--color-border)' }}
            >
              What I Do
            </h2>
          </AnimatedItem>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pillar) => (
              <AnimatedItem key={pillar.title}>
                <div
                  className="chalk-card rounded-xl h-full flex flex-col gap-3"
                  style={{ borderLeft: `4px solid ${pillar.accent}` }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ color: pillar.accent }}>{pillar.icon}</span>
                    <h3
                      className="text-lg font-bold"
                      style={{ fontFamily: 'var(--font-display)', color: pillar.accent }}
                    >
                      {pillar.title}
                    </h3>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {pillar.summary}
                  </p>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>

        {/* ── Research Interests ── */}
        <div className="mb-20">
          <AnimatedItem>
            <h2
              className="text-2xl md:text-3xl font-bold mb-10 text-center border-b pb-4"
              style={{ fontFamily: 'var(--font-display)', borderColor: 'var(--color-border)' }}
            >
              Research Interests
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <div className="flex flex-wrap gap-2 justify-center">
              {profile.researchInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1.5 text-sm font-medium rounded-full cursor-default transition-colors duration-200"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </AnimatedItem>
        </div>

        {/* ── CTA ── */}
        <AnimatedItem>
          <div
            className="chalk-card rounded-2xl text-center py-12 px-8"
            style={{ borderColor: 'rgba(240, 192, 96, 0.3)' }}
          >
            <p
              style={{
                fontFamily: 'var(--font-handwritten)',
                fontSize: '1.5rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '0.25rem',
              }}
            >
              Want to know more?
            </p>
            <p
              className="text-sm mb-8"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Explore the tools I build or reach out directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-bold rounded-xl transition-opacity hover:opacity-80"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-primary)' }}
              >
                View Projects
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-bold rounded-xl transition-colors hover:text-[var(--color-text-primary)]"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </AnimatedItem>

      </div>
    </section>
  )
}
