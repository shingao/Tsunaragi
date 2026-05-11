import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function monthsAgo(date: Date | string): number {
  const then = new Date(date)
  const now = new Date()
  return (
    (now.getFullYear() - then.getFullYear()) * 12 +
    (now.getMonth() - then.getMonth())
  )
}
