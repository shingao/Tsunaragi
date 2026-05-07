import { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || 'localhost',
        port: parseInt(process.env.EMAIL_SERVER_PORT || '25'),
        auth: {
          user: process.env.EMAIL_SERVER_USER || '',
          pass: process.env.EMAIL_SERVER_PASSWORD || '',
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@tsunagari.local',
      sendVerificationRequest: async ({ identifier, url }) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(
            `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `  MAGIC LINK (dev only)\n` +
            `  To: ${identifier}\n` +
            `  URL: ${url}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
          )
          return
        }
        // In production, install nodemailer and configure SMTP here:
        // npm install nodemailer @types/nodemailer
        // const { createTransport } = await import('nodemailer')
        // const transport = createTransport({ host, port, auth: { user, pass } })
        // await transport.sendMail({ to: identifier, from, subject, text, html })
        throw new Error('Email sending not configured for production. See src/lib/auth.ts.')
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  session: {
    strategy: 'database',
  },
}
