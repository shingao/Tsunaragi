'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MyceliaLogo } from './MyceliaLogo'
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
    <header
      className="sticky top-0 z-40"
      style={{ borderBottom: '1px solid var(--line)', backgroundColor: 'var(--bg)' }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <MyceliaLogo size={24} color="var(--accent)" />
          <span
            className="font-serif font-medium text-base tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Mycelia
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm transition-colors duration-150',
                pathname === link.href
                  ? 'font-medium'
                  : 'hover:text-text'
              )}
              style={{
                color: pathname === link.href ? 'var(--text)' : 'var(--muted)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm transition-colors"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm transition-colors"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/auth/signin" className="btn-primary text-sm">
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden transition-colors"
          style={{ color: 'var(--muted)' }}
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
        <div
          className="md:hidden"
          style={{ borderTop: '1px solid var(--line)', backgroundColor: 'var(--bg)' }}
        >
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm py-1 transition-colors"
                style={{ color: 'var(--muted)' }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="divider my-1" />
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm py-1 transition-colors"
                  style={{ color: 'var(--muted)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                  className="text-left text-sm py-1 transition-colors"
                  style={{ color: 'var(--muted)' }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="btn-primary text-sm w-fit" onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
