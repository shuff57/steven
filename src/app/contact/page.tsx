import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { ContactForm } from '@/components/ui/ContactForm'

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Contact Section */}
      <section id="section-contact-info" className="px-4 sm:px-6 py-20 max-w-3xl mx-auto">
        <ScrollReveal animation="slide-up">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold mb-4 font-display text-[var(--color-text-primary)]">
              Get in Touch
            </h1>
            <p className="text-xl text-[var(--color-text-muted)]">
              Open to discussing teaching opportunities, collaborations, and curriculum development
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-in" delay={0.2}>
          <div className="chalk-card p-6 sm:p-8 mb-20 max-w-xl mx-auto">
            <p className="mb-6 text-[var(--color-text-secondary)]">
              Send me a message and I will reply to the email address you give.
            </p>
            <ContactForm />
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
