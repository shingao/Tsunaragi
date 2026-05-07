# 繋がり Tsunagari

**Connection. Bond.**

A platform helping international students arrive in France and become local ambassadors over time.

---

## Stack

- **Next.js 14** — App Router, TypeScript
- **Tailwind CSS** — with a custom Japanese-inspired design system
- **Prisma + SQLite** — local development, zero configuration
- **NextAuth v4** — email magic links, no passwords
- **Leaflet + React-Leaflet** — interactive community map
- **Space Mono** — monospace font for all UI

---

## Setup

### 1. Clone and install

```bash
git clone <repository-url>
cd tsunagari
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env` — the defaults work for local development. The only required change for production is `NEXTAUTH_SECRET`:

```bash
# Generate a secret
openssl rand -base64 32
```

### 3. Initialize the database

```bash
npm run db:push    # Create SQLite database from schema
npm run db:seed    # Seed with demo data
```

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Sign in (development)

Tsunagari uses **email magic links** — no passwords. In development, the sign-in link is printed to your terminal console instead of being emailed.

1. Go to [http://localhost:3000/auth/signin](http://localhost:3000/auth/signin)
2. Enter any email address
3. Copy the magic link from your terminal output
4. Paste it in your browser

**Demo accounts (pre-seeded):**

| Email | Role | Status |
|-------|------|--------|
| `maria@demo.tsunagari.app` | Host, Author | AMBASSADOR |
| `yuki@demo.tsunagari.app` | Student | NEWCOMER |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero and value props |
| `/auth/signin` | Email magic link sign-in |
| `/onboarding` | Multi-step profile setup → generates checklist |
| `/dashboard` | User home: checklist, buddy status, upcoming events |
| `/map` | Community map with category filters. Add places when signed in. |
| `/experiences` | Events and meetups. RSVP when signed in. |
| `/buddy` | Request a buddy or become one (Ambassador status required) |
| `/stories` | Community arrival stories |
| `/stories/create` | Write and publish your story |
| `/profile/[id]` | Public profile with contributions |

---

## Status system

User status updates automatically based on arrival date and contributions:

```
NEWCOMER  → arrived < 3 months ago
SETTLED   → arrived 3+ months ago
AMBASSADOR → SETTLED + 3 contributions
             (place added + story posted + buddy hosted)
```

---

## Database commands

```bash
npm run db:push      # Sync schema to database (no migrations)
npm run db:seed      # Reseed with demo data
npm run db:studio    # Open Prisma Studio GUI
npm run db:reset     # Reset and reseed (destructive)
```

---

## Project structure

```
src/
├── app/
│   ├── api/              # Route handlers
│   ├── auth/             # Sign in + verify pages
│   ├── buddy/            # Buddy matching
│   ├── dashboard/        # User dashboard
│   ├── experiences/      # Events
│   ├── map/              # Leaflet map
│   ├── onboarding/       # Profile setup
│   ├── profile/[id]/     # Public profiles
│   ├── stories/          # Story feed + detail + create
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── map/MapClient.tsx # Leaflet client component
│   ├── Divider.tsx
│   ├── Nav.tsx
│   └── StatusBadge.tsx
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── checklist.ts      # Checklist generation
│   ├── prisma.ts         # Prisma singleton
│   ├── status.ts         # Status computation
│   └── utils.ts          # Utilities
prisma/
├── schema.prisma
└── seed.ts
```

---

## Production deployment

For production, configure a real email provider (Resend, Postmark, SendGrid) in `.env`:

```bash
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=re_xxxxx
EMAIL_FROM=hello@yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<your-secret>
```

For the database, migrate to PostgreSQL by changing the Prisma provider and `DATABASE_URL`.

---

## Design

The UI follows a Japanese-inspired minimal aesthetic:

- **Font**: Space Mono (monospace everywhere)
- **Colors**: `#FAFAF7` background · `#1A1A1A` text · `#2E3A8C` accent
- **No rounded corners** (2px max), no gradients, no heavy shadows
- **Thin borders** (1px), generous whitespace
- **Kanji 繋がり** used as a subtle design element, never decorative
- **Status badges**: dot indicator + uppercase mono text
- **Transitions**: 150ms, no bounce

---

*繋がり — tsunagari — connection, bond.*
