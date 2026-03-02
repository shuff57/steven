import { ProfessionalDevelopment } from '@/components/sections/ProfessionalDevelopment'

export const metadata = {
  title: 'Professional Development | Steven Huff',
  description: 'Conferences, workshops, and technical trainings attended by Steven Huff.',
}

export default function ProfessionalDevelopmentPage() {
  return (
    <main className="min-h-screen">
      <ProfessionalDevelopment />
    </main>
  )
}
