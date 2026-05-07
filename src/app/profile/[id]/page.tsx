import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/StatusBadge'
import { Divider } from '@/components/Divider'
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

  const contributionCount =
    user.storiesWritten.length + user.placesAdded.length

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="md:col-span-2">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 border border-border flex items-center justify-center shrink-0">
              <span className="text-accent text-xl" aria-hidden>繋</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {user.name ?? 'Community Member'}
              </h1>
              <StatusBadge status={user.status} className="mt-1.5" />
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {user.nationality && (
                  <span className="text-xs text-muted">{user.nationality}</span>
                )}
                {user.city && (
                  <span className="text-xs text-muted">·</span>
                )}
                {user.city && (
                  <span className="text-xs text-muted">{user.city}</span>
                )}
                {user.arrivalDate && (
                  <>
                    <span className="text-xs text-muted">·</span>
                    <span className="text-xs text-muted">Arrived {formatDate(user.arrivalDate)}</span>
                  </>
                )}
              </div>
              {languages.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {languages.map((lang) => (
                    <span key={lang} className="text-[10px] border border-border px-2 py-0.5 text-muted uppercase tracking-widest">
                      {lang}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {user.bio && (
            <p className="text-sm text-muted leading-relaxed mt-6 max-w-lg">
              {user.bio}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="border border-border bg-surface p-5">
          <div className="section-label mb-4">Contributions</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold">{user.storiesWritten.length}</div>
              <div className="text-[10px] text-muted uppercase tracking-widest">Stories</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{user.placesAdded.length}</div>
              <div className="text-[10px] text-muted uppercase tracking-widest">Places</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{user.hostedExperiences.length}</div>
              <div className="text-[10px] text-muted uppercase tracking-widest">Events</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{contributionCount}</div>
              <div className="text-[10px] text-muted uppercase tracking-widest">Total</div>
            </div>
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
                  <div className="text-xs font-bold text-foreground group-hover:text-accent transition-colors">
                    {story.title}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted">{formatDate(story.createdAt)}</span>
                    {parseJsonArray(story.tags).slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] text-accent">#{tag}</span>
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
            <div className="section-label mb-4">Places added</div>
            <div className="space-y-2">
              {user.placesAdded.map((place) => (
                <div key={place.id} className="flex items-center gap-3">
                  <span className="text-[10px] border border-border px-1.5 py-0.5 text-muted uppercase">
                    {place.category.toLowerCase()}
                  </span>
                  <span className="text-xs text-foreground">{place.name}</span>
                  <span className="text-[10px] text-muted ml-auto">{place.city}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experiences */}
        {user.hostedExperiences.length > 0 && (
          <div>
            <div className="section-label mb-4">Events hosted</div>
            <div className="space-y-3">
              {user.hostedExperiences.map((exp) => (
                <Link key={exp.id} href={`/experiences/${exp.id}`} className="block group">
                  <div className="text-xs font-bold text-foreground group-hover:text-accent transition-colors">
                    {exp.title}
                  </div>
                  <div className="text-[10px] text-muted mt-0.5">
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
