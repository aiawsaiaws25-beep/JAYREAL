/**
 * Shared seed dataset.
 *
 * Used by `scripts/seed.ts` to populate Neon, and by `src/lib/queries.ts`
 * as an in-memory fallback when DATABASE_URL is not configured (local design review).
 * All developers, projects and people are fictional.
 */
import type { LeadSource, LeadStage, ListingType, ProjectStatus, PropertyStatus, PropertyType } from "./schema";

const u = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  skyline: u("photo-1512453979798-5ea266f8880c", 2400),
  marina: u("photo-1546412414-e1885259563a"),
  downtown: u("photo-1518684079-3c830dcef090"),
  palm: u("photo-1526495124232-a04e1849168c"),
  creek: u("photo-1479839672679-a46d2ce2e5e7"),
  tower1: u("photo-1567496898669-ee935f5f647a"),
  tower2: u("photo-1449844908441-8829872d2607"),
  villa1: u("photo-1613490493576-7fde63acd811"),
  villa2: u("photo-1600585154340-be6161a56a0c"),
  villa3: u("photo-1600596542815-ffad4c1539a9"),
  villa4: u("photo-1580587771525-78b9dba3b914"),
  villa5: u("photo-1512917774080-9991f1c4c750"),
  villa6: u("photo-1564013799919-ab600027ffc6"),
  house1: u("photo-1600607687920-4e2a09cf159d"),
  house2: u("photo-1600047509807-ba8f99d2cdde"),
  house3: u("photo-1523217582562-09d0def993a6"),
  apt1: u("photo-1502672260266-1c1ef2d93688"),
  apt2: u("photo-1522708323590-d24dbb6b0267"),
  apt3: u("photo-1560448204-e02f11c3d0e2"),
  living1: u("photo-1600566753086-00f18fb6b3ea"),
  living2: u("photo-1493809842364-78817add7ffb"),
  living3: u("photo-1600573472550-8090b5e0745e"),
  kitchen1: u("photo-1600210492486-724fe5c67fb0"),
  kitchen2: u("photo-1583608205776-bfd35f0d3f0e"),
  bath1: u("photo-1600585154526-990dced4db0d"),
  interior1: u("photo-1600607687939-ce8a6c25118c"),
};

/** Generic interior shots reused for property galleries until per-listing galleries exist. */
export const GALLERY_FALLBACK = [IMAGES.living1, IMAGES.kitchen1, IMAGES.living3, IMAGES.bath1, IMAGES.interior1];

export const COMMUNITIES = [
  { name: "Dubai Marina", slug: "dubai-marina", image: IMAGES.marina, blurb: "Waterfront towers and a yacht-lined promenade." },
  { name: "Downtown Dubai", slug: "downtown-dubai", image: IMAGES.downtown, blurb: "The city's cultural and commercial heart." },
  { name: "Palm Jumeirah", slug: "palm-jumeirah", image: IMAGES.palm, blurb: "Beachfront villas and private island living." },
  { name: "Business Bay", slug: "business-bay", image: IMAGES.creek, blurb: "Canal-side residences minutes from Downtown." },
  { name: "Dubai Hills Estate", slug: "dubai-hills-estate", image: IMAGES.villa2, blurb: "Golf-course villas in a green master community." },
  { name: "Jumeirah Village Circle", slug: "jvc", image: IMAGES.tower2, blurb: "Well-connected homes with strong rental yields." },
];

/* ------------------------------- Developers ------------------------------- */

export const seedDevelopers = [
  { id: 1, name: "Meridian Living", logoUrl: null },
  { id: 2, name: "Aurum Developments", logoUrl: null },
  { id: 3, name: "Sable & Stone", logoUrl: null },
  { id: 4, name: "Horizon Estates", logoUrl: null },
  { id: 5, name: "Casa Nova Group", logoUrl: null },
];

/* -------------------------------- Projects -------------------------------- */

