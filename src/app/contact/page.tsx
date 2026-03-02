import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { conferences } from '@/data/conferences';
import { profile } from '@/data/profile';

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Contact Section */}
      <section id="section-contact-info" className="px-6 py-20 max-w-3xl mx-auto">
        <ScrollReveal animation="slide-up">
          <div className="mb-20 text-center">
            <h1 className="text-5xl font-bold mb-4 font-display text-[var(--color-text-primary)]">
              Get in Touch
            </h1>
            <p className="text-xl text-[var(--color-text-muted)]">
              Open to discussing teaching opportunities, collaborations, and curriculum development
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-in" delay={0.2}>
          <div className="chalk-card p-8 mb-20 max-w-xl mx-auto">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-2xl" aria-hidden="true">✉</span>
                <a 
                  href={`mailto:${profile.email}`} 
                  className="text-lg sm:text-2xl font-medium text-[var(--color-accent)] hover:underline transition-colors break-all sm:break-normal"
                >
                  {profile.email}
                </a>
              </div>
              
              {/* Personal phone — Steven may want to remove for public site */}
              <div className="flex items-center gap-4">
                <span className="text-2xl" aria-hidden="true">📞</span>
                <a 
                  href={`tel:${profile.phone.replace(/[^0-9]/g, '')}`} 
                  className="text-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {profile.phone}
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="scale-in" delay={0.3}>
          <div id="section-download-cv" className="text-center mb-20">
            <h2 className="text-3xl font-bold mb-4 font-display text-[var(--color-text-primary)]">
              Prefer the Traditional Format?
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
              Download the complete CV as a PDF.
            </p>
            <a 
              href="/Curriculum%20Vitae.pdf" 
              download
              className="inline-block bg-[var(--color-accent)] text-[var(--color-bg-primary)] font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
            >
              Download Full CV (PDF)
            </a>
          </div>
        </ScrollReveal>
      </section>

      {/* Professional Development Section */}
      <section id="section-conferences" className="px-6 py-20 max-w-5xl mx-auto border-t border-[var(--color-border)]">
        <ScrollReveal animation="fade-in">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2 font-display text-[var(--color-text-primary)]">
              Conferences & Professional Development
            </h2>
            <p className="text-[var(--color-text-muted)]">
              Workshops, trainings, and conferences attended
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="stagger" staggerSelector=".flex.flex-col">
          <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
            {conferences.map((item, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-medium text-[var(--color-text-primary)] text-lg leading-tight">
                    {item.title}
                  </h3>
                  {item.date && (
                    <span className="text-sm text-[var(--color-text-muted)] whitespace-nowrap shrink-0 mt-0.5">
                      {item.date}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-1">
                  {item.description}
                </p>
                {item.location && (
                  <p className="text-xs text-[var(--color-text-muted)] italic">
                    {item.location}
                  </p>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
