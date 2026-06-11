'use client'

import { motion } from 'framer-motion'
import { useReveal } from './useReveal'

/* ── SVG Illustrations ───────────────────────────────────────────── */

function BuddyIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden>
      {/* Two circles connected by a thread */}
      <circle cx="38" cy="60" r="18" stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent-soft)" />
      <circle cx="82" cy="60" r="18" stroke="var(--success)" strokeWidth="1.5" fill="var(--success-soft)" />
      {/* Connection path */}
      <path d="M 56,60 Q 60,48 64,60" stroke="var(--line)" strokeWidth="1" fill="none" strokeDasharray="3 2" />
      {/* Person A silhouette */}
      <circle cx="38" cy="54" r="5" fill="var(--accent)" />
      <path d="M 28,70 Q 38,62 48,70" stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Person B silhouette */}
      <circle cx="82" cy="54" r="5" fill="var(--success)" />
      <path d="M 72,70 Q 82,62 92,70" stroke="var(--success)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Small node in the thread */}
      <circle cx="60" cy="56" r="2.5" fill="var(--accent)" opacity="0.6" />
    </svg>
  )
}

function MapIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden>
      {/* Grid / city blocks */}
      <rect x="20" y="20" width="80" height="80" rx="2" stroke="var(--line)" strokeWidth="1" fill="var(--surface)" />
      {/* Streets */}
      <line x1="20" y1="50" x2="100" y2="50" stroke="var(--line)" strokeWidth="0.8" />
      <line x1="20" y1="75" x2="100" y2="75" stroke="var(--line)" strokeWidth="0.8" />
      <line x1="48" y1="20" x2="48" y2="100" stroke="var(--line)" strokeWidth="0.8" />
      <line x1="75" y1="20" x2="75" y2="100" stroke="var(--line)" strokeWidth="0.8" />
      {/* Blocks */}
      <rect x="24" y="24" width="20" height="22" rx="1" fill="var(--surface-alt)" />
      <rect x="52" y="24" width="19" height="22" rx="1" fill="var(--surface-alt)" />
      <rect x="24" y="54" width="20" height="17" rx="1" fill="var(--surface-alt)" />
      <rect x="79" y="54" width="17" height="17" rx="1" fill="var(--surface-alt)" />
      <rect x="52" y="78" width="19" height="18" rx="1" fill="var(--surface-alt)" />
      {/* Location pin */}
      <circle cx="60" cy="58" r="7" fill="var(--accent)" />
      <circle cx="60" cy="58" r="3" fill="white" />
      <path d="M 60,65 L 60,72" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Pulse ring */}
      <circle cx="60" cy="58" r="12" stroke="var(--accent)" strokeWidth="1" opacity="0.25" />
    </svg>
  )
}

function GuidesIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden>
      {/* Open book / guide pages */}
      <rect x="22" y="28" width="34" height="64" rx="2" fill="var(--surface-alt)" stroke="var(--line)" strokeWidth="1" />
      <rect x="64" y="28" width="34" height="64" rx="2" fill="var(--surface)" stroke="var(--line)" strokeWidth="1" />
      {/* Spine */}
      <line x1="56" y1="28" x2="56" y2="92" stroke="var(--accent)" strokeWidth="1.5" />
      {/* Lines of text (left page) */}
      <line x1="28" y1="40" x2="50" y2="40" stroke="var(--line)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="48" x2="50" y2="48" stroke="var(--line)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="56" x2="50" y2="56" stroke="var(--line)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="64" x2="44" y2="64" stroke="var(--line)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="72" x2="50" y2="72" stroke="var(--line)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Lines of text (right page) */}
      <line x1="70" y1="40" x2="92" y2="40" stroke="var(--line)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="70" y1="48" x2="92" y2="48" stroke="var(--line)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="70" y1="56" x2="86" y2="56" stroke="var(--line)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Checkmark on right page */}
      <path d="M 70,68 L 76,74 L 86,62" stroke="var(--success)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

const FEATURES = [
  {
    id: 'buddy',
    step: '01',
    title: 'Meet your local',
    body: 'We match you with a Mycelia ambassador who shares your background, speaks your language, and knows your neighbourhood. Not a chatbot — a real person who was once where you are now.',
    cta: 'Find a buddy',
    href: '/buddy',
    Illustration: BuddyIllustration,
  },
  {
    id: 'map',
    step: '02',
    title: 'Find your places',
    body: 'Community-curated spots: the Japanese épicerie, the café that won\'t rush you, the préfecture queue that\'s shorter on Thursdays. Places that matter, shared by people who live here.',
    cta: 'Open the map',
    href: '/map',
    Illustration: MapIllustration,
  },
  {
    id: 'guides',
    step: '03',
    title: 'Navigate the system',
    body: 'Step-by-step guides written by people who\'ve done it: open a bank account without a proof of address, get your Carte Vitale before it expires, understand your lease. No jargon.',
    cta: 'Browse guides',
    href: '/guides',
    Illustration: GuidesIllustration,
  },
]

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const { ref, hidden } = useReveal<HTMLDivElement>('-10% 0px')
  const { Illustration } = feature

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col"
      style={{
        border: '1px solid var(--line)',
        borderRadius: '4px',
        padding: '2rem',
        backgroundColor: 'var(--surface)',
      }}
      initial={false}
      animate={hidden ? { opacity: 0, y: 28 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      {/* Step label */}
      <span
        className="text-[10px] uppercase tracking-[0.2em] mb-4 block"
        style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
      >
        {feature.step}
      </span>

      {/* Illustration */}
      <div className="w-20 h-20 mb-6">
        <Illustration />
      </div>

      <h3
        className="font-serif mb-3"
        style={{
          fontSize: '1.5rem',
          fontWeight: 400,
          color: 'var(--text)',
          lineHeight: 1.2,
        }}
      >
        {feature.title}
      </h3>

      <p
        className="text-sm leading-relaxed mb-6 flex-1"
        style={{ color: 'var(--muted)' }}
      >
        {feature.body}
      </p>

      <a
        href={feature.href}
        className="text-sm font-medium transition-colors duration-150 text-accent hover:text-accent-hover"
      >
        {feature.cta} →
      </a>
    </motion.div>
  )
}

export function HowItWorksSection() {
  const { ref: headRef, hidden: headHidden } = useReveal<HTMLDivElement>('-10% 0px')

  return (
    <section
      className="py-28 lg:py-40"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          ref={headRef}
          className="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
          initial={false}
          animate={headHidden ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span
              className="block text-[10px] uppercase tracking-[0.22em] mb-4"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains), monospace' }}
            >
              How Mycelia works
            </span>
            <h2
              className="font-serif leading-[1.1]"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 400,
                color: 'var(--text)',
              }}
            >
              Three threads.<br />One network.
            </h2>
          </div>
          <p
            className="text-sm leading-relaxed max-w-xs lg:text-right"
            style={{ color: 'var(--muted)' }}
          >
            Mycelia weaves together people, places, and knowledge so the invisible becomes navigable.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.id} feature={f} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
