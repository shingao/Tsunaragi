'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useAnimation } from 'framer-motion'
import Link from 'next/link'

/* ─── Network topology ──────────────────────────────────────────── */
const NODES = [
  { id: 'c',   cx: 300, cy: 288, r: 5,   delay: 0 },
  { id: 'n1',  cx: 168, cy: 162, r: 3,   delay: 0.6 },
  { id: 'n2',  cx: 432, cy: 148, r: 3.5, delay: 0.5 },
  { id: 'n3',  cx: 488, cy: 318, r: 3,   delay: 0.55 },
  { id: 'n4',  cx: 182, cy: 408, r: 3.5, delay: 0.65 },
  { id: 'n5',  cx: 312, cy: 456, r: 3,   delay: 0.7 },
  { id: 'n6',  cx: 72,  cy: 100, r: 2,   delay: 1.1 },
  { id: 'n7',  cx: 196, cy: 52,  r: 2,   delay: 1.2 },
  { id: 'n8',  cx: 516, cy: 68,  r: 2,   delay: 1.0 },
  { id: 'n9',  cx: 556, cy: 208, r: 2,   delay: 1.05 },
  { id: 'n10', cx: 568, cy: 368, r: 2,   delay: 1.05 },
  { id: 'n11', cx: 524, cy: 468, r: 2,   delay: 1.1 },
  { id: 'n12', cx: 108, cy: 496, r: 2,   delay: 1.15 },
  { id: 'n13', cx: 52,  cy: 338, r: 2,   delay: 1.2 },
  { id: 'n14', cx: 296, cy: 548, r: 2,   delay: 1.25 },
  { id: 'n15', cx: 388, cy: 520, r: 1.5, delay: 1.4 },
  { id: 'n16', cx: 92,  cy: 228, r: 1.5, delay: 1.35 },
]

// Organic curved paths: M start Q control end
const EDGES = [
  // Main trunk from centre
  { id: 'e1',  d: 'M 300,288 Q 224,218 168,162', delay: 0.05, w: 1.2 },
  { id: 'e2',  d: 'M 300,288 Q 368,210 432,148', delay: 0.1,  w: 1.2 },
  { id: 'e3',  d: 'M 300,288 Q 398,300 488,318', delay: 0.08, w: 1.3 },
  { id: 'e4',  d: 'M 300,288 Q 238,350 182,408', delay: 0.12, w: 1.2 },
  { id: 'e5',  d: 'M 300,288 Q 308,372 312,456', delay: 0.15, w: 1.0 },
  // First tier branches
  { id: 'e6',  d: 'M 168,162 Q 116,128  72,100', delay: 0.65, w: 0.9 },
  { id: 'e7',  d: 'M 168,162 Q 182,106 196, 52', delay: 0.7,  w: 0.9 },
  { id: 'e8',  d: 'M 432,148 Q 476,106 516, 68', delay: 0.58, w: 0.9 },
  { id: 'e9',  d: 'M 432,148 Q 496,178 556,208', delay: 0.62, w: 0.9 },
  { id: 'e10', d: 'M 488,318 Q 530,342 568,368', delay: 0.62, w: 0.8 },
  { id: 'e11', d: 'M 488,318 Q 508,394 524,468', delay: 0.65, w: 0.8 },
  { id: 'e12', d: 'M 182,408 Q 142,454 108,496', delay: 0.72, w: 0.8 },
  { id: 'e13', d: 'M 182,408 Q 114,372  52,338', delay: 0.75, w: 0.8 },
  { id: 'e14', d: 'M 312,456 Q 302,504 296,548', delay: 0.78, w: 0.7 },
  { id: 'e15', d: 'M 312,456 Q 352,490 388,520', delay: 0.8,  w: 0.7 },
  // Fine tendrils
  { id: 'e16', d: 'M 168,162 Q 128,196  92,228', delay: 0.9,  w: 0.6 },
  { id: 'e17', d: 'M  72,100 Q  56, 80  44, 60', delay: 1.3,  w: 0.5 },
  { id: 'e18', d: 'M 556,208 Q 572,248 580,288', delay: 1.3,  w: 0.5 },
  { id: 'e19', d: 'M  52,338 Q  36,300  28,264', delay: 1.35, w: 0.5 },
  { id: 'e20', d: 'M 296,548 Q 248,558 200,564', delay: 1.45, w: 0.4 },
]

/* ─── Animated path ─────────────────────────────────────────────── */
function AnimatedPath({
  d, delay, strokeWidth, reduced,
}: { d: string; delay: number; strokeWidth: number; reduced: boolean }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: reduced ? 1 : 0.55 }}
      transition={{
        pathLength: { duration: reduced ? 0 : 1.4, delay: reduced ? 0 : delay, ease: 'easeOut' },
        opacity:   { duration: 0.01, delay: reduced ? 0 : delay },
      }}
    />
  )
}

