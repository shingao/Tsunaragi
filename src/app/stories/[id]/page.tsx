import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/StatusBadge'
import { Divider } from '@/components/Divider'
import { parseJsonArray, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function StoryDetailPage({ params }: { params: { id: string } }) {
  const story = await prisma.story.findUnique({
    where: { id: params.id },
    include: { author: { select: { id: true, name: true, nationality: true, status: true, bio: true, city: true } } },
  })

  if (!story) notFound()

  const tags = parseJsonArray(story.tags)

  const otherStories = await prisma.story.findMany({
    where: { authorId: story.authorId, NOT: { id: story.id } },
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, createdAt: true },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/stories" className="text-xs text-muted hover:text-foreground transition-colors">
          ← Stories
        </Link>
      </div>

      <article>
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <StatusBadge status={story.author.status} />
            {story.author.nationality && (
              <span className="text-xs text-muted">{story.author.nationality}</span>
            )}
            <span className="text-xs text-muted">{formatDate(story.createdAt)}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-4">
            {story.title}
          </h1>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="text-[10px] text-accent uppercase tracking-widest">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <Divider className="mb-8" />

        {/* Content */}
        <div className="text-sm text-foreground leading-[1.8] whitespace-pre-wrap mb-10">
          {story.content}
        </div>

        <Divider className="mb-8" />

        {/* Author */}
        <div className="flex items-start gap-5 bg-surface border border-border p-5">
          <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
            <span className="text-accent text-sm" aria-hidden>繋</span>
          </div>
          <div>
            <div className="font-bold text-sm mb-0.5">
              <Link href={`/profile/${story.author.id}`} className="hover:text-accent transition-colors">
                {story.author.name ?? 'Anonymous'}
              </Link>
            </div>
            <StatusBadge status={story.author.status} />
            {story.author.nationality && (
              <div className="text-xs text-muted mt-0.5">{story.author.nationality} · {story.author.city}</div>
            )}
            {story.author.bio && (
              <p className="text-xs text-muted mt-2 leading-relaxed">{story.author.bio}</p>
            )}
          </div>
        </div>

        {otherStories.length > 0 && (
          <div className="mt-10">
            <Divider label="More from this author" className="mb-6" />
            <div className="space-y-3">
              {otherStories.map((s) => (
                <Link key={s.id} href={`/stories/${s.id}`} className="block group">
                  <div className="text-xs font-bold text-foreground group-hover:text-accent transition-colors">
                    {s.title}
                  </div>
                  <div className="text-[10px] text-muted mt-0.5">{formatDate(s.createdAt)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
