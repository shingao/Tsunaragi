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
          <h1 className="text-3xl font-serif" style={{ color: 'var(--text)', fontWeight: 500 }}>
            {user.name ?? user.email}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={user.status} showTooltip />
            {user.city && (
              <span className="text-sm" style={{ color: 'var(--muted)' }}>{user.city}</span>
            )}
            {user.arrivalDate && (
              <span className="text-sm" style={{ color: 'var(--muted)' }}>Arrived {formatDate(user.arrivalDate)}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/profile/${userId}`} className="btn-ghost text-sm">
            View profile
          </Link>
          <Link href="/onboarding" className="btn-ghost text-sm">
            Edit profile
          </Link>
        </div>
      </div>

      <Divider className="mb-10" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checklist — 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="section-label">Your first steps</div>
            <span className="text-sm" style={{ color: 'var(--muted)' }}>{completed}/{total} done</span>
          </div>

          {/* Progress bar */}
          <div
            className="h-1.5 overflow-hidden"
            style={{ backgroundColor: 'var(--surface-alt)', border: '1px solid var(--line)', borderRadius: '4px' }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: 'var(--accent)' }}
            />
          </div>

          <ChecklistWidget items={checklistItems} categoryGroups={categoryGroups} />
        </div>

        {/* Sidebar — 1/3 width */}
        <div className="space-y-5">
          {/* Buddy status */}
          <div
            className="p-5"
            style={{ border: '1px solid var(--line)', backgroundColor: 'var(--surface)', borderRadius: '4px' }}
          >
            <div className="section-label mb-3">Your local</div>
            {buddyAsNewcomer ? (
              <div>
                <div className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
                  {buddyAsNewcomer.status === 'PENDING' ? 'Request pending' : 'Matched with'}
                </div>
                <div className="font-medium text-base" style={{ color: 'var(--text)' }}>
                  {buddyAsNewcomer.ambassador.name ?? 'Ambassador'}
                </div>
                <StatusBadge status={buddyAsNewcomer.ambassador.status} className="mt-1" />
                <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                  {buddyAsNewcomer.ambassador.nationality}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--muted)' }}>
                  Connect with someone from your background who knows France.
                </p>
                <Link href="/buddy" className="btn-secondary text-sm">
                  Meet your local
                </Link>
              </div>
            )}
          </div>

          {/* Upcoming experiences */}
          <div
            className="p-5"
            style={{ border: '1px solid var(--line)', backgroundColor: 'var(--surface)', borderRadius: '4px' }}
          >
            <div className="section-label mb-3">Upcoming</div>
            {experiences.length > 0 ? (
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <Link key={exp.id} href={`/experiences/${exp.id}`} className="block group">
                    <div
                      className="text-sm font-medium group-hover:text-accent line-clamp-1 transition-colors"
                      style={{ color: 'var(--text)' }}
                    >
                      {exp.title}
                    </div>
                    <div
                      className="text-[10px] mt-0.5"
                      style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
                    >
                      {new Date(exp.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                      {' · '}{exp.attendees.length}/{exp.capacity}
                    </div>
                  </Link>
                ))}
                <Link href="/experiences" className="text-sm transition-colors" style={{ color: 'var(--muted)' }}>
                  View all →
                </Link>
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--muted)' }}>No upcoming events in {user.city}.</p>
            )}
          </div>

          {/* Profile summary */}
          <div
            className="p-5"
            style={{ border: '1px solid var(--line)', backgroundColor: 'var(--surface)', borderRadius: '4px' }}
          >
            <div className="section-label mb-3">Profile</div>
            <div className="space-y-1.5 text-sm" style={{ color: 'var(--muted)' }}>
              <div>Nationality: <span style={{ color: 'var(--text)' }}>{user.nationality ?? '—'}</span></div>
              <div>City: <span style={{ color: 'var(--text)' }}>{user.city ?? '—'}</span></div>
              <div>Languages: <span style={{ color: 'var(--text)' }}>{languages.join(', ') || '—'}</span></div>
            </div>
          </div>

          {/* Growing your roots */}
          {user.status !== 'AMBASSADOR' && (
            <div
              className="p-5"
              style={{
                border: '1px solid',
                borderColor: 'var(--accent-soft)',
                backgroundColor: 'var(--accent-soft)',
                borderRadius: '4px',
              }}
            >
              <div
                className="text-xs font-medium mb-2"
                style={{
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Growing your roots
              </div>
              <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--muted)' }}>
                Become an Ambassador by making 3 contributions: share a place,
                write your story, or welcome someone.
              </p>
              <div className="space-y-1">
                <Link href="/map" className="block text-sm hover:underline" style={{ color: 'var(--accent)' }}>→ Share a place</Link>
                <Link href="/stories/create" className="block text-sm hover:underline" style={{ color: 'var(--accent)' }}>→ Share your story</Link>
                <Link href="/buddy" className="block text-sm hover:underline" style={{ color: 'var(--accent)' }}>→ Welcome someone</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
