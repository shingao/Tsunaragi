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

  // Ambassadors matching same nationality+city go first
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
        <h1 className="text-2xl font-bold tracking-tight">Buddy System</h1>
        <p className="text-sm text-muted mt-2 max-w-xl">
          Get matched with an ambassador who has walked your path, or become one
          and help the next generation of newcomers.
        </p>
      </div>

      <Divider className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Newcomer section */}
        <div>
          <div className="section-label mb-4">Find a buddy</div>

          {activeRequest ? (
            <div className="border border-border p-5 space-y-3">
              <div className={`text-xs font-bold uppercase tracking-widest ${
                activeRequest.status === 'ACTIVE' ? 'text-accent' : 'text-muted'
              }`}>
                {activeRequest.status === 'ACTIVE' ? 'Active match' : 'Request pending'}
              </div>
              <div>
                <div className="font-bold text-sm">{activeRequest.ambassador.name ?? 'Ambassador'}</div>
                <StatusBadge status={activeRequest.ambassador.status} className="mt-1" />
                <div className="text-xs text-muted mt-1">{activeRequest.ambassador.nationality} · {activeRequest.ambassador.city}</div>
              </div>
              {activeRequest.ambassador.bio && (
                <p className="text-xs text-muted leading-relaxed">{activeRequest.ambassador.bio}</p>
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
                  <Divider label="Other ambassadors" className="mb-4" />
                  <div className="space-y-3">
                    {otherAmbassadors.slice(0, 5).map((amb) => (
                      <AmbassadorCard key={amb.id} ambassador={amb} userId={userId} />
                    ))}
                  </div>
                </div>
              )}

              {availableAmbassadors.length === 0 && (
                <div className="border border-border p-6 text-center">
                  <p className="text-sm text-muted">
                    No ambassadors available right now. Check back soon.
                  </p>
                </div>
              )}

              <BuddyActions action="request" label="Auto-match me with a buddy" />
            </div>
          )}
        </div>

        {/* Ambassador section */}
        <div>
          <div className="section-label mb-4">
            {isAmbassador ? 'Your newcomers' : 'Become an ambassador'}
          </div>

          {!isAmbassador ? (
            <div className="border border-border p-6">
              <div className="text-accent text-sm font-bold mb-3">Ambassador status required</div>
              <p className="text-xs text-muted leading-relaxed mb-4">
                Ambassadors are settled members who have made 3 contributions:
                adding a place, sharing a story, or hosting a buddy.
                Your status updates automatically as you contribute.
              </p>
              <div className="text-[10px] text-muted uppercase tracking-widest">
                Current status: <StatusBadge status={user.status} className="inline-flex" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {asAmbassador.length === 0 ? (
                <div className="border border-border p-5 text-center">
                  <p className="text-sm text-muted">No buddy requests yet.</p>
                  <p className="text-xs text-muted mt-1">You will be notified when newcomers request you.</p>
                </div>
              ) : (
                asAmbassador.map((match) => (
                  <div key={match.id} className="border border-border p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-sm">{match.newcomer.name ?? 'Newcomer'}</div>
                        <StatusBadge status={match.newcomer.status} className="mt-1" />
                        <div className="text-xs text-muted mt-1">
                          {match.newcomer.nationality} · {match.newcomer.city}
                        </div>
                      </div>
                      <span className={`text-[10px] uppercase tracking-widest font-bold ${
                        match.status === 'ACTIVE' ? 'text-accent' :
                        match.status === 'PENDING' ? 'text-muted' : 'text-muted'
                      }`}>
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
    <div className="border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold text-sm">{ambassador.name ?? 'Ambassador'}</div>
          <StatusBadge status={ambassador.status} className="mt-1" />
          <div className="text-xs text-muted mt-1">
            {ambassador.nationality} · {ambassador.city}
          </div>
          {ambassador.bio && (
            <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">{ambassador.bio}</p>
          )}
        </div>
        <BuddyActions action="request-specific" ambassadorId={ambassador.id} label="Request" />
      </div>
    </div>
  )
}
