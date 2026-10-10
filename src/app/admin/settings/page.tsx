"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import {
  Button,
  Field,
  Spinner,
  inputClass,
} from "@/components/admin/ui";

type Social = { label: string; url: string };

type FormState = {
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
  socials: Social[];
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from("site_settings").select("key, value");
    const values: Record<string, unknown> = {};
    for (const row of data ?? []) {
      values[row.key] = row.value;
    }
    setForm({
      name: String(values.name ?? "Muhammad Asim"),
      role: String(values.role ?? "Graphic Designer & Visual Artist"),
      logoText: String(values.logoText ?? "ASIM®"),
      tagline: String(values.tagline ?? ""),
      description: String(values.description ?? ""),
      heroDescription: String(values.heroDescription ?? ""),
      url: String(values.url ?? ""),
      email: String(values.email ?? ""),
      location: String(values.location ?? ""),
      availability: String(values.availability ?? "Available for Selected Projects"),
      socials: Array.isArray(values.socials)
        ? (values.socials as Social[])
        : [
            { label: "Instagram", url: "#" },
            { label: "Behance", url: "#" },
            { label: "Dribbble", url: "#" },
            { label: "LinkedIn", url: "#" },
          ],
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!form) return;
    setError(null);
    setSaving(true);
    setSaved(false);
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setSaving(false);
      return;
    }
    const entries: [string, unknown][] = [
      ["name", form.name],
      ["role", form.role],
      ["logoText", form.logoText],
      ["tagline", form.tagline],
      ["description", form.description],
      ["heroDescription", form.heroDescription],
      ["url", form.url],
      ["email", form.email],
      ["location", form.location],
      ["availability", form.availability],
      ["socials", form.socials.filter((s) => s.label.trim())],
    ];
    const { error: saveError } = await supabase.from("site_settings").upsert(
      entries.map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      })),
    );
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading || !form) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const set = (patch: Partial<FormState>) => setForm({ ...form, ...patch });
  const setSocial = (i: number, patch: Partial<Social>) =>
    setForm({
      ...form,
      socials: form.socials.map((s, j) => (j === i ? { ...s, ...patch } : s)),
    });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Site Settings</h1>
        <p className="mt-1 text-sm text-ink/60">
          These values appear across the site (hero, about, contact, footer, SEO). Changes go live
          within a minute.
        </p>
      </div>

      <div className="space-y-5 rounded-xl border border-ink/10 bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name">
            <input value={form.name} onChange={(e) => set({ name: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Role / Title">
            <input value={form.role} onChange={(e) => set({ role: e.target.value })} className={inputClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Logo text">
            <input value={form.logoText} onChange={(e) => set({ logoText: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Contact email">
            <input type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} className={inputClass} />
          </Field>
        </div>
        <Field label="Tagline (footer)">
          <textarea rows={2} value={form.tagline} onChange={(e) => set({ tagline: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Site description (SEO)">
          <textarea rows={2} value={form.description} onChange={(e) => set({ description: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Hero description">
          <textarea rows={2} value={form.heroDescription} onChange={(e) => set({ heroDescription: e.target.value })} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Site URL" hint="Used for canonical/OG links">
            <input value={form.url} onChange={(e) => set({ url: e.target.value })} className={inputClass} placeholder="https://your-domain.com" />
          </Field>
          <Field label="Location line">
            <input value={form.location} onChange={(e) => set({ location: e.target.value })} className={inputClass} />
          </Field>
        </div>
        <Field label="Availability badge">
          <input value={form.availability} onChange={(e) => set({ availability: e.target.value })} className={inputClass} />
        </Field>

        <div>
          <p className="label mb-2 block text-ink/55">Social links</p>
          <div className="space-y-2">
            {form.socials.map((social, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={social.label}
                  onChange={(e) => setSocial(i, { label: e.target.value })}
                  className={inputClass}
                  placeholder="Label (e.g. Behance)"
                />
                <input
                  value={social.url}
                  onChange={(e) => setSocial(i, { url: e.target.value })}
                  className={inputClass}
                  placeholder="https://behance.net/yourprofile"
                />
                <button
                  type="button"
                  onClick={() => set({ socials: form.socials.filter((_, j) => j !== i) })}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/50 transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove social link"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button variant="ghost" onClick={() => set({ socials: [...form.socials, { label: "", url: "" }] })}>
              <Plus className="h-4 w-4" />
              Add social link
            </Button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}

        <div className="flex items-center gap-4 border-t border-ink/10 pt-5">
          <Button variant="lime" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save Settings"}
          </Button>
          {saved && <p className="text-sm font-semibold text-green-700">Saved ✓</p>}
        </div>
      </div>
    </div>
  );
}
