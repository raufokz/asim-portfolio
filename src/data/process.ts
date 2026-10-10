export type ProcessStep = {
  id: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    id: "01",
    title: "Discover",
    description: "Understand the brief, audience, goals, and brand personality.",
  },
  {
    id: "02",
    title: "Explore",
    description: "Research references, develop concepts, and explore visual directions.",
  },
  {
    id: "03",
    title: "Design",
    description: "Refine typography, composition, colors, and visual assets.",
  },
  {
    id: "04",
    title: "Deliver",
    description: "Prepare final artwork, export production-ready files, and organize deliverables.",
  },
];
