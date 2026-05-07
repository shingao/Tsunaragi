'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { StatusBadge } from './StatusBadge'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/map', label: 'Map' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/buddy', label: 'Buddy' },
  { href: '/stories', label: 'Stories' },
]

export function Nav() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b border-border bg-background sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span className="text-accent text-lg leading-none select-none" aria-hidden>繋</span>
          <span className="font-bold text-sm tracking-widest uppercase text-foreground">Tsunagari</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-xs uppercase tracking-widest transition-colors duration-150',
                pathname === link.href
                  ? 'text-foreground font-bold'
                  : 'text-muted hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {session?.user ? (
            <>
              <Link href="/dashboard" className="text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/auth/signin" className="btn-primary text-xs">
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-muted hover:text-foreground transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1">
            <span className={cn('block h-px w-5 bg-current transition-all', menuOpen && 'translate-y-1.5 rotate-45')} />
            <span className={cn('block h-px w-5 bg-current transition-all', menuOpen && 'opacity-0')} />
            <span className={cn('block h-px w-5 bg-current transition-all', menuOpen && '-translate-y-1.5 -rotate-45')} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors py-1"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="divider my-1" />
            {session?.user ? (
              <>
                <Link href="/dashboard" className="text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors py-1" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                  className="text-left text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors py-1"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="btn-primary text-xs w-fit" onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
