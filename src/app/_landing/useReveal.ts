'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * Hydration-safe scroll reveal.
 *
 * Server-rendered HTML must stay visible (no inline opacity:0), otherwise
 * the page is blank until the JS bundle hydrates. So elements are only
 * hidden AFTER hydration, while they wait to scroll into view.
 *
 * Usage on a motion element:
 *   const { ref, hidden } = useReveal<HTMLDivElement>('-10% 0px')
 *   <motion.div ref={ref} initial={false}
 *     animate={hidden ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }} />
 */
export function useReveal<T extends Element>(margin?: string) {
  const ref = useRef<T>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inView = useInView(ref, { once: true, margin: margin as any })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return { ref, hidden: mounted && !inView }
}
