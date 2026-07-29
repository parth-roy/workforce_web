import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 to `end` when the element enters the viewport.
 * @param {number|string} end  - target value (e.g. 500000 or "3.2")
 * @param {number} duration    - ms for the animation
 * @param {string} prefix      - text before the number (e.g. "Rs.")
 * @param {string} suffix      - text after the number (e.g. "Cr+", "+")
 * @returns {{ ref, display }} - ref to attach to the DOM node, display string
 */
export function useAnimatedCounter({ end, duration = 1800, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(`${prefix}0${suffix}`)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return

    // Parse numeric end (strip commas, plus, letters)
    const numeric = parseFloat(String(end).replace(/[^0-9.]/g, ''))
    if (isNaN(numeric)) {
      setDisplay(`${prefix}${end}${suffix}`)
      return
    }

    const isFloat = String(numeric).includes('.')
    const decimals = isFloat ? (String(numeric).split('.')[1] || '').length : 0
    const startTime = performance.now()

    const step = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = numeric * eased

      const formatted = isFloat
        ? current.toFixed(decimals)
        : Math.floor(current).toLocaleString('en-IN')

      setDisplay(`${prefix}${formatted}${suffix}`)
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [started, end, duration, prefix, suffix])

  return { ref, display }
}
