import type { Metadata } from 'next'
import { Space_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Nav } from '@/components/Nav'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tsunagari 繋がり',
  description: 'Connection. Helping international students arrive in France and become local ambassadors.',
  keywords: ['international students', 'France', 'expat', 'Paris', 'Lyon', 'community'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={spaceMono.variable}>
      <body className="font-mono bg-background text-foreground min-h-screen">
        <Providers>
          <Nav />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
