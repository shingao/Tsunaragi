import Link from 'next/link'

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full border border-border p-8 md:p-10">
        <div className="text-accent text-2xl mb-6 select-none" aria-hidden>繋</div>
        <div className="section-label mb-2">Email sent</div>
        <h1 className="text-xl font-bold mb-4">Check your inbox</h1>
        <p className="text-sm text-muted leading-relaxed mb-6">
          A sign-in link has been sent to your email address.
          Click the link to sign in to Tsunagari.
        </p>
        <p className="text-xs text-muted mb-6">
          In development mode, the magic link is printed to the terminal console.
        </p>
        <Link href="/" className="text-xs text-muted underline">
          ← Return to homepage
        </Link>
      </div>
    </div>
  )
}
