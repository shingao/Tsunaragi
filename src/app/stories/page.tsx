import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { StatusBadge } from '@/components/StatusBadge'
import { Divider } from '@/components/Divider'
import { parseJsonArray, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function StoriesPage() {
  const session = await getServerSession(authOptions)

  const stories = await prisma.story.findMany({
    include: { author: { select: { id: true, name: true, nationality: true, status: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const allTags = Array.from(
    new Set(stories.flatMap((s) => parseJsonArray(s.tags)))
  ).slice(0, 20)

  const canWrite = session?.user?.id

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="section-label mb-1">Community</div>
          <h1 className="text-2xl font-serif" style={{ color: 'var(--text)', fontWeight: 500 }}>Stories</h1>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
            Arrival narratives from the Mycelia community.
          </p>
        </div>
        {canWrite && (
          <Link href="/stories/create" className="btn-primary text-sm shrink-0">
            Share your story
          </Link>
        )}
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {allTags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-widest px-2 py-1"
              style={{
                border: '1px solid var(--line)',
                color: 'var(--muted)',
                borderRadius: '4px',
                fontFamily: 'var(--font-jetbrains), monospace',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <Divider className="mb-8" />

      {stories.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4 select-none" aria-hidden>🌱</div>
          <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>No stories yet. Be the first to plant one.</p>
          {canWrite && (
            <Link href="/stories/create" className="btn-secondary text-sm">
              Write the first story
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-0">
          {stories.map((story, i) => (
            <div key={story.id}>
              {i > 0 && <Divider />}
              <Link href={`/stories/${story.id}`} className="block group py-6">
                <div className="flex items-start gap-5">
                  <div
                    className="shrink-0 w-12 pt-0.5 text-[10px]"
                    style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
                  >
                    {new Date(story.createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2
                      className="text-base font-serif mb-2 leading-snug transition-colors"
                      style={{ color: 'var(--text)', fontWeight: 500 }}
                    >
                      {story.title}
                    </h2>
                    <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--muted)' }}>
                      {story.content.slice(0, 200)}...
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>
                        {story.author.name ?? 'Anonymous'}
                      </div>
                      <StatusBadge status={story.author.status} />
                      {story.author.nationality && (
                        <span className="text-[10px]" style={{ color: 'var(--muted)' }}>
                          {story.author.nationality}
                        </span>
                      )}
                      {parseJsonArray(story.tags).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] uppercase tracking-widest"
                          style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains), monospace' }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
