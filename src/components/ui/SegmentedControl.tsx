'use client'

import React from 'react'

interface SegmentOption {
  label: string
  value: string
}

interface SegmentedControlProps {
  options: SegmentOption[]
  value: string
  onChange: (value: string) => void
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div
      role="group"
      style={{
        display: 'inline-flex',
        borderRadius: '9999px',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onChange(option.value)
              }
            }}
            style={{
              padding: '6px 20px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              outline: 'none',
              transition: 'background-color 0.15s ease, color 0.15s ease',
              backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
              color: isActive ? '#ffffff' : 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'var(--color-accent-muted)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
              }
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
