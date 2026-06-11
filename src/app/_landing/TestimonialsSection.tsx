'use client'

import { motion } from 'framer-motion'
import { useReveal } from './useReveal'

const TESTIMONIALS = [
  {
    id: 't1',
    quote: 'I arrived in Lyon not knowing a single person. Within two weeks, my ambassador had shown me the Saturday market, helped me open a bank account, and introduced me to her book club. Mycelia gave me a city before I even spoke the language well.',
    author: 'Yuki T.',
    origin: 'Osaka → Lyon',
    role: 'Software engineer, 8 months in',
    initials: 'YT',
    color: '#D4A574',
  },
  {
    id: 't2',
    quote: 'The checklist sounds small, but it was everything. Knowing exactly what to do — and in what order — meant I didn\'t lie awake panicking about CPAM or my titre de séjour. Someone had already mapped the path.',
    author: 'Marcos R.',
    origin: 'São Paulo → Paris',
    role: 'Architect, 14 months in',
    initials: 'MR',
    color: '#7A9E87',
  },
  {
    id: 't3',
    quote: 'I never expected to become an ambassador so soon. But helping someone navigate the paperwork I once found terrifying — watching them relax when they realise it\'s manageable — that\'s the most satisfying thing I\'ve done here.',
    author: 'Léa K.',
    origin: 'Berlin → Marseille',
    role: 'Ambassador since 2023',
    initials: 'LK',
    color: '#C45A3D',
  },
]

function QuoteCard({ t, index }: { t: typeof TESTIMONIALS[0]; index: number }) {
  const { ref, hidden } = useReveal<HTMLDivElement>('-10% 0px')
  const isMiddle = index === 1

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col justify-between p-8 lg:p-10"
      style={{
        backgroundColor: isMiddle ? 'var(--surface-alt)' : 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '4px',
      }}
      initial={false}
      animate={hidden ? { opacity: 0, y: 32 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Large quote mark */}
      <div
        className="font-serif leading-none mb-6 select-none"
        style={{
          fontSize: 'clamp(4rem, 6vw, 6rem)',
          color: t.color,
          opacity: 0.25,
          fontWeight: 400,
          lineHeight: 0.8,
        }}
        aria-hidden
      >
        "
      </div>

      {/* Quote text */}
      <blockquote
        className="font-serif leading-[1.55] mb-8 flex-1"
        style={{
          fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
          fontWeight: 400,
          color: 'var(--text)',
        }}
      >
        {t.quote}
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4">
        {/* Round photo placeholder */}
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-medium"
          style={{ backgroundColor: t.color }}
        >
          {t.initials}
        </div>
        <div>
          <div
            className="text-sm font-medium"
            style={{ color: 'var(--text)' }}
          >
            {t.author}
          </div>
          <div
            className="text-[11px]"
            style={{
              color: 'var(--muted)',
              fontFamily: 'var(--font-jetbrains), monospace',
            }}
          >
            {t.origin} · {t.role}
          </div>
        </div>
      </div>

      {/* Accent corner rule */}
      <div
        className="absolute top-0 left-8 w-6 h-px"
        style={{ backgroundColor: t.color, opacity: 0.6 }}
      />
    </motion.div>
  )
}

export function TestimonialsSection() {
  const { ref: headRef, hidden: headHidden } = useReveal<HTMLDivElement>('-10% 0px')

  return (
    <section
      className="py-28 lg:py-40"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          ref={headRef}
          className="mb-16 max-w-2xl"
          initial={false}
          animate={headHidden ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="block text-[10px] uppercase tracking-[0.22em] mb-4"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            Stories
          </span>
          <h2
            className="font-serif leading-[1.1]"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 400,
              color: 'var(--text)',
            }}
          >
            Voices from the network.
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <QuoteCard key={t.id} t={t} index={i} />
          ))}
        </div>

        {/* Read more link */}
        <div className="mt-12 text-right">
          <a
            href="/stories"
            className="text-sm transition-colors duration-150 text-muted hover:text-text"
          >
            Read all stories →
          </a>
        </div>

      </div>
    </section>
  )
}
