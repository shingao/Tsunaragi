# Mycelia

**Arrive in France. Put down roots. Grow together.**

Mycelia is a platform that connects international arrivals to locals, ambassadors, and resources — helping them settle in a new country, one thread at a time.

> **The concept:** Mycelia takes its name from mycelium — the underground network of fungal threads connecting trees in a forest, allowing them to share resources and communicate. It's nature's internet. For Mycelia the platform, it's the invisible network connecting newcomers to locals and ambassadors, helping them put down roots in France.

---

## Stack

- **Next.js 14** — App Router, TypeScript
- **Tailwind CSS** — custom "Warm Welcome" design system
- **Prisma + SQLite** — local development, zero configuration
- **NextAuth v4** — email magic links, no passwords
- **Leaflet + React-Leaflet** — interactive community map
- **Fraunces** (headings) · **Inter** (body) · **JetBrains Mono** (labels, badges)

---

## Setup

### 1. Clone and install

```bash
git clone <repository-url>
cd mycelia
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env` — the defaults work for local development. The only required change for production is `NEXTAUTH_SECRET`:

```bash
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

Mycelia uses **email magic links** — no passwords. In development, the sign-in link is printed to your terminal console instead of being emailed.

1. Go to [http://localhost:3000/auth/signin](http://localhost:3000/auth/signin)
2. Enter any email address
3. Copy the magic link from your terminal output
4. Paste it in your browser

**Demo accounts (pre-seeded):**

| Email | Role | Status |
|-------|------|--------|
| `maria@demo.mycelia.app` | Host, Author | AMBASSADOR |
| `yuki@demo.mycelia.app` | Student | NEWCOMER |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, "How it works", CTA |
| `/auth/signin` | Email magic link sign-in |
| `/onboarding` | Multi-step profile setup → generates checklist |
| `/dashboard` | User home: first-steps checklist, buddy status, events |
| `/map` | Community map with category filters. Share places when signed in. |
| `/experiences` | Events and meetups. RSVP when signed in. |
| `/buddy` | Meet your local or become one (Ambassador status required) |
| `/stories` | Community arrival stories |
| `/stories/create` | Write and publish your story |
| `/profile/[id]` | Public profile with contributions |

---

## Status system

User status updates automatically based on arrival date and contributions:

```
NEWCOMER   → arrived < 3 months ago ("Just arrived")
SETTLED    → arrived 3+ months ago ("Settling in")
AMBASSADOR → SETTLED + 3 contributions
             (place shared + story posted + buddy welcomed)
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
│   ├── buddy/            # Buddy/local matching
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
│   ├── MyceliaLogo.tsx   # SVG mycelium mark
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

## Design system — "Warm Welcome"

The UI follows a warm, organic aesthetic inspired by mycelium networks:

- **Fonts**: Fraunces (headings, serif) · Inter (body) · JetBrains Mono (labels, badges)
- **Colors**: `#FBF5EC` warm cream bg · `#C45A3D` terracotta accent · `#1F1A15` deep brown text
- **Borders**: 1px `#E5DACA`, radius 4px on cards and inputs
- **Shadows**: very subtle, warm-tinted (`rgba(31,26,21,0.04)`)
- **Tagline**: "Arrive in France. Put down roots. Grow together."
- **Status badges**: dot + JetBrains Mono label, pulse animation on Ambassador
- **Logo**: minimal SVG mycelium mark — a central node with branching threads

---

*Mycelia — the invisible network connecting newcomers to their new home.*