export const seedProjects: Array<{
  id: number;
  name: string;
  slug: string;
  developerId: number;
  community: string;
  handoverDate: Date;
  status: ProjectStatus;
  paymentPlan: string;
  description: string;
  imageUrl: string;
}> = [
  {
    id: 1,
    name: "Marina Horizon Residences",
    slug: "marina-horizon-residences",
    developerId: 1,
    community: "Dubai Marina",
    handoverDate: new Date("2028-03-31"),
    status: "off-plan",
    paymentPlan: "60/40",
    description:
      "A slender waterfront tower of one to four bedroom residences with floor-to-ceiling glazing, private terraces and an infinity pool over the marina. Interiors are finished in pale stone and oak, with a residents' lounge, spa and 24-hour concierge.",
    imageUrl: IMAGES.tower1,
  },
  {
    id: 2,
    name: "Creek Sky Tower",
    slug: "creek-sky-tower",
    developerId: 2,
    community: "Business Bay",
    handoverDate: new Date("2027-12-31"),
    status: "under-construction",
    paymentPlan: "70/30",
    description:
      "Canal-facing apartments across 42 floors, a short walk from Downtown. Every residence opens onto a balcony with views to the Burj skyline, and the podium holds a lap pool, gym and shaded gardens.",
    imageUrl: IMAGES.creek,
  },
  {
    id: 3,
    name: "The Palm Villas",
    slug: "the-palm-villas",
    developerId: 3,
    community: "Palm Jumeirah",
    handoverDate: new Date("2027-06-30"),
    status: "under-construction",
    paymentPlan: "50/50",
    description:
      "A limited collection of beachfront villas with private pools, direct sand access and double-height living spaces. Each home is designed around a shaded courtyard and finished in travertine and warm timber.",
    imageUrl: IMAGES.villa1,
  },
  {
    id: 4,
    name: "Hills Park Collection",
    slug: "hills-park-collection",
    developerId: 4,
    community: "Dubai Hills Estate",
    handoverDate: new Date("2028-09-30"),
    status: "off-plan",
    paymentPlan: "80/20",
    description:
      "Three to five bedroom townhouses and villas set along the fairways of Dubai Hills. Generous gardens, rooftop terraces and a private clubhouse for residents.",
    imageUrl: IMAGES.villa3,
  },
  {
    id: 5,
    name: "Downtown Atelier",
    slug: "downtown-atelier",
    developerId: 5,
    community: "Downtown Dubai",
    handoverDate: new Date("2029-01-31"),
    status: "off-plan",
    paymentPlan: "60/40",
    description:
      "Boutique residences and penthouses moments from the Opera District. A quiet address with a rooftop pool, private cinema and hotel-style services.",
    imageUrl: IMAGES.downtown,
  },
  {
    id: 6,
    name: "Circle Gardens",
    slug: "circle-gardens",
    developerId: 1,
    community: "Jumeirah Village Circle",
    handoverDate: new Date("2027-09-30"),
    status: "under-construction",
    paymentPlan: "1% monthly",
    description:
      "Studios to two bedroom apartments arranged around landscaped courtyards, designed for strong rental yields and easy ownership. Retail, a gym and a community pool on the ground floor.",
    imageUrl: IMAGES.tower2,
  },
];

/* ------------------------------- Properties ------------------------------- */

type SeedProperty = {
  id: number;
  title: string;
  slug: string;
  listingType: ListingType;
  projectId: number | null;
  type: PropertyType;
  priceAed: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  community: string;
  imageUrl: string;
  featured: boolean;
  status: PropertyStatus;
};

