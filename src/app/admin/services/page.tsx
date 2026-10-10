"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { ServiceRow } from "@/lib/db-types";
import { serviceCategories } from "@/data/services";
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

type FormState = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  sortOrder: number;
  published: boolean;
};

const emptyForm: FormState = {
  slug: "",
  title: "",
  description: "",
  category: serviceCategories[0].id,
  sortOrder: 0,
  published: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminServicesPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    setRows((data ?? []) as ServiceRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!editing) return;
    setError(null);
    if (!editing.title.trim() || !editing.description.trim()) {
      setError("Title and description are required.");
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
      description: editing.description.trim(),
      category: editing.category,
      sort_order: Number(editing.sortOrder) || 0,
      published: editing.published,
      updated_at: new Date().toISOString(),
    };
    const { data, error: saveError } = editing.id
      ? await supabase.from("services").update(payload).eq("id", editing.id).select().single()
      : await supabase.from("services").insert(payload).select().single();
    setSaving(false);
    if (saveError || !data) {
      setError(saveError?.message ?? "Save failed. Check the slug is unique.");
      return;
    }
    const saved = data as ServiceRow;
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
    await supabase.from("services").delete().eq("id", id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Services</h1>
          <p className="mt-1 text-sm text-ink/60">
            The services listed under Creative Expertise. The contact form offers these as options.
          </p>
        </div>
        <Button variant="lime" onClick={() => setEditing({ ...emptyForm })}>
          <Plus className="h-4 w-4" />
          New Service
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No services yet"
          action={
            <Button variant="lime" onClick={() => setEditing({ ...emptyForm })}>
              <Plus className="h-4 w-4" />
              New Service
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
                  <Badge tone="gray">{row.category}</Badge>
                </p>
                <p className="mt-0.5 text-sm text-ink/55">{row.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  onClick={() =>
                    setEditing({
                      id: row.id,
                      slug: row.slug,
                      title: row.title,
                      description: row.description,
                      category: row.category,
                      sortOrder: row.sort_order,
                      published: row.published,
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
        title={editing?.id ? "Edit Service" : "New Service"}
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
            <Field label="Description *">
              <textarea
                rows={3}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Category">
              <select
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className={inputClass}
              >
                {serviceCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
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
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                    className="h-4 w-4 accent-lime"
                  />
                  Published on site
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
                {saving ? "Saving…" : "Save Service"}
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
