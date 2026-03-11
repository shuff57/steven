'use client'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ')
}

interface MatrixTextProps {
  texts: string[]
  className?: string
  initialDelay?: number
  letterAnimationDuration?: number
  letterInterval?: number
  pauseDuration?: number
}

interface LetterState {
  id: string
  char: string
  isMatrix: boolean
  isSpace: boolean
}

const motionVariants = {
  matrix: {
    color: '#00ff00',
    textShadow: '0 2px 4px rgba(0, 255, 0, 0.5)',
  },
  normal: {
    color: 'inherit',
    textShadow: 'none',
  },
}

export default function MatrixText({
  texts,
  className,
  initialDelay = 200,
  letterAnimationDuration = 400,
  letterInterval = 80,
  pauseDuration = 2500,
}: MatrixTextProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [letters, setLetters] = useState<LetterState[]>([])
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const idCounterRef = useRef(0)

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId)
    })
    timeoutsRef.current = []
  }, [])

  const getRandomChar = useCallback(() => (Math.random() > 0.5 ? '0' : '1'), [])

  const setLetter = useCallback((index: number, next: Omit<LetterState, 'id'>) => {
    setLetters((prev) => {
      if (index < 0 || index >= prev.length) {
        return prev
      }
      const updated = [...prev]
      updated[index] = { ...next, id: updated[index].id }
      return updated
    })
  }, [])

  const runCycle = useCallback(
    (textIndex: number) => {
      clearAllTimeouts()

      const currentText = texts[textIndex] ?? ''
      const chars = currentText.split('')

      setLetters(
        chars.map((char) => ({
          id: `matrix-letter-${idCounterRef.current++}`,
          char,
          isMatrix: false,
          isSpace: char === ' ',
        }))
      )

      chars.forEach((char, i) => {
        const revealStart = setTimeout(() => {
          if (char !== ' ') {
            setLetter(i, { char: getRandomChar(), isMatrix: true, isSpace: false })
          }

          const revealResolve = setTimeout(() => {
            setLetter(i, { char, isMatrix: false, isSpace: char === ' ' })
          }, letterAnimationDuration)

          timeoutsRef.current.push(revealResolve)
        }, initialDelay + i * letterInterval)

        timeoutsRef.current.push(revealStart)
      })

      const totalRevealTime = initialDelay + chars.length * letterInterval + letterAnimationDuration

      const waitTimeout = setTimeout(() => {
        chars.forEach((char, i) => {
          const scrambleStart = setTimeout(() => {
            if (char !== ' ') {
              setLetter(i, { char: getRandomChar(), isMatrix: true, isSpace: false })
            }
          }, i * letterInterval)

          timeoutsRef.current.push(scrambleStart)
        })

        const scrambleTotal = chars.length * letterInterval + letterAnimationDuration

        const nextTextTimeout = setTimeout(() => {
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
        }, scrambleTotal)

        timeoutsRef.current.push(nextTextTimeout)
      }, totalRevealTime + pauseDuration)

      timeoutsRef.current.push(waitTimeout)
    },
    [clearAllTimeouts, getRandomChar, initialDelay, letterAnimationDuration, letterInterval, pauseDuration, setLetter, texts]
  )

  useEffect(() => {
    if (texts.length === 0) {
      setLetters([])
      return
    }

    runCycle(currentTextIndex)

    return () => {
      clearAllTimeouts()
    }
  }, [clearAllTimeouts, currentTextIndex, runCycle, texts.length])

  if (texts.length === 0) {
    return null
  }

  return (
    <div
      role="img"
      aria-label={`Matrix text: ${texts[currentTextIndex]}`}
      className={cn('flex flex-wrap items-center justify-center', className)}
    >
      {letters.map((letter) => (
        <motion.div
          key={letter.id}
          animate={letter.isMatrix ? 'matrix' : 'normal'}
          className={cn('w-[1ch] overflow-hidden text-center', letter.isMatrix && 'font-mono')}
          initial="normal"
          style={{ display: 'inline-block', fontVariantNumeric: 'tabular-nums' }}
          transition={{ duration: 0.1, ease: 'easeInOut' }}
          variants={motionVariants}
        >
          {letter.isSpace ? '\u00A0' : letter.char}
        </motion.div>
      ))}
    </div>
  )
}
