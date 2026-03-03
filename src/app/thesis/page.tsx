import { type Metadata } from 'next'

import { PdfViewer } from '@/components/ui'
import { THESIS_PDF_PATH } from '@/lib/pdfConfig'

export const metadata: Metadata = {
  title: "Master's Thesis | Steven Huff",
  description:
    "View and download Steven Huff's Master's Thesis: Lower-Division Undergraduate Mathematics Students' Perspectives on the Purpose of Tutoring.",
}

export default function ThesisPage() {
  return (
    <main className="min-h-screen">
      <PdfViewer pdfUrl={THESIS_PDF_PATH} title="Master's Thesis" downloadUrl={THESIS_PDF_PATH} />
    </main>
  )
}
