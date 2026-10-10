"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { InquiryRow } from "@/lib/db-types";
import {
  Badge,
  ConfirmButton,
  EmptyState,
  Field,
  SlideOver,
  Spinner,
} from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const statusFilters = ["all", "new", "read", "replied", "archived"] as const;
type StatusFilter = (typeof statusFilters)[number];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminInquiriesPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<InquiryRow[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<InquiryRow | null>(null);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data ?? []) as InquiryRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: InquiryRow["status"]) => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase.from("inquiries").update({ status }).eq("id", id);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  };

  const remove = async (id: string) => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase.from("inquiries").delete().eq("id", id);
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelected(null);
  };

  const visible = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const counts = {
    all: rows.length,
    new: rows.filter((r) => r.status === "new").length,
    read: rows.filter((r) => r.status === "read").length,
    replied: rows.filter((r) => r.status === "replied").length,
    archived: rows.filter((r) => r.status === "archived").length,
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Inquiries</h1>
        <p className="mt-1 text-sm text-ink/60">
          Messages submitted through the contact form. Reply by email, then mark as replied.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {statusFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors",
              filter === f
                ? "bg-ink text-paper"
                : "border border-ink/15 text-ink/70 hover:border-ink hover:text-ink",
            )}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          title={filter === "all" ? "No inquiries yet" : `No ${filter} inquiries`}
          description="Submitted contact-form messages will appear here."
        />
      ) : (
        <ul className="divide-y divide-ink/5 rounded-xl border border-ink/10 bg-white">
          {visible.map((inquiry) => (
            <li key={inquiry.id}>
              <button
                type="button"
                onClick={() => setSelected(inquiry)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-ink/[0.02]"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {inquiry.name}
                    <span className="ml-2 font-normal text-ink/50">{inquiry.email}</span>
                  </p>
                  <p className="mt-0.5 truncate text-sm text-ink/55">{inquiry.message}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge
                    tone={
                      inquiry.status === "new"
                        ? "lime"
                        : inquiry.status === "replied"
                          ? "ink"
                          : "gray"
                    }
                  >
                    {inquiry.status}
                  </Badge>
                  <span className="hidden text-xs text-ink/45 sm:block">
                    {formatDate(inquiry.created_at)}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <SlideOver
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Inquiry details"
      >
        {selected && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Field label="From">
                <p className="rounded-lg border border-ink/10 bg-white px-3.5 py-2.5 text-sm">
                  {selected.name} — {selected.email}
                </p>
              </Field>
              {selected.company && (
                <Field label="Company">
                  <p className="rounded-lg border border-ink/10 bg-white px-3.5 py-2.5 text-sm">
                    {selected.company}
                  </p>
                </Field>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Service">
                  <p className="rounded-lg border border-ink/10 bg-white px-3.5 py-2.5 text-sm">
                    {selected.service ?? "—"}
                  </p>
                </Field>
                <Field label="Budget">
                  <p className="rounded-lg border border-ink/10 bg-white px-3.5 py-2.5 text-sm">
                    {selected.budget ?? "—"}
                  </p>
                </Field>
              </div>
              <Field label="Deadline">
                <p className="rounded-lg border border-ink/10 bg-white px-3.5 py-2.5 text-sm">
                  {selected.deadline ?? "—"}
                </p>
              </Field>
              <Field label="Submitted">
                <p className="rounded-lg border border-ink/10 bg-white px-3.5 py-2.5 text-sm">
                  {formatDate(selected.created_at)}
                </p>
              </Field>
              <Field label="Message">
                <p className="whitespace-pre-wrap rounded-lg border border-ink/10 bg-white px-3.5 py-2.5 text-sm leading-relaxed">
                  {selected.message}
                </p>
              </Field>
            </div>

            <div className="space-y-3 border-t border-ink/10 pt-5">
              <p className="label text-ink/50">Mark as</p>
              <div className="flex flex-wrap gap-2">
                {(["new", "read", "replied", "archived"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateStatus(selected.id, s)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors",
                      selected.status === s
                        ? "bg-ink text-paper"
                        : "border border-ink/15 text-ink/70 hover:border-ink hover:text-ink",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-ink/10 pt-5">
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(
                  `Re: Your project inquiry`,
                )}&body=${encodeURIComponent(`Hi ${selected.name},\n\nThanks for reaching out!\n\n— Muhammad Asim`)}`}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-ink/90"
              >
                <Mail className="h-4 w-4" />
                Reply by email
              </a>
              <ConfirmButton
                label="Delete"
                confirmLabel="Confirm delete"
                onConfirm={() => remove(selected.id)}
              />
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}
