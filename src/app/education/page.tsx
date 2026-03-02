import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { education } from '@/data/education'
import { profile } from '@/data/profile'
import { TrigCurve } from '@/components/math-viz/TrigCurve'
import { YearNav } from '@/components/ui/YearNav'

const EDUCATION_YEAR_NAV = [
  { year: 2015, id: 'section-degrees' },
  { year: 2021, id: 'section-thesis' },
  { year: 2023, id: 'section-credentials' },
]
export default function EducationPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-sans selection:bg-[var(--color-accent-muted)] selection:text-white pb-20">
      <div className="max-w-5xl mx-auto px-6 py-20">
        
        {/* Header */}
        <ScrollReveal animation="slide-up">
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              Education <span className="text-[var(--color-accent)]">&</span> Credentials
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Graduate training in mathematics education and ongoing professional development
            </p>
          </div>
        </ScrollReveal>

        {/* YearNav: fixed left side */}
        <YearNav items={EDUCATION_YEAR_NAV} />

        {/* Degrees */}
        <ScrollReveal animation="stagger" staggerSelector=".chalk-card">
          <section id="section-degrees" className="mb-16">
            <h2 className="text-3xl font-bold mb-8 font-display chalk-underline decoration-[var(--color-accent)]">Degrees</h2>
            <div className="grid gap-6">
              {education.degrees.map((degree, index) => (
                <div key={index} className="chalk-card p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">{degree.degree}</h3>
                    <div className="text-lg text-[var(--color-accent)] font-medium mb-2">{degree.field}</div>
                    <div className="text-[var(--color-text-secondary)]">
                      {degree.institution} • <span className="text-[var(--color-text-muted)]">{degree.date}</span>
                    </div>
                    {degree.notes && (
                      <div className="mt-2 text-sm text-[var(--color-text-muted)] italic">
                        {degree.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Thesis Highlight - Only show if thesis exists */}
        {education.thesis && (
          <ScrollReveal animation="scale-in" delay={0.1}>
          <section id="section-thesis" className="mb-16">
               <div className="chalk-card border-l-4 border-l-[var(--color-accent)] p-8 md:p-10 relative overflow-hidden group">
                  {/* Background icon for decoration */}
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none" aria-hidden="true">
                     <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-accent)]" aria-hidden="true">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                     </svg>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] mb-2">Master's Thesis</div>
                    <h3 className="text-2xl md:text-3xl font-display italic mb-4 leading-tight">
                      "{education.thesis.title}"
                    </h3>
                    <div className="text-[var(--color-text-secondary)] mb-6">
                      California State University, Chico — May 2021
                    </div>
                    
                    <p className="text-lg text-[var(--color-text-primary)] mb-8 max-w-3xl leading-relaxed">
                      {education.thesis.summary}
                    </p>
                    
                    <a 
                      href={education.thesis.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-[var(--color-bg-primary)] font-bold rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors"
                    >
                      Read Full Thesis
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  </div>
               </div>
            </section>
          </ScrollReveal>
        )}

        {/* Credentials */}
        <ScrollReveal animation="fade-in" delay={0.2}>
          <section id="section-credentials" className="mb-20">
            <h2 className="text-3xl font-bold mb-8 font-display chalk-underline decoration-[var(--color-accent)]">Credentials</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {education.credentials.map((cred, index) => (
                <div key={index} className="chalk-card p-6 flex flex-col justify-between h-full hover:border-[var(--color-accent)] transition-colors duration-300">
                  <div>
                      <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-2 leading-snug">{cred.degree}</h3>
                      <div className="text-[var(--color-accent)] mb-4 text-sm font-medium">{cred.field}</div>
                  </div>
                  <div className="pt-4 border-t border-[var(--color-border)] mt-auto flex justify-between items-end text-sm text-[var(--color-text-secondary)]">
                     <span>{cred.institution}</span>
                     <span className="font-mono text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2 py-1 rounded border border-[var(--color-border)] whitespace-nowrap ml-2">{cred.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Math viz: animated trig curve divider */}
        <div className="my-16 px-4 opacity-40">
          <TrigCurve />
        </div>

        {/* Interests Section */}
        <div id="section-interests" className="grid md:grid-cols-12 gap-12">
           
           {/* Research Interests */}
           <ScrollReveal animation="slide-up">
             <div className="md:col-span-5">
                <h2 className="text-2xl font-bold mb-6 font-display text-[var(--color-text-primary)] flex items-center gap-2">
                  <span className="w-2 h-8 bg-[var(--color-accent)] rounded-sm"></span>
                  Research Interests
                </h2>
                <ul className="space-y-4">
                  {profile.researchInterests.map((interest, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] group-hover:scale-150 transition-transform duration-300 flex-shrink-0 shadow-[0_0_8px_var(--color-accent)]"></span>
                      <span className="text-lg text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors leading-relaxed">
                        {interest}
                      </span>
                    </li>
                  ))}
                </ul>
             </div>
           </ScrollReveal>

           {/* Teaching Interests */}
           <ScrollReveal animation="stagger" staggerSelector="span">
             <div className="md:col-span-7">
                <h2 className="text-2xl font-bold mb-6 font-display text-[var(--color-text-primary)] flex items-center gap-2">
                  <span className="w-2 h-8 bg-[var(--color-accent)] rounded-sm opacity-50"></span>
                  Teaching Interests
                </h2>
                <div className="flex flex-wrap gap-3 content-start">
                  {profile.teachingInterests.map((interest, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-muted)] transition-all duration-300 cursor-default shadow-sm hover:shadow-[0_0_15px_rgba(94,206,195,0.1)]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
             </div>
           </ScrollReveal>

        </div>

      </div>
    </main>
  );
}