export const seedProperties: SeedProperty[] = [
  // Ready listings (15)
  { id: 1, title: "Marina Gate Two Bedroom with Sea View", slug: "marina-gate-2br-sea-view", listingType: "ready", projectId: null, type: "apartment", priceAed: 3_250_000, bedrooms: 2, bathrooms: 3, areaSqft: 1_480, community: "Dubai Marina", imageUrl: IMAGES.apt1, featured: true, status: "available" },
  { id: 2, title: "Marina Promenade Penthouse", slug: "marina-promenade-penthouse", listingType: "ready", projectId: null, type: "penthouse", priceAed: 14_800_000, bedrooms: 4, bathrooms: 5, areaSqft: 5_200, community: "Dubai Marina", imageUrl: IMAGES.apt3, featured: false, status: "available" },
  { id: 3, title: "Burj View One Bedroom, Opera District", slug: "burj-view-1br-opera-district", listingType: "ready", projectId: null, type: "apartment", priceAed: 2_450_000, bedrooms: 1, bathrooms: 2, areaSqft: 890, community: "Downtown Dubai", imageUrl: IMAGES.apt2, featured: true, status: "available" },
  { id: 4, title: "Boulevard Three Bedroom, Full Fountain View", slug: "boulevard-3br-fountain-view", listingType: "ready", projectId: null, type: "apartment", priceAed: 7_900_000, bedrooms: 3, bathrooms: 4, areaSqft: 2_310, community: "Downtown Dubai", imageUrl: IMAGES.living2, featured: false, status: "reserved" },
  { id: 5, title: "Downtown Sky Penthouse", slug: "downtown-sky-penthouse", listingType: "ready", projectId: null, type: "penthouse", priceAed: 28_500_000, bedrooms: 5, bathrooms: 6, areaSqft: 7_400, community: "Downtown Dubai", imageUrl: IMAGES.living3, featured: true, status: "available" },
  { id: 6, title: "Garden Home Villa, Frond K", slug: "garden-home-villa-frond-k", listingType: "ready", projectId: null, type: "villa", priceAed: 18_500_000, bedrooms: 4, bathrooms: 5, areaSqft: 5_000, community: "Palm Jumeirah", imageUrl: IMAGES.villa1, featured: true, status: "available" },
  { id: 7, title: "Signature Villa with Private Beach", slug: "signature-villa-private-beach", listingType: "ready", projectId: null, type: "villa", priceAed: 42_000_000, bedrooms: 6, bathrooms: 7, areaSqft: 8_600, community: "Palm Jumeirah", imageUrl: IMAGES.villa5, featured: false, status: "available" },
  { id: 8, title: "Shoreline Two Bedroom, Beach Access", slug: "shoreline-2br-beach-access", listingType: "ready", projectId: null, type: "apartment", priceAed: 3_900_000, bedrooms: 2, bathrooms: 3, areaSqft: 1_650, community: "Palm Jumeirah", imageUrl: IMAGES.living1, featured: false, status: "available" },
  { id: 9, title: "Canal Front Two Bedroom", slug: "canal-front-2br", listingType: "ready", projectId: null, type: "apartment", priceAed: 2_650_000, bedrooms: 2, bathrooms: 2, areaSqft: 1_320, community: "Business Bay", imageUrl: IMAGES.apt3, featured: false, status: "available" },
  { id: 10, title: "Bay Square Studio, High Floor", slug: "bay-square-studio-high-floor", listingType: "ready", projectId: null, type: "apartment", priceAed: 1_150_000, bedrooms: 0, bathrooms: 1, areaSqft: 520, community: "Business Bay", imageUrl: IMAGES.interior1, featured: false, status: "sold" },
  { id: 11, title: "Golf Place Five Bedroom Villa", slug: "golf-place-5br-villa", listingType: "ready", projectId: null, type: "villa", priceAed: 21_000_000, bedrooms: 5, bathrooms: 6, areaSqft: 7_100, community: "Dubai Hills Estate", imageUrl: IMAGES.villa2, featured: true, status: "available" },
  { id: 12, title: "Maple Four Bedroom Townhouse", slug: "maple-4br-townhouse", listingType: "ready", projectId: null, type: "townhouse", priceAed: 5_400_000, bedrooms: 4, bathrooms: 4, areaSqft: 2_900, community: "Dubai Hills Estate", imageUrl: IMAGES.house1, featured: false, status: "available" },
  { id: 13, title: "Park Ridge Three Bedroom", slug: "park-ridge-3br", listingType: "ready", projectId: null, type: "apartment", priceAed: 3_750_000, bedrooms: 3, bathrooms: 3, areaSqft: 1_760, community: "Dubai Hills Estate", imageUrl: IMAGES.kitchen2, featured: false, status: "available" },
  { id: 14, title: "JVC One Bedroom with Pool View", slug: "jvc-1br-pool-view", listingType: "ready", projectId: null, type: "apartment", priceAed: 890_000, bedrooms: 1, bathrooms: 1, areaSqft: 760, community: "Jumeirah Village Circle", imageUrl: IMAGES.apt2, featured: false, status: "available" },
  { id: 15, title: "District 12 Four Bedroom Townhouse", slug: "district-12-4br-townhouse", listingType: "ready", projectId: null, type: "townhouse", priceAed: 3_100_000, bedrooms: 4, bathrooms: 4, areaSqft: 2_450, community: "Jumeirah Village Circle", imageUrl: IMAGES.house3, featured: false, status: "available" },
  // Off-plan units linked to projects
  { id: 16, title: "Marina Horizon One Bedroom", slug: "marina-horizon-1br", listingType: "off-plan", projectId: 1, type: "apartment", priceAed: 2_450_000, bedrooms: 1, bathrooms: 2, areaSqft: 820, community: "Dubai Marina", imageUrl: IMAGES.tower1, featured: false, status: "available" },
  { id: 17, title: "Marina Horizon Three Bedroom Sky Villa", slug: "marina-horizon-3br-sky-villa", listingType: "off-plan", projectId: 1, type: "apartment", priceAed: 6_900_000, bedrooms: 3, bathrooms: 4, areaSqft: 2_400, community: "Dubai Marina", imageUrl: IMAGES.living3, featured: false, status: "available" },
  { id: 18, title: "Creek Sky One Bedroom", slug: "creek-sky-1br", listingType: "off-plan", projectId: 2, type: "apartment", priceAed: 1_850_000, bedrooms: 1, bathrooms: 1, areaSqft: 740, community: "Business Bay", imageUrl: IMAGES.creek, featured: false, status: "available" },
  { id: 19, title: "Creek Sky Two Bedroom Corner", slug: "creek-sky-2br-corner", listingType: "off-plan", projectId: 2, type: "apartment", priceAed: 3_200_000, bedrooms: 2, bathrooms: 3, areaSqft: 1_380, community: "Business Bay", imageUrl: IMAGES.apt1, featured: false, status: "reserved" },
  { id: 20, title: "Palm Villa Type A, Beachfront", slug: "palm-villa-type-a-beachfront", listingType: "off-plan", projectId: 3, type: "villa", priceAed: 36_000_000, bedrooms: 5, bathrooms: 6, areaSqft: 8_200, community: "Palm Jumeirah", imageUrl: IMAGES.villa4, featured: false, status: "available" },
  { id: 21, title: "Hills Park Four Bedroom Townhouse", slug: "hills-park-4br-townhouse", listingType: "off-plan", projectId: 4, type: "townhouse", priceAed: 4_900_000, bedrooms: 4, bathrooms: 4, areaSqft: 3_050, community: "Dubai Hills Estate", imageUrl: IMAGES.villa3, featured: false, status: "available" },
  { id: 22, title: "Hills Park Five Bedroom Villa", slug: "hills-park-5br-villa", listingType: "off-plan", projectId: 4, type: "villa", priceAed: 12_500_000, bedrooms: 5, bathrooms: 6, areaSqft: 5_800, community: "Dubai Hills Estate", imageUrl: IMAGES.villa6, featured: false, status: "available" },
  { id: 23, title: "Atelier Two Bedroom Residence", slug: "atelier-2br-residence", listingType: "off-plan", projectId: 5, type: "apartment", priceAed: 5_600_000, bedrooms: 2, bathrooms: 3, areaSqft: 1_620, community: "Downtown Dubai", imageUrl: IMAGES.downtown, featured: false, status: "available" },
  { id: 24, title: "Atelier Sky Penthouse", slug: "atelier-sky-penthouse", listingType: "off-plan", projectId: 5, type: "penthouse", priceAed: 24_000_000, bedrooms: 4, bathrooms: 5, areaSqft: 6_100, community: "Downtown Dubai", imageUrl: IMAGES.living2, featured: false, status: "available" },
  { id: 25, title: "Circle Gardens Studio", slug: "circle-gardens-studio", listingType: "off-plan", projectId: 6, type: "apartment", priceAed: 620_000, bedrooms: 0, bathrooms: 1, areaSqft: 430, community: "Jumeirah Village Circle", imageUrl: IMAGES.tower2, featured: false, status: "available" },
  { id: 26, title: "Circle Gardens Two Bedroom", slug: "circle-gardens-2br", listingType: "off-plan", projectId: 6, type: "apartment", priceAed: 1_350_000, bedrooms: 2, bathrooms: 2, areaSqft: 1_080, community: "Jumeirah Village Circle", imageUrl: IMAGES.kitchen1, featured: false, status: "available" },
];

