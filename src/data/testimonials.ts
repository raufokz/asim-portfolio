export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  /** When true, the card is rendered with a visible PLACEHOLDER badge. */
  isPlaceholder: boolean;
};

/**
 * IMPORTANT: No real testimonials have been supplied.
 * Every entry below is clearly-marked placeholder content and must be replaced
 * with genuine client feedback before this site is shown as "production".
 * Never present these as authentic.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "[PLACEHOLDER] Asim took a vague idea and returned a brand that felt like it had always existed. Replace this with a real client quote.",
    name: "[Client Name]",
    role: "Founder",
    company: "[Company]",
    isPlaceholder: true,
  },
  {
    quote:
      "[PLACEHOLDER] Fast, precise, and genuinely creative. Our packaging redesign lifted shelf pickup noticeably. Replace this with a real client quote.",
    name: "[Client Name]",
    role: "Marketing Lead",
    company: "[Company]",
    isPlaceholder: true,
  },
  {
    quote:
      "[PLACEHOLDER] The campaign assets worked across every channel without a single redesign. Replace this with a real client quote.",
    name: "[Client Name]",
    role: "Brand Manager",
    company: "[Company]",
    isPlaceholder: true,
  },
];
