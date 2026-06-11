'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Divider } from '@/components/Divider'
import { MyceliaLogo } from '@/components/MyceliaLogo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError('')

    const result = await signIn('email', {
      email: email.trim(),
      redirect: false,
      callbackUrl: '/dashboard',
    })

    setLoading(false)

    if (result?.error) {
      setError('Something went wrong. Please try again.')
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: 'var(--success-soft)' }}
      >
        <div className="max-w-md w-full">
          <div
            className="p-8 md:p-10"
            style={{
              border: '1px solid var(--line)',
              backgroundColor: 'var(--surface)',
              borderRadius: '4px',
              boxShadow: '0 1px 2px rgba(31,26,21,0.04), 0 4px 12px rgba(31,26,21,0.04)',
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <MyceliaLogo size={20} color="var(--success)" />
            </div>
            <div className="section-label mb-4" style={{ color: 'var(--success)' }}>Link on its way</div>
            <h1 className="text-2xl font-serif mb-4" style={{ color: 'var(--text)', fontWeight: 500 }}>
              Check your inbox
            </h1>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
              We&apos;ve sent a login link to{' '}
              <strong style={{ color: 'var(--text)' }}>{email}</strong>.
              Click the link to pick up where you left off.
            </p>
            <Divider rhythm className="mb-6" />
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              In development, the magic link is printed to the terminal console.
              Check your server logs.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--success-soft)' }}
    >
      <div className="max-w-md w-full">
        <div
          className="p-8 md:p-10"
          style={{
            border: '1px solid var(--line)',
            backgroundColor: 'var(--surface)',
            borderRadius: '4px',
            boxShadow: '0 1px 2px rgba(31,26,21,0.04), 0 4px 12px rgba(31,26,21,0.04)',
            borderTop: '3px solid var(--success)',
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <MyceliaLogo size={24} color="var(--success)" />
            <span className="font-serif text-base" style={{ color: 'var(--text)', fontWeight: 500 }}>Mycelia</span>
          </div>

          <div className="section-label mb-2" style={{ color: 'var(--success)' }}>Existing account</div>
          <h1 className="text-2xl font-serif mb-2" style={{ color: 'var(--text)', fontWeight: 500 }}>
            Welcome back
          </h1>
          <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--muted)' }}>
            Good to see you again. Enter your email and we&apos;ll send you a magic link — no password needed.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block section-label mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                required
                autoFocus
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: '#c0392b' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send login link'}
            </button>
          </form>

          <Divider className="my-6" />

          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            New here?{' '}
            <Link href="/auth/signin" className="underline" style={{ color: 'var(--text)' }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
