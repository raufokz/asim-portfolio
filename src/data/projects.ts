export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  thumbnail: string;
  cover: string;
  /** Shown in the case-study sidebar. All current entries are self-initiated. */
  client: string;
  palette: { name: string; hex: string }[];
  fonts: { name: string; role: string }[];
  overview: string;
  brief: string;
  challenge: string;
  approach: string;
  process: string[];
  services: string[];
  /** Optional before/after comparison shown in the case study. */
  beforeAfterId?: string;
  /**
   * Every project in this portfolio is a concept / self-initiated piece.
   * Cards and case-study pages label this honestly. Replace with real
   * client work (and set isConcept: false) when available.
   */
  isConcept: boolean;
};

export const projects: Project[] = [
  {
    slug: "noir",
    title: "NOIR",
    category: "Brand Identity",
    year: "2026",
    description:
      "A monochrome identity for a contemporary fashion label — built on contrast, negative space, and uncompromising typography.",
    thumbnail: "/work/noir-cover.jpg",
    cover: "/work/noir-cover.jpg",
    client: "Self-initiated (Concept)",
    palette: [
      { name: "Ink", hex: "#111111" },
      { name: "Paper", hex: "#F7F5F0" },
      { name: "Signal Lime", hex: "#D7FF64" },
      { name: "Gray", hex: "#8A8A8A" },
    ],
    fonts: [
      { name: "Playfair Display", role: "Display serif — wordmark & headlines" },
      { name: "Inter", role: "Body & UI text" },
    ],
    overview:
      "NOIR is a concept identity for a contemporary fashion label that wanted to feel editorial rather than commercial. The system is built on a strict black-and-white palette, a high-contrast serif wordmark, and a layout grid that lets photography breathe. Every application — from woven labels to lookbook spreads — follows the same restrained visual logic.",
    brief: "Create a complete brand identity for a contemporary fashion label: wordmark, type system, color palette, stationery, and social templates. The brand should feel premium and editorial — never loud.",
    challenge:
      "Fashion branding often mistakes decoration for luxury. The risk was producing something that would feel dated within a season; the identity had to be quiet, confident, and built to last.",
    approach:
      "I stripped the system to its essentials: one wordmark, two typefaces, a strict grid, and a single accent used sparingly. Photography is the hero — typography and layout stay out of its way.",
    process: [
      "Reference research — editorial fashion houses & lookbooks",
      "Wordmark exploration — 40+ directions, 3 finalists",
      "Type pairing & layout grid definition",
      "Stationery, tags, and label applications",
      "Brand guideline document & asset export",
    ],
    services: ["Logo Design & Brand Identity", "Brand Guidelines & Visual Systems", "Business Cards & Stationery"],
    beforeAfterId: "noir-logo",
    isConcept: true,
  },
  {
    slug: "fuel-lab",
    title: "FUEL LAB",
    category: "Packaging Design",
    year: "2025",
    description:
      "High-voltage packaging for an energy drink — a can designed to be picked up from across the shelf.",
    thumbnail: "/work/fuellab-cover.jpg",
    cover: "/work/fuellab-cover.jpg",
    client: "Self-initiated (Concept)",
    palette: [
      { name: "Black", hex: "#111111" },
      { name: "Electric Lime", hex: "#D7FF64" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Steel", hex: "#8A8A8A" },
    ],
    fonts: [
      { name: "Space Grotesk", role: "Display — can name & headlines" },
      { name: "Inter", role: "Supporting text & nutrition panel" },
    ],
    overview:
      "FUEL LAB is a concept energy drink aimed at athletes and late-night creators. The packaging leans on a black base, an electric lime accent, and diagonal energy lines that wrap the can. The system works as a single can on a shelf or as a stacked retail display wall.",
    brief: "Design packaging for a new energy drink line: primary can, flavor color variants, and a retail display concept. Shelf impact from three meters away was the primary measure of success.",
    challenge:
      "The energy drink aisle is a wall of noise — neon, explosions, and aggression everywhere. FUEL LAB needed to feel energetic without blending into the chaos.",
    approach:
      "One bold diagonal gesture, one electric accent, and disciplined typography. The can reads instantly at shelf distance and rewards a closer look with layered detail.",
    process: [
      "Category audit & shelf research",
      "Concept directions — 3 visual territories",
      "Can dieline & label system",
      "Flavor variant color coding",
      "Retail display & mockup renders",
    ],
    services: ["Packaging & Label Design", "Product Mockups"],
    isConcept: true,
  },
  {
    slug: "form",
    title: "FORM",
    category: "Campaign Design",
    year: "2025",
    description:
      "A fitness campaign built on raw photography, condensed type, and one unmissable accent.",
    thumbnail: "/work/form-cover.jpg",
    cover: "/work/form-cover.jpg",
    client: "Self-initiated (Concept)",
    palette: [
      { name: "Ink", hex: "#111111" },
      { name: "Paper", hex: "#F7F5F0" },
      { name: "Signal Lime", hex: "#D7FF64" },
    ],
    fonts: [
      { name: "Oswald", role: "Condensed display — headlines" },
      { name: "Inter", role: "Supporting text & CTA" },
    ],
    overview:
      "FORM is a concept launch campaign for an independent fitness studio. The visual language pairs documentary-style gym photography with condensed uppercase typography and a strict grid. Every asset — poster, story, or web banner — ends in the same place: a single, unmissable call to action.",
    brief: "Design a launch campaign for a new fitness studio: posters, social assets, and web banners. The tone should motivate without shouting — intense, not aggressive.",
    challenge:
      "Fitness advertising defaults to volume. The goal was intensity through restraint — letting the photography and the type carry the energy instead of decoration.",
    approach:
      "A strict two-column grid, condensed uppercase type, and one electric accent per asset. The system flexes from A2 posters to 9:16 stories without losing its voice.",
    process: [
      "Audience & competitor campaign audit",
      "Photography direction & art direction notes",
      "Poster & social template system",
      "Web banner adaptions",
      "Campaign rollout kit & asset export",
    ],
    services: ["Poster & Flyer Design", "Social Media Posts & Campaigns", "Website Banners & Digital Ads"],
    isConcept: true,
  },
  {
    slug: "mono",
    title: "MONO",
    category: "Brand Identity",
    year: "2024",
    description:
      "A quiet, confident identity for a specialty coffee roaster — kraft, cream, and typography doing all the talking.",
    thumbnail: "/work/mono-cover.jpg",
    cover: "/work/mono-cover.jpg",
    client: "Self-initiated (Concept)",
    palette: [
      { name: "Kraft", hex: "#C9A87C" },
      { name: "Cream", hex: "#F7F5F0" },
      { name: "Espresso", hex: "#221A12" },
      { name: "Ink", hex: "#111111" },
    ],
    fonts: [
      { name: "Space Grotesk", role: "Wordmark & headlines" },
      { name: "Inter", role: "Body & labels" },
    ],
    overview:
      "MONO is a concept brand for a specialty coffee roaster that believes less is more. The identity pairs unbleached kraft textures with a precise typographic system: one typeface family, two colors, zero ornament. Bags, cups, menus, and the storefront all speak the same quiet language.",
    brief: "Brand a specialty coffee roastery: logo, packaging, cups, and storefront signage. The brand should feel artisanal but precise — handmade, never messy.",
    challenge:
      "Artisanal coffee branding swings between twee and generic. MONO needed warmth with discipline — crafted, but controlled.",
    approach:
      "A characterful grotesque wordmark, a strict label grid, and kraft paper as the primary brand material. Color is earned, not sprayed.",
    process: [
      "Roastery positioning & audience research",
      "Wordmark & monogram development",
      "Packaging dielines & label grid",
      "Cups, menus & signage applications",
      "Brand book & print-ready exports",
    ],
    services: ["Logo Design & Brand Identity", "Packaging & Label Design", "Menu & Restaurant Graphics"],
    beforeAfterId: "mono-packaging",
    isConcept: true,
  },
  {
    slug: "culture",
    title: "CULTURE",
    category: "Poster Design",
    year: "2026",
    description:
      "A festival poster series designed to be collected — loud type, louder color, wheatpaste-ready.",
    thumbnail: "/work/culture-cover.jpg",
    cover: "/work/culture-cover.jpg",
    client: "Self-initiated (Concept)",
    palette: [
      { name: "Violet", hex: "#6C3BF4" },
      { name: "Heat", hex: "#FF4D24" },
      { name: "Paper", hex: "#F7F5F0" },
      { name: "Ink", hex: "#111111" },
    ],
    fonts: [
      { name: "Anton", role: "Poster display type" },
      { name: "Space Grotesk", role: "Supporting information" },
    ],
    overview:
      "CULTURE is a concept poster series for a three-day music and arts festival. Each poster isolates one act, one color, and one typographic gesture. Together they form a wall; apart, each one stands on its own. The series extends into social cutdowns and a stage-screen loop.",
    brief: "Design a poster series for a music festival: A2 print posters, social cutdowns, and a stage-screen loop. The series must work as individual posters and as a collective wall.",
    challenge:
      "Festival posters compete with each other on the same wall. The system had to be flexible enough for variety, strict enough for recognition.",
    approach:
      "A fixed grid, a rotating accent color, and type that scales from whisper to shout. Every poster shares the same bones; every act gets its own voice.",
    process: [
      "Festival identity & lineup research",
      "Poster grid & type system",
      "Per-act color & composition variants",
      "Social & stage-screen adaptions",
      "Print-ready exports & paste-up mockups",
    ],
    services: ["Poster & Flyer Design", "Event & Music Posters", "Motion Graphics & Animated Social Posts"],
    beforeAfterId: "culture-poster",
    isConcept: true,
  },
  {
    slug: "nova",
    title: "NOVA",
    category: "Packaging Design",
    year: "2025",
    description:
      "Soft, clinical, and quietly premium — skincare packaging that whispers luxury.",
    thumbnail: "/work/nova-cover.jpg",
    cover: "/work/nova-cover.jpg",
    client: "Self-initiated (Concept)",
    palette: [
      { name: "Blush", hex: "#F2D8D5" },
      { name: "Cream", hex: "#F7F5F0" },
      { name: "Sage", hex: "#B7C4B1" },
      { name: "Ink", hex: "#111111" },
    ],
    fonts: [
      { name: "Cormorant Garamond", role: "Brand serif — product names" },
      { name: "Inter", role: "Data, ingredients & labels" },
    ],
    overview:
      "NOVA is a concept skincare line built on calm. The packaging system pairs soft pastel vessels with clean, clinical labels: monospaced ingredient data, generous whitespace, and a single serene serif for the brand voice. It feels closer to a lab than a candy store.",
    brief: "Design packaging for a three-product skincare line — cleanser, serum, moisturizer. The brand should feel clinical, calm, and premium, at a accessible price point.",
    challenge:
      "The skincare shelf is a wall of pastel clichés. NOVA needed to feel scientific and serene at the same time — premium without pretension.",
    approach:
      "A restrained pastel system, structured data panels for ingredients, and one serif carrying the brand voice. Structure over ornament.",
    process: [
      "Category & competitor packaging audit",
      "Structural form & material selection",
      "Label grid & regulatory layout",
      "Product photography direction",
      "E-commerce & retail mockups",
    ],
    services: ["Packaging & Label Design", "Product Mockups", "E-commerce Product Graphics"],
    isConcept: true,
  },
  {
    slug: "urban",
    title: "URBAN",
    category: "Campaign Design",
    year: "2024",
    description:
      "A streetwear campaign shot on the street, for the street — raw photos, bold type, zero polish.",
    thumbnail: "/work/urban-cover.jpg",
    cover: "/work/urban-cover.jpg",
    client: "Self-initiated (Concept)",
    palette: [
      { name: "Ink", hex: "#111111" },
      { name: "Paper", hex: "#F7F5F0" },
      { name: "Safety Orange", hex: "#FF5A1F" },
    ],
    fonts: [
      { name: "Archivo Black", role: "Display — campaign headlines" },
      { name: "Space Grotesk", role: "Supporting text" },
    ],
    overview:
      "URBAN is a concept campaign for a streetwear label that wanted to feel found, not manufactured. Documentary street photography, a high-contrast grade, graffiti-adjacent typography, and layouts borrowed from zine culture. Wheatpaste posters, a lookbook, and a merch drop complete the rollout.",
    brief: "Launch a streetwear label with a campaign that feels authentic: street photography, poster takeovers, and a printed lookbook. No studio gloss.",
    challenge:
      "Streetwear campaigns often over-produce. The brief asked for real streets, real light, and real texture — energy without a photo-studio sheen.",
    approach:
      "Documentary photography with a high-contrast editorial grade, type set like a wheatpaste poster, and layouts that borrow from zine culture.",
    process: [
      "Location scouting & casting",
      "Photography direction & grade test",
      "Poster & lookbook layout system",
      "Merch graphics & drop assets",
      "Campaign rollout kit",
    ],
    services: ["Poster & Flyer Design", "Social Media Ad Creatives", "T-Shirt & Merchandise Graphics"],
    isConcept: true,
  },
  {
    slug: "social-kit",
    title: "SOCIAL KIT",
    category: "Social Media Design",
    year: "2026",
    description:
      "A 30-post social system for a product launch — one grid, endless variations, unmistakably one brand.",
    thumbnail: "/work/socialkit-cover.jpg",
    cover: "/work/socialkit-cover.jpg",
    client: "Self-initiated (Concept)",
    palette: [
      { name: "Ink", hex: "#111111" },
      { name: "Signal Lime", hex: "#D7FF64" },
      { name: "Paper", hex: "#F7F5F0" },
      { name: "White", hex: "#FFFFFF" },
    ],
    fonts: [
      { name: "Space Grotesk", role: "Headlines" },
      { name: "Inter", role: "Body & captions" },
    ],
    overview:
      "SOCIAL KIT is a concept content system for a product launch: a modular grid, three template families, and thirty ready-to-post designs. Announcements, education, and hype posts all draw from the same visual engine — so every post ships on time and still looks unmistakably on-brand.",
    brief: "Build a social media kit for a product launch: 30 square posts, 9 stories, and a highlight-cover set — all generated from one modular system.",
    challenge:
      "Thirty posts can quietly become thirty one-offs. The system had to flex across announcements, education, and hype without losing its identity.",
    approach:
      "A strict grid, two type sizes, one accent color, and clear photography rules. Templates do the heavy lifting; the brand does the talking.",
    process: [
      "Platform & content audit",
      "Modular grid & template families",
      "30-post content matrix",
      "Story & highlight-cover adaptions",
      "Editable template handover",
    ],
    services: ["Social Media Posts & Campaigns", "Social Media Ad Creatives", "Motion Graphics & Animated Social Posts"],
    beforeAfterId: "social-post",
    isConcept: true,
  },
  {
    slug: "prime",
    title: "PRIME",
    category: "Brand Identity",
    year: "2024",
    description:
      "A corporate identity with a spine — navy, gold, and a grid that means business.",
    thumbnail: "/work/prime-cover.jpg",
    cover: "/work/prime-cover.jpg",
    client: "Self-initiated (Concept)",
    palette: [
      { name: "Navy", hex: "#14213D" },
      { name: "Gold", hex: "#B08D2E" },
      { name: "Paper", hex: "#F7F5F0" },
      { name: "White", hex: "#FFFFFF" },
    ],
    fonts: [
      { name: "Source Serif 4", role: "Brand serif — headlines" },
      { name: "Inter", role: "Corporate body text" },
    ],
    overview:
      "PRIME is a concept identity for a corporate consultancy that needed to look established without looking old. A geometric monogram, a disciplined navy-and-gold system, and typography with a strong vertical rhythm — applied consistently across stationery, pitch decks, and signage.",
    brief: "Rebrand a corporate consultancy: identity, stationery, a pitch-deck template, and signage. Credible, confident, contemporary.",
    challenge:
      "Corporate design defaults to safe. PRIME needed authority without arrogance — established, not elderly.",
    approach:
      "A geometric monogram, a disciplined two-color system, and typography with a strong vertical rhythm, applied with consistency across print and presentation.",
    process: [
      "Stakeholder interviews & positioning",
      "Monogram & wordmark development",
      "Stationery & collateral system",
      "Pitch deck template design",
      "Signage & environmental graphics",
    ],
    services: ["Logo Design & Brand Identity", "Presentation & Pitch Deck Design", "Business Cards & Stationery"],
    isConcept: true,
  },
  {
    slug: "abstract",
    title: "ABSTRACT",
    category: "Typography",
    year: "2026",
    description:
      "A self-initiated type experiment — deconstructed letterforms, printed large, judged by no one.",
    thumbnail: "/work/abstract-cover.jpg",
    cover: "/work/abstract-cover.jpg",
    client: "Self-initiated (Concept)",
    palette: [
      { name: "Ink", hex: "#111111" },
      { name: "Paper", hex: "#F7F5F0" },
      { name: "White", hex: "#FFFFFF" },
    ],
    fonts: [
      { name: "Space Grotesk", role: "Experimental display" },
      { name: "Inter", role: "Annotations" },
    ],
    overview:
      "ABSTRACT is a self-initiated typography experiment: letterforms pulled apart, overlapped, and rebuilt as posters. No client, no brief — just type, ink, and paper. Ten treatments were explored; the strongest three were printed at A1 and pasted around the studio.",
    brief: "Personal experiment: push a single word through ten typographic treatments and print the strongest three as A1 posters.",
    challenge:
      "With no client, the only audience is the work itself. Each treatment had to earn its place on the wall.",
    approach:
      "One word, ten treatments, strict black and white. Scale, overlap, and crop do the work that color usually fakes.",
    process: [
      "Word & letterform selection",
      "Ten typographic treatments",
      "A1 print & paste-up test",
      "Final poster selection",
      "Series documentation",
    ],
    services: ["Typography & Lettering"],
    isConcept: true,
  },
];
