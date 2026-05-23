import { useEffect, useMemo, useState } from 'react'

interface TypingTextProps {
  lines: string[]
  className?: string
  typingSpeed?: number
  deleteSpeed?: number
  pause?: number
}

export function TypingText({
  lines,
  className = '',
  typingSpeed = 85,
  deleteSpeed = 45,
  pause = 1600,
}: TypingTextProps) {
  const filtered = useMemo(
    () => lines.map((l) => l.trim()).filter(Boolean),
    [lines],
  )

  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const currentLine = filtered[lineIndex] ?? ''
  const displayText = currentLine.slice(0, charIndex)

  useEffect(() => {
    if (filtered.length === 0) return

    const current = filtered[lineIndex] ?? ''
    let delay = typingSpeed

    if (!isDeleting && charIndex < current.length) {
      delay = typingSpeed
    } else if (!isDeleting && charIndex === current.length) {
      delay = pause
    } else if (isDeleting && charIndex > 0) {
      delay = deleteSpeed
    } else {
      delay = 400
    }

    const timer = window.setTimeout(() => {
      if (!isDeleting && charIndex < current.length) {
        setCharIndex((c) => c + 1)
        return
      }
      if (!isDeleting && charIndex === current.length) {
        if (filtered.length === 1) return
        setIsDeleting(true)
        return
      }
      if (isDeleting && charIndex > 0) {
        setCharIndex((c) => c - 1)
        return
      }
      setIsDeleting(false)
      setLineIndex((i) => (i + 1) % filtered.length)
    }, delay)

    return () => window.clearTimeout(timer)
  }, [
    charIndex,
    isDeleting,
    lineIndex,
    filtered,
    typingSpeed,
    deleteSpeed,
    pause,
  ])

  useEffect(() => {
    setLineIndex(0)
    setCharIndex(0)
    setIsDeleting(false)
  }, [filtered.join('|')])

  if (filtered.length === 0) return null

  return (
    <span className={`typing-text font-mono ${className}`.trim()} aria-live="polite">
      <span>{displayText}</span>
      <span className="typing-cursor ml-0.5 inline-block font-normal text-primary">
        |
      </span>
    </span>
  )
}
