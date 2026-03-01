'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register plugins once — centralized to prevent duplicate registrations
gsap.registerPlugin(ScrollTrigger, useGSAP)

// Animation vocabulary constants
export const ANIMATION_DEFAULTS = {
  duration: 0.8,
  ease: 'power3.out',
  staggerDelay: 0.1,
  scrollStart: 'top 80%',
  scrollEnd: 'bottom 20%',
} as const

export type AnimationType = 'fade-in' | 'slide-up' | 'stagger' | 'text-reveal' | 'scale-in' | 'parallax'

export { gsap, ScrollTrigger }
