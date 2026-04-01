'use client'

import { useAutoExpand } from '@/lib/autoExpandContext'
import { CV_PDF_PATH, THESIS_PDF_PATH } from '@/lib/pdfConfig'

export function Footer() {
  const year = new Date().getFullYear()
  const { autoExpand, setAutoExpand } = useAutoExpand()

  return (
    <footer
      className="border-t mt-auto"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Name + contact */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span
              className="text-lg font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-accent)',
              }}
            >
              Steven Huff
            </span>
            <div className="flex flex-wrap gap-4 text-sm justify-center md:justify-start">
              <a
                href="mailto:shuff57@gmail.com"
                className="transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-accent)' }}
              >
                shuff57@gmail.com
              </a>

            </div>
          </div>

          {/* Download CTAs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <a
              href={CV_PDF_PATH}
              download
              className="text-sm transition-opacity hover:opacity-75"
              style={{
                padding: '7px 14px',
                border: '1px solid var(--color-accent)',
                borderRight: 'none',
                borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              ↓ Download CV
            </a>
            <a
              href={THESIS_PDF_PATH}
              download
              className="text-sm transition-opacity hover:opacity-75"
              style={{
                padding: '7px 14px',
                border: '1px solid var(--color-accent)',
                borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              ↓ Download Thesis
            </a>
          </div>

          {/* Settings — Card Expand Mode */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Card Expand Mode
            </span>
            <div
              className="inline-flex rounded-md overflow-hidden"
              style={{ border: '1px solid var(--color-border)' }}
              role="group"
              aria-label="Card expand mode"
            >
              <button
                type="button"
                onClick={() => setAutoExpand(true)}
                className="px-2.5 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer border-none"
                style={{
                  background: autoExpand ? 'var(--color-accent)' : 'transparent',
                  color: autoExpand ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
                }}
                aria-pressed={autoExpand}
                title="Cards expand on hover"
              >
                Auto-open
              </button>
              <button
                type="button"
                onClick={() => setAutoExpand(false)}
                className="px-2.5 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer border-none"
                style={{
                  background: !autoExpand ? 'var(--color-accent)' : 'transparent',
                  color: !autoExpand ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
                  borderLeft: '1px solid var(--color-border)',
                }}
                aria-pressed={!autoExpand}
                title="Cards open only on click"
              >
                Click to open
              </button>
            </div>
          </div>

          {/* Copyright */}
          <p
            className="text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            © {year} Steven Huff
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
