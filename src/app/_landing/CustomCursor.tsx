'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Soft trailing cursor that appears over [data-cursor] zones.
 * Use `data-cursor="grow"` on elements where you want the dot to expand.
 * The cursor only renders on pointer-capable devices.
 */
export function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [grown, setGrown] = useState(false)
  const [hasPointer, setHasPointer] = useState(false)

  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  const x = useSpring(rawX, { stiffness: 380, damping: 34, mass: 0.5 })
  const y = useSpring(rawY, { stiffness: 380, damping: 34, mass: 0.5 })

  useEffect(() => {
    // Only activate on true pointer devices
    if (!window.matchMedia('(pointer: fine)').matches) return
    setHasPointer(true)

    const move = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }

    const enter = () => setVisible(true)
    const leave = () => setVisible(false)

    const overEl = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const cursorEl = target.closest('[data-cursor]')
      setGrown(cursorEl?.getAttribute('data-cursor') === 'grow')
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mousemove', overEl, { passive: true })
    document.documentElement.addEventListener('mouseenter', enter)
    document.documentElement.addEventListener('mouseleave', leave)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousemove', overEl)
      document.documentElement.removeEventListener('mouseenter', enter)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [rawX, rawY])

  if (!hasPointer) return null

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full mix-blend-multiply"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        backgroundColor: 'var(--accent)',
      }}
      animate={{
        width: grown ? 40 : 10,
        height: grown ? 40 : 10,
        opacity: visible ? (grown ? 0.22 : 0.55) : 0,
      }}
      transition={{ width: { duration: 0.25, ease: 'easeOut' }, height: { duration: 0.25, ease: 'easeOut' }, opacity: { duration: 0.15 } }}
    />
  )
}
