import { prisma } from './prisma'

interface ChecklistTemplate {
  category: string
  title: string
  description: string
  order: number
  guideSlug?: string
}

const GENERIC_ITEMS: ChecklistTemplate[] = [
  { category: 'admin', title: 'Register at your local Mairie', description: 'Register your address at the town hall (declaration de domicile)', order: 1 },
  { category: 'admin', title: 'Open a French bank account', description: 'Required for most services. Try La Banque Postale or a neobank like Wise.', order: 2, guideSlug: 'open-bank-account' },
  { category: 'health', title: 'Register with CPAM (Assurance Maladie)', description: 'Apply for French health insurance at ameli.fr', order: 3, guideSlug: 'register-cpam' },
  { category: 'admin', title: 'Apply for CAF housing aid', description: 'Housing assistance (APL) from the French state at caf.fr', order: 4, guideSlug: 'caf-housing-aid' },
  { category: 'admin', title: 'Get a French SIM card', description: 'A local number is needed for most registrations and verifications', order: 5, guideSlug: 'french-sim-card' },
  { category: 'health', title: 'Obtain your Carte Vitale', description: 'Your health insurance card — apply once CPAM registration is confirmed', order: 6, guideSlug: 'register-cpam' },
  { category: 'health', title: 'Register with a médecin traitant', description: 'Choose a primary care physician (required for full reimbursement)', order: 7, guideSlug: 'find-doctor' },
  { category: 'admin', title: 'Set up a Navigo transport card', description: 'Monthly metro/bus pass for Île-de-France. Available at any station.', order: 8, guideSlug: 'navigo-card' },
  { category: 'admin', title: 'Apply for titre de séjour (non-EU)', description: 'Submit residence permit application online at administration-etrangers-en-france.interieur.gouv.fr', order: 9, guideSlug: 'titre-de-sejour-student' },
  { category: 'admin', title: 'Set up EDF or Engie (utilities)', description: 'Register electricity and gas in your name if renting', order: 10 },
  { category: 'community', title: 'Explore your neighborhood', description: 'Find the nearest bakery, pharmacy, and supermarket', order: 11 },
  { category: 'food', title: 'Visit a local market', description: 'Fresh produce, local culture, and affordable groceries', order: 12 },
  { category: 'community', title: 'Join a local international group', description: 'Meetup.com or Facebook groups for expats in your city', order: 13 },
  { category: 'culture', title: 'Get a library card (médiathèque)', description: 'Free access to books, films, and often free events', order: 14 },
  { category: 'community', title: 'Attend a Mycelia welcome event', description: 'Meet fellow newcomers and local ambassadors', order: 15 },
  { category: 'health', title: 'Get a complementary health insurance (mutuelle)', description: 'CPAM covers ~70% — a mutuelle covers the rest. Student plans from €10/month.', order: 21, guideSlug: 'mutuelle-health-insurance' },
  { category: 'health', title: 'Learn how pharmacies and prescriptions work', description: 'Find your neighborhood pharmacy and the pharmacie de garde for nights and Sundays', order: 22, guideSlug: 'pharmacy-prescriptions' },
  { category: 'health', title: 'Know your mental health resources', description: '12 free psychologist sessions per year, free university services, and peer listening', order: 23, guideSlug: 'mental-health-support' },
]

const NATIONALITY_ITEMS: Record<string, ChecklistTemplate[]> = {
  Japanese: [
    { category: 'admin', title: 'Register at Japanese Consulate', description: 'Notify the consulate of your residence in France (zaigai todoke)', order: 16 },
    { category: 'community', title: 'Connect with the Japan Cultural Institute (ICJ)', description: 'Institut franco-japonais — events, language, community', order: 17 },
    { category: 'admin', title: 'Transfer or renew your Japanese driving license', description: 'Exchange for a French license at the Préfecture', order: 18 },
    { category: 'culture', title: 'Find Japanese grocery stores', description: 'Kioko, Ace Mart in Paris / Épicerie du Monde in Lyon', order: 19 },
    { category: 'community', title: 'Join a local Japanese community group', description: 'Association Franco-Japonaise or local Facebook groups', order: 20 },
  ],
  Brazilian: [
    { category: 'admin', title: 'Register at Brazilian Consulate', description: 'Notify your consulate of your residence abroad', order: 16 },
    { category: 'community', title: 'Find the Brazilian community in your city', description: 'Facebook groups: Brasileiros em Paris / Brasileiros em Lyon', order: 17 },
    { category: 'admin', title: 'Legalize your Brazilian documents', description: 'Get a Hague Apostille for diplomas and vital records', order: 18 },
    { category: 'food', title: 'Find Brazilian grocery stores', description: 'Toko Brasil, O Mercadão — Brazilian products in France', order: 19 },
    { category: 'culture', title: 'Find Portuguese language resources', description: 'FLUPA association for Lusophone community in France', order: 20 },
  ],
  Chinese: [
    { category: 'admin', title: 'Register at Chinese Consulate', description: 'Notify the consulate of your new address in France', order: 16 },
    { category: 'community', title: 'Find the Chinese community association', description: 'Association des Résidents Chinois en France (ARCF)', order: 17 },
    { category: 'food', title: 'Find Chinese grocery stores', description: 'Tang Frères and Paris Store are in most major French cities', order: 18 },
    { category: 'admin', title: 'Handle your Chinese bank account', description: 'Enable international transfers before traveling', order: 19 },
    { category: 'culture', title: 'Locate the closest Confucius Institute', description: 'Language and cultural resources for Chinese expats', order: 20 },
  ],
}

const DEFAULT_NATIONALITY_ITEMS: ChecklistTemplate[] = [
  { category: 'admin', title: "Register at your country's consulate", description: 'Notify your home country of your residence in France', order: 16 },
  { category: 'community', title: 'Find your national community association', description: 'Search on Facebook Groups or Meetup for your nationality in your city', order: 17 },
  { category: 'admin', title: 'Legalize important documents', description: 'Get official translations and apostilles for diplomas and records', order: 18 },
  { category: 'food', title: 'Find familiar grocery stores', description: 'Asian, African, or international grocery stores in your city', order: 19 },
  { category: 'community', title: 'Meet a local ambassador from your country', description: 'Request a buddy who shares your background', order: 20 },
]

export async function generateChecklist(
  userId: string,
  nationality: string | null,
  _city: string | null
): Promise<void> {
  const existing = await prisma.checklistItem.count({ where: { userId } })
  if (existing > 0) return

  const nationalityItems =
    (nationality && NATIONALITY_ITEMS[nationality]) || DEFAULT_NATIONALITY_ITEMS

  const items = [...GENERIC_ITEMS, ...nationalityItems]

  await prisma.checklistItem.createMany({
    data: items.map((item) => ({
      userId,
      category: item.category,
      title: item.title,
      description: item.description,
      order: item.order,
      guideSlug: item.guideSlug ?? null,
      completed: false,
    })),
  })
}
