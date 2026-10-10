/**
 * Global site configuration.
 * Everything a client would want to edit lives here — no hunting through components.
 */
export const site = {
  name: "Muhammad Asim",
  role: "Graphic Designer & Visual Artist",
  /** Text logo used in the header & footer. */
  logoText: "ASIM®",
  /** Short creative statement used in the footer. */
  tagline:
    "Independent graphic designer crafting bold identities, packaging, posters, and campaigns — from first sketch to final file.",
  description:
    "Muhammad Asim is an independent graphic designer helping businesses transform ideas into distinctive visual identities, compelling marketing graphics, and memorable brand experiences.",
  /** Hero supporting paragraph. */
  heroDescription:
    "I help businesses transform ideas into distinctive visual identities, compelling marketing graphics, and memorable brand experiences.",
  /** REPLACE with the real deployed URL (used for canonical/OG URLs). */
  url: "https://asim.design",
  /** REPLACE with the real contact email. */
  email: "hello@asim.design",
  /** Editable location line. */
  location: "Islamabad, Pakistan — working with clients worldwide",
  /** Editable availability badge shown in the hero & contact sections. */
  availability: "Available for Selected Projects",
  /**
   * Social links. REPLACE the "#" placeholders with real profile URLs.
   * They are intentionally rendered as plain links — no fake destinations.
   */
  socials: [
    { label: "Instagram", url: "#" },
    { label: "Behance", url: "#" },
    { label: "Dribbble", url: "#" },
    { label: "LinkedIn", url: "#" },
  ],
  /** Primary navigation — hrefs map to section IDs on the home page. */
  nav: [
    { label: "Home", href: "#home" },
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Before & After", href: "#before-after" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
};
