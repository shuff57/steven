import type { Metadata } from 'next'

import { PdfViewer } from '@/components/ui'
import { CV_PDF_PATH } from '@/lib/pdfConfig'

export const metadata: Metadata = {
  title: 'Curriculum Vitae | Steven Huff',
  description: "View and download Steven Huff's Curriculum Vitae.",
}

export default function CVPage() {
  return (
    <main className="min-h-screen">
      <PdfViewer
        pdfUrl={CV_PDF_PATH}
        title="Curriculum Vitae"
        downloadUrl={CV_PDF_PATH}
      />
    </main>
  )
}
