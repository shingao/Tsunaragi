'use client'

import { useState } from 'react'

interface OfficialLinkCardProps {
  label: string
  url: string
}

export function OfficialLinkCard({ label, url }: OfficialLinkCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2.5 text-base transition-colors duration-150"
      style={{
        border: `1px solid ${hovered ? 'var(--accent)' : 'var(--line)'}`,
        color: hovered ? 'var(--accent)' : 'var(--text)',
        backgroundColor: 'var(--surface)',
        borderRadius: '4px',
        fontFamily: 'var(--font-inter), sans-serif',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ color: 'var(--muted)' }}>↗</span>
      {label}
    </a>
  )
}
