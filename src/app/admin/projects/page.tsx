"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { BeforeAfterRow, ProjectRow } from "@/lib/db-types";
import {
  Badge,
  Button,
  ConfirmButton,
  EmptyState,
  Field,
  SlideOver,
  Spinner,
  inputClass,
  labelClass,
} from "@/components/admin/ui";
import ImageUpload from "@/components/admin/ImageUpload";

const categorySuggestions = [
  "Brand Identity",
  "Packaging Design",
  "Campaign Design",
  "Poster Design",
  "Social Media Design",
  "Typography",
];

type PaletteEntry = { name: string; hex: string };
type FontEntry = { name: string; role: string };

type FormState = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  cover: string;
  thumbnail: string;
  client: string;
  overview: string;
  brief: string;
  challenge: string;
  approach: string;
  processText: string;
  servicesText: string;
  palette: PaletteEntry[];
  fonts: FontEntry[];
  beforeAfterSlug: string;
  isConcept: boolean;
  published: boolean;
  sortOrder: number;
};

const emptyForm: FormState = {
  slug: "",
  title: "",
  category: "",
  year: String(new Date().getFullYear()),
  description: "",
  cover: "",
  thumbnail: "",
  client: "Self-initiated (Concept)",
  overview: "",
  brief: "",
  challenge: "",
  approach: "",
  processText: "",
  servicesText: "",
  palette: [],
  fonts: [],
  beforeAfterSlug: "",
  isConcept: true,
  published: true,
  sortOrder: 0,
};

