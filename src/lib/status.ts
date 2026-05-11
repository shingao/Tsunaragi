import { prisma } from './prisma'
import { monthsAgo } from './utils'

export type UserStatus = 'NEWCOMER' | 'SETTLED' | 'AMBASSADOR'

export function computeStatusFromArrival(arrivalDate: Date | null): UserStatus {
  if (!arrivalDate) return 'NEWCOMER'
  const months = monthsAgo(arrivalDate)
  if (months >= 3) return 'SETTLED'
  return 'NEWCOMER'
}

export async function countContributions(userId: string): Promise<number> {
  const [places, stories, hostedBuddies, guideComments] = await Promise.all([
    prisma.place.count({ where: { addedById: userId } }),
    prisma.story.count({ where: { authorId: userId } }),
    prisma.buddyMatch.count({ where: { ambassadorId: userId, status: 'ACTIVE' } }),
    prisma.guideComment.count({ where: { authorId: userId } }),
  ])
  return places + stories + hostedBuddies + guideComments
}

export async function refreshUserStatus(userId: string): Promise<UserStatus> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { arrivalDate: true, status: true },
  })
  if (!user) return 'NEWCOMER'

  const baseStatus = computeStatusFromArrival(user.arrivalDate)

  let newStatus: UserStatus = baseStatus
  if (baseStatus === 'SETTLED') {
    const contributions = await countContributions(userId)
    if (contributions >= 3) newStatus = 'AMBASSADOR'
  }

  if (newStatus !== user.status) {
    await prisma.user.update({ where: { id: userId }, data: { status: newStatus } })
  }

  return newStatus
}

export const STATUS_LABELS: Record<UserStatus, string> = {
  NEWCOMER: 'NEWCOMER',
  SETTLED: 'SETTLED',
  AMBASSADOR: 'AMBASSADOR',
}

export const STATUS_COLORS: Record<UserStatus, string> = {
  NEWCOMER: 'text-muted',
  SETTLED: 'text-foreground',
  AMBASSADOR: 'text-accent',
}

export const STATUS_DOT: Record<UserStatus, string> = {
  NEWCOMER: 'bg-muted',
  SETTLED: 'bg-accent',
  AMBASSADOR: 'bg-accent',
}
