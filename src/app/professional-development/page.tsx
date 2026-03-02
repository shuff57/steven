export const metadata = {
  title: 'Professional Development | Steven Huff',
  description: 'Conferences, workshops, and technical trainings attended by Steven Huff.',
}

export default function ProfessionalDevelopmentPage() {
  return (
    <main className="min-h-screen py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
          Professional Development
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Conferences, workshops, and technical trainings
        </p>
      </div>
    </main>
  )
}
