import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.guideComment.deleteMany()
  await prisma.guide.deleteMany()
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
      bio: "Recently arrived in Paris for a Master's in AI. Still figuring out the CAF paperwork but loving the bakeries.",
      emailVerified: new Date(),
    },
  })

  console.log('✓ Created 2 demo users')

  // ── Guides ───────────────────────────────────────────────
  const guideSimCard = await prisma.guide.create({
    data: {
      slug: 'french-sim-card',
      checklistCategory: 'admin',
      title: 'Get a French SIM Card',
      summary: 'Compare the main mobile operators and pick the best plan for students arriving in France. A French number is required for most administrative registrations.',
      officialLinks: JSON.stringify([
        { label: 'ARCEP — compare mobile operators', url: 'https://www.arcep.fr/consumers/comparateur-offres.html' },
        { label: 'Free Mobile', url: 'https://mobile.free.fr' },
        { label: 'Sosh (Orange discount brand)', url: 'https://www.sosh.fr' },
        { label: 'Lycamobile France', url: 'https://www.lycamobile.fr' },
        { label: 'Lebara France', url: 'https://mobile.lebara.com/fr/fr' },
      ]),
      steps: JSON.stringify([
        {
          title: 'Start with a prepaid SIM on arrival',
          description: 'Lycamobile and Lebara prepaid SIMs are available at airports, Relay kiosks, tabacs, and supermarkets for €10–15. They activate in minutes and require no French bank account.',
          tip: 'Buy a prepaid SIM at the airport before leaving arrivals. You will need a working French number immediately for everything from RATP to CAF registration.',
        },
        {
          title: 'Choose your long-term operator',
          description: 'Free Mobile offers a €2/month plan (2 GB data, unlimited calls within France) and a €19.99/month unlimited plan — both exceptional value for students. Sosh (Orange) is more reliable and often runs back-to-school promotions in September.',
          tip: "Free Mobile's €2/month plan is a legendary student secret. It requires a French bank account or credit card — get your bank account set up first, then switch.",
        },
        {
          title: 'Purchase and activate your SIM',
          description: 'For subscription plans (Free, Sosh, Orange), visit a store or order online. Your SIM arrives by post within 2–3 days. Activate it by following the instructions on the packaging or in the activation email.',
        },
        {
          title: 'Complete identity verification',
          description: 'EU regulations require all operators to verify your identity. Upload a photo of your passport or national ID via the operator\'s app or website. This is usually done online within 24 hours of activation.',
        },
        {
          title: 'Port your existing number (optional)',
          description: 'If you want to keep a foreign number, ask your current operator for an RIO code (Relevé d\'Identité Opérateur) before switching. Provide this to your new French operator during sign-up.',
        },
      ]),
      tips: 'Free Mobile\'s €2/month plan is the best-known student secret in France: 2 GB data, unlimited calls and SMS within France. Requires a French payment method — set up your bank account first.\n\nFor the first few weeks while you are getting settled, a Lycamobile or Lebara prepaid SIM (€10–15, available at any Relay airport kiosk) covers all your basic needs and includes international SMS.\n\nSosh (Orange\'s discount brand) is a reliable middle-ground option and frequently has student promotions at the start of the academic year (September).\n\nKeep your receipts. Some administrative forms ask for proof of your mobile number registration.',
    },
  })

  const guideBankAccount = await prisma.guide.create({
    data: {
      slug: 'open-bank-account',
      checklistCategory: 'admin',
      title: 'Open a French Bank Account',
      summary: 'A French bank account is required for CAF, rent payments, and most employers. Most students use a two-account approach: a neobank immediately and a traditional bank for formal requirements.',
      officialLinks: JSON.stringify([
        { label: 'La Banque Postale — student accounts', url: 'https://www.labanquepostale.fr/particulier/comptes/compte-bancaire-etudiant.html' },
        { label: 'Hello bank! by BNP Paribas', url: 'https://www.hellobank.fr' },
        { label: 'Wise — multi-currency account (French IBAN)', url: 'https://wise.com/fr' },
        { label: 'N26 — mobile bank', url: 'https://n26.com/fr-fr' },
        { label: 'Banque de France — droit au compte', url: 'https://www.banque-france.fr/particuliers/services-bancaires/ouverture-de-compte/droit-au-compte' },
      ]),
      steps: JSON.stringify([
        {
          title: 'Open a Wise account immediately',
          description: 'Wise can be opened online in under 10 minutes with just a passport. It gives you a French IBAN (FR76...) which is accepted by CAF, most French employers, and landlords. Use this for all spending while you wait for a traditional account.',
          tip: "Wise's French IBAN is accepted by the majority of French services. Revolut only provides a Lithuanian IBAN for EU accounts, which some French services (including certain préfectures) reject.",
        },
        {
          title: 'Gather documents for a traditional bank',
          description: 'Most French banks require: valid passport or national ID, justificatif de domicile (utility bill, lease, or Attestation d\'hébergement), proof of student status (certificat de scolarité), and sometimes a scholarship letter or income proof.',
          tip: 'Bring originals AND copies of every document. French bank staff will ask for a copy even if you are standing there with the original.',
        },
        {
          title: 'Apply to La Banque Postale or BNP',
          description: 'La Banque Postale is the most accessible for newcomers — it has a legal obligation (droit au compte) to open accounts for all French residents. BNP Paribas\'s Hello bank! offers lower fees and a good mobile app.',
          tip: 'La Banque Postale is legally required to open a bank account for any resident who requests one. If another bank rejects you, go directly to La Banque Postale.',
        },
        {
          title: 'Wait for your card and IBAN',
          description: 'Traditional banks take 1–3 weeks to send your physical card. Your IBAN is usually available immediately in the app or online. Once you have your IBAN, update it with CAF, your university, and your employer.',
        },
        {
          title: 'Update your IBAN everywhere',
          description: 'Once your traditional account is open, update your IBAN on: CAF, CPAM, your university grants office, your employer\'s HR, and any subscription services.',
        },
      ]),
      tips: 'Start with Wise. It takes 10 minutes, gives you a multi-currency account with a French IBAN, and you can pay for everything while you wait for your traditional bank account to open.\n\nFor the traditional account, La Banque Postale is the safest bet — by law they cannot refuse any resident. Bring everything in a folder with copies.\n\nN26 is convenient but their customer support is slow. For administrative purposes, Wise is more reliable than N26 for French services.\n\nIf you have income from outside France, Wise is excellent for converting it with low fees. Keep it open even after you get a French bank account.',
    },
  })

  const guideCaf = await prisma.guide.create({
    data: {
      slug: 'caf-housing-aid',
      checklistCategory: 'admin',
      title: 'Apply for CAF Housing Aid (APL)',
      summary: 'APL (Aide Personnalisée au Logement) is a French state housing subsidy available to most students renting in France. Amounts range from €50 to €250/month depending on city, rent, and income.',
      officialLinks: JSON.stringify([
        { label: 'CAF.fr — apply online (DALF)', url: 'https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/logement/les-aides-au-logement' },
        { label: 'CAF — eligibility simulator', url: 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement' },
        { label: 'CAF — create an account', url: 'https://www.caf.fr/allocataires/caf-de-paris/offre-de-service/ouvrir-mon-espace-client' },
        { label: 'Service-Public — APL explained', url: 'https://www.service-public.fr/particuliers/vosdroits/F12006' },
      ]),
      steps: JSON.stringify([
        {
          title: 'Apply the day you sign your lease',
          description: 'APL is calculated from the month of your application — not when it is approved or when you move in. Apply on the same day you sign your rental agreement.',
          tip: 'CAF processing takes 4–6 months. You will receive back-payments retroactively from your application date, but you need to manage your budget without it during that period.',
        },
        {
          title: 'Check your eligibility first',
          description: 'Use the CAF online simulator (link above) before applying. You are likely eligible if: you rent a qualifying property, your income is below the threshold, and you are registered with a French university. Students with scholarships, part-time income, or no income can all qualify.',
          tip: 'Even if you are unsure about eligibility, apply anyway. The simulator sometimes underestimates aid amounts.',
        },
        {
          title: 'Create your CAF account',
          description: 'Go to caf.fr and register with your personal details (name, date of birth, address, nationality). You will need a French email address and your French home address.',
        },
        {
          title: 'Submit the DALF form',
          description: 'Fill in the Demande d\'Aide au Logement (DALF) online. Required documents: signed lease (bail de location), bank account details (RIB), landlord details including SIRET number (if landlord is a company), and your income details (€0 for most students).',
          tip: "If your landlord is a private individual (not a company), select 'particulier' as landlord type — they do not need a SIRET. Many private landlords rent without a SIRET and this is fine for CAF.",
        },
        {
          title: 'Wait and track your file',
          description: 'CAF will contact your landlord to verify the rental details. Track your file status in your CAF online account. First payments are typically received 4–6 months after application, then monthly thereafter.',
        },
      ]),
      tips: 'Apply the day you sign your lease. This cannot be stressed enough. Every month you delay is a month\'s worth of aid you will not receive retroactively.\n\nHave a scan of your signed lease, your RIB (bank account details slip), your landlord\'s details, and a passport/ID ready before starting the online form. The session can time out and does not always save progress.\n\nJoin Facebook groups like "Expatriés en France" or "Étudiants internationaux en France" for real-time advice on common CAF error messages and rejections.\n\nAPL is paid at the end of the month following the month it covers. Your first payment will cover multiple months retroactively.',
    },
  })

  const guideTitreSejour = await prisma.guide.create({
    data: {
      slug: 'titre-de-sejour-student',
      checklistCategory: 'admin',
      title: 'Apply for Titre de Séjour (Non-EU Students)',
      summary: 'Non-EU students must either validate their VLS-TS visa online or apply for a residence permit. The process has moved primarily online via the ANEF portal. Missing deadlines can result in loss of legal status.',
      officialLinks: JSON.stringify([
        { label: 'ANEF — online residence permit portal', url: 'https://administration-etrangers-en-france.interieur.gouv.fr' },
        { label: 'Service-Public — titre de séjour étudiant', url: 'https://www.service-public.fr/particuliers/vosdroits/F2209' },
        { label: 'Campus France — student immigration', url: 'https://www.campusfrance.org/fr/venir-etudier-en-france/preparer-votre-sejour/les-visas-pour-etudier-en-france' },
        { label: 'Service-Public — VLS-TS validation', url: 'https://www.service-public.fr/particuliers/vosdroits/F16003' },
      ]),
      steps: JSON.stringify([
        {
          title: 'Validate your VLS-TS visa within 3 months of arrival',
          description: 'If you arrived on a VLS-TS (Long Stay Visa valid as Residence Permit), you must validate it online at ANEF within 3 months of your arrival date. This is free and takes about 15 minutes. Failure to validate invalidates your visa.',
          tip: 'Do not confuse validation with a new application. Validation confirms your existing visa. You will receive a certificat de validation which serves as your residence permit for the full visa period.',
        },
        {
          title: 'Apply for renewal 2–3 months before expiry',
          description: 'If your studies continue beyond your visa or permit period, begin the renewal process at ANEF 2–3 months before your current document expires. Some préfectures still require in-person appointments — check your local préfecture\'s website.',
          tip: 'Start early. Appointments at physical préfectures can be booked 6–8 weeks in advance and slots fill quickly at the start of the academic year.',
        },
        {
          title: 'Prepare your documents',
          description: 'Standard requirements: valid passport + most recent visa/permit, current university enrollment certificate (certificat de scolarité), proof of accommodation (lease or attestation d\'hébergement), proof of financial resources (bank statements or scholarship letter, typically €615/month), 2 passport photos, and proof of health insurance (CPAM number or student mutuelle policy).',
          tip: 'Your university\'s international student services office (service des relations internationales) has handled hundreds of these applications. Visit them before starting — they know your préfecture\'s specific requirements.',
        },
        {
          title: 'Submit via ANEF or in person',
          description: 'Most renewals are processed via ANEF online. Upload all documents as PDF or JPEG. After submission, you receive a récépissé (receipt) by email, which serves as a legal temporary residence document while your application is processed.',
          tip: 'Have all documents as PDF scans prepared before starting the ANEF session. The portal has a session timeout and does not always save progress between sessions.',
        },
        {
          title: 'Track and collect your permit',
          description: 'Processing takes 2–6 months depending on the préfecture. Track status via your ANEF account. You will be contacted when your card is ready for collection, usually at a préfecture counter. Bring your récépissé and passport to collect it.',
        },
      ]),
      tips: 'The ANEF portal is now the primary route for most non-EU students at major préfectures. It is awkward but functional. Prepare all your PDFs before you open the form — the session can time out.\n\nThe récépissé you receive after submitting is a valid legal residence document. Keep a printed copy with you at all times.\n\nFrench passport photo requirements are strict (35×45 mm, white background, neutral expression, no glasses). Use a Photo Haton machine or pharmacie photo booth — many supermarkets have them. Do not use photos from another country.\n\nIf you receive a refusal, you have the right to appeal (recours). Your university\'s international office or a student legal aid service (APATEC, GISTI) can help.',
    },
  })

  const guideNavigo = await prisma.guide.create({
    data: {
      slug: 'navigo-card',
      checklistCategory: 'admin',
      title: 'Set Up a Navigo Transport Card',
      summary: 'The Navigo card gives you unlimited travel across all Île-de-France public transport (metro, RER, bus, tram). Students under 26 can get the Imagine R annual pass at roughly one-third the regular monthly price.',
      officialLinks: JSON.stringify([
        { label: 'Île-de-France Mobilités — all passes', url: 'https://www.iledefrance-mobilites.fr/titres-et-tarifs' },
        { label: 'Imagine R — annual youth pass', url: 'https://www.iledefrance-mobilites.fr/titres-et-tarifs/detail/imagine-r' },
        { label: 'Navigo Mois — monthly pass', url: 'https://www.iledefrance-mobilites.fr/titres-et-tarifs/detail/navigo-mois' },
        { label: 'Navigo Easy — pay-per-use card', url: 'https://www.iledefrance-mobilites.fr/titres-et-tarifs/detail/navigo-easy' },
        { label: 'RATP — buy and reload online', url: 'https://www.ratp.fr' },
      ]),
      steps: JSON.stringify([
        {
          title: 'Choose the right pass for you',
          description: 'Imagine R (annual, under 26): ~€350/year (~€29/month) — best value for full academic year. Navigo Mois (monthly, all ages): ~€86.40/month — flexible but expensive. Navigo Easy (pay-per-use): €2 card + load tickets as needed — good for occasional travel.',
          tip: "Imagine R is the clear winner if you are under 26 and staying for a full year. At €29/month vs €86/month, you save over €685 per year. Don't pay monthly if you qualify for Imagine R.",
        },
        {
          title: 'Apply for Imagine R (if under 26)',
          description: 'Applications open in September for the new academic year. Apply at a major RATP station (Châtelet-Les Halles, Gare du Nord, etc.) or online. You need: a student enrollment certificate, proof of age, a passport photo, and a French bank account for direct debit.',
          tip: 'If you arrive after September, you can still get Imagine R mid-year — you just pay for the remaining months. The annual cycle runs September to August.',
        },
        {
          title: 'Get a monthly Navigo pass',
          description: 'Visit any staffed RATP ticket office or use a station machine with staff assistance. You need a passport photo and an ID. The Navigo card itself costs €5 (refundable) and is rechargeable.',
        },
        {
          title: 'Set up automatic monthly reload',
          description: 'On the RATP website or app, register your Navigo card number and set up a direct debit. Your card is automatically reloaded around the 20th of each month for the following month.',
        },
        {
          title: 'Buy Navigo Easy for casual use',
          description: 'If you travel infrequently, Navigo Easy (€2 contactless card, no photo needed) lets you pay per trip or buy a carnet (10-trip pack). Available from all station machines.',
        },
      ]),
      tips: 'Imagine R at ~€29/month vs €86/month for a regular pass — the math is obvious. If you are under 26 and in Paris for a year, get Imagine R.\n\nThe monthly Navigo Mois pass covers all zones 1–5, meaning you can take the train to Versailles, both CDG and Orly airports, and Disneyland Paris — all included with no extra charge.\n\nFor Imagine R and named monthly passes, you need a 3.5×4.5 cm passport photo. Photo booths at major RATP stations dispense the right format — look for "Photo Haton" machines.\n\nIf your card is lost or stolen, report it immediately via the RATP app or at a station. The balance on personalized cards can be transferred to a replacement card.',
    },
  })

  console.log('✓ Created 5 guides')

  // ── Guide comments ───────────────────────────────────────
  const pastDate = (daysAgo: number) => {
    const d = new Date()
    d.setDate(d.getDate() - daysAgo)
    return d
  }

  await prisma.guideComment.createMany({
    data: [
      // SIM card
      {
        guideId: guideSimCard.id,
        authorId: ambassador.id,
        content: "The Free Mobile €2 plan was a game-changer for me. I used it for the first 6 months while I sorted out my main bank account, then it became my secondary SIM. The Lycamobile airport SIM tip is spot on — I bought one at CDG and it kept me connected for the whole first week.",
        helpful: 14,
        createdAt: pastDate(45),
      },
      {
        guideId: guideSimCard.id,
        authorId: newcomer.id,
        content: "Just arrived last month and bought a Lebara SIM at the Relay in Gare du Nord. Activated in 10 minutes. Good tip about needing a French number for CPAM registration — I almost got stuck without it.",
        helpful: 7,
        createdAt: pastDate(12),
      },
      // Bank account
      {
        guideId: guideBankAccount.id,
        authorId: ambassador.id,
        content: "Start with Wise — this advice saved me so much stress. I had a French IBAN the same day I arrived. La Banque Postale took 3 weeks but was essential for my CAF application once the online form insisted on a French bank. The droit au compte law is real — I know someone who was rejected by three banks and LBP opened their account without any issue.",
        helpful: 21,
        createdAt: pastDate(60),
      },
      {
        guideId: guideBankAccount.id,
        authorId: newcomer.id,
        content: "Wise worked for my CAF application — I was worried about this but it was fine. My French IBAN starts with FR76 which seems to be the key. The regular La Banque Postale application took 4 weeks but I could use Wise in the meantime for everything.",
        helpful: 9,
        createdAt: pastDate(8),
      },
      // CAF
      {
        guideId: guideCaf.id,
        authorId: ambassador.id,
        content: "The most important advice here: apply the same day you sign your lease. I applied 3 weeks late and lost €150 I will never get back. Also, the CAF form doesn't save properly between sessions — screenshot everything before you submit.",
        helpful: 28,
        createdAt: pastDate(90),
      },
      {
        guideId: guideCaf.id,
        authorId: newcomer.id,
        content: "Applied the day I signed my lease following this guide. Currently 2 months in, no payment yet but the status shows 'en cours de traitement' which apparently is normal. The Facebook group for international students in France has been really helpful for interpreting the status messages.",
        helpful: 11,
        createdAt: pastDate(20),
      },
      // Titre de séjour
      {
        guideId: guideTitreSejour.id,
        authorId: ambassador.id,
        content: "The ANEF portal has improved a lot compared to 2 years ago when I had to go in person to the préfecture. My renewal last year was fully online. Key tip: download and save your récépissé immediately — it's a real legal document and you'll need it if you travel internationally before your card arrives.",
        helpful: 19,
        createdAt: pastDate(55),
      },
      {
        guideId: guideTitreSejour.id,
        authorId: newcomer.id,
        content: "Validated my VLS-TS visa at ANEF within a week of arriving. The process took about 20 minutes online. I was nervous but it's genuinely straightforward — just have your passport and arrival date ready. The confirmation email arrived within 24 hours.",
        helpful: 13,
        createdAt: pastDate(15),
      },
      // Navigo
      {
        guideId: guideNavigo.id,
        authorId: ambassador.id,
        content: "I was on a monthly Navigo for 6 months before someone told me about Imagine R. I could have saved over €340. If you are under 26 and staying more than 3 months, Imagine R is not optional — it's a necessity. Applications can also be submitted at the RATP counters at Châtelet-Les Halles, which is open long hours.",
        helpful: 16,
        createdAt: pastDate(70),
      },
      {
        guideId: guideNavigo.id,
        authorId: newcomer.id,
        content: "Got my Navigo Easy first week while sorting out the Imagine R application. The machines at Gare du Nord are straightforward. One tip: if you want to load t+ tickets (for zones outside monthly pass coverage), the machine UI is in French only — Google Translate camera mode works great for this.",
        helpful: 8,
        createdAt: pastDate(10),
      },
    ],
  })

  console.log('✓ Created guide comments')

  // ── Checklist for demo users ─────────────────────────────
  const GENERIC_ITEMS = [
    { category: 'admin', title: 'Register at your local Mairie', description: 'Register your address at the town hall (declaration de domicile)', order: 1, guideSlug: null },
    { category: 'admin', title: 'Open a French bank account', description: 'Required for most services. Try La Banque Postale or a neobank like Wise.', order: 2, guideSlug: 'open-bank-account' },
    { category: 'health', title: 'Register with CPAM (Assurance Maladie)', description: 'Apply for French health insurance at ameli.fr', order: 3, guideSlug: null },
    { category: 'admin', title: 'Apply for CAF housing aid', description: 'Housing assistance (APL) from the French state at caf.fr', order: 4, guideSlug: 'caf-housing-aid' },
    { category: 'admin', title: 'Get a French SIM card', description: 'A local number is needed for most registrations and verifications', order: 5, guideSlug: 'french-sim-card' },
    { category: 'health', title: 'Obtain your Carte Vitale', description: 'Your health insurance card — apply once CPAM registration is confirmed', order: 6, guideSlug: null },
    { category: 'health', title: 'Register with a médecin traitant', description: 'Choose a primary care physician (required for full reimbursement)', order: 7, guideSlug: null },
    { category: 'admin', title: 'Set up a Navigo transport card', description: 'Monthly metro/bus pass for Île-de-France. Available at any station.', order: 8, guideSlug: 'navigo-card' },
    { category: 'admin', title: 'Apply for titre de séjour (non-EU)', description: 'Submit residence permit application online', order: 9, guideSlug: 'titre-de-sejour-student' },
    { category: 'admin', title: 'Set up EDF or Engie (utilities)', description: 'Register electricity and gas in your name if renting', order: 10, guideSlug: null },
    { category: 'community', title: 'Explore your neighborhood', description: 'Find the nearest bakery, pharmacy, and supermarket', order: 11, guideSlug: null },
    { category: 'food', title: 'Visit a local market', description: 'Fresh produce, local culture, and affordable groceries', order: 12, guideSlug: null },
    { category: 'community', title: 'Join a local international group', description: 'Meetup.com or Facebook groups for expats in your city', order: 13, guideSlug: null },
    { category: 'culture', title: 'Get a library card (médiathèque)', description: 'Free access to books, films, and often free events', order: 14, guideSlug: null },
    { category: 'community', title: 'Attend a Tsunagari welcome event', description: 'Meet fellow newcomers and local ambassadors', order: 15, guideSlug: null },
  ]

  const JAPANESE_ITEMS = [
    { category: 'admin', title: 'Register at Japanese Consulate', description: 'Notify the consulate of your residence in France (zaigai todoke)', order: 16, guideSlug: null },
    { category: 'community', title: 'Connect with the Japan Cultural Institute (ICJ)', description: 'Institut franco-japonais — events, language, community', order: 17, guideSlug: null },
    { category: 'admin', title: 'Transfer or renew your Japanese driving license', description: 'Exchange for a French license at the Préfecture', order: 18, guideSlug: null },
    { category: 'food', title: 'Find Japanese grocery stores', description: 'Kioko, Ace Mart in Paris / Épicerie du Monde in Lyon', order: 19, guideSlug: null },
    { category: 'community', title: 'Join a local Japanese community group', description: 'Association Franco-Japonaise or local Facebook groups', order: 20, guideSlug: null },
  ]

  const BRAZILIAN_ITEMS = [
    { category: 'admin', title: 'Register at Brazilian Consulate', description: 'Notify your consulate of your residence abroad', order: 16, guideSlug: null },
    { category: 'community', title: 'Find the Brazilian community in Paris', description: 'Facebook groups: Brasileiros em Paris', order: 17, guideSlug: null },
    { category: 'admin', title: 'Legalize your Brazilian documents', description: 'Get a Hague Apostille for diplomas and vital records', order: 18, guideSlug: null },
    { category: 'food', title: 'Find Brazilian grocery stores', description: 'Toko Brasil, O Mercadão — Brazilian products in France', order: 19, guideSlug: null },
    { category: 'culture', title: 'Find Portuguese language resources', description: 'FLUPA association for Lusophone community in France', order: 20, guideSlug: null },
  ]

  await prisma.checklistItem.createMany({
    data: [
      ...GENERIC_ITEMS.map((item) => ({ ...item, userId: newcomer.id, completed: false })),
      ...JAPANESE_ITEMS.map((item) => ({ ...item, userId: newcomer.id, completed: false })),
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
