import Link from 'next/link'
import { Divider } from '@/components/Divider'
import { MyceliaLogo } from '@/components/MyceliaLogo'

/* ─── How it works data ─────────────────────────────────────────── */
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Arrive',
    description:
      'Your personalized checklist walks you through every first step — admin, health, housing, community — so nothing slips through the cracks.',
    icon: '🌱',
  },
  {
    step: '02',
    title: 'Connect',
    description:
      'Get matched with a local who has walked your path. Someone from your background who knows how France really works.',
    icon: '🤝',
  },
  {
    step: '03',
    title: 'Grow',
    description:
      'Once settled, give back. Host events, share your story, welcome the next person. The network grows with every root laid down.',
    icon: '✦',
  },
]

const PLATFORM_FEATURES = [
  ['Map', 'Community-built places'],
  ['Experiences', 'Events & meetups'],
  ['Buddy', 'Peer matching'],
  ['Stories', 'Arrival narratives'],
]

/* ─── Page ──────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden">

        {/* Mycelium background watermark */}
        <div
          className="absolute inset-0 pointer-events-none select-none flex items-center justify-end pr-8"
          aria-hidden
        >
          <svg
            width="480"
            height="480"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.035 }}
          >
            <circle cx="100" cy="100" r="5" fill="var(--accent)" />
            <path d="M100 100 L40 30" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
            <path d="M100 100 L100 15" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
            <path d="M100 100 L165 30" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
            <path d="M100 100 L175 120" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
            <path d="M100 100 L60 175" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
            <path d="M100 100 L25 130" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="40" cy="30" r="3" fill="var(--accent)" />
            <circle cx="100" cy="15" r="3" fill="var(--accent)" />
            <circle cx="165" cy="30" r="3" fill="var(--accent)" />
            <circle cx="175" cy="120" r="3" fill="var(--accent)" />
            <circle cx="60" cy="175" r="3" fill="var(--accent)" />
            <circle cx="25" cy="130" r="3" fill="var(--accent)" />
            {/* Sub-branches */}
            <path d="M40 30 L20 50" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
            <path d="M40 30 L55 12" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
            <path d="M165 30 L185 50" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
            <path d="M165 30 L150 12" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
            <path d="M175 120 L192 105" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
            <path d="M60 175 L45 192" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
            <path d="M60 175 L80 192" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            {/* Brand label */}
            <div className="flex items-center gap-2 mb-8">
              <MyceliaLogo size={18} color="var(--accent)" />
              <span className="section-label" style={{ color: 'var(--accent)' }}>Mycelia</span>
            </div>

            {/* Tagline — 3-line split */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6 font-serif font-normal" style={{ color: 'var(--text)' }}>
              Arrive in France.<br />
              Put down roots.<br />
              <span style={{ color: 'var(--accent)' }}>Grow together.</span>
            </h1>

            <p className="text-base leading-relaxed mb-10 max-w-md" style={{ color: 'var(--muted)' }}>
              Mycelia connects international arrivals to locals, ambassadors, and resources —
              helping you put down roots in a new country, one thread at a time.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/auth/signin" className="btn-primary">
                Find your roots
              </Link>
              <Link href="/stories" className="btn-secondary">
                Read stories
              </Link>
            </div>
          </div>

          {/* Status card */}
          <div className="hidden lg:block">
            <div
              className="p-8 space-y-5"
              style={{
                border: '1px solid var(--line)',
                backgroundColor: 'var(--surface)',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(31,26,21,0.04), 0 4px 12px rgba(31,26,21,0.04)',
              }}
            >
              <div className="section-label">Your journey</div>
              <Divider />
              <div className="space-y-5 pt-1">
                {[
                  {
                    dotColor: 'var(--muted)',
                    label: 'Just arrived',
                    desc: 'Your first weeks in France',
                    active: true,
                  },
                  {
                    dotColor: 'var(--success)',
                    label: 'Settling in',
                    desc: '3+ months, finding your rhythm',
                  },
                  {
                    dotColor: 'var(--accent)',
                    label: 'Ambassador',
                    desc: 'Contributing, welcoming others',
                  },
                ].map((s, i) => (
                  <div key={i} className={`flex items-start gap-4 ${!s.active ? 'opacity-40' : ''}`}>
                    <div className="mt-1.5 shrink-0">
                      <span
                        className="block w-2 h-2 rounded-full"
                        style={{ backgroundColor: s.dotColor }}
                      />
                    </div>
                    <div>
                      <div
                        className="text-sm font-medium"
                        style={{
                          fontFamily: 'var(--font-jetbrains), monospace',
                          color: 'var(--text)',
                        }}
                      >
                        {s.label}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                        {s.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom rhythm divider */}
        <div className="absolute bottom-8 left-0 right-0 max-w-6xl mx-auto px-6">
          <Divider rhythm />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-14">
          <Divider label="How it works" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.step}
              className="group p-8 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(31,26,21,0.04)',
              }}
            >
              <div
                className="text-xs font-medium mb-5"
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  color: 'var(--accent)',
                }}
              >
                {item.step}
              </div>
              <h3
                className="text-xl mb-3 font-serif"
                style={{ color: 'var(--text)', fontWeight: 500 }}
              >
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cities & platform ────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="md:pr-12 pb-8 md:pb-0" style={{ borderRight: '1px solid var(--line)' }}>
              <div className="section-label mb-4">Currently active in</div>
              <div className="flex gap-6 items-end">
                <div>
                  <div className="text-3xl font-serif" style={{ color: 'var(--text)', fontWeight: 400 }}>Paris</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Île-de-France</div>
                </div>
                <div className="text-2xl leading-none pb-1" style={{ color: 'var(--line)' }}>·</div>
                <div>
                  <div className="text-3xl font-serif" style={{ color: 'var(--text)', fontWeight: 400 }}>Lyon</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Auvergne-Rhône-Alpes</div>
                </div>
              </div>
            </div>
            <div className="md:pl-12 pt-8 md:pt-0">
              <div className="section-label mb-4">What&apos;s inside</div>
              <div className="grid grid-cols-2 gap-4">
                {PLATFORM_FEATURES.map(([name, desc]) => (
                  <div key={name}>
                    <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-lg">
          <div className="section-label mb-4">Ready to begin?</div>
          <h2 className="text-3xl font-serif mb-4" style={{ color: 'var(--text)', fontWeight: 400 }}>
            Your roots start here.
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--muted)' }}>
            Sign in with your email to build a profile, generate your first-steps checklist,
            and connect with the Mycelia community.
          </p>
          <Link href="/auth/signin" className="btn-primary">
            Get started — it&apos;s free
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--line)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <MyceliaLogo size={16} color="var(--accent)" />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              Mycelia — the invisible network connecting newcomers to their new home
            </span>
          </div>
          <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}>
            Built for international arrivals in France
          </div>
        </div>
      </footer>
    </div>
  )
}
