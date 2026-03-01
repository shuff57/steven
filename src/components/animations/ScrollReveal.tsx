'use client'

import { useRef, ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ANIMATION_DEFAULTS, AnimationType } from '@/lib/gsapConfig'

interface ScrollRevealProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  stagger?: number
  className?: string
  // For stagger, selector to find children to stagger
  staggerSelector?: string
}

export function ScrollReveal({
  children,
  animation = 'fade-in',
  delay = 0,
  duration = ANIMATION_DEFAULTS.duration,
  stagger = ANIMATION_DEFAULTS.staggerDelay,
  className,
  staggerSelector = ':scope > *',
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      const el = containerRef.current
      const target = animation === 'stagger' 
        ? Array.from(el.querySelectorAll(staggerSelector)) 
        : el

      // Check prefers-reduced-motion
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) {
        // Show immediately in final state
        if (Array.isArray(target)) {
          gsap.set(target, { opacity: 1, y: 0, scale: 1, x: 0 })
        } else {
          gsap.set(target, { opacity: 1, y: 0, scale: 1, x: 0 })
        }
        return
      }

      // Initial hidden states
      const hiddenStates: Record<AnimationType, gsap.TweenVars> = {
        'fade-in': { opacity: 0 },
        'slide-up': { opacity: 0, y: 60 },
        'stagger': { opacity: 0, y: 40 },
        'text-reveal': { opacity: 0, y: 30 },
        'scale-in': { opacity: 0, scale: 0.85 },
        'parallax': {},
      }

      // Visible states
      const visibleStates: Record<AnimationType, gsap.TweenVars> = {
        'fade-in': { opacity: 1 },
        'slide-up': { opacity: 1, y: 0 },
        'stagger': { opacity: 1, y: 0 },
        'text-reveal': { opacity: 1, y: 0 },
        'scale-in': { opacity: 1, scale: 1 },
        'parallax': {},
      }

      if (animation === 'parallax') {
        // Parallax is handled by ParallaxLayer, not ScrollReveal
        return
      }

      if (animation === 'stagger') {
        gsap.set(target, hiddenStates.stagger)
        gsap.to(target, {
          ...visibleStates.stagger,
          duration,
          delay,
          stagger,
          ease: ANIMATION_DEFAULTS.ease,
          scrollTrigger: {
            trigger: el,
            start: ANIMATION_DEFAULTS.scrollStart,
            toggleActions: 'play none none none',
          },
        })
      } else {
        gsap.set(target as HTMLElement, hiddenStates[animation])
        gsap.to(target as HTMLElement, {
          ...visibleStates[animation],
          duration,
          delay,
          ease: ANIMATION_DEFAULTS.ease,
          scrollTrigger: {
            trigger: el,
            start: ANIMATION_DEFAULTS.scrollStart,
            toggleActions: 'play none none none',
          },
        })
      }
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

export default ScrollReveal
