import { ScrollReveal } from '@/components/animations/ScrollReveal'
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
              

            </div>
          </div>
        </ScrollReveal>


      </section>


    </main>
  );
}
