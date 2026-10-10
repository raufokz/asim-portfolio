export const serviceCategories = [
  { id: "branding", label: "Branding & Type" },
  { id: "print", label: "Print & Packaging" },
  { id: "social", label: "Social & Digital" },
  { id: "campaign", label: "Campaigns & Outdoor" },
  { id: "photo", label: "Photo & Retouch" },
  { id: "product", label: "Product & Data" },
] as const;

export type ServiceCategoryId = (typeof serviceCategories)[number]["id"];

export type Service = {
  id: string;
  title: string;
  description: string;
  category: ServiceCategoryId;
};

export const services: Service[] = [
  // Branding & Type
  {
    id: "logo-identity",
    title: "Logo Design & Brand Identity",
    description: "Distinctive marks and complete identity systems that give brands a voice worth remembering.",
    category: "branding",
  },
  {
    id: "brand-guidelines",
    title: "Brand Guidelines & Visual Systems",
    description: "Documented rules for color, type, and layout so your brand stays consistent everywhere it shows up.",
    category: "branding",
  },
  {
    id: "stationery",
    title: "Business Cards & Stationery",
    description: "Tactile first impressions — cards, letterheads, and envelopes built from your identity.",
    category: "branding",
  },
  {
    id: "typography-lettering",
    title: "Typography & Lettering",
    description: "Custom type treatments and hand-drawn lettering that make words impossible to skim past.",
    category: "branding",
  },
  // Print & Packaging
  {
    id: "poster-flyer",
    title: "Poster & Flyer Design",
    description: "Print-ready posters and flyers designed to stop foot traffic and start conversations.",
    category: "print",
  },
  {
    id: "brochure-profile",
    title: "Brochure & Company Profile Design",
    description: "Structured, editorial brochures that turn company information into a compelling read.",
    category: "print",
  },
  {
    id: "packaging-label",
    title: "Packaging & Label Design",
    description: "Shelf-ready packaging and labels engineered for impact at three meters and three centimeters.",
    category: "print",
  },
  {
    id: "editorial",
    title: "Magazine & Editorial Layouts",
    description: "Grid-driven page layouts for magazines, journals, and long-form publications.",
    category: "print",
  },
  {
    id: "menu-graphics",
    title: "Menu & Restaurant Graphics",
    description: "Menus and restaurant collateral that make dishes look as good as they taste.",
    category: "print",
  },
  {
    id: "event-posters",
    title: "Event & Music Posters",
    description: "Loud, collectible poster designs for events, gigs, and festivals.",
    category: "print",
  },
  // Social & Digital
  {
    id: "social-campaigns",
    title: "Social Media Posts & Campaigns",
    description: "Scroll-stopping post designs and campaign kits that keep your feed cohesive.",
    category: "social",
  },
  {
    id: "social-ads",
    title: "Social Media Ad Creatives",
    description: "Conversion-focused ad creatives sized and styled for every major platform.",
    category: "social",
  },
  {
    id: "youtube-thumbnails",
    title: "YouTube Thumbnails & Channel Graphics",
    description: "Click-worthy thumbnails and channel art that frame your videos professionally.",
    category: "social",
  },
  {
    id: "web-banners",
    title: "Website Banners & Digital Ads",
    description: "Responsive banner sets and display ads built for the web, not just for print.",
    category: "social",
  },
  {
    id: "motion-social",
    title: "Motion Graphics & Animated Social Posts",
    description: "Short animated loops and motion posts that add movement to your social presence.",
    category: "social",
  },
  // Campaigns & Outdoor
  {
    id: "billboard",
    title: "Billboard & Outdoor Advertising",
    description: "Large-format outdoor design that stays legible at highway speed.",
    category: "campaign",
  },
  {
    id: "real-estate",
    title: "Real Estate Marketing Graphics",
    description: "Brochures, boards, and digital listings that sell the property before the viewing.",
    category: "campaign",
  },
  {
    id: "pitch-decks",
    title: "Presentation & Pitch Deck Design",
    description: "Decks that hold a room’s attention — structured, visual, and on-brand.",
    category: "campaign",
  },
  // Photo & Retouch
  {
    id: "photo-manipulation",
    title: "Photo Manipulation & Compositing",
    description: "Seamless composites and surreal imagery built from real photography.",
    category: "photo",
  },
  {
    id: "retouching",
    title: "Image Retouching & Color Correction",
    description: "Clean, natural retouching and color grading that keeps images believable.",
    category: "photo",
  },
  // Product & Data
  {
    id: "product-mockups",
    title: "Product Mockups",
    description: "Photorealistic mockups that present your designs in context — devices, print, packaging, and space.",
    category: "product",
  },
  {
    id: "ecommerce-graphics",
    title: "E-commerce Product Graphics",
    description: "Product images, infographics, and listing graphics that lift conversion.",
    category: "product",
  },
  {
    id: "infographics",
    title: "Infographics & Data Visualization",
    description: "Complex information turned into clear, beautiful, shareable visuals.",
    category: "product",
  },
  {
    id: "merch",
    title: "T-Shirt & Merchandise Graphics",
    description: "Wearable designs — from streetwear drops to event merch — prepared for print.",
    category: "product",
  },
];
