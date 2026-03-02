'use client'

import { conferences } from '@/data/conferences'
import { ConferenceCard } from '@/components/cards/ConferenceCard'
import { AnimatedItem } from '@/components/ui/AnimatedItem'

export function ProfessionalDevelopment() {
  return (
    <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
          Professional Development
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Conferences, workshops, and technical trainings
        </p>
      </div>

      <div className="grid grid-cols-1 max-w-2xl mx-auto gap-3">
        {conferences.map((item, i) => (
          <AnimatedItem key={i}>
            <ConferenceCard item={item} />
          </AnimatedItem>
        ))}
      </div>
    </div>
  )
}
