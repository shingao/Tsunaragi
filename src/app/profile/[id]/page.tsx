import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/StatusBadge'
import { Divider } from '@/components/Divider'
import { MyceliaLogo } from '@/components/MyceliaLogo'
import { parseJsonArray, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="md:col-span-2">
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
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{user.nationality}</span>
                )}
                {user.city && (
                  <>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>·</span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{user.city}</span>
                  </>
                )}
                {user.arrivalDate && (
                  <>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>·</span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
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

        {/* Stats */}
        <div
          className="p-5"
          style={{ border: '1px solid var(--line)', backgroundColor: 'var(--surface)', borderRadius: '4px' }}
        >
          <div className="section-label mb-4">Contributions</div>
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

      <Divider className="mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stories */}
        {user.storiesWritten.length > 0 && (
          <div>
            <div className="section-label mb-4">Stories</div>
            <div className="space-y-3">
              {user.storiesWritten.map((story) => (
                <Link key={story.id} href={`/stories/${story.id}`} className="block group">
                  <div className="text-base font-medium transition-colors text-text group-hover:text-accent">
                    {story.title}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[10px]"
                      style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
                    >
                      {formatDate(story.createdAt)}
                    </span>
                    {parseJsonArray(story.tags).slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px]" style={{ color: 'var(--accent)' }}>#{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Places added */}
        {user.placesAdded.length > 0 && (
          <div>
            <div className="section-label mb-4">Places shared</div>
            <div className="space-y-2">
              {user.placesAdded.map((place) => (
                <div key={place.id} className="flex items-center gap-3">
                  <span
                    className="text-[10px] px-1.5 py-0.5"
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
                  <span className="text-sm" style={{ color: 'var(--text)' }}>{place.name}</span>
                  <span className="text-[10px] ml-auto" style={{ color: 'var(--muted)' }}>{place.city}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experiences hosted */}
        {user.hostedExperiences.length > 0 && (
          <div>
            <div className="section-label mb-4">Events hosted</div>
            <div className="space-y-3">
              {user.hostedExperiences.map((exp) => (
                <Link key={exp.id} href={`/experiences/${exp.id}`} className="block group">
                  <div className="text-base font-medium transition-colors text-text group-hover:text-accent">
                    {exp.title}
                  </div>
                  <div
                    className="text-[10px] mt-0.5"
                    style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
                  >
                    {formatDate(exp.date)} · {exp.city}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
