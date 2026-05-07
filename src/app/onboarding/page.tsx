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
                    className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest border transition-all duration-150 ${
                      form.city === city
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-background text-muted border-border hover:border-foreground hover:text-foreground'
                    }`}
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
            <p className="text-xs text-muted mb-4">Select all that apply.</p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`px-3 py-1.5 text-xs border transition-all duration-150 ${
                    form.languages.includes(lang)
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-muted border-border hover:border-foreground hover:text-foreground'
                  }`}
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
            <div className="text-accent text-2xl select-none" aria-hidden>繋</div>
            <h3 className="text-lg font-bold">You&apos;re all set</h3>
            <p className="text-sm text-muted leading-relaxed">
              Welcome to Tsunagari, <strong className="text-foreground">{form.name}</strong>.
              Your personalized checklist has been generated. Your journey starts now.
            </p>
            <div className="border border-border p-4 space-y-2">
              <div className="section-label">Your profile</div>
              <Divider />
              <div className="mt-2 space-y-1 text-xs text-muted">
                <div>City: <span className="text-foreground">{form.city}</span></div>
                <div>Nationality: <span className="text-foreground">{form.nationality}</span></div>
                <div>Languages: <span className="text-foreground">{form.languages.join(', ')}</span></div>
              </div>
            </div>
            <button onClick={() => router.push('/dashboard')} className="btn-primary w-full justify-center mt-4">
              Go to dashboard →
            </button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.slice(0, -1).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 flex items-center justify-center border text-[10px] font-bold transition-all duration-150 ${
                i === step
                  ? 'bg-foreground text-background border-foreground'
                  : i < step
                  ? 'bg-accent text-background border-accent'
                  : 'bg-background text-muted border-border'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] uppercase tracking-widest hidden sm:block ${i === step ? 'text-foreground font-bold' : 'text-muted'}`}>
                {s}
              </span>
              {i < STEPS.length - 2 && <span className="text-border mx-1 hidden sm:block">—</span>}
            </div>
          ))}
        </div>

        <div className="border border-border p-8">
          {step < STEPS.length - 1 && (
            <div className="mb-6">
              <div className="section-label mb-1">Step {step + 1} of {STEPS.length - 1}</div>
              <h2 className="text-xl font-bold">{STEPS[step]}</h2>
            </div>
          )}

          {stepContent()}

          {error && <p className="text-xs text-red-600 mt-4">{error}</p>}

          {step < STEPS.length - 1 && (
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="btn-ghost"
                >
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
