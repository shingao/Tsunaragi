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
        <h1 className="text-2xl font-serif" style={{ color: 'var(--text)', fontWeight: 500 }}>Experiences</h1>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
          Events, workshops, and gatherings hosted by the Mycelia community.
        </p>
      </div>

      <Divider className="mb-8" />

      {upcoming.length === 0 && past.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4 select-none" aria-hidden>🌱</div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>No experiences yet. Check back soon.</p>
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
      <div className="p-5 h-full flex flex-col transition-colors duration-150" style={{ border: '1px solid var(--line)', backgroundColor: 'var(--surface)', borderRadius: '4px' }}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.borderColor = 'var(--line)')}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}>{experience.city}</span>
          {!past && (
            <span className={`text-[10px] uppercase tracking-widest font-bold ${isFull ? 'text-red-500' : 'text-accent'}`}>
              {isFull ? 'Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
            </span>
          )}
        </div>

        <h3 className="text-sm font-medium line-clamp-2 mb-2 flex-1 transition-colors" style={{ color: 'var(--text)' }}>
          {experience.title}
        </h3>

        <p className="text-xs line-clamp-2 mb-4 leading-relaxed" style={{ color: 'var(--muted)' }}>
          {experience.description}
        </p>

        <Divider className="mb-3" />

        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}>{formatDate(experience.date)}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}>
              {experience.attendees.length}/{experience.capacity} attending
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px]" style={{ color: 'var(--muted)' }}>Hosted by</div>
            <div className="text-[10px] font-medium" style={{ color: 'var(--text)' }}>{experience.host.name ?? 'Community'}</div>
            <StatusBadge status={experience.host.status} className="mt-0.5" />
          </div>
        </div>
      </div>
    </Link>
  )
}
