import { getServerSession } from 'next-auth/next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/StatusBadge'
import { Divider } from '@/components/Divider'
import { formatDate } from '@/lib/utils'
import { RSVPButton } from './RSVPButton'

export const dynamic = 'force-dynamic'

export default async function ExperienceDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  const experience = await prisma.experience.findUnique({
    where: { id: params.id },
    include: {
      host: { select: { id: true, name: true, status: true, nationality: true, bio: true } },
      attendees: { select: { userId: true, user: { select: { name: true } } } },
    },
  })

  if (!experience) notFound()

  const isAttending = session?.user?.id
    ? experience.attendees.some((a) => a.userId === session.user.id)
    : false
  const isFull = experience.attendees.length >= experience.capacity
  const isPast = new Date(experience.date) < new Date()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/experiences" className="text-xs text-muted hover:text-foreground transition-colors">
          ← Experiences
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="section-label">{experience.city}</span>
              {isPast && <span className="text-[10px] text-muted uppercase tracking-widest">Past event</span>}
              {!isPast && isFull && <span className="text-[10px] text-red-500 uppercase tracking-widest font-bold">Full</span>}
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">{experience.title}</h1>
            <p className="text-lg text-muted leading-relaxed whitespace-pre-wrap">{experience.description}</p>
          </div>

          <Divider />

          {/* Attendees */}
          <div>
            <div className="section-label mb-3">
              Attendees ({experience.attendees.length}/{experience.capacity})
            </div>
            <div className="flex flex-wrap gap-2">
              {experience.attendees.map((a) => (
                <span key={a.userId} className="text-sm border border-border px-2 py-1 text-muted">
                  {a.user.name ?? 'Anonymous'}
                </span>
              ))}
              {experience.attendees.length === 0 && (
                <span className="text-sm text-muted">No attendees yet — be the first!</span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="border border-border bg-surface p-5 space-y-3">
            <div className="section-label">When</div>
            <div className="text-base font-bold">{formatDate(experience.date)}</div>
            <div className="text-sm text-muted">
              {new Date(experience.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </div>

            <Divider />

            <div className="section-label">Where</div>
            <div className="text-base font-bold">{experience.city}</div>

            <Divider />

            <div className="section-label">Capacity</div>
            <div className="text-base">
              <span className="font-bold">{experience.attendees.length}</span>
              <span className="text-muted"> / {experience.capacity}</span>
            </div>

            {!isPast && (
              <>
                <Divider />
                {session?.user ? (
                  <RSVPButton
                    experienceId={experience.id}
                    isAttending={isAttending}
                    isFull={isFull && !isAttending}
                  />
                ) : (
                  <Link href="/auth/login" className="btn-secondary w-full justify-center text-sm">
                    Log in to RSVP
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Host */}
          <div className="border border-border bg-surface p-5">
            <div className="section-label mb-3">Host</div>
            <Link href={`/profile/${experience.host.id}`} className="block group">
              <div className="font-bold text-base group-hover:text-accent transition-colors">
                {experience.host.name ?? 'Community Member'}
              </div>
              <StatusBadge status={experience.host.status} className="mt-1" />
              {experience.host.nationality && (
                <div className="text-sm text-muted mt-1">{experience.host.nationality}</div>
              )}
              {experience.host.bio && (
                <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-3">
                  {experience.host.bio}
                </p>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
