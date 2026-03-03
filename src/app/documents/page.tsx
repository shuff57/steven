import type { Metadata } from 'next'

import { DocumentsView } from '@/components/sections/DocumentsView'

export const metadata: Metadata = {
  title: 'Documents | Steven Huff',
  description:
    "View Steven Huff's Curriculum Vitae and Master's Thesis.",
}

export default function DocumentsPage() {
  return (
    <main className="min-h-screen">
      <DocumentsView />
    </main>
  )
}
