'use client'

import { useState } from 'react'

import { SegmentedControl, PdfViewer } from '@/components/ui'
import { CV_PDF_PATH, THESIS_PDF_PATH } from '@/lib/pdfConfig'

const DOC_OPTIONS = [
  { label: 'Curriculum Vitae', value: 'cv' },
  { label: "Master's Thesis", value: 'thesis' },
]

export function DocumentsView() {
  const [active, setActive] = useState('cv')

  return (
    <div>
      {/* Segmented control bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px 16px',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-primary)',
        }}
      >
        <SegmentedControl options={DOC_OPTIONS} value={active} onChange={setActive} />
      </div>

      {/* PdfViewer handles its own height + body scroll lock */}
      {active === 'cv' ? (
        <PdfViewer
          pdfUrl={CV_PDF_PATH}
          title="Curriculum Vitae"
          downloadUrl={CV_PDF_PATH}
        />
      ) : (
        <PdfViewer
          pdfUrl={THESIS_PDF_PATH}
          title="Master's Thesis"
          downloadUrl={THESIS_PDF_PATH}
        />
      )}
    </div>
  )
}

export default DocumentsView
