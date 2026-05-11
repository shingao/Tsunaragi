import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Divider } from '@/components/Divider'
import { StatusBadge } from '@/components/StatusBadge'
import { BuddyActions } from './BuddyActions'

export const dynamic = 'force-dynamic'

export default async function BuddyPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin')

  const userId = session.user.id

  const [user, asNewcomer, asAmbassador, availableAmbassadors] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, nationality: true, city: true, status: true },
    }),
    prisma.buddyMatch.findMany({
      where: { newcomerId: userId },
      include: { ambassador: { select: { id: true, name: true, nationality: true, city: true, status: true, bio: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.buddyMatch.findMany({
      where: { ambassadorId: userId },
      include: { newcomer: { select: { id: true, name: true, nationality: true, city: true, status: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findMany({
      where: {
        status: 'AMBASSADOR',
        NOT: { id: userId },
      },
      select: { id: true, name: true, nationality: true, city: true, status: true, bio: true },
      take: 20,
    }),
  ])

  if (!user) redirect('/auth/signin')

  const activeRequest = asNewcomer.find((m) => m.status === 'PENDING' || m.status === 'ACTIVE')
  const isAmbassador = user.status === 'AMBASSADOR'

  const matchedAmbassadors = availableAmbassadors.filter(
    (a) => a.nationality === user.nationality && a.city === user.city
  )
  const otherAmbassadors = availableAmbassadors.filter(
    (a) => !(a.nationality === user.nationality && a.city === user.city)
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="section-label mb-1">Connection</div>
        <h1 className="text-2xl font-serif" style={{ color: 'var(--text)', fontWeight: 500 }}>
          Meet your local
        </h1>
        <p className="text-sm mt-2 max-w-xl leading-relaxed" style={{ color: 'var(--muted)' }}>
          Get matched with an ambassador who has walked your path, or become one
          and welcome the next person arriving.
        </p>
      </div>

      <Divider className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Newcomer section */}
        <div>
          <div className="section-label mb-4">Find a local</div>

          {activeRequest ? (
            <div
              className="p-5 space-y-3"
              style={{ border: '1px solid var(--line)', borderRadius: '4px', backgroundColor: 'var(--surface)' }}
            >
              <div
                className="text-xs font-medium"
                style={{
                  color: activeRequest.status === 'ACTIVE' ? 'var(--success)' : 'var(--muted)',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {activeRequest.status === 'ACTIVE' ? 'Active match' : 'Request pending'}
              </div>
              <div>
                <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>
                  {activeRequest.ambassador.name ?? 'Ambassador'}
                </div>
                <StatusBadge status={activeRequest.ambassador.status} className="mt-1" />
                <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  {activeRequest.ambassador.nationality} · {activeRequest.ambassador.city}
                </div>
              </div>
              {activeRequest.ambassador.bio && (
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {activeRequest.ambassador.bio}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {matchedAmbassadors.length > 0 && (
                <div>
                  <Divider label="Best matches" className="mb-4" />
                  <div className="space-y-3">
                    {matchedAmbassadors.map((amb) => (
                      <AmbassadorCard key={amb.id} ambassador={amb} userId={userId} />
                    ))}
                  </div>
                </div>
              )}

              {otherAmbassadors.length > 0 && (
                <div>
                  <Divider label="Other locals" className="mb-4" />
                  <div className="space-y-3">
                    {otherAmbassadors.slice(0, 5).map((amb) => (
                      <AmbassadorCard key={amb.id} ambassador={amb} userId={userId} />
                    ))}
                  </div>
                </div>
              )}

              {availableAmbassadors.length === 0 && (
                <div
                  className="p-6 text-center"
                  style={{ border: '1px solid var(--line)', borderRadius: '4px', backgroundColor: 'var(--surface)' }}
                >
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    No locals available right now. Check back soon.
                  </p>
                </div>
              )}

              <BuddyActions action="request" label="Auto-match me with a local" />
            </div>
          )}
        </div>

        {/* Ambassador section */}
        <div>
          <div className="section-label mb-4">
            {isAmbassador ? 'People you are welcoming' : 'Become a local ambassador'}
          </div>

          {!isAmbassador ? (
            <div
              className="p-6"
              style={{ border: '1px solid var(--line)', borderRadius: '4px', backgroundColor: 'var(--surface)' }}
            >
              <div className="text-sm font-medium mb-3" style={{ color: 'var(--accent)' }}>
                Ambassador status required
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
                Ambassadors are settled members who have made 3 contributions:
                sharing a place, writing a story, or welcoming a newcomer.
                Your status updates automatically as you contribute.
              </p>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}>
                Current status: <StatusBadge status={user.status} className="inline-flex ml-1" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {asAmbassador.length === 0 ? (
                <div
                  className="p-5 text-center"
                  style={{ border: '1px solid var(--line)', borderRadius: '4px', backgroundColor: 'var(--surface)' }}
                >
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>No requests yet.</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                    You will be notified when newcomers reach out.
                  </p>
                </div>
              ) : (
                asAmbassador.map((match) => (
                  <div
                    key={match.id}
                    className="p-5"
                    style={{ border: '1px solid var(--line)', borderRadius: '4px', backgroundColor: 'var(--surface)' }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>
                          {match.newcomer.name ?? 'Newcomer'}
                        </div>
                        <StatusBadge status={match.newcomer.status} className="mt-1" />
                        <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                          {match.newcomer.nationality} · {match.newcomer.city}
                        </div>
                      </div>
                      <span
                        className="text-[10px] uppercase tracking-widest font-medium"
                        style={{
                          color: match.status === 'ACTIVE' ? 'var(--success)' : 'var(--muted)',
                          fontFamily: 'var(--font-jetbrains), monospace',
                        }}
                      >
                        {match.status}
                      </span>
                    </div>
                    {match.status === 'PENDING' && (
                      <div className="flex gap-2 mt-3">
                        <BuddyActions action="accept" matchId={match.id} label="Accept" />
                        <BuddyActions action="decline" matchId={match.id} label="Decline" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AmbassadorCard({
  ambassador,
  userId: _userId,
}: {
  ambassador: { id: string; name: string | null; nationality: string | null; city: string | null; status: string; bio: string | null }
  userId: string
}) {
  return (
    <div
      className="p-4"
      style={{ border: '1px solid var(--line)', borderRadius: '4px', backgroundColor: 'var(--surface)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>
            {ambassador.name ?? 'Ambassador'}
          </div>
          <StatusBadge status={ambassador.status} className="mt-1" />
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            {ambassador.nationality} · {ambassador.city}
          </div>
          {ambassador.bio && (
            <p className="text-xs mt-2 leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
              {ambassador.bio}
            </p>
          )}
        </div>
        <BuddyActions action="request-specific" ambassadorId={ambassador.id} label="Connect" />
      </div>
    </div>
  )
}
