"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
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
} from "@/components/admin/ui";
import ImageUpload from "@/components/admin/ImageUpload";

type FormState = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  projectSlug: string;
  isConcept: boolean;
  published: boolean;
  sortOrder: number;
};

const emptyForm: FormState = {
  slug: "",
  title: "",
  description: "",
  beforeImage: "",
  afterImage: "",
  beforeLabel: "Before",
  afterLabel: "After",
  projectSlug: "",
  isConcept: true,
  published: true,
  sortOrder: 0,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminBeforeAfterPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<BeforeAfterRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setLoading(true);
    const [baRes, projectsRes] = await Promise.all([
      supabase.from("before_after").select("*").order("sort_order", { ascending: true }),
      supabase.from("projects").select("id, slug, title").order("sort_order", { ascending: true }),
    ]);
    setRows((baRes.data ?? []) as BeforeAfterRow[]);
    setProjects((projectsRes.data ?? []) as ProjectRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!editing) return;
    setError(null);
    if (!editing.title.trim() || !editing.beforeImage.trim() || !editing.afterImage.trim()) {
      setError("Title, before image, and after image are required.");
      return;
    }
    const slug = editing.slug.trim() || slugify(editing.title);
    setSaving(true);
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setSaving(false);
      return;
    }
    const payload = {
      slug,
      title: editing.title.trim(),
      description: editing.description.trim() || null,
      before_image: editing.beforeImage.trim(),
      after_image: editing.afterImage.trim(),
      before_label: editing.beforeLabel.trim() || "Before",
      after_label: editing.afterLabel.trim() || "After",
      project_slug: editing.projectSlug || null,
      is_concept: editing.isConcept,
      published: editing.published,
      sort_order: Number(editing.sortOrder) || 0,
      updated_at: new Date().toISOString(),
    };
    const { data, error: saveError } = editing.id
      ? await supabase.from("before_after").update(payload).eq("id", editing.id).select().single()
      : await supabase.from("before_after").insert(payload).select().single();
    setSaving(false);
    if (saveError || !data) {
      setError(saveError?.message ?? "Save failed. Check the slug is unique.");
      return;
    }
    const saved = data as BeforeAfterRow;
    setRows((prev) =>
      prev.some((r) => r.id === saved.id)
        ? prev.map((r) => (r.id === saved.id ? saved : r))
        : [...prev, saved],
    );
    setEditing(null);
  };

  const remove = async (id: string) => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase.from("before_after").delete().eq("id", id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Before / After</h1>
          <p className="mt-1 text-sm text-ink/60">
            Comparison slider items. Mark them as concept work unless they are real client redesigns.
          </p>
        </div>
        <Button variant="lime" onClick={() => setEditing({ ...emptyForm })}>
          <Plus className="h-4 w-4" />
          New Comparison
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No comparisons yet"
          action={
            <Button variant="lime" onClick={() => setEditing({ ...emptyForm })}>
              <Plus className="h-4 w-4" />
              New Comparison
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-ink/5 rounded-xl border border-ink/10 bg-white">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-semibold">
                  {row.title}
                  <Badge tone={row.published ? "lime" : "gray"}>
                    {row.published ? "Published" : "Draft"}
                  </Badge>
                  {row.is_concept && <Badge tone="ink">Concept</Badge>}
                </p>
                <p className="mt-0.5 text-sm text-ink/55">
                  {row.description ?? "—"} · /{row.slug}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  onClick={() =>
                    setEditing({
                      id: row.id,
                      slug: row.slug,
                      title: row.title,
                      description: row.description ?? "",
                      beforeImage: row.before_image,
                      afterImage: row.after_image,
                      beforeLabel: row.before_label,
                      afterLabel: row.after_label,
                      projectSlug: row.project_slug ?? "",
                      isConcept: row.is_concept,
                      published: row.published,
                      sortOrder: row.sort_order,
                    })
                  }
                >
                  Edit
                </Button>
                <ConfirmButton
                  label="Delete"
                  confirmLabel="Confirm"
                  onConfirm={() => remove(row.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <SlideOver
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit Comparison" : "New Comparison"}
      >
        {editing && (
          <div className="space-y-5">
            <Field label="Title *">
              <input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Slug" hint="Defaults to a slugified title">
              <input
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={2}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className={inputClass}
              />
            </Field>
            <ImageUpload
              label="Before image *"
              value={editing.beforeImage}
              onChange={(url) => setEditing({ ...editing, beforeImage: url })}
              folder="before-after"
              hint="Upload a file, or paste a path / URL"
            />
            <ImageUpload
              label="After image *"
              value={editing.afterImage}
              onChange={(url) => setEditing({ ...editing, afterImage: url })}
              folder="before-after"
              hint="Upload a file, or paste a path / URL"
            />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Before label">
                <input
                  value={editing.beforeLabel}
                  onChange={(e) => setEditing({ ...editing, beforeLabel: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="After label">
                <input
                  value={editing.afterLabel}
                  onChange={(e) => setEditing({ ...editing, afterLabel: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Linked project" hint="Optional — shows the comparison inside that case study">
              <select
                value={editing.projectSlug}
                onChange={(e) => setEditing({ ...editing, projectSlug: e.target.value })}
                className={inputClass}
              >
                <option value="">None</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.slug}>
                    {p.title} ({p.slug})
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
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                    className="h-4 w-4 accent-lime"
                  />
                  Published on site
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={editing.isConcept}
                    onChange={(e) => setEditing({ ...editing, isConcept: e.target.checked })}
                    className="h-4 w-4 accent-lime"
                  />
                  Label as concept comparison
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
                {saving ? "Saving…" : "Save Comparison"}
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
