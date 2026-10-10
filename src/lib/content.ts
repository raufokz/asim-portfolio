/**
 * Content layer for the public site.
 *
 * Source of truth: Supabase (managed in the admin dashboard).
 * Fallback: the local data files in src/data (used when Supabase is not
 * configured or unreachable, so the site never renders broken/empty).
 *
 * Reads are cached with unstable_cache (60s ISR) so the site stays fast
 * while still picking up admin changes within a minute.
 */
import { unstable_cache } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import type {
  BeforeAfterRow,
  ProjectRow,
  ServiceRow,
  SiteSettingRow,
  TestimonialRow,
} from "@/lib/db-types";
import { projects as localProjects, type Project } from "@/data/projects";
import { services as localServices, type Service } from "@/data/services";
import {
  beforeAfterItems as localBeforeAfter,
  type BeforeAfterItem,
} from "@/data/beforeAfter";
import { testimonials as localTestimonials, type Testimonial } from "@/data/testimonials";
import { site as localSite } from "@/data/site";

const REVALIDATE_SECONDS = 60;

/** Public site configuration (local defaults merged with DB overrides). */
export type SiteConfig = typeof localSite;

// ── Row → public type mappers ───────────────────────────────────────────────

function projectRowToProject(row: ProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    year: row.year,
    description: row.description,
    thumbnail: row.thumbnail ?? row.cover,
    cover: row.cover,
    client: row.client ?? "Self-initiated (Concept)",
    palette: row.palette ?? [],
    fonts: row.fonts ?? [],
    overview: row.overview ?? "",
    brief: row.brief ?? "",
    challenge: row.challenge ?? "",
    approach: row.approach ?? "",
    process: row.process ?? [],
    services: row.services ?? [],
    beforeAfterId: row.before_after_slug ?? undefined,
    isConcept: row.is_concept,
  };
}

function serviceRowToService(row: ServiceRow): Service {
  return {
    id: row.slug,
    title: row.title,
    description: row.description,
    category: row.category as Service["category"],
  };
}

function beforeAfterRowToItem(row: BeforeAfterRow): BeforeAfterItem {
  return {
    id: row.slug,
    projectId: row.project_slug ?? undefined,
    title: row.title,
    description: row.description ?? undefined,
    beforeImage: row.before_image,
    afterImage: row.after_image,
    beforeLabel: row.before_label,
    afterLabel: row.after_label,
    isConcept: row.is_concept,
  };
}

function testimonialRowToTestimonial(row: TestimonialRow): Testimonial {
  return {
    quote: row.quote,
    name: row.name,
    role: row.role ?? undefined,
    company: row.company ?? undefined,
    isPlaceholder: row.is_placeholder,
  };
}

// ── Fetchers (DB with local fallback) ───────────────────────────────────────

async function fetchProjects(): Promise<Project[]> {
  const supabase = getSupabaseServer();
  if (!supabase) return localProjects;
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error || !data) return localProjects;
    return (data as ProjectRow[]).map(projectRowToProject);
  } catch {
    return localProjects;
  }
}

async function fetchServices(): Promise<Service[]> {
  const supabase = getSupabaseServer();
  if (!supabase) return localServices;
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return localServices;
    return (data as ServiceRow[]).map(serviceRowToService);
  } catch {
    return localServices;
  }
}

async function fetchBeforeAfter(): Promise<BeforeAfterItem[]> {
  const supabase = getSupabaseServer();
  if (!supabase) return localBeforeAfter;
  try {
    const { data, error } = await supabase
      .from("before_after")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return localBeforeAfter;
    return (data as BeforeAfterRow[]).map(beforeAfterRowToItem);
  } catch {
    return localBeforeAfter;
  }
}

async function fetchTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabaseServer();
  if (!supabase) return localTestimonials;
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return localTestimonials;
    return (data as TestimonialRow[]).map(testimonialRowToTestimonial);
  } catch {
    return localTestimonials;
  }
}

async function fetchSiteSettings() {
  const supabase = getSupabaseServer();
  if (!supabase) return localSite;
  try {
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error || !data) return localSite;
    const overrides: Record<string, unknown> = {};
    for (const row of data as SiteSettingRow[]) {
      overrides[row.key] = row.value;
    }
    return { ...localSite, ...overrides };
  } catch {
    return localSite;
  }
}

// ── Cached public getters ───────────────────────────────────────────────────

export const getProjects = unstable_cache(fetchProjects, ["content:projects"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["projects"],
});

export const getServices = unstable_cache(fetchServices, ["content:services"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["services"],
});

export const getBeforeAfter = unstable_cache(fetchBeforeAfter, ["content:before-after"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["before-after"],
});

export const getTestimonials = unstable_cache(fetchTestimonials, ["content:testimonials"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["testimonials"],
});

export const getSiteSettings = unstable_cache(fetchSiteSettings, ["content:settings"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["settings"],
});

/** Before/after comparison attached to a given project slug. */
export async function getBeforeAfterForProject(projectSlug: string) {
  const items = await getBeforeAfter();
  return items.find((item) => item.projectId === projectSlug);
}
