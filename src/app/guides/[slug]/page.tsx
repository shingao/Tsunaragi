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
import { RelatedGuideLink } from './RelatedGuideLink'
import { OfficialLinkCard } from '@/components/OfficialLinkCard'

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
        <Link
          href="/guides"
          className="text-xs transition-colors"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
        >
          ← All guides
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Main content ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Header */}
          <div
            className="p-6"
            style={{
              border: '1px solid var(--line)',
              borderRadius: '4px',
              backgroundColor: 'var(--surface)',
              boxShadow: '0 1px 2px rgba(31,26,21,0.04), 0 4px 12px rgba(31,26,21,0.04)',
            }}
          >
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="section-label">{CATEGORY_LABELS[guide.checklistCategory] ?? guide.checklistCategory}</span>
              {checklistStatus !== null && (
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: checklistStatus?.completed ? 'var(--success)' : 'var(--muted)',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {checklistStatus?.completed ? '✓ Done' : 'Not yet done'}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-serif mb-3" style={{ color: 'var(--text)', fontWeight: 500 }}>
              {guide.title}
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>{guide.summary}</p>
            <div
              className="text-[10px] mt-4"
              style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
            >
              Updated {formatDate(guide.updatedAt)}
            </div>
          </div>

          {/* Official resources */}
          {officialLinks.length > 0 && (
            <div>
              <div className="section-label mb-4">Official resources</div>
              <div className="flex flex-col gap-2">
                {officialLinks.map((link) => (
                  <OfficialLinkCard key={link.url} label={link.label} url={link.url} />
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
                    <div
                      className="shrink-0 w-7 h-7 flex items-center justify-center text-[10px] font-medium mt-0.5"
                      style={{
                        border: '1px solid var(--line)',
                        borderRadius: '4px',
                        color: 'var(--muted)',
                        fontFamily: 'var(--font-jetbrains), monospace',
                        backgroundColor: 'var(--surface-alt)',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-medium mb-1" style={{ color: 'var(--text)' }}>
                        {step.title}
                      </div>
                      <p className="text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
                        {step.description}
                      </p>
                      {step.tip && (
                        <div
                          className="mt-3 pl-3"
                          style={{ borderLeft: '2px solid var(--accent)' }}
                        >
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                            <span
                              className="font-medium"
                              style={{
                                color: 'var(--accent)',
                                fontFamily: 'var(--font-jetbrains), monospace',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                              }}
                            >
                              Tip
                            </span>
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
              <div
                className="p-5"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                }}
              >
                <div className="text-base leading-[1.8] whitespace-pre-wrap" style={{ color: 'var(--muted)' }}>
                  {guide.tips}
                </div>
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <Divider label={`Comments (${guide.comments.length})`} className="mb-6" />

            {guide.comments.length > 0 && (
              <div className="space-y-4 mb-6">
                {guide.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4"
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--line)',
                      borderRadius: '4px',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                          {comment.author.name ?? 'Community member'}
                        </span>
                        <StatusBadge status={comment.author.status} />
                        <span
                          className="text-[10px]"
                          style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
                        >
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <HelpfulButton
                        commentId={comment.id}
                        slug={params.slug}
                        initialCount={comment.helpful}
                      />
                    </div>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {guide.comments.length === 0 && (
              <p className="text-base mb-6" style={{ color: 'var(--muted)' }}>
                No comments yet. Be the first to share your experience.
              </p>
            )}

            {session?.user ? (
              <div>
                <div className="section-label mb-3">Share your experience</div>
                <CommentForm slug={params.slug} />
              </div>
            ) : (
              <div
                className="p-4"
                style={{ border: '1px solid var(--line)', borderRadius: '4px', backgroundColor: 'var(--surface)' }}
              >
                <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>
                  Log in to share your experience and help others.
                </p>
                <Link href="/auth/login" className="btn-secondary text-sm">
                  Log in
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Sticky sidebar ── */}
        <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          {/* Checklist status */}
          <div
            className="p-5"
            style={{ border: '1px solid var(--line)', borderRadius: '4px', backgroundColor: 'var(--surface)' }}
          >
            <div className="section-label mb-3">Your checklist</div>
            {session?.user ? (
              <>
                {checklistStatus !== null && (
                  <div
                    className="text-sm mb-3"
                    style={{ color: checklistStatus?.completed ? 'var(--success)' : 'var(--muted)' }}
                  >
                    {checklistStatus?.completed
                      ? '✓ Marked complete'
                      : 'This step is on your checklist'}
                  </div>
                )}
                <Link href="/dashboard" className="btn-ghost text-sm w-full justify-center">
                  View your first steps
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--muted)' }}>
                  Log in to track your progress and mark this step done.
                </p>
                <Link href="/auth/login" className="btn-ghost text-sm w-full justify-center">
                  Log in
                </Link>
              </>
            )}
          </div>

          {/* Related guides */}
          {relatedGuides.length > 0 && (
            <div
              className="p-5"
              style={{ border: '1px solid var(--line)', borderRadius: '4px', backgroundColor: 'var(--surface)' }}
            >
              <div className="section-label mb-3">Related guides</div>
              <div className="space-y-2">
                {relatedGuides.map((g) => (
                  <RelatedGuideLink key={g.slug} slug={g.slug} title={g.title} />
                ))}
              </div>
              <Link
                href="/guides"
                className="text-[10px] mt-3 block transition-colors"
                style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}
              >
                All guides →
              </Link>
            </div>
          )}

          {/* Contribute */}
          <div
            className="p-5"
            style={{
              border: '1px solid var(--accent-soft)',
              borderRadius: '4px',
              backgroundColor: 'var(--accent-soft)',
            }}
          >
            <div
              className="text-[10px] font-medium mb-2 uppercase tracking-widest"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains), monospace' }}
            >
              Contribute
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Leaving a helpful comment counts toward your Ambassador status.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
