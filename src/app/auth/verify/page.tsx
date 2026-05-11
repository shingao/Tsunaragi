import Link from 'next/link'
import { MyceliaLogo } from '@/components/MyceliaLogo'

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="max-w-md w-full p-8 md:p-10"
        style={{
          border: '1px solid var(--line)',
          borderRadius: '4px',
          backgroundColor: 'var(--surface)',
          boxShadow: '0 1px 2px rgba(31,26,21,0.04), 0 4px 12px rgba(31,26,21,0.04)',
        }}
      >
        <div className="flex items-center gap-2 mb-6">
          <MyceliaLogo size={20} color="var(--accent)" />
        </div>
        <div className="section-label mb-2">Link on its way</div>
        <h1 className="text-xl font-serif mb-4" style={{ color: 'var(--text)', fontWeight: 500 }}>
          Check your inbox
        </h1>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
          A sign-in link has been sent to your email address.
          Click the link to sign in to Mycelia.
        </p>
        <p className="text-xs mb-6" style={{ color: 'var(--muted)' }}>
          In development mode, the magic link is printed to the terminal console.
        </p>
        <Link
          href="/"
          className="text-xs underline transition-colors"
          style={{ color: 'var(--muted)' }}
        >
          ← Return to homepage
        </Link>
      </div>
    </div>
  )
}
