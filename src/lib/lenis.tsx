'use client'

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from './gsapConfig'

interface LenisContextValue {
  lenis: Lenis | null
}

const LenisContext = createContext<LenisContextValue>({ lenis: null })

export function useLenis() {
  return useContext(LenisContext)
}

interface LenisProviderProps {
  children: ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Don't run smooth-scroll on full-viewport PDF pages
    if (pathname === '/cv' || pathname === '/thesis') return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)
    
    // Use GSAP ticker to drive Lenis RAF loop
    const tickerFn = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(tickerFn)
      lenisRef.current = null
    }
  }, [pathname])

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </LenisContext.Provider>
  )
}
