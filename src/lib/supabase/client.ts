"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

let browserClient: SupabaseClient | null = null;

/** Singleton Supabase client for browser/admin components. */
export function getSupabaseBrowser(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
      { auth: { persistSession: true, autoRefreshToken: true } },
    );
  }
  return browserClient;
}
