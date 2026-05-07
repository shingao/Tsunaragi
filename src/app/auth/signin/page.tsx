'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Divider } from '@/components/Divider'

export default function SignInPage() {
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="border border-border bg-surface p-8 md:p-10">
            <div className="text-accent text-2xl mb-6 select-none" aria-hidden>繋</div>
            <div className="section-label mb-4">Magic link sent</div>
            <h1 className="text-xl font-bold mb-4">Check your inbox</h1>
            <p className="text-sm text-muted leading-relaxed mb-6">
              We&apos;ve sent a sign-in link to <strong className="text-foreground">{email}</strong>.
              Click the link in the email to continue.
            </p>
            <Divider rhythm className="mb-6" />
            <p className="text-xs text-muted">
              In development, the magic link is printed to the terminal console.
              Check your server logs.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="border border-border bg-surface p-8 md:p-10">
          <div className="text-accent text-2xl mb-6 select-none" aria-hidden>繋</div>

          <div className="section-label mb-2">Welcome</div>
          <h1 className="text-xl font-bold mb-2">Sign in to Tsunagari</h1>
          <p className="text-sm text-muted mb-8">
            Enter your email address. We&apos;ll send you a magic link — no password needed.
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
              <p className="text-xs text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? 'Sending...' : 'Send magic link'}
            </button>
          </form>

          <Divider className="my-6" />

          <p className="text-xs text-muted">
            New to Tsunagari?{' '}
            <Link href="/auth/signin" className="text-foreground underline">
              Just sign in
            </Link>{' '}
            — your account is created automatically.
          </p>
        </div>
      </div>
    </div>
  )
}
