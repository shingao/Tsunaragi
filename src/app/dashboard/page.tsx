import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { refreshUserStatus } from '@/lib/status'
import { parseJsonArray, formatDate } from '@/lib/utils'
import { StatusBadge } from '@/components/StatusBadge'
import { Divider } from '@/components/Divider'
import { ChecklistWidget } from './ChecklistWidget'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin')

  const userId = session.user.id

  await refreshUserStatus(userId)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, name: true, email: true, nationality: true, city: true,
      arrivalDate: true, languages: true, status: true, bio: true,
    },
  })

  if (!user) redirect('/auth/signin')

  const isOnboarded = !!user.city
  if (!isOnboarded) redirect('/onboarding')

  const [checklistItems, buddyAsNewcomer, experiences] = await Promise.all([
    prisma.checklistItem.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
      select: {
        id: true, category: true, title: true, description: true,
        completed: true, order: true, guideSlug: true,
      },
    }),
    prisma.buddyMatch.findFirst({
      where: { newcomerId: userId, status: { in: ['PENDING', 'ACTIVE'] } },
      include: { ambassador: { select: { id: true, name: true, nationality: true, status: true } } },
    }),
    prisma.experience.findMany({
      where: { date: { gte: new Date() }, city: user.city ?? 'Paris' },
      take: 3,
      orderBy: { date: 'asc' },
      include: { attendees: { select: { userId: true } } },
    }),
  ])

  const completed = checklistItems.filter((i) => i.completed).length
  const total = checklistItems.length
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  const languages = parseJsonArray(user.languages)

  const categoryGroups = checklistItems.reduce<Record<string, typeof checklistItems>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-10">
        <div>
          <div className="section-label mb-1">Dashboard</div>
          <h1 className="text-2xl font-bold tracking-tight">
            {user.name ?? user.email}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={user.status} />
            {user.city && (
              <span className="text-xs text-muted">{user.city}</span>
            )}
            {user.arrivalDate && (
              <span className="text-xs text-muted">Arrived {formatDate(user.arrivalDate)}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/profile/${userId}`} className="btn-ghost text-xs">
            View profile
          </Link>
          <Link href="/onboarding" className="btn-ghost text-xs">
            Edit profile
          </Link>
        </div>
      </div>

      <Divider className="mb-10" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checklist — 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="section-label">Arrival checklist</div>
            <span className="text-xs text-muted">{completed}/{total} completed</span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-muted-bg border border-border overflow-hidden" role="progressbar">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <ChecklistWidget items={checklistItems} categoryGroups={categoryGroups} />
        </div>

        {/* Sidebar — 1/3 width */}
        <div className="space-y-5">
          {/* Buddy status */}
          <div className="border border-border bg-surface p-5">
            <div className="section-label mb-3">Buddy</div>
            {buddyAsNewcomer ? (
              <div>
                <div className="text-xs text-muted mb-2">
                  {buddyAsNewcomer.status === 'PENDING' ? 'Request pending' : 'Matched with'}
                </div>
                <div className="font-bold text-sm">
                  {buddyAsNewcomer.ambassador.name ?? 'Ambassador'}
                </div>
                <StatusBadge status={buddyAsNewcomer.ambassador.status} className="mt-1" />
                <div className="text-xs text-muted mt-1">{buddyAsNewcomer.ambassador.nationality}</div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted mb-3">
                  Connect with an ambassador from your background.
                </p>
                <Link href="/buddy" className="btn-secondary text-xs">
                  Find a buddy
                </Link>
              </div>
            )}
          </div>

          {/* Upcoming experiences */}
          <div className="border border-border bg-surface p-5">
            <div className="section-label mb-3">Upcoming</div>
            {experiences.length > 0 ? (
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <Link key={exp.id} href={`/experiences/${exp.id}`} className="block group">
                    <div className="text-xs font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                      {exp.title}
                    </div>
                    <div className="text-[10px] text-muted mt-0.5">
                      {new Date(exp.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                      {' · '}{exp.attendees.length}/{exp.capacity}
                    </div>
                  </Link>
                ))}
                <Link href="/experiences" className="text-xs text-muted hover:text-foreground transition-colors">
                  View all →
                </Link>
              </div>
            ) : (
              <p className="text-xs text-muted">No upcoming events in {user.city}.</p>
            )}
          </div>

          {/* Profile summary */}
          <div className="border border-border bg-surface p-5">
            <div className="section-label mb-3">Profile</div>
            <div className="space-y-1.5 text-xs text-muted">
              <div>Nationality: <span className="text-foreground">{user.nationality ?? '—'}</span></div>
              <div>City: <span className="text-foreground">{user.city ?? '—'}</span></div>
              <div>Languages: <span className="text-foreground">{languages.join(', ') || '—'}</span></div>
            </div>
          </div>

          {/* Ambassador path */}
          {user.status !== 'AMBASSADOR' && (
            <div className="border border-accent/20 bg-accent/5 p-5">
              <div className="text-accent text-xs font-bold uppercase tracking-widest mb-2">
                Path to Ambassador
              </div>
              <p className="text-xs text-muted mb-3 leading-relaxed">
                Earn ambassador status by making 3 contributions: add a place to the map,
                share a story, or successfully host a buddy.
              </p>
              <div className="space-y-1">
                <Link href="/map" className="block text-xs text-accent hover:underline">→ Add a place</Link>
                <Link href="/stories/create" className="block text-xs text-accent hover:underline">→ Share your story</Link>
                <Link href="/buddy" className="block text-xs text-accent hover:underline">→ Host a newcomer</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
