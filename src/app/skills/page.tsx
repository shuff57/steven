import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { languages, software, systems, hardware, shinyAppsUrl } from '@/data/skills'
import { profile } from '@/data/profile'
import { NormalDist } from '@/components/math-viz/NormalDist'


export default function SkillsPage() {
  /* Group teaching interests loosely by domain */
  const mathFoundational = [
    'Foundational Mathematics',
    'College Algebra',
    'Trigonometry',
    'Pre-Calculus',
    'Finite Mathematics',
    'Survey of Calculus',
    'Analytic Geometry and Calculus Series',
    'Concepts and Structures of Mathematics Series',
  ]
  const statistics = [
    'Introductory Statistics',
    'Conceptual and Practical Statistics',
  ]
  const advancedMath = [
    'Discrete Math',
    'Elementary Linear Algebra',
    'Elementary Differential Equations',
    'Intuitive Foundations of Geometry',
    'College Geometry',
    'Advanced Number and Operation',
    'Real and Complex Number Systems',
    'Graph Theory',
  ]
  const techCS = [
    'Industrial Technology',
    'Woodworking',
    'CNC Machining',
  ]

  /* Verify all teaching interests are accounted for */
  const allGrouped = [...mathFoundational, ...statistics, ...advancedMath, ...techCS]
  const ungrouped = profile.teachingInterests.filter(
    (item) => !allGrouped.includes(item)
  )

  return (
    <section className="min-h-screen px-6 py-20">
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        {/* ── Page Header ── */}
        <ScrollReveal animation="slide-up">
          <h1
            className="text-5xl font-bold"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
            }}
          >
            Skills &amp; Technology
          </h1>
          <p
            className="mt-4"
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--leading-normal)',
              maxWidth: '40rem',
            }}
          >
            Programming languages, educational tools, systems, and hardware I work with
          </p>
        </ScrollReveal>

        {/* ══════════════════════════════════════════
            Section 1 — Languages (most prominent)
           ══════════════════════════════════════════ */}
        <ScrollReveal animation="stagger" staggerSelector="span">
          <div style={{ marginTop: 'var(--spacing-section)' }}>
            <SectionHeading>Languages</SectionHeading>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginTop: '1.25rem',
              }}
            >
              {languages.map((lang) => (
                <span
                  key={lang}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem 1.25rem',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 600,
                    color: 'var(--color-accent)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <hr className="chalk-divider" />

        {/* ══════════════════════════════════════════
            Section 2 — Software
           ══════════════════════════════════════════ */}
        <ScrollReveal animation="stagger" staggerSelector="span">
          <div>
            <SectionHeading>Software</SectionHeading>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginTop: '1.25rem',
              }}
            >
              {software.map((item) => (
                <span
                  key={item}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.25rem 0.75rem',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  {item}
                  {item === 'Shiny Apps' && (
                    <a
                      href={shinyAppsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open Shiny Apps dashboard"
                      style={{
                        color: 'var(--color-accent)',
                        fontSize: 'var(--text-xs)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <hr className="chalk-divider" />

        {/* ══════════════════════════════════════════
            Section 3 — Learning Management Systems
           ══════════════════════════════════════════ */}
        <ScrollReveal animation="stagger" staggerSelector="div > div">
          <div>
            <SectionHeading>Learning Management Systems</SectionHeading>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(13rem, 1fr))',
                gap: '0.75rem',
                marginTop: '1.25rem',
              }}
            >
              {systems.map((item) => (
                <div
                  key={item}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.625rem 1rem',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <hr className="chalk-divider" />

        {/* ══════════════════════════════════════════
            Section 4 — Hardware
           ══════════════════════════════════════════ */}
        <ScrollReveal animation="stagger" staggerSelector="span">
          <div>
            <SectionHeading>Hardware</SectionHeading>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginTop: '1.25rem',
              }}
            >
              {hardware.map((item) => {
                const icon = hardwareIcon(item)
                return (
                  <span
                    key={item}
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.375rem 1rem',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span aria-hidden="true">{icon}</span>
                    {item}
                  </span>
                )
              })}
            </div>
          </div>
        </ScrollReveal>

        <hr className="chalk-divider" />

        {/* Math viz: interactive normal distribution */}
        <div className="py-12 flex flex-col items-center">
          <p className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>
            The 68–95–99.7 Rule
          </p>
          <NormalDist className="opacity-90" />
        </div>


        {/* ══════════════════════════════════════════
            Section 5 — Teaching Interests
           ══════════════════════════════════════════ */}
        <ScrollReveal animation="stagger" staggerSelector="span">
          <div style={{ marginBottom: '4rem' }}>
            <h2
              className="text-3xl font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-primary)',
              }}
            >
              Courses I Can Teach
            </h2>
            <p
              className="mt-2"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
              }}
            >
              From foundational math to embedded systems
            </p>

            {/* Mathematics: Foundational through Calculus */}
            <CourseGroup label="Mathematics">
              {mathFoundational.map((c) => (
                <CourseChip key={c}>{c}</CourseChip>
              ))}
            </CourseGroup>

            {/* Statistics */}
            <CourseGroup label="Statistics">
              {statistics.map((c) => (
                <CourseChip key={c}>{c}</CourseChip>
              ))}
            </CourseGroup>

            {/* Advanced Mathematics */}
            <CourseGroup label="Advanced Mathematics">
              {advancedMath.map((c) => (
                <CourseChip key={c}>{c}</CourseChip>
              ))}
            </CourseGroup>

            {/* Technology / CS */}
            <CourseGroup label="Technology &amp; Fabrication">
              {techCS.map((c) => (
                <CourseChip key={c}>{c}</CourseChip>
              ))}
            </CourseGroup>

            {/* Catch-all: any items not in the groups above */}
            {ungrouped.length > 0 && (
              <CourseGroup label="Other">
                {ungrouped.map((c) => (
                  <CourseChip key={c}>{c}</CourseChip>
                ))}
              </CourseGroup>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────
   Inline helper components (server-only)
   ────────────────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-2xl font-bold"
      style={{
        fontFamily: 'var(--font-display)',
        color: 'var(--color-text-primary)',
      }}
    >
      {children}
    </h2>
  )
}

function CourseGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.625rem',
        }}
      >
        {label}
      </h3>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function CourseChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.25rem 0.75rem',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
      }}
    >
      {children}
    </span>
  )
}

function hardwareIcon(item: string): string {
  if (item.includes('3D')) return '🖨️'
  if (item.includes('CNC')) return '⚙️'
  if (item.includes('Raspberry')) return '🍓'
  if (item.includes('ESP')) return '📡'
  return '🔧'
}