/* --------------------------------- Users ---------------------------------- */

export const seedUsers = [
  { id: 1, name: "Jay Admin", email: "admin@jayrealestate.example", role: "admin" as const, monthlyTargetAed: 0, password: "Admin123!" },
  { id: 2, name: "Layla Haddad", email: "layla@jayrealestate.example", role: "agent" as const, monthlyTargetAed: 25_000_000, password: "Agent123!" },
  { id: 3, name: "Omar Rashid", email: "omar@jayrealestate.example", role: "agent" as const, monthlyTargetAed: 20_000_000, password: "Agent123!" },
  { id: 4, name: "Sofia Marchetti", email: "sofia@jayrealestate.example", role: "agent" as const, monthlyTargetAed: 30_000_000, password: "Agent123!" },
];

/* --------------------------------- Leads ---------------------------------- */

const FIRST = ["Ahmed", "Fatima", "James", "Priya", "Chen", "Olga", "Mohammed", "Sarah", "Luca", "Aisha", "Daniel", "Noor", "Viktor", "Emily", "Rahul", "Zainab", "Thomas", "Mariam", "Kenji", "Hana"];
const LAST = ["Al Mansoori", "Khan", "Whitaker", "Sharma", "Wei", "Petrova", "Hassan", "Bennett", "Rossi", "Farouk", "Okafor", "Saleh", "Ivanov", "Clarke", "Mehta", "Rahman", "Muller", "Nasser", "Tanaka", "Kim"];
const STAGES: LeadStage[] = ["new", "new", "new", "new", "new", "new", "contacted", "contacted", "contacted", "contacted", "contacted", "qualified", "qualified", "qualified", "qualified", "qualified", "qualified", "viewing", "viewing", "viewing", "viewing", "viewing", "offer", "offer", "offer", "mou_signed", "mou_signed", "mou_signed", "financing", "financing", "transfer", "transfer", "won", "won", "won", "won", "won", "lost", "lost", "lost"];
const SOURCES: LeadSource[] = ["form", "property_page", "project_page", "brochure", "mortgage_calc", "valuation", "callback"];
const TIMELINES = ["immediate", "1-3 months", "3-6 months", "6+ months"] as const;
const MESSAGES = [
  "Looking for a sea-view apartment for my family.",
  "Interested in off-plan with a flexible payment plan.",
  "Please send the brochure and floor plans.",
  "Would like to arrange a viewing this week.",
  "Investor seeking strong rental yield, budget flexible.",
  "Relocating to Dubai in the spring, need a ready home.",
  null,
];

