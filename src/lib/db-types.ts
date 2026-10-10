/**
 * Database row types (Supabase / PostgREST). Shared between server code
 * (public site) and the admin dashboard. Pure types — no runtime code,
 * safe to import from client components.
 */

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  cover: string;
  thumbnail: string | null;
  client: string | null;
  overview: string | null;
  brief: string | null;
  challenge: string | null;
  approach: string | null;
  process: string[] | null;
  services: string[] | null;
  palette: { name: string; hex: string }[] | null;
  fonts: { name: string; role: string }[] | null;
  before_after_slug: string | null;
  is_concept: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type BeforeAfterRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  before_image: string;
  after_image: string;
  before_label: string;
  after_label: string;
  project_slug: string | null;
  is_concept: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type TestimonialRow = {
  id: string;
  quote: string;
  name: string;
  role: string | null;
  company: string | null;
  is_placeholder: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type InquiryRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  budget: string | null;
  deadline: string | null;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
};

export type SiteSettingRow = {
  key: string;
  value: unknown;
  updated_at: string;
};

export type SiteSettings = {
  name: string;
  role: string;
  logoText: string;
  tagline: string;
  description: string;
  heroDescription: string;
  url: string;
  email: string;
  location: string;
  availability: string;
  socials: { label: string; url: string }[];
};
