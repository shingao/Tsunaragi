import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Divider } from '@/components/Divider'
import { StatusBadge } from '@/components/StatusBadge'
import { CommentForm } from './CommentForm'
import { HelpfulButton } from './HelpfulButton'

export const dynamic = 'force-dynamic'

interface OfficialLink { label: string; url: string }
interface Step { title: string; description: string; tip?: string }

const CATEGORY_LABELS: Record<string, string> = {
  admin: 'Admin & Documents',
  health: 'Health',
  community: 'Community',
  food: 'Food & Markets',
  culture: 'Culture',
}

export default async function GuideDetailPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)

  const [guide, checklistStatus, relatedGuides] = await Promise.all([
    prisma.guide.findUnique({
      where: { slug: params.slug },
      include: {
        comments: {
          orderBy: { helpful: 'desc' },
          include: {
            author: { select: { name: true, status: true } },
          },
        },
      },
    }),
    session?.user?.id
      ? prisma.checklistItem.findFirst({
          where: { userId: session.user.id, guideSlug: params.slug },
          select: { completed: true },
        })
      : Promise.resolve(null),
    prisma.guide.findMany({
      where: { slug: { not: params.slug } },
      take: 4,
      select: { slug: true, title: true, checklistCategory: true },
      orderBy: { checklistCategory: 'asc' },
    }),
  ])

  if (!guide) notFound()

  const officialLinks: OfficialLink[] = JSON.parse(guide.officialLinks) as OfficialLink[]
  const steps: Step[] = JSON.parse(guide.steps) as Step[]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/guides" className="text-xs text-muted hover:text-foreground transition-colors font-mono">
          ← All guides
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="bg-surface border border-border p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="section-label">{CATEGORY_LABELS[guide.checklistCategory] ?? guide.checklistCategory}</span>
              {checklistStatus !== null && (
                <span className={`text-[10px] font-mono uppercase tracking-widest ${
                  checklistStatus?.completed ? 'text-accent' : 'text-muted'
                }`}>
                  {checklistStatus?.completed ? '✓ Completed' : 'Not yet done'}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold tracking-tight mb-3">{guide.title}</h1>
            <p className="text-sm text-muted leading-relaxed">{guide.summary}</p>
            <div className="text-[10px] text-muted font-mono mt-4">
              Updated {formatDate(guide.updatedAt)}
            </div>
          </div>

          {/* Official resources */}
          {officialLinks.length > 0 && (
            <div>
              <div className="section-label mb-4">Official resources</div>
              <div className="flex flex-col gap-2">
                {officialLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border text-xs text-foreground hover:border-accent hover:text-accent transition-colors duration-150 bg-surface font-mono"
                  >
                    <span className="text-muted">↗</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Step by step */}
          {steps.length > 0 && (
            <div>
              <Divider label="Step by step" className="mb-6" />
              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 w-7 h-7 border border-border flex items-center justify-center font-mono text-[10px] font-bold text-muted mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-foreground mb-1">{step.title}</div>
                      <p className="text-sm text-muted leading-relaxed">{step.description}</p>
                      {step.tip && (
                        <div className="mt-3 pl-3 border-l-2 border-accent">
                          <p className="text-xs text-muted leading-relaxed">
                            <span className="font-mono font-bold text-accent uppercase tracking-widest text-[10px]">Pro tip</span>
                            {' '}— {step.tip}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community tips */}
          {guide.tips && (
            <div>
              <Divider label="Community tips" className="mb-4" />
              <div className="bg-surface border border-border p-5">
                <div className="text-sm text-muted leading-[1.8] whitespace-pre-wrap">{guide.tips}</div>
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <Divider label={`Comments (${guide.comments.length})`} className="mb-6" />

            {guide.comments.length > 0 && (
              <div className="space-y-4 mb-6">
                {guide.comments.map((comment) => (
                  <div key={comment.id} className="bg-surface border border-border p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-foreground">
                          {comment.author.name ?? 'Community member'}
                        </span>
                        <StatusBadge status={comment.author.status} />
                        <span className="text-[10px] text-muted font-mono">{formatDate(comment.createdAt)}</span>
                      </div>
                      <HelpfulButton
                        commentId={comment.id}
                        slug={params.slug}
                        initialCount={comment.helpful}
                      />
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {guide.comments.length === 0 && (
              <p className="text-sm text-muted mb-6">
                No comments yet. Be the first to share your experience.
              </p>
            )}

            {session?.user ? (
              <div>
                <div className="section-label mb-3">Share your experience</div>
                <CommentForm slug={params.slug} />
              </div>
            ) : (
              <div className="border border-border bg-surface p-4">
                <p className="text-xs text-muted mb-3">
                  Sign in to share your experience and help others.
                </p>
                <Link href="/auth/signin" className="btn-secondary text-xs">
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Back to checklist */}
          <div className="border border-border bg-surface p-5">
            <div className="section-label mb-3">Your checklist</div>
            {session?.user ? (
              <>
                {checklistStatus !== null && (
                  <div className={`text-xs mb-3 ${checklistStatus?.completed ? 'text-accent' : 'text-muted'}`}>
                    {checklistStatus?.completed
                      ? '✓ This item is marked complete'
                      : 'This item is on your checklist'}
                  </div>
                )}
                <Link href="/dashboard" className="btn-ghost text-xs w-full justify-center">
                  View checklist
                </Link>
              </>
            ) : (
              <>
                <p className="text-xs text-muted mb-3">
                  Sign in to track your progress and mark this step as complete.
                </p>
                <Link href="/auth/signin" className="btn-ghost text-xs w-full justify-center">
                  Sign in
                </Link>
              </>
            )}
          </div>

          {/* Related guides */}
          {relatedGuides.length > 0 && (
            <div className="border border-border bg-surface p-5">
              <div className="section-label mb-3">Related guides</div>
              <div className="space-y-2">
                {relatedGuides.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="block text-xs text-muted hover:text-foreground transition-colors py-1 border-b border-border last:border-0"
                  >
                    {g.title}
                  </Link>
                ))}
              </div>
              <Link href="/guides" className="text-[10px] text-muted hover:text-foreground transition-colors mt-3 block font-mono uppercase tracking-widest">
                All guides →
              </Link>
            </div>
          )}

          {/* Contribute hint */}
          <div className="border border-accent/20 bg-accent/5 p-5">
            <div className="text-accent text-[10px] font-mono font-bold uppercase tracking-widest mb-2">
              Contribute
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Leaving a comment counts as a community contribution toward Ambassador status.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
