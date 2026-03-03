'use client'

import { useRef, useEffect, useState, type CSSProperties, type ReactNode, type KeyboardEvent } from 'react'
import { gsap } from '@/lib/gsapConfig'

interface PixelTransitionProps {
  firstContent: ReactNode | string
  secondContent: ReactNode | string
  gridSize?: number
  pixelColor?: string
  animationStepDuration?: number
  once?: boolean
  className?: string
  style?: CSSProperties
  height?: number | string
  ariaLabel?: string
}

export default function PixelTransition({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = 'var(--color-bg-primary)',
  animationStepDuration = 0.3,
  once = false,
  className = '',
  style,
  height = 220,
  ariaLabel,
}: PixelTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pixelGridRef = useRef<HTMLDivElement | null>(null)
  const activeRef = useRef<HTMLDivElement | null>(null)
  const delayedCallRef = useRef<gsap.core.Tween | null>(null)
  // Sync ref for stale-closure-safe hover checks
  const isActiveRef = useRef(false)

  const [isActive, setIsActive] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  // Build the pixel grid whenever gridSize or pixelColor changes
  useEffect(() => {
    const pixelGridEl = pixelGridRef.current
    if (!pixelGridEl) return

    pixelGridEl.innerHTML = ''

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement('div')
        pixel.classList.add('pixelated-image-card__pixel', 'absolute', 'hidden')
        pixel.style.backgroundColor = pixelColor

        const size = 100 / gridSize
        pixel.style.width = `${size}%`
        pixel.style.height = `${size}%`
        pixel.style.left = `${col * size}%`
        pixel.style.top = `${row * size}%`

        pixelGridEl.appendChild(pixel)
      }
    }
  }, [gridSize, pixelColor])

  function animatePixels(activate: boolean) {
    const pixelGridEl = pixelGridRef.current
    const activeEl = activeRef.current
    if (!pixelGridEl || !activeEl) return

    // Keep ref in sync synchronously so handlers never read stale state
    isActiveRef.current = activate
    setIsActive(activate)

    // Reduced motion — swap instantly
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      activeEl.style.display = activate ? 'block' : 'none'
      activeEl.style.pointerEvents = 'auto'
      return
    }

    const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>('.pixelated-image-card__pixel')
    if (!pixels.length) return

    gsap.killTweensOf(pixels)
    if (delayedCallRef.current) delayedCallRef.current.kill()

    const staggerDuration = animationStepDuration / pixels.length

    gsap.set(pixels, { display: 'none' })

    gsap.to(pixels, {
      display: 'block',
      duration: 0,
      stagger: { each: staggerDuration, from: 'random' },
    })

    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      activeEl.style.display = activate ? 'block' : 'none'
      activeEl.style.pointerEvents = 'auto'
    })

    gsap.to(pixels, {
      display: 'none',
      duration: 0,
      delay: animationStepDuration,
      stagger: { each: staggerDuration, from: 'random' },
    })
  }

  function handleEnter() {
    if (!isActiveRef.current) animatePixels(true)
  }
  function handleLeave() {
    if (isActiveRef.current && !once) animatePixels(false)
  }
  function handleClick() {
    if (!isActiveRef.current) animatePixels(true)
    else if (!once) animatePixels(false)
  }

  const heightStyle = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      className={`${className} bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] max-w-full relative overflow-hidden cursor-pointer select-none`}
      style={{ ...style, height: heightStyle }}
      onMouseEnter={!isTouchDevice ? handleEnter : undefined}
      onMouseLeave={!isTouchDevice ? handleLeave : undefined}
      onClick={handleClick}
      onFocus={!isTouchDevice ? handleEnter : undefined}
      onBlur={!isTouchDevice ? handleLeave : undefined}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <div className="absolute inset-0 w-full h-full" aria-hidden={isActive}>
        {firstContent}
      </div>

      <div
        ref={activeRef}
        className="absolute inset-0 w-full h-full z-[2]"
        style={{ display: 'none' }}
        aria-hidden={!isActive}
      >
        {secondContent}
      </div>

      {/* Pixel grid overlay */}
      <div
        ref={pixelGridRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
      />
    </div>
  )
}
