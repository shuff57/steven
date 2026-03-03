'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function SplitButton() {
  const pathname = usePathname()

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 14px',
    fontSize: '0.875rem',
    fontWeight: 500,
    border: '1px solid var(--color-accent)',
    color: 'var(--color-accent)',
    textDecoration: 'none',
    transition: 'background-color 0.15s',
  }

  const activeStyles: React.CSSProperties = {
    backgroundColor: 'var(--color-accent-muted)',
  }

  return (
    <div style={{ display: 'inline-flex', borderRadius: '6px', overflow: 'hidden' }}>
      <Link
        href="/cv"
        style={{
          ...baseStyles,
          borderRight: 'none',
          borderRadius: '6px 0 0 6px',
          ...(pathname === '/cv' ? activeStyles : {}),
        }}
      >
        View CV
      </Link>
      <Link
        href="/thesis"
        style={{
          ...baseStyles,
          borderRadius: '0 6px 6px 0',
          ...(pathname === '/thesis' ? activeStyles : {}),
        }}
      >
        View Thesis
      </Link>
    </div>
  )
}

export default SplitButton
