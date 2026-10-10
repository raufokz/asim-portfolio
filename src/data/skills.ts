/**
 * Tools & skill categories.
 * No proficiency percentages are shown — the owner can edit these lists freely
 * without implying fake precision.
 */
export const tools: { name: string; note: string }[] = [
  { name: "Adobe Photoshop", note: "Compositing & photo work" },
  { name: "Adobe Illustrator", note: "Vector & identity" },
  { name: "Adobe InDesign", note: "Editorial & print" },
  { name: "Adobe After Effects", note: "Motion graphics" },
  { name: "Figma", note: "UI & mockups" },
  { name: "Canva", note: "Fast social content" },
];

export const skillCategories: { title: string; items: string[] }[] = [
  { title: "Branding", items: ["Identity systems", "Logo design", "Brand guidelines", "Art direction"] },
  { title: "Digital Design", items: ["Social content", "Ad creatives", "Web banners", "Thumbnails"] },
  { title: "Print Design", items: ["Posters", "Packaging", "Editorial", "Stationery"] },
  { title: "Packaging", items: ["Labels", "Dielines", "Mockups", "Variant systems"] },
  { title: "Photo Editing", items: ["Compositing", "Retouching", "Color grading", "Backgrounds"] },
  { title: "Typography", items: ["Type pairing", "Lettering", "Type layouts", "Hierarchy"] },
  { title: "Layout Design", items: ["Grids", "Brochures", "Decks", "Menus"] },
  { title: "Creative Direction", items: ["Concepts", "Campaigns", "Visual systems", "Presentations"] },
];
