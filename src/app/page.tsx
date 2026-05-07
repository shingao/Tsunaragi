import Link from 'next/link'
import { Divider } from '@/components/Divider'

const VALUE_PROPS = [
  {
    symbol: '01',
    title: 'Find Your Way',
    description: 'A personalized checklist walks you through every administrative, practical, and social step of arriving in France.',
  },
  {
    symbol: '02',
    title: 'Connect with Locals',
    description: 'Get matched with an ambassador who shares your background — someone who has already walked the path you are starting.',
  },
  {
    symbol: '03',
    title: 'Become an Ambassador',
    description: 'Once settled, give back. Host events, share your story, and welcome the next generation of newcomers.',
  },
]

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
        {/* Kanji watermark */}
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden
        >
          <span
            className="text-[28vw] font-bold leading-none text-foreground opacity-[0.025]"
            style={{ writingMode: 'vertical-rl' }}
          >
            繋がり
          </span>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-6">
              <span className="section-label">繋がり — tsunagari</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-foreground">
              Arrive in France.<br />
              Find your ground.<br />
              <span className="text-accent">Build connection.</span>
            </h1>

            <p className="text-sm text-muted leading-relaxed mb-10 max-w-md">
              Tsunagari guides international students through every step of settling in France —
              from administrative paperwork to building a community you can call home.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/auth/signin" className="btn-primary">
                Begin your journey
              </Link>
              <Link href="/stories" className="btn-secondary">
                Read stories
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="border border-border p-8 space-y-4">
              <div className="section-label">Status progression</div>
              <Divider />
              <div className="space-y-4 mt-4">
                {[
                  { dot: 'bg-amber-500', label: 'NEWCOMER', desc: '< 3 months in France', active: true },
                  { dot: 'bg-emerald-500', label: 'SETTLED', desc: '3+ months, finding rhythm' },
                  { dot: 'bg-accent', label: 'AMBASSADOR', desc: '3 contributions + settled' },
                ].map((s, i) => (
                  <div key={i} className={`flex items-start gap-4 ${!s.active ? 'opacity-50' : ''}`}>
                    <div className="mt-1.5">
                      <span className={`block w-2 h-2 rounded-full ${s.dot}`} />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-foreground">{s.label}</div>
                      <div className="text-xs text-muted mt-0.5">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 right-6 max-w-6xl mx-auto">
          <Divider rhythm />
        </div>
      </section>

      {/* Value props */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-12">
          <Divider label="What Tsunagari offers" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.symbol} className="bg-background p-8 md:p-10">
              <div className="text-accent text-xs font-bold tracking-widest mb-6">{prop.symbol}</div>
              <h3 className="text-lg font-bold text-foreground mb-3 tracking-tight">{prop.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{prop.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cities */}
      <section className="border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="md:border-r border-border pr-0 md:pr-12 pb-8 md:pb-0">
              <div className="section-label mb-4">Currently active in</div>
              <div className="flex gap-6 items-end">
                <div>
                  <div className="text-3xl font-bold tracking-tight">Paris</div>
                  <div className="text-xs text-muted mt-1">Île-de-France</div>
                </div>
                <div className="text-muted text-2xl leading-none pb-1">·</div>
                <div>
                  <div className="text-3xl font-bold tracking-tight">Lyon</div>
                  <div className="text-xs text-muted mt-1">Auvergne-Rhône-Alpes</div>
                </div>
              </div>
            </div>
            <div className="md:pl-12 pt-8 md:pt-0 border-t md:border-t-0 border-border">
              <div className="section-label mb-4">The platform</div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Map', 'Community-built places'],
                  ['Experiences', 'Events & meetups'],
                  ['Buddy', 'Peer matching'],
                  ['Stories', 'Arrival narratives'],
                ].map(([name, desc]) => (
                  <div key={name}>
                    <div className="text-sm font-bold text-foreground">{name}</div>
                    <div className="text-xs text-muted mt-0.5">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-lg">
          <div className="section-label mb-4">Ready to start?</div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Your arrival story begins here.
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-8">
            Sign in with your email to create a profile, generate your personalized checklist,
            and connect with the Tsunagari community.
          </p>
          <Link href="/auth/signin" className="btn-primary">
            Get started — it&apos;s free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-accent" aria-hidden>繋</span>
            <span className="text-xs text-muted">Tsunagari — connection, bond</span>
          </div>
          <div className="text-[10px] text-muted tracking-widest uppercase">
            Built for international students in France
          </div>
        </div>
      </footer>
    </div>
  )
}
