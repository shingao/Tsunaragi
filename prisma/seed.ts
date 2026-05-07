import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.buddyMatch.deleteMany()
  await prisma.experienceAttendee.deleteMany()
  await prisma.story.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.place.deleteMany()
  await prisma.checklistItem.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()

  // ── Demo users ──────────────────────────────────────────
  const now = new Date()

  const ambassador = await prisma.user.create({
    data: {
      id: 'demo-ambassador-1',
      email: 'maria@demo.tsunagari.app',
      name: 'Maria Santos',
      nationality: 'Brazilian',
      city: 'Paris',
      arrivalDate: new Date(now.getFullYear() - 2, now.getMonth(), now.getDate()),
      languages: JSON.stringify(['Portuguese', 'French', 'English', 'Spanish']),
      status: 'AMBASSADOR',
      bio: "I arrived in Paris two years ago with one suitcase and zero French beyond 'bonjour'. Now I work in tech and help newcomers navigate everything I had to figure out the hard way.",
      emailVerified: new Date(),
    },
  })

  const newcomer = await prisma.user.create({
    data: {
      id: 'demo-newcomer-1',
      email: 'yuki@demo.tsunagari.app',
      name: 'Yuki Tanaka',
      nationality: 'Japanese',
      city: 'Paris',
      arrivalDate: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
      languages: JSON.stringify(['Japanese', 'English']),
      status: 'NEWCOMER',
      bio: 'Recently arrived in Paris for a Master\'s in AI. Still figuring out the CAF paperwork but loving the bakeries.',
      emailVerified: new Date(),
    },
  })

  console.log('✓ Created 2 demo users')

  // ── Checklist for demo users ─────────────────────────────
  const GENERIC_ITEMS = [
    { category: 'admin', title: 'Register at your local Mairie', description: 'Register your address at the town hall (declaration de domicile)', order: 1 },
    { category: 'admin', title: 'Open a French bank account', description: 'Required for most services. Try La Banque Postale or a neobank like Wise.', order: 2 },
    { category: 'health', title: 'Register with CPAM (Assurance Maladie)', description: 'Apply for French health insurance at ameli.fr', order: 3 },
    { category: 'admin', title: 'Apply for CAF housing aid', description: 'Housing assistance (APL) from the French state at caf.fr', order: 4 },
    { category: 'admin', title: 'Get a French SIM card', description: 'A local number is needed for most registrations and verifications', order: 5 },
    { category: 'health', title: 'Obtain your Carte Vitale', description: 'Your health insurance card — apply once CPAM registration is confirmed', order: 6 },
    { category: 'health', title: 'Register with a médecin traitant', description: 'Choose a primary care physician (required for full reimbursement)', order: 7 },
    { category: 'admin', title: 'Set up a Navigo transport card', description: 'Monthly metro/bus pass for Île-de-France. Available at any station.', order: 8 },
    { category: 'admin', title: 'Apply for titre de séjour (non-EU)', description: 'Submit residence permit application online', order: 9 },
    { category: 'admin', title: 'Set up EDF or Engie (utilities)', description: 'Register electricity and gas in your name if renting', order: 10 },
    { category: 'community', title: 'Explore your neighborhood', description: 'Find the nearest bakery, pharmacy, and supermarket', order: 11 },
    { category: 'food', title: 'Visit a local market', description: 'Fresh produce, local culture, and affordable groceries', order: 12 },
    { category: 'community', title: 'Join a local international group', description: 'Meetup.com or Facebook groups for expats in your city', order: 13 },
    { category: 'culture', title: 'Get a library card (médiathèque)', description: 'Free access to books, films, and often free events', order: 14 },
    { category: 'community', title: 'Attend a Tsunagari welcome event', description: 'Meet fellow newcomers and local ambassadors', order: 15 },
  ]

  const JAPANESE_ITEMS = [
    { category: 'admin', title: 'Register at Japanese Consulate', description: 'Notify the consulate of your residence in France (zaigai todoke)', order: 16 },
    { category: 'community', title: 'Connect with the Japan Cultural Institute (ICJ)', description: 'Institut franco-japonais — events, language, community', order: 17 },
    { category: 'admin', title: 'Transfer or renew your Japanese driving license', description: 'Exchange for a French license at the Préfecture', order: 18 },
    { category: 'food', title: 'Find Japanese grocery stores', description: 'Kioko, Ace Mart in Paris / Épicerie du Monde in Lyon', order: 19 },
    { category: 'community', title: 'Join a local Japanese community group', description: 'Association Franco-Japonaise or local Facebook groups', order: 20 },
  ]

  const BRAZILIAN_ITEMS = [
    { category: 'admin', title: 'Register at Brazilian Consulate', description: 'Notify your consulate of your residence abroad', order: 16 },
    { category: 'community', title: 'Find the Brazilian community in Paris', description: 'Facebook groups: Brasileiros em Paris', order: 17 },
    { category: 'admin', title: 'Legalize your Brazilian documents', description: 'Get a Hague Apostille for diplomas and vital records', order: 18 },
    { category: 'food', title: 'Find Brazilian grocery stores', description: 'Toko Brasil, O Mercadão — Brazilian products in France', order: 19 },
    { category: 'culture', title: 'Find Portuguese language resources', description: 'FLUPA association for Lusophone community in France', order: 20 },
  ]

  await prisma.checklistItem.createMany({
    data: [
      ...GENERIC_ITEMS.map((item) => ({ ...item, userId: newcomer.id, completed: false })),
      ...JAPANESE_ITEMS.map((item) => ({ ...item, userId: newcomer.id, completed: false })),
      // Pre-complete some items for the newcomer
    ],
  })

  await prisma.checklistItem.createMany({
    data: [
      ...GENERIC_ITEMS.map((item) => ({ ...item, userId: ambassador.id, completed: true })),
      ...BRAZILIAN_ITEMS.map((item) => ({ ...item, userId: ambassador.id, completed: true })),
    ],
  })

  console.log('✓ Generated checklists')

  // ── Places ───────────────────────────────────────────────
  const places = [
    // Paris — Food
    { name: 'Bouillon Chartier', category: 'FOOD', lat: 48.8729, lng: 2.3396, city: 'Paris', description: 'Classic Parisian brasserie with affordable traditional food. Perfect first French meal.' },
    { name: 'Marché d\'Aligre', category: 'FOOD', lat: 48.8493, lng: 2.3698, city: 'Paris', description: 'Lively outdoor market with great prices. Open Tuesday–Sunday mornings.' },
    { name: 'Kioko Japanese Grocery', category: 'FOOD', lat: 48.8665, lng: 2.3373, city: 'Paris', description: 'The go-to Japanese grocery store in Paris. Near Opéra.' },
    { name: 'Tang Frères', category: 'FOOD', lat: 48.8302, lng: 2.3617, city: 'Paris', description: 'Huge Asian supermarket in the 13th arrondissement. Affordable and well-stocked.' },

    // Paris — Admin
    { name: 'CPAM Paris Centre', category: 'ADMIN', lat: 48.8737, lng: 2.3471, city: 'Paris', description: 'French health insurance office. Bring all documents. Expect queues.' },
    { name: 'CAF Paris', category: 'ADMIN', lat: 48.8763, lng: 2.3613, city: 'Paris', description: 'Family Allowance Fund — apply for housing aid (APL) here or online.' },
    { name: 'Préfecture de Police de Paris', category: 'ADMIN', lat: 48.8540, lng: 2.3476, city: 'Paris', description: 'For residence permits (titre de séjour). Book appointments well in advance.' },
    { name: 'Mairie du 5e', category: 'ADMIN', lat: 48.8513, lng: 2.3459, city: 'Paris', description: 'Local town hall for the Latin Quarter. Address registration and local services.' },

    // Paris — Health
    { name: 'Hôpital Saint-Louis', category: 'HEALTH', lat: 48.8694, lng: 2.3653, city: 'Paris', description: 'Major public hospital in the 10th. Emergency services 24/7.' },
    { name: 'Centre de Santé Richerand', category: 'HEALTH', lat: 48.8683, lng: 2.3631, city: 'Paris', description: 'Community health center with doctors, affordable consultations.' },

    // Paris — Culture
    { name: 'Centre Pompidou', category: 'CULTURE', lat: 48.8606, lng: 2.3523, city: 'Paris', description: 'Free entry on the first Sunday of each month. Great café on top floor.' },
    { name: 'Musée d\'Orsay', category: 'CULTURE', lat: 48.8600, lng: 2.3266, city: 'Paris', description: 'Impressionist art in a stunning train station. Free for under-26 EU residents.' },

    // Paris — Community
    { name: 'Alliance Française Paris', category: 'COMMUNITY', lat: 48.8455, lng: 2.3193, city: 'Paris', description: 'French language courses and cultural events for international residents.' },
    { name: 'American Library in Paris', category: 'COMMUNITY', lat: 48.8587, lng: 2.3042, city: 'Paris', description: 'Great English-language library and events. Welcoming to all expats.' },

    // Lyon — Food
    { name: 'Les Halles de Lyon Paul Bocuse', category: 'FOOD', lat: 45.7647, lng: 4.8427, city: 'Lyon', description: 'Lyon\'s famous covered market. Try quenelles, charcuterie, and local cheeses.' },
    { name: 'Bouchon Daniel et Denise', category: 'FOOD', lat: 45.7598, lng: 4.8352, city: 'Lyon', description: 'Authentic Lyonnais bouchon. A must-visit for traditional local cuisine.' },

    // Lyon — Admin
    { name: 'Préfecture du Rhône', category: 'ADMIN', lat: 45.7567, lng: 4.8334, city: 'Lyon', description: 'Residence permits and official documents. Bring everything and arrive early.' },
    { name: 'CPAM Lyon', category: 'ADMIN', lat: 45.7490, lng: 4.8478, city: 'Lyon', description: 'Health insurance registration for Lyon residents.' },

    // Lyon — Health
    { name: 'Hôpital de la Croix-Rousse', category: 'HEALTH', lat: 45.7777, lng: 4.8290, city: 'Lyon', description: 'Major public hospital serving northern Lyon. Large emergency department.' },

    // Lyon — Culture + Community
    { name: 'Institut Lumière', category: 'CULTURE', lat: 45.7476, lng: 4.8451, city: 'Lyon', description: 'Birthplace of cinema. Museum, screenings, and the Lumière film festival in October.' },
    { name: 'Alliance Française Lyon', category: 'COMMUNITY', lat: 45.7549, lng: 4.8350, city: 'Lyon', description: 'French language courses and community events for international residents in Lyon.' },
  ]

  for (const place of places) {
    await prisma.place.create({
      data: { ...place, addedById: ambassador.id },
    })
  }

  console.log(`✓ Created ${places.length} places`)

  // ── Experiences ──────────────────────────────────────────
  const futureDate = (daysFromNow: number) => {
    const d = new Date()
    d.setDate(d.getDate() + daysFromNow)
    d.setHours(18, 0, 0, 0)
    return d
  }

  const exp1 = await prisma.experience.create({
    data: {
      hostId: ambassador.id,
      title: 'Newcomer Picnic at Parc des Buttes-Chaumont',
      description: 'A relaxed Sunday afternoon for newcomers to Paris. Bring your own picnic, share stories, ask questions, and meet people in the same boat. Regulars welcome to come and mingle.\n\nWe meet near the main entrance on the Rue Botzaris side. Look for the Tsunagari sign.',
      city: 'Paris',
      date: futureDate(14),
      capacity: 25,
    },
  })

  const exp2 = await prisma.experience.create({
    data: {
      hostId: ambassador.id,
      title: 'Administrative Paperwork Workshop',
      description: 'A practical 2-hour workshop covering everything you need to know about French administrative procedures: CPAM registration, CAF application, titre de séjour, and more.\n\nBring your documents (or copies) and get your questions answered.',
      city: 'Paris',
      date: futureDate(7),
      capacity: 15,
    },
  })

  await prisma.experience.create({
    data: {
      hostId: ambassador.id,
      title: 'French ↔ English Language Exchange',
      description: 'Informal language exchange evening at a local café. Speak French, practice English, meet locals and internationals. No level requirement — all are welcome.',
      city: 'Paris',
      date: futureDate(21),
      capacity: 20,
    },
  })

  await prisma.experience.create({
    data: {
      hostId: ambassador.id,
      title: 'Welcome Dinner for International Students',
      description: 'A potluck dinner for international students in Lyon. Bring a dish from your home country or a bottle of wine. Share your story over good food.',
      city: 'Lyon',
      date: futureDate(10),
      capacity: 30,
    },
  })

  await prisma.experience.create({
    data: {
      hostId: ambassador.id,
      title: 'Lyon Walking Tour: Traboules & History',
      description: 'Explore Lyon\'s famous traboules (hidden passageways) and the history of the Presqu\'île. Led by a local ambassador who has been living here for 3 years.',
      city: 'Lyon',
      date: futureDate(28),
      capacity: 12,
    },
  })

  // RSVP demo newcomer to first two experiences
  await prisma.experienceAttendee.create({
    data: { experienceId: exp1.id, userId: newcomer.id },
  })
  await prisma.experienceAttendee.create({
    data: { experienceId: exp2.id, userId: newcomer.id },
  })

  console.log('✓ Created 5 experiences')

  // ── Stories ──────────────────────────────────────────────
  await prisma.story.create({
    data: {
      authorId: ambassador.id,
      title: 'Finding My Rhythm: One Year in Paris',
      content: `I arrived in Paris on a grey November morning with one large suitcase, a six-month student visa, and the phone number of a university housing contact who never picked up.

The first three months were a blur of paperwork, failed appointments, and very expensive espressos drunk alone at zinc counters, pretending to understand what people around me were saying.

The CAF took four months to process my APL application. The CPAM lost my file twice. I found a doctor by essentially walking into every cabinet médical in my arrondissement and asking if they were taking new patients.

But I also found the Marché d'Aligre on a Tuesday morning, discovered that Bouillon Chartier would feed me a full meal for €12, and accidentally joined a French conversation group at the local médiathèque.

The hardest part wasn't the language or even the loneliness. It was the pace at which France operates — slow, deliberate, deeply attached to the physical document and the in-person visit. Coming from Brazil, where everything moves on WhatsApp and instant gratification, this was a cultural recalibration I wasn't prepared for.

A year in, I can say with honesty: I love it here. Not despite the difficulty, but partly because of it. Every bureaucratic hurdle I cleared was a proof that I could build a life somewhere completely foreign.

What helped most: other internationals who were a year or two ahead of me on the path. They knew which forms could be submitted online, which offices to call, and crucially — which battles to let go of.

That's why I became an ambassador on Tsunagari. The knowledge of how to survive your first year in France is too valuable not to share.`,
      tags: JSON.stringify(['housing', 'admin', 'first-year', 'paris', 'community']),
    },
  })

  await prisma.story.create({
    data: {
      authorId: ambassador.id,
      title: 'The French Administrative Maze: What Nobody Tells You',
      content: `After two years of navigating the French bureaucratic system as a Brazilian expat, here are the things I wish someone had told me before I started.

**1. Everything requires a justificatif de domicile**

Your proof of address is your passport to every service. Get it right from day one. A recent utility bill, a bank statement, or a rental agreement — carry a fresh copy everywhere.

**2. The AMELI website is actually good**

Creating your compte ameli and tracking your Carte Vitale application online is surprisingly smooth. Don't queue at the physical CPAM office until you absolutely have to.

**3. CAF is chronically slow — apply immediately**

Housing aid (APL) is calculated from the month you apply, not from when it's approved. Apply the day you sign your lease. Even if you're not sure you're eligible, apply anyway.

**4. The sous-préfecture is not the préfecture**

For titre de séjour renewals, know exactly which office handles your category. The wrong office will send you away politely but firmly.

**5. Build a document folder and keep it updated**

I use a physical binder with tabs: identity, housing, health, taxes, transport. When France asks for a document (and it will), you want to be able to find it in under 30 seconds.

This is not a comprehensive guide — it's a survival starter kit. The best resource will always be someone who has done it recently before you.`,
      tags: JSON.stringify(['admin', 'tips', 'housing', 'health']),
    },
  })

  await prisma.story.create({
    data: {
      authorId: newcomer.id,
      title: 'First Impressions: Paris Through Japanese Eyes',
      content: `I've been in Paris for just over a month. These are my observations so far, written while they're still fresh.

The thing that surprised me most: how dark it is. Not culturally — the people are warmer than I expected — but literally. Paris in April is cloudy in a way that Tokyo in April is not. I wake up and can't tell if it's 7am or 9am.

The bread is real. I knew the croissants would be good, but I didn't expect to feel emotional about a baguette. The first time I bought one from the boulangerie two blocks from my apartment and ate it warm while walking home, I understood something about why French people are the way they are about food.

The silence of the city at 2pm is bewildering. The quiet hours — the sacred post-lunch lull — exist here in a way they simply don't in Tokyo. Shops close. The streets empty. Time slows. It took me weeks to stop feeling like I was missing something.

The bureaucracy is real and not exaggerated. I have a file. In the file are 23 documents. I am still waiting for my CPAM number.

The community I've found through Tsunagari has been more helpful than any official resource. Maria answered my questions about CAF in 10 minutes and saved me probably three visits to the wrong office.

More updates to follow. Ask me again in six months.`,
      tags: JSON.stringify(['first-impressions', 'paris', 'japanese', 'newcomer']),
    },
  })

  console.log('✓ Created 3 stories')

  // ── Buddy match ──────────────────────────────────────────
  await prisma.buddyMatch.create({
    data: {
      newcomerId: newcomer.id,
      ambassadorId: ambassador.id,
      status: 'ACTIVE',
    },
  })

  console.log('✓ Created buddy match')

  console.log('\n✅ Seed complete!\n')
  console.log('Demo accounts:')
  console.log('  Ambassador: maria@demo.tsunagari.app')
  console.log('  Newcomer:   yuki@demo.tsunagari.app')
  console.log('\nTo sign in as a demo user, go to /auth/signin,')
  console.log('enter the email above, and copy the magic link from the terminal.\n')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
