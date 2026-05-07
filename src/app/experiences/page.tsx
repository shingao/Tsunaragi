import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { StatusBadge } from '@/components/StatusBadge'
import { Divider } from '@/components/Divider'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ExperiencesPage() {
  const experiences = await prisma.experience.findMany({
    include: {
      host: { select: { id: true, name: true, status: true } },
      attendees: { select: { userId: true } },
    },
    orderBy: { date: 'asc' },
  })

  const upcoming = experiences.filter((e) => new Date(e.date) >= new Date())
  const past = experiences.filter((e) => new Date(e.date) < new Date())

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="section-label mb-1">Community</div>
        <h1 className="text-2xl font-bold tracking-tight">Experiences</h1>
        <p className="text-sm text-muted mt-2">
          Events, workshops, and gatherings hosted by the Tsunagari community.
        </p>
      </div>

      <Divider className="mb-8" />

      {upcoming.length === 0 && past.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-accent text-3xl mb-4 select-none" aria-hidden>繋</div>
          <p className="text-sm text-muted">No experiences yet. Check back soon.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {upcoming.length > 0 && (
            <div>
              <Divider label="Upcoming" className="mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcoming.map((exp) => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <Divider label="Past" className="mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
                {past.map((exp) => (
                  <ExperienceCard key={exp.id} experience={exp} past />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ExperienceCard({
  experience,
  past,
}: {
  experience: {
    id: string
    title: string
    description: string
    city: string
    date: Date
    capacity: number
    host: { id: string; name: string | null; status: string }
    attendees: { userId: string }[]
  }
  past?: boolean
}) {
  const spotsLeft = experience.capacity - experience.attendees.length
  const isFull = spotsLeft <= 0

  return (
    <Link href={`/experiences/${experience.id}`} className="block group">
      <div className="border border-border bg-surface p-5 h-full flex flex-col hover:border-accent transition-colors duration-150">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] text-muted uppercase tracking-widest">{experience.city}</span>
          {!past && (
            <span className={`text-[10px] uppercase tracking-widest font-bold ${isFull ? 'text-red-500' : 'text-accent'}`}>
              {isFull ? 'Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
            </span>
          )}
        </div>

        <h3 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2 flex-1">
          {experience.title}
        </h3>

        <p className="text-xs text-muted line-clamp-2 mb-4 leading-relaxed">
          {experience.description}
        </p>

        <Divider className="mb-3" />

        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-muted">{formatDate(experience.date)}</div>
            <div className="text-[10px] text-muted mt-0.5">
              {experience.attendees.length}/{experience.capacity} attending
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted">Hosted by</div>
            <div className="text-[10px] text-foreground font-bold">{experience.host.name ?? 'Community'}</div>
            <StatusBadge status={experience.host.status} className="mt-0.5" />
          </div>
        </div>
      </div>
    </Link>
  )
}
