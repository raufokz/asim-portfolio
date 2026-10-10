"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { TestimonialRow } from "@/lib/db-types";
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
  quote: string;
  name: string;
  role: string;
  company: string;
  isPlaceholder: boolean;
  published: boolean;
  sortOrder: number;
};

const emptyForm: FormState = {
  quote: "",
  name: "",
  role: "",
  company: "",
  isPlaceholder: true,
  published: true,
  sortOrder: 0,
};

export default function AdminTestimonialsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<TestimonialRow[]>([]);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    setRows((data ?? []) as TestimonialRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!editing) return;
    setError(null);
    if (!editing.quote.trim() || !editing.name.trim()) {
      setError("Quote and name are required.");
      return;
    }
    setSaving(true);
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setSaving(false);
      return;
    }
    const payload = {
      quote: editing.quote.trim(),
      name: editing.name.trim(),
      role: editing.role.trim() || null,
      company: editing.company.trim() || null,
      is_placeholder: editing.isPlaceholder,
      published: editing.published,
      sort_order: Number(editing.sortOrder) || 0,
      updated_at: new Date().toISOString(),
    };
    const { data, error: saveError } = editing.id
      ? await supabase.from("testimonials").update(payload).eq("id", editing.id).select().single()
      : await supabase.from("testimonials").insert(payload).select().single();
    setSaving(false);
    if (saveError || !data) {
      setError(saveError?.message ?? "Save failed.");
      return;
    }
    const saved = data as TestimonialRow;
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
    await supabase.from("testimonials").delete().eq("id", id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="mt-1 text-sm text-ink/60">
            Client feedback. Only publish real quotes — keep <strong>placeholder</strong> enabled
            until a genuine testimonial is supplied, so visitors always know what is real.
          </p>
        </div>
        <Button variant="lime" onClick={() => setEditing({ ...emptyForm })}>
          <Plus className="h-4 w-4" />
          New Testimonial
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          action={
            <Button variant="lime" onClick={() => setEditing({ ...emptyForm })}>
              <Plus className="h-4 w-4" />
              New Testimonial
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-ink/5 rounded-xl border border-ink/10 bg-white">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-semibold">
                  {row.name}
                  {row.is_placeholder && <Badge tone="lime">Placeholder</Badge>}
                  <Badge tone={row.published ? "gray" : "red"}>
                    {row.published ? "Published" : "Hidden"}
                  </Badge>
                </p>
                <p className="mt-0.5 line-clamp-2 text-sm text-ink/55">“{row.quote}”</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  onClick={() =>
                    setEditing({
                      id: row.id,
                      quote: row.quote,
                      name: row.name,
                      role: row.role ?? "",
                      company: row.company ?? "",
                      isPlaceholder: row.is_placeholder,
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
        title={editing?.id ? "Edit Testimonial" : "New Testimonial"}
      >
        {editing && (
          <div className="space-y-5">
            <Field label="Quote *">
              <textarea
                rows={4}
                value={editing.quote}
                onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                className={inputClass}
                placeholder="What the client said…"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name *">
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className={inputClass}
                  placeholder="Client name"
                />
              </Field>
              <Field label="Role">
                <input
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  className={inputClass}
                  placeholder="Founder"
                />
              </Field>
            </div>
            <Field label="Company">
              <input
                value={editing.company}
                onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                className={inputClass}
              />
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
                    checked={editing.isPlaceholder}
                    onChange={(e) =>
                      setEditing({ ...editing, isPlaceholder: e.target.checked })
                    }
                    className="h-4 w-4 accent-lime"
                  />
                  Mark as placeholder
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
                {saving ? "Saving…" : "Save Testimonial"}
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
