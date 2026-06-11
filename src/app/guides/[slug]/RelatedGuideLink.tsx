'use client'

import { useState } from 'react'
import Link from 'next/link'

interface RelatedGuideLinkProps {
  slug: string
  title: string
}

export function RelatedGuideLink({ slug, title }: RelatedGuideLinkProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/guides/${slug}`}
      className="block text-sm py-1 transition-colors"
      style={{
        color: hovered ? 'var(--text)' : 'var(--muted)',
        borderBottom: '1px solid var(--line)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {title}
    </Link>
  )
}