function AnimatedNode({
  cx, cy, r, delay, reduced,
}: { cx: number; cy: number; r: number; delay: number; reduced: boolean }) {
  return (
    <motion.circle
      cx={cx} cy={cy} r={r}
      fill="currentColor"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: reduced ? 0.7 : [0, 0.9, 0.7] }}
      transition={{
        scale:   { duration: reduced ? 0 : 0.35, delay: reduced ? 0 : delay, type: 'spring', stiffness: 280, damping: 18 },
        opacity: { duration: reduced ? 0 : 0.3,  delay: reduced ? 0 : delay },
      }}
    />
  )
}

/* ─── Main component ────────────────────────────────────────────── */
export function MyceliumHero() {
  const reduced = useReducedMotion() ?? false

  const tagline = [
    { text: 'Arrive in France.', accent: false },
    { text: 'Put down roots.', accent: false },
    { text: 'Grow together.', accent: true },
  ]

  return (
    <section
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.6,
        }}
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-6 py-24 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center">

        {/* ── Left: editorial copy ── */}
        <div className="relative z-10">
          {/* Brand mark */}
          <motion.div
            className="flex items-center gap-2 mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains), monospace' }}
            >
              Mycelia
            </span>
            <span
              className="inline-block w-8 h-px"
              style={{ backgroundColor: 'var(--accent)', opacity: 0.4 }}
            />
            <span
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
            >
              Paris · Lyon
            </span>
          </motion.div>

          {/* Tagline */}
          <h1 className="font-serif leading-[1.08] mb-8" style={{ color: 'var(--text)' }}>
            {tagline.map((line, i) => (
              <motion.span
                key={i}
                className="block"
                style={{
                  fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)',
                  fontWeight: 400,
                  color: line.accent ? 'var(--accent)' : 'var(--text)',
                }}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.3 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
              >
                {line.text}
              </motion.span>
            ))}
          </h1>

          {/* Subline */}
          <motion.p
            className="text-base leading-relaxed mb-10 max-w-md"
            style={{ color: 'var(--muted)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            Mycelia is the invisible network connecting newcomers to locals,
            ambassadors, and the resources that help you put down roots —
            just like mycelium connects trees in a forest.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Link
              href="/auth/signin"
              className="group relative overflow-hidden px-6 py-3 text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--accent)', borderRadius: '4px' }}
            >
              <motion.span
                className="absolute inset-0"
                style={{ backgroundColor: 'var(--accent-hover)' }}
                initial={{ x: '-101%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
              <span className="relative">Find your roots →</span>
            </Link>

            <Link
              href="/stories"
              className="group px-6 py-3 text-sm font-medium transition-all duration-200"
              style={{
                border: '1px solid var(--line)',
                color: 'var(--text)',
                borderRadius: '4px',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--text)'
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-alt)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
              }}
            >
              Read stories
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute -bottom-16 left-0 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <motion.div
              className="w-px h-10"
              style={{ backgroundColor: 'var(--line)' }}
              animate={{ scaleY: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
            >
              Scroll
            </span>
          </motion.div>
        </div>

        {/* ── Right: animated mycelium SVG ── */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full max-w-[600px]"
          >
            <svg
              viewBox="0 0 600 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              style={{ color: 'var(--accent)' }}
              aria-hidden
            >
              {/* Glow behind central node */}
              <motion.circle
                cx={300} cy={288} r={48}
                fill="var(--accent)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.06, 0.04] }}
                transition={{ duration: 1.2, delay: 0.3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />

              {/* Edges */}
              {EDGES.map(e => (
                <AnimatedPath
                  key={e.id}
                  d={e.d}
                  delay={e.delay}
                  strokeWidth={e.w}
                  reduced={reduced}
                />
              ))}

              {/* Nodes */}
              {NODES.map(n => (
                <AnimatedNode
                  key={n.id}
                  cx={n.cx} cy={n.cy} r={n.r}
                  delay={n.delay}
                  reduced={reduced}
                />
              ))}

              {/* Pulsing centre */}
              <motion.circle
                cx={300} cy={288} r={5}
                fill="var(--accent)"
                animate={{ r: [5, 7, 5], opacity: [1, 0.6, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              />
            </svg>
          </motion.div>

          {/* Floating label */}
          <motion.div
            className="absolute bottom-6 right-0 text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
          >
            <div
              className="text-[10px] uppercase tracking-[0.16em]"
              style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
            >
              The mycelia network
            </div>
            <div
              className="text-[10px]"
              style={{ color: 'var(--muted)', opacity: 0.6 }}
            >
              invisible threads, real connections
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
