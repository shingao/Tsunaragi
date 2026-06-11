import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/StatusBadge'
import { MyceliaLogo } from '@/components/MyceliaLogo'
import { parseJsonArray, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const CARD_STYLE = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--line)',
  borderRadius: '4px',
  boxShadow: '0 1px 2px rgba(31,26,21,0.04), 0 4px 12px rgba(31,26,21,0.04)',
} as const

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true, name: true, nationality: true, city: true,
      arrivalDate: true, languages: true, status: true, bio: true,
      createdAt: true,
      storiesWritten: {
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, createdAt: true, tags: true },
      },
      placesAdded: {
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, category: true, city: true },
        take: 10,
      },
      hostedExperiences: {
        orderBy: { date: 'desc' },
        select: { id: true, title: true, date: true, city: true },
        take: 5,
      },
    },
  })

  if (!user) notFound()

  const languages = parseJsonArray(user.languages)
  const contributionCount = user.storiesWritten.length + user.placesAdded.length

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile header */}
      <div className="mb-10">
        <div className="flex items-start gap-5">
          <div
            className="w-14 h-14 flex items-center justify-center shrink-0"
            style={{
              border: '1px solid var(--line)',
              borderRadius: '4px',
              backgroundColor: 'var(--surface-alt)',
            }}
          >
            <MyceliaLogo size={24} color="var(--accent)" />
          </div>
          <div>
            <h1 className="text-3xl font-serif" style={{ color: 'var(--text)', fontWeight: 500 }}>
              {user.name ?? 'Community Member'}
            </h1>
            <StatusBadge status={user.status} className="mt-1.5" showTooltip />
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {user.nationality && (
                <span className="text-sm" style={{ color: 'var(--muted)' }}>{user.nationality}</span>
              )}
              {user.city && (
                <>
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>·</span>
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>{user.city}</span>
                </>
              )}
              {user.arrivalDate && (
                <>
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>·</span>
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>
                    Arrived {formatDate(user.arrivalDate)}
                  </span>
                </>
              )}
            </div>
            {languages.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {languages.map((lang) => (
                  <span
                    key={lang}
                    className="text-[10px] px-2 py-0.5"
                    style={{
                      border: '1px solid var(--line)',
                      color: 'var(--muted)',
                      borderRadius: '3px',
                      fontFamily: 'var(--font-jetbrains), monospace',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {user.bio && (
          <p className="text-base leading-relaxed mt-6 max-w-lg" style={{ color: 'var(--muted)' }}>
            {user.bio}
          </p>
        )}
      </div>

      {/* Asymmetric grid: content cards left, sidebar right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">

        {/* ── Main content: stacked section cards ── */}
        <div className="md:col-span-2 flex flex-col gap-6 lg:gap-8">

          {/* Stories */}
          {user.storiesWritten.length > 0 && (
            <section className="p-6 lg:p-8" style={CARD_STYLE}>
              <div className="section-label mb-6">Stories</div>
              <div className="space-y-5">
                {user.storiesWritten.map((story) => (
                  <Link key={story.id} href={`/stories/${story.id}`} className="block group">
                    <div className="text-lg font-medium transition-colors text-text group-hover:text-accent">
                      {story.title}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className="text-sm"
                        style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
                      >
                        {formatDate(story.createdAt)}
                      </span>
                      {parseJsonArray(story.tags).slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-sm"
                          style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains), monospace' }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Places added */}
          {user.placesAdded.length > 0 && (
            <section className="p-6 lg:p-8" style={CARD_STYLE}>
              <div className="section-label mb-6">Places shared</div>
              <div>
                {user.placesAdded.map((place) => (
                  <div
                    key={place.id}
                    className="flex items-center gap-3 py-3 px-2 -mx-2 rounded transition-colors hover:bg-surface-alt"
                    style={{ borderBottom: '1px solid var(--line)' }}
                  >
                    <span
                      className="text-[10px] px-1.5 py-0.5 shrink-0"
                      style={{
                        border: '1px solid var(--line)',
                        color: 'var(--muted)',
                        borderRadius: '3px',
                        fontFamily: 'var(--font-jetbrains), monospace',
                        textTransform: 'uppercase',
                      }}
                    >
                      {place.category.toLowerCase()}
                    </span>
                    <span className="text-base" style={{ color: 'var(--text)' }}>{place.name}</span>
                    <span
                      className="text-sm ml-auto shrink-0"
                      style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
                    >
                      {place.city}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experiences hosted */}
          {user.hostedExperiences.length > 0 && (
            <section className="p-6 lg:p-8" style={CARD_STYLE}>
              <div className="section-label mb-6">Events hosted</div>
              <div className="space-y-5">
                {user.hostedExperiences.map((exp) => (
                  <Link key={exp.id} href={`/experiences/${exp.id}`} className="block group">
                    <div className="text-lg font-medium transition-colors text-text group-hover:text-accent">
                      {exp.title}
                    </div>
                    <div
                      className="text-sm mt-1"
                      style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
                    >
                      {formatDate(exp.date)} · {exp.city}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Empty state when no contributions at all */}
          {user.storiesWritten.length === 0 &&
            user.placesAdded.length === 0 &&
            user.hostedExperiences.length === 0 && (
            <section className="p-6 lg:p-8 text-center" style={CARD_STYLE}>
              <p className="text-base" style={{ color: 'var(--muted)' }}>
                No contributions yet — roots take time to grow.
              </p>
            </section>
          )}
        </div>

        {/* ── Sidebar: contributions ── */}
        <div className="p-6" style={CARD_STYLE}>
          <div className="section-label mb-6">Contributions</div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { count: user.storiesWritten.length, label: 'Stories' },
              { count: user.placesAdded.length, label: 'Places' },
              { count: user.hostedExperiences.length, label: 'Events' },
              { count: contributionCount, label: 'Total' },
            ].map(({ count, label }) => (
              <div key={label}>
                <div className="text-2xl font-serif" style={{ color: 'var(--text)', fontWeight: 400 }}>{count}</div>
                <div
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
