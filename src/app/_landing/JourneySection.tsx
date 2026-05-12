'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STEPS = [
  {
    id: 'arriving',
    phase: '01',
    title: 'Arriving',
    headline: 'Everything is unfamiliar.\nThat\'s okay.',
    body: 'A new city, a new language, a stack of paperwork you don\'t quite understand yet. Mycelia meets you exactly where you are — with a checklist that knows what you\'re facing, and people who\'ve been there.',
    detail: 'Carte Vitale. Titre de séjour. CAF. We know the alphabet.',
    color: 'var(--muted)',
    accentLine: 'var(--line)',
  },
  {
    id: 'settling',
    phase: '02',
    title: 'Settling',
    headline: 'You start to recognise\nthe baker\'s face.',
    body: 'Three months in and the city starts giving back. A local ambassador introduces you to the market on Sundays. You find a café where the wifi is good and the music isn\'t too loud. Roots form slowly, then all at once.',
    detail: 'Match with a local who speaks your language and knows your arrondissement.',
    color: 'var(--success)',
    accentLine: 'var(--success)',
  },
  {
    id: 'belonging',
    phase: '03',
    title: 'Belonging',
    headline: 'Someone asks you for\nadvice about moving here.',
    body: 'You\'ve become the person someone else needed when they arrived. You know which prefecture to avoid on Mondays, and which boulangerie stays open late. Belonging isn\'t a destination — it\'s what happens when you give back.',
    detail: 'Become an ambassador. Welcome the next arrival.',
    color: 'var(--accent)',
    accentLine: 'var(--accent)',
  },
]

function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <motion.div
      ref={ref}
      className="relative grid grid-cols-1 lg:grid-cols-[80px_1fr_1fr] gap-8 lg:gap-16 items-start"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Phase number */}
      <div className="hidden lg:flex flex-col items-center gap-3 pt-1">
        <span
          className="text-[11px] font-medium tabular-nums"
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            color: step.color,
          }}
        >
          {step.phase}
        </span>
        {/* Vertical connector line */}
        {index < STEPS.length - 1 && (
          <motion.div
            className="w-px"
            style={{ backgroundColor: 'var(--line)', height: '180px' }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* Headline */}
      <div>
        {/* Mobile phase label */}
        <span
          className="lg:hidden block text-[11px] font-medium mb-3"
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            color: step.color,
          }}
        >
          {step.phase} — {step.title}
        </span>

        <motion.h3
          className="font-serif leading-[1.12] whitespace-pre-line mb-4"
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 400,
            color: 'var(--text)',
          }}
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {step.headline}
        </motion.h3>

        {/* Accent line */}
        <motion.div
          className="h-px mb-6"
          style={{ backgroundColor: step.accentLine, opacity: 0.5 }}
          initial={{ width: 0 }}
          animate={inView ? { width: 40 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
        />

        {/* Detail label */}
        <p
          className="text-[11px] uppercase tracking-[0.16em]"
          style={{
            color: step.color,
            fontFamily: 'var(--font-jetbrains), monospace',
          }}
        >
          {step.detail}
        </p>
      </div>

      {/* Body copy */}
      <motion.p
        className="text-base leading-relaxed"
        style={{ color: 'var(--muted)' }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {step.body}
      </motion.p>
    </motion.div>
  )
}

export function JourneySection() {
  const headRef = useRef<HTMLDivElement>(null)
  const headInView = useInView(headRef, { once: true, margin: '-10% 0px' })

  return (
    <section
      className="py-28 lg:py-40"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      <div className="max-w-5xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          ref={headRef}
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span
            className="block text-[10px] uppercase tracking-[0.22em] mb-4"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            The Journey
          </span>
          <h2
            className="font-serif leading-[1.1]"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 400,
              color: 'var(--text)',
            }}
          >
            Moving is a story in three parts.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col gap-16 lg:gap-24">
          {STEPS.map((step, i) => (
            <StepCard key={step.id} step={step} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
