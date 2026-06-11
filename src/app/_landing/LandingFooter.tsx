'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { MyceliaLogo } from '@/components/MyceliaLogo'

const LINKS = [
  { label: 'Guides', href: '/guides' },
  { label: 'Map', href: '/map' },
  { label: 'Stories', href: '/stories' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Log in', href: '/auth/login' },
]

export function LandingFooter() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <footer
      ref={ref}
      className="py-20 lg:py-28"
      style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Emotional closing line */}
        <motion.div
          className="mb-16 max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="font-serif leading-[1.3]"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 400,
              color: 'var(--bg)',
              opacity: 0.95,
            }}
          >
            Nobody should arrive somewhere<br />
            and feel like nobody.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="h-px mb-12"
          style={{ backgroundColor: 'var(--bg)', opacity: 0.12 }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Bottom row */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MyceliaLogo size={20} color="var(--accent)" />
              <span
                className="font-serif text-lg"
                style={{ color: 'var(--bg)' }}
              >
                Mycelia
              </span>
            </div>
            <p
              className="text-[11px] max-w-[240px] leading-relaxed"
              style={{
                color: 'var(--bg)',
                opacity: 0.45,
                fontFamily: 'var(--font-jetbrains), monospace',
              }}
            >
              Paris · Lyon — A network for newcomers, built by people who arrived before you.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm transition-colors duration-150"
                style={{ color: 'var(--bg)', opacity: 0.55 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.55' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="/auth/signin"
            className="group relative overflow-hidden px-5 py-2.5 text-sm font-medium self-start md:self-auto shrink-0"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
              borderRadius: '4px',
            }}
          >
            <motion.span
              className="absolute inset-0"
              style={{ backgroundColor: 'var(--accent-hover)' }}
              initial={{ x: '-101%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            />
            <span className="relative">Start your journey</span>
          </Link>
        </motion.div>

        {/* Fine print */}
        <motion.p
          className="mt-12 text-[10px]"
          style={{
            color: 'var(--bg)',
            opacity: 0.25,
            fontFamily: 'var(--font-jetbrains), monospace',
          }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.25 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          © {new Date().getFullYear()} Mycelia — Made with care for the people who take the leap.
        </motion.p>

      </div>
    </footer>
  )
}
