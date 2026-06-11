'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Divider } from '@/components/Divider'

const STEPS = ['Profile', 'Location', 'Languages', 'Done']

const NATIONALITIES = [
  'French', 'Japanese', 'Chinese', 'Brazilian', 'Indian', 'American',
  'British', 'German', 'Spanish', 'Italian', 'Korean', 'Vietnamese',
  'Moroccan', 'Algerian', 'Tunisian', 'Senegalese', 'Other'
]

const CITIES = ['Paris', 'Lyon']

const LANGUAGES = [
  'French', 'English', 'Japanese', 'Chinese (Mandarin)', 'Chinese (Cantonese)',
  'Portuguese', 'Spanish', 'Arabic', 'Hindi', 'Korean', 'Vietnamese', 'German',
  'Italian', 'Russian', 'Turkish', 'Other'
]

interface FormData {
  name: string
  nationality: string
  city: string
  arrivalDate: string
  languages: string[]
}

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({
    name: session?.user?.name ?? '',
    nationality: '',
    city: '',
    arrivalDate: '',
    languages: [],
  })

  const toggleLanguage = (lang: string) => {
    setForm((f) => ({
      ...f,
      languages: f.languages.includes(lang)
        ? f.languages.filter((l) => l !== lang)
        : [...f.languages, lang],
    }))
  }

  const canAdvance = () => {
    if (step === 0) return form.name.trim().length > 0 && form.nationality !== ''
    if (step === 1) return form.city !== '' && form.arrivalDate !== ''
    if (step === 2) return form.languages.length > 0
    return true
  }

  const handleNext = async () => {
    if (step < STEPS.length - 2) {
      setStep((s) => s + 1)
      return
    }

    setLoading(true)
    setError('')

    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setStep(STEPS.length - 1)
    setLoading(false)
  }

  const stepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <div>
              <label className="section-label block mb-2">Your name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="How should we call you?"
                className="input-field"
                autoFocus
              />
            </div>
            <div>
              <label className="section-label block mb-2">Nationality</label>
              <select
                value={form.nationality}
                onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                className="input-field"
              >
                <option value="">Select nationality...</option>
                {NATIONALITIES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label className="section-label block mb-2">City in France</label>
              <div className="flex gap-2">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setForm({ ...form, city })}
                    className="flex-1 py-2.5 text-sm font-medium transition-all duration-150"
                    style={{
                      border: '1px solid',
                      borderColor: form.city === city ? 'var(--accent)' : 'var(--line)',
                      backgroundColor: form.city === city ? 'var(--accent-soft)' : 'var(--surface)',
                      color: form.city === city ? 'var(--accent)' : 'var(--muted)',
                      borderRadius: '4px',
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="section-label block mb-2">Arrival date (or planned)</label>
              <input
                type="date"
                value={form.arrivalDate}
                onChange={(e) => setForm({ ...form, arrivalDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div>
            <label className="section-label block mb-3">Languages you speak</label>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Select all that apply.</p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className="px-3 py-1.5 text-sm transition-all duration-150"
                  style={{
                    border: '1px solid',
                    borderColor: form.languages.includes(lang) ? 'var(--accent)' : 'var(--line)',
                    backgroundColor: form.languages.includes(lang) ? 'var(--accent-soft)' : 'var(--surface)',
                    color: form.languages.includes(lang) ? 'var(--accent)' : 'var(--muted)',
                    borderRadius: '4px',
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-3xl mb-2 select-none" style={{ color: 'var(--accent)' }} aria-hidden>🌱</div>
            <h3 className="text-2xl font-serif" style={{ color: 'var(--text)', fontWeight: 500 }}>
              You&apos;re all set
            </h3>
            <p className="text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
              Welcome to Mycelia, <strong style={{ color: 'var(--text)' }}>{form.name}</strong>.
              Your first-steps checklist has been generated. Your journey starts now.
            </p>
            <div
              className="p-4 space-y-2"
              style={{
                border: '1px solid var(--line)',
                borderRadius: '4px',
                backgroundColor: 'var(--surface-alt)',
              }}
            >
              <div className="section-label">Your profile</div>
              <Divider className="my-2" />
              <div className="space-y-1 text-sm" style={{ color: 'var(--muted)' }}>
                <div>City: <span style={{ color: 'var(--text)' }}>{form.city}</span></div>
                <div>Nationality: <span style={{ color: 'var(--text)' }}>{form.nationality}</span></div>
                <div>Languages: <span style={{ color: 'var(--text)' }}>{form.languages.join(', ')}</span></div>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary w-full justify-center mt-4"
            >
              Go to dashboard →
            </button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">

        {/* Organic step indicator — branching line that grows */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.slice(0, -1).map((s, i) => (
            <div key={s} className="flex items-center gap-1 flex-1">
              <div
                className="w-6 h-6 flex items-center justify-center text-[10px] font-medium shrink-0 transition-all duration-200"
                style={{
                  border: '1px solid',
                  borderRadius: '50%',
                  borderColor: i === step ? 'var(--accent)' : i < step ? 'var(--success)' : 'var(--line)',
                  backgroundColor: i === step ? 'var(--accent-soft)' : i < step ? 'var(--success-soft)' : 'var(--surface)',
                  color: i === step ? 'var(--accent)' : i < step ? 'var(--success)' : 'var(--muted)',
                  fontFamily: 'var(--font-jetbrains), monospace',
                }}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span
                className="text-[10px] hidden sm:block"
                style={{
                  color: i === step ? 'var(--text)' : 'var(--muted)',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontWeight: i === step ? 500 : 400,
                }}
              >
                {s}
              </span>
              {i < STEPS.length - 2 && (
                <div
                  className="flex-1 h-px mx-2 transition-all duration-300"
                  style={{
                    backgroundColor: i < step ? 'var(--success)' : 'var(--line)',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div
          className="p-8"
          style={{
            border: '1px solid var(--line)',
            borderRadius: '4px',
            backgroundColor: 'var(--surface)',
            boxShadow: '0 1px 2px rgba(31,26,21,0.04), 0 4px 12px rgba(31,26,21,0.04)',
          }}
        >
          {step < STEPS.length - 1 && (
            <div className="mb-6">
              <div className="section-label mb-1">Step {step + 1} of {STEPS.length - 1}</div>
              <h2 className="text-2xl font-serif" style={{ color: 'var(--text)', fontWeight: 500 }}>
                {STEPS[step]}
              </h2>
            </div>
          )}

          {stepContent()}

          {error && (
            <p className="text-sm mt-4" style={{ color: '#c0392b' }}>{error}</p>
          )}

          {step < STEPS.length - 1 && (
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <button onClick={() => setStep((s) => s - 1)} className="btn-ghost">
                  ← Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canAdvance() || loading}
                className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : step === STEPS.length - 2 ? 'Generate checklist →' : 'Continue →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
