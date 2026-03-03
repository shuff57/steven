'use client'

import React, { useEffect } from 'react'

interface PdfViewerProps {
  pdfUrl: string
  title: string
  downloadUrl: string
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl, title }) => {
  // Lock body scroll — the iframe handles its own scrolling
  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
    }
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',  // 64px = h-16 nav height
      }}
    >
      {/* Native browser PDF viewer — provides zoom, page nav, search, print */}
      <iframe
        src={pdfUrl}
        title={title}
        style={{
          flex: 1,
          border: 'none',
          width: '100%',
        }}
      />
    </div>
  )
}

export { PdfViewer }
export default PdfViewer
