export type BeforeAfterItem = {
  id: string;
  /** Project this comparison belongs to (optional link to a case study). */
  projectId?: string;
  title: string;
  description?: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  /**
   * All comparisons are illustrative concept work — never present them
   * as genuine client redesigns.
   */
  isConcept: boolean;
};

/**
 * Before/after comparison data.
 * Images live in /public/before-after/. The "before" side is additionally
 * desaturated via CSS so the transformation always reads clearly.
 * Replace with real (permissioned) client work when available.
 */
export const beforeAfterItems: BeforeAfterItem[] = [
  {
    id: "noir-logo",
    projectId: "noir",
    title: "Logo — Ordinary Wordmark vs. Editorial Identity",
    description: "A dated, clip-art wordmark rebuilt as a confident, editorial fashion mark.",
    beforeImage: "/before-after/noir-logo-before.jpg",
    afterImage: "/before-after/noir-logo-after.jpg",
    beforeLabel: "Before",
    afterLabel: "After",
    isConcept: true,
  },
  {
    id: "social-post",
    projectId: "social-kit",
    title: "Social Post — Cluttered Feed Ad vs. Premium Creative",
    description: "Same product, two treatments: noise removed, hierarchy restored, brand elevated.",
    beforeImage: "/before-after/social-before.jpg",
    afterImage: "/before-after/social-after.jpg",
    beforeLabel: "Before",
    afterLabel: "After",
    isConcept: true,
  },
  {
    id: "mono-packaging",
    projectId: "mono",
    title: "Packaging — Generic Label vs. Refined Brand System",
    description: "From unbranded shelf filler to a packaging system with a clear point of view.",
    beforeImage: "/before-after/mono-pack-before.jpg",
    afterImage: "/before-after/mono-pack-after.jpg",
    beforeLabel: "Before",
    afterLabel: "After",
    isConcept: true,
  },
  {
    id: "culture-poster",
    projectId: "culture",
    title: "Event Poster — Outdated Flyer vs. Modern Poster",
    description: "A dated event flyer reimagined as a bold, collectible poster design.",
    beforeImage: "/before-after/culture-poster-before.jpg",
    afterImage: "/before-after/culture-poster-after.jpg",
    beforeLabel: "Before",
    afterLabel: "After",
    isConcept: true,
  },
];
