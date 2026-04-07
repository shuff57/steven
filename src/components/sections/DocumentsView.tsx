'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

import { SegmentedControl, PdfViewer } from '@/components/ui'
import { CV_PDF_PATH, THESIS_PDF_PATH } from '@/lib/pdfConfig'

const DOC_OPTIONS = [
  { label: 'Curriculum Vitae', value: 'cv' },
  { label: "Master's Thesis", value: 'thesis' },
]

function DocumentsViewInner() {
  const searchParams = useSearchParams()
  const docParam = searchParams.get('doc')
  const [active, setActive] = useState<'cv' | 'thesis'>(
    docParam === 'thesis' ? 'thesis' : 'cv'
  )

  // Sync whenever the ?doc= param changes
  useEffect(() => {
    setActive(docParam === 'thesis' ? 'thesis' : 'cv')
  }, [docParam])

  return (
    <div>
      {/* Segmented control bar — sticky below nav (nav = 64px) */}
      <div
        style={{
          position: 'sticky',
          top: 64,
          zIndex: 40,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px 16px',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-primary)',
        }}
      >
        <SegmentedControl options={DOC_OPTIONS} value={active} onChange={(v) => setActive(v as 'cv' | 'thesis')} />
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

export function DocumentsView() {
  return (
    <Suspense>
      <DocumentsViewInner />
    </Suspense>
  )
}

export default DocumentsView