/** Deterministic pseudo-random so seeds are reproducible. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rand = rng(42);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

export const seedLeads = Array.from({ length: 40 }, (_, i) => {
  const stage = STAGES[i];
  const source = SOURCES[i % SOURCES.length];
  const property = rand() > 0.35 ? pick(seedProperties) : null;
  const project = !property && rand() > 0.4 ? pick(seedProjects) : property?.projectId ? seedProjects.find((p) => p.id === property.projectId) ?? null : null;
  const anchor = property?.priceAed ?? (project ? seedProperties.find((p) => p.projectId === project.id)?.priceAed ?? 3_000_000 : 3_000_000);
  const budgetMin = Math.round((anchor * 0.85) / 50_000) * 50_000;
  const budgetMax = Math.round((anchor * 1.15) / 50_000) * 50_000;
  const created = daysAgo(Math.floor(rand() * 120));
  const stageIndex = STAGES.indexOf(stage);
  const score = Math.min(100, 20 + stageIndex * 4 + Math.floor(rand() * 30));
  const first = FIRST[i % FIRST.length];
  const last = LAST[(i * 7 + Math.floor(i / FIRST.length) * 3) % LAST.length]; // unique name per lead
  return {
    id: i + 1,
    fullName: `${first} ${last}`,
    email: `${first}.${last}`.toLowerCase().replace(/\s+/g, "") + `${i}@example.com`,
    phone: `+9715${String(10000000 + Math.floor(rand() * 89999999)).slice(0, 8)}`,
    message: pick(MESSAGES),
    buyerType: (rand() > 0.5 ? "investor" : "end-user") as "investor" | "end-user",
    financeType: pick(["cash", "mortgage", "undecided"] as const),
    budgetMin,
    budgetMax,
    timeline: pick(TIMELINES),
    source,
    propertyId: property?.id ?? null,
    projectId: project?.id ?? null,
    stage,
    score,
    assignedTo: stage === "new" && rand() > 0.5 ? null : 2 + (i % 3),
    expectedValueAed: stage === "lost" ? null : anchor,
    viewedAt: stage === "new" ? null : new Date(created.getTime() + 3_600_000 * (1 + Math.floor(rand() * 48))),
    createdAt: created,
    updatedAt: new Date(created.getTime() + 86_400_000 * Math.floor(rand() * 10)),
  };
});

export const seedLeadNotes = seedLeads
  .filter((l) => l.stage !== "new")
  .slice(0, 25)
  .map((l, i) => ({
    id: i + 1,
    leadId: l.id,
    userId: l.assignedTo ?? 2,
    note: pick([
      "Called and introduced the shortlist. Prefers high floor.",
      "Sent brochure and payment plan. Following up Thursday.",
      "Client comparing with a similar unit nearby. Price sensitive.",
      "Confirmed viewing slot. Will bring spouse.",
      "Mortgage pre-approval in progress with bank.",
      "Negotiating on price, seller open to a small reduction.",
    ]),
    createdAt: new Date(l.createdAt.getTime() + 86_400_000 * 2),
  }));

const viewingLeads = seedLeads.filter((l) => ["viewing", "offer", "mou_signed", "financing", "transfer", "won"].includes(l.stage)).slice(0, 10);

export const seedViewings = viewingLeads.map((l, i) => {
  const property = l.propertyId ? seedProperties.find((p) => p.id === l.propertyId)! : pick(seedProperties.filter((p) => p.listingType === "ready"));
  const status = l.stage === "viewing" ? (i % 3 === 0 ? "scheduled" : "done") : "done";
  return {
    id: i + 1,
    leadId: l.id,
    propertyId: property.id,
    agentId: l.assignedTo ?? 2,
    scheduledAt: status === "scheduled" ? new Date(Date.now() + 86_400_000 * (2 + i)) : new Date(l.createdAt.getTime() + 86_400_000 * 5),
    status: status as "scheduled" | "done",
    feedback: status === "done" ? pick(["Loved the view, wants a second visit.", "Liked the layout, concerned about service charges.", "Very positive, ready to make an offer."]) : null,
  };
});

export const seedDeals = seedLeads
  .filter((l) => l.stage === "won")
  .slice(0, 5)
  .map((l, i) => {
    const property = l.propertyId ? seedProperties.find((p) => p.id === l.propertyId)! : seedProperties[i * 2];
    const salePriceAed = Math.round((property.priceAed * (0.96 + rand() * 0.04)) / 10_000) * 10_000;
    const commissionPercent = 2;
    return {
      id: i + 1,
      leadId: l.id,
      propertyId: property.id,
      agentId: l.assignedTo ?? 2,
      salePriceAed,
      commissionPercent: commissionPercent.toFixed(2),
      commissionAed: Math.round(salePriceAed * (commissionPercent / 100)),
      closedAt: daysAgo(Math.floor(rand() * 60)),
    };
  });
