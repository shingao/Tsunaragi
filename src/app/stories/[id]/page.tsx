import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/StatusBadge'
import { Divider } from '@/components/Divider'
import { MyceliaLogo } from '@/components/MyceliaLogo'
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
        <Link
          href="/stories"
          className="text-xs transition-colors"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
        >
          ← Stories
        </Link>
      </div>

      <article>
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <StatusBadge status={story.author.status} />
            {story.author.nationality && (
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{story.author.nationality}</span>
            )}
            <span
              className="text-xs"
              style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
            >
              {formatDate(story.createdAt)}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif leading-tight mb-4" style={{ color: 'var(--text)', fontWeight: 400 }}>
            {story.title}
          </h1>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains), monospace' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <Divider className="mb-8" />

        {/* Content */}
        <div
          className="text-lg leading-[1.9] whitespace-pre-wrap mb-10"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {story.content}
        </div>

        <Divider className="mb-8" />

        {/* Author card */}
        <div
          className="flex items-start gap-5 p-5"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: '4px',
          }}
        >
          <div
            className="w-10 h-10 flex items-center justify-center shrink-0"
            style={{ border: '1px solid var(--line)', borderRadius: '4px', backgroundColor: 'var(--surface-alt)' }}
          >
            <MyceliaLogo size={18} color="var(--accent)" />
          </div>
          <div>
            <div className="font-medium text-base mb-0.5" style={{ color: 'var(--text)' }}>
              <Link
                href={`/profile/${story.author.id}`}
                className="transition-colors hover:underline"
                style={{ color: 'var(--text)' }}
              >
                {story.author.name ?? 'Anonymous'}
              </Link>
            </div>
            <StatusBadge status={story.author.status} />
            {story.author.nationality && (
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {story.author.nationality} · {story.author.city}
              </div>
            )}
            {story.author.bio && (
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
                {story.author.bio}
              </p>
            )}
          </div>
        </div>

        {otherStories.length > 0 && (
          <div className="mt-10">
            <Divider label="More from this author" className="mb-6" />
            <div className="space-y-3">
              {otherStories.map((s) => (
                <Link key={s.id} href={`/stories/${s.id}`} className="block group">
                  <div className="text-base font-medium transition-colors text-text group-hover:text-accent">
                    {s.title}
                  </div>
                  <div
                    className="text-[10px] mt-0.5"
                    style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
                  >
                    {formatDate(s.createdAt)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
