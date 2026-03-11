'use client'
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
          char: char === ' ' ? char : getRandomChar(),
          isMatrix: char !== ' ',
          isSpace: char === ' ',
        }))
      )

      chars.forEach((char, i) => {
        if (char === ' ') return
        const revealTimeout = setTimeout(() => {
          setLetter(i, { char, isMatrix: false, isSpace: false })
        }, initialDelay + i * letterInterval)
        timeoutsRef.current.push(revealTimeout)
      })

      const totalRevealTime = initialDelay + chars.length * letterInterval

      const waitTimeout = setTimeout(() => {
        chars.forEach((char, i) => {
          if (char === ' ') return
          const scrambleTimeout = setTimeout(() => {
            setLetter(i, { char: getRandomChar(), isMatrix: true, isSpace: false })
          }, i * letterInterval)
          timeoutsRef.current.push(scrambleTimeout)
        })

        const scrambleTotal = chars.length * letterInterval

        const nextTextTimeout = setTimeout(() => {
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
        }, scrambleTotal + 200)

        timeoutsRef.current.push(nextTextTimeout)
      }, totalRevealTime + pauseDuration)

      timeoutsRef.current.push(waitTimeout)
    },
    [clearAllTimeouts, getRandomChar, initialDelay, letterInterval, pauseDuration, setLetter, texts]
  )

  const runCycleRef = useRef(runCycle)
  useEffect(() => {
    runCycleRef.current = runCycle
  })

  useEffect(() => {
    if (texts.length === 0) {
      setLetters([])
      return
    }

    runCycleRef.current(currentTextIndex)

    return () => {
      clearAllTimeouts()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTextIndex, texts.length, clearAllTimeouts])

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
        <div
          key={letter.id}
          className="w-[1ch] overflow-hidden text-center"
          style={{
            display: 'inline-block',
            fontVariantNumeric: 'tabular-nums',
            color: letter.isMatrix ? '#f0c060' : undefined,
            textShadow: letter.isMatrix ? '0 2px 4px rgba(240, 192, 96, 0.5)' : 'none',
            transition: 'color 0.1s ease-in-out',
          }}
        >
          {letter.isSpace ? '\u00A0' : letter.char}
        </div>
      ))}
    </div>
  )
}
