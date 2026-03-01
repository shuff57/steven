'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsapConfig'

interface TrigCurveProps {
  className?: string
}

export function TrigCurve({ className }: TrigCurveProps) {
  const containerRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useGSAP(() => {
    const path = pathRef.current
    if (!path) return

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const length = path.getTotalLength()
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        end: 'top 30%',
        scrub: 1.5,
      },
    })
  }, { scope: containerRef })

  return (
    <svg
      ref={containerRef}
      viewBox="0 0 800 80"
      className={`w-full h-auto ${className ?? ''}`}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {/* Two full periods of a sine curve from x=0 to x=800, centered at y=40 */}
      <path
        ref={pathRef}
        d="M0,40 C44,8 88,72 133,40 C178,8 222,72 267,40 C311,8 355,72 400,40 C444,8 488,72 533,40 C578,8 622,72 667,40 C711,8 756,72 800,40"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
