import Script from 'next/script'
import type { CSSProperties } from 'react'

// The shared Left Hand Dev contact form (repo lhd-contact, https://contact.lefthanddev.com).
// embed.js draws the form into the empty placeholder and sends it on (site key "steven").
// React must never render children into the placeholder.
const formTheme = {
  '--lhd-cf-accent': 'var(--color-accent)',
  '--lhd-cf-field-bg': 'var(--color-bg-primary)',
  '--lhd-cf-border': '1px solid var(--color-text-muted)',
  '--lhd-cf-radius': 'var(--radius-md)',
  '--lhd-cf-btn-bg': 'var(--color-accent)',
  '--lhd-cf-btn-fg': 'var(--color-bg-primary)',
  '--lhd-cf-error': '#f28b82',
  '--lhd-cf-max': '100%',
  color: 'var(--color-text-primary)',
} as CSSProperties

export function ContactForm() {
  return (
    <div style={formTheme}>
      <div data-lhd-contact data-site="steven" suppressHydrationWarning />
      <Script src="https://contact.lefthanddev.com/embed.js" strategy="afterInteractive" />
    </div>
  )
}

export default ContactForm