function rowToForm(row: ProjectRow): FormState {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    year: row.year,
    description: row.description,
    cover: row.cover,
    thumbnail: row.thumbnail ?? "",
    client: row.client ?? "",
    overview: row.overview ?? "",
    brief: row.brief ?? "",
    challenge: row.challenge ?? "",
    approach: row.approach ?? "",
    processText: (row.process ?? []).join("\n"),
    servicesText: (row.services ?? []).join("\n"),
    palette: row.palette ?? [],
    fonts: row.fonts ?? [],
    beforeAfterSlug: row.before_after_slug ?? "",
    isConcept: row.is_concept,
    published: row.published,
    sortOrder: row.sort_order,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [comparisons, setComparisons] = useState<BeforeAfterRow[]>([]);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setLoading(true);
    const [projectsRes, comparisonsRes] = await Promise.all([
      supabase.from("projects").select("*").order("sort_order", { ascending: true }),
      supabase.from("before_after").select("*").order("sort_order", { ascending: true }),
    ]);
    setRows((projectsRes.data ?? []) as ProjectRow[]);
    setComparisons((comparisonsRes.data ?? []) as BeforeAfterRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!editing) return;
    setError(null);
    if (!editing.title.trim() || !editing.cover.trim() || !editing.description.trim()) {
      setError("Title, cover image, and description are required.");
      return;
    }
    const slug = editing.slug.trim() || slugify(editing.title);
    if (!slug) {
      setError("Could not derive a slug — please set one explicitly.");
      return;
    }
    setSaving(true);
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setSaving(false);
      return;
    }
    const payload = {
      slug,
      title: editing.title.trim(),
      category: editing.category.trim() || "Design",
      year: editing.year.trim() || String(new Date().getFullYear()),
      description: editing.description.trim(),
      cover: editing.cover.trim(),
      thumbnail: editing.thumbnail.trim() || null,
      client: editing.client.trim() || null,
      overview: editing.overview.trim() || null,
      brief: editing.brief.trim() || null,
      challenge: editing.challenge.trim() || null,
      approach: editing.approach.trim() || null,
      process: editing.processText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      services: editing.servicesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      palette: editing.palette.filter((p) => p.name.trim() && p.hex.trim()),
      fonts: editing.fonts.filter((f) => f.name.trim()),
      before_after_slug: editing.beforeAfterSlug || null,
      is_concept: editing.isConcept,
      published: editing.published,
      sort_order: Number(editing.sortOrder) || 0,
      updated_at: new Date().toISOString(),
    };
    const { data, error: saveError } = editing.id
      ? await supabase.from("projects").update(payload).eq("id", editing.id).select().single()
      : await supabase.from("projects").insert(payload).select().single();
    setSaving(false);
    if (saveError || !data) {
      setError(saveError?.message ?? "Save failed. Check the slug is unique.");
      return;
    }
    const saved = data as ProjectRow;
    setRows((prev) => {
      const exists = prev.some((r) => r.id === saved.id);
      return exists
        ? prev.map((r) => (r.id === saved.id ? saved : r))
        : [...prev, saved];
    });
    setEditing(null);
  };

  const remove = async (id: string) => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase.from("projects").delete().eq("id", id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const setPalette = (entries: PaletteEntry[]) =>
    setEditing((prev) => (prev ? { ...prev, palette: entries } : prev));
  const setFonts = (entries: FontEntry[]) =>
    setEditing((prev) => (prev ? { ...prev, fonts: entries } : prev));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-ink/60">
            Case studies shown on the site. Images: use paths in <code className="rounded bg-ink/5 px-1 font-mono text-xs">/public</code> (e.g. <code className="rounded bg-ink/5 px-1 font-mono text-xs">/work/my-cover.jpg</code>) or full URLs.
          </p>
        </div>
        <Button variant="lime" onClick={() => setEditing({ ...emptyForm })}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first case study — it will appear on the site within a minute."
          action={
            <Button variant="lime" onClick={() => setEditing({ ...emptyForm })}>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-white"
            >
              <button
                type="button"
                onClick={() => setEditing(rowToForm(row))}
                className="relative aspect-[4/3] w-full overflow-hidden bg-ink/5 text-left"
              >
                {row.cover && (
                  <Image
                    src={row.cover}
                    alt={row.title}
                    fill
                    sizes="(max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                )}
              </button>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display font-bold">{row.title}</h3>
                  <Badge tone={row.published ? "lime" : "gray"}>
                    {row.published ? "Published" : "Draft"}
                  </Badge>
                  {row.is_concept && <Badge tone="ink">Concept</Badge>}
                </div>
                <p className="text-sm text-ink/55">
                  {row.category} · {row.year} · /{row.slug}
                </p>
                <div className="mt-auto flex gap-2 pt-2">
                  <Button onClick={() => setEditing(rowToForm(row))}>Edit</Button>
                  <ConfirmButton
                    label="Delete"
                    confirmLabel="Confirm delete"
                    onConfirm={() => remove(row.id)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <SlideOver
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit Project" : "New Project"}
      >
        {editing && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title *">
                <input
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  className={inputClass}
                  placeholder="NOIR"
                />
              </Field>
              <Field label="Slug" hint="URL: /work/slug — defaults to a slugified title">
                <input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className={inputClass}
                  placeholder="noir"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <input
                  list="project-categories"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className={inputClass}
                  placeholder="Brand Identity"
                />
                <datalist id="project-categories">
                  {categorySuggestions.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field label="Year">
                <input
                  value={editing.year}
                  onChange={(e) => setEditing({ ...editing, year: e.target.value })}
                  className={inputClass}
                  placeholder="2026"
                />
              </Field>
            </div>

            <Field label="Short description *" hint="Shown on cards and meta descriptions">
              <textarea
                rows={2}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className={inputClass}
              />
            </Field>

            <ImageUpload
              label="Cover image *"
              value={editing.cover}
              onChange={(url) => setEditing({ ...editing, cover: url })}
              folder="projects"
              hint="Upload a file, or paste a path / URL"
            />
            <ImageUpload
              label="Thumbnail"
              value={editing.thumbnail}
              onChange={(url) => setEditing({ ...editing, thumbnail: url })}
              folder="projects"
              hint="Optional — defaults to the cover image"
            />

            <Field label="Client">
              <input
                value={editing.client}
                onChange={(e) => setEditing({ ...editing, client: e.target.value })}
                className={inputClass}
                placeholder="Self-initiated (Concept)"
              />
            </Field>

            <Field label="Overview">
              <textarea
                rows={3}
                value={editing.overview}
                onChange={(e) => setEditing({ ...editing, overview: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="The Brief">
              <textarea
                rows={2}
                value={editing.brief}
                onChange={(e) => setEditing({ ...editing, brief: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="The Challenge">
              <textarea
                rows={2}
                value={editing.challenge}
                onChange={(e) => setEditing({ ...editing, challenge: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="The Approach">
              <textarea
                rows={2}
                value={editing.approach}
                onChange={(e) => setEditing({ ...editing, approach: e.target.value })}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Process steps" hint="One per line">
                <textarea
                  rows={5}
                  value={editing.processText}
                  onChange={(e) => setEditing({ ...editing, processText: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Services used" hint="One per line">
                <textarea
                  rows={5}
                  value={editing.servicesText}
                  onChange={(e) => setEditing({ ...editing, servicesText: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Palette editor */}
            <div>
              <p className={labelClass}>Color palette</p>
              <div className="space-y-2">
                {editing.palette.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={entry.hex || "#111111"}
                      onChange={(e) => {
                        const next = [...editing.palette];
                        next[i] = { ...entry, hex: e.target.value };
                        setPalette(next);
                      }}
                      className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-ink/15 bg-white p-1"
                      aria-label={`Color ${i + 1}`}
                    />
                    <input
                      value={entry.name}
                      onChange={(e) => {
                        const next = [...editing.palette];
                        next[i] = { ...entry, name: e.target.value };
                        setPalette(next);
                      }}
                      className={inputClass}
                      placeholder="Name (e.g. Ink)"
                    />
                    <input
                      value={entry.hex}
                      onChange={(e) => {
                        const next = [...editing.palette];
                        next[i] = { ...entry, hex: e.target.value };
                        setPalette(next);
                      }}
                      className={`${inputClass} w-28 font-mono`}
                      placeholder="#111111"
                    />
                    <button
                      type="button"
                      onClick={() => setPalette(editing.palette.filter((_, j) => j !== i))}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/50 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove color"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  onClick={() => setPalette([...editing.palette, { name: "", hex: "#D7FF64" }])}
                >
                  <Plus className="h-4 w-4" />
                  Add color
                </Button>
              </div>
            </div>

            {/* Fonts editor */}
            <div>
              <p className={labelClass}>Typography</p>
              <div className="space-y-2">
                {editing.fonts.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={entry.name}
                      onChange={(e) => {
                        const next = [...editing.fonts];
                        next[i] = { ...entry, name: e.target.value };
                        setFonts(next);
                      }}
                      className={inputClass}
                      placeholder="Font name (e.g. Space Grotesk)"
                    />
                    <input
                      value={entry.role}
                      onChange={(e) => {
                        const next = [...editing.fonts];
                        next[i] = { ...entry, role: e.target.value };
                        setFonts(next);
                      }}
                      className={inputClass}
                      placeholder="Role (e.g. Display)"
                    />
                    <button
                      type="button"
                      onClick={() => setFonts(editing.fonts.filter((_, j) => j !== i))}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/50 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove font"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  onClick={() => setFonts([...editing.fonts, { name: "", role: "" }])}
                >
                  <Plus className="h-4 w-4" />
                  Add font
                </Button>
              </div>
            </div>

            <Field label="Before / After comparison" hint="Optional — links a comparison to this project">
              <select
                value={editing.beforeAfterSlug}
                onChange={(e) =>
                  setEditing({ ...editing, beforeAfterSlug: e.target.value })
                }
                className={inputClass}
              >
                <option value="">None</option>
                {comparisons.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Sort order">
                <input
                  type="number"
                  value={editing.sortOrder}
                  onChange={(e) =>
                    setEditing({ ...editing, sortOrder: Number(e.target.value) })
                  }
                  className={inputClass}
                />
              </Field>
              <div className="flex flex-col justify-end gap-2 pb-1">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) =>
                      setEditing({ ...editing, published: e.target.checked })
                    }
                    className="h-4 w-4 accent-lime"
                  />
                  Published on site
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={editing.isConcept}
                    onChange={(e) =>
                      setEditing({ ...editing, isConcept: e.target.checked })
                    }
                    className="h-4 w-4 accent-lime"
                  />
                  Label as concept project
                </label>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex gap-2 border-t border-ink/10 pt-5">
              <Button variant="lime" onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save Project"}
              </Button>
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}
