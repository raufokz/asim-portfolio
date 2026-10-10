"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Columns2,
  FolderKanban,
  Inbox,
  MessageSquareQuote,
  Wrench,
} from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { InquiryRow } from "@/lib/db-types";
import { Badge, EmptyState, Spinner } from "@/components/admin/ui";

type Counts = {
  projects: number;
  services: number;
  beforeAfter: number;
  testimonials: number;
  inquiries: number;
  newInquiries: number;
};

const cards = (counts: Counts) => [
  { label: "Projects", value: counts.projects, href: "/admin/projects", icon: FolderKanban },
  { label: "Services", value: counts.services, href: "/admin/services", icon: Wrench },
  { label: "Before / After", value: counts.beforeAfter, href: "/admin/before-after", icon: Columns2 },
  { label: "Testimonials", value: counts.testimonials, href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Inquiries", value: counts.inquiries, href: "/admin/inquiries", icon: Inbox },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [recent, setRecent] = useState<InquiryRow[]>([]);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setLoading(true);
    const countOf = async (table: string, extra?: { status?: string }) => {
      let query = supabase.from(table).select("*", { count: "exact", head: true });
      if (extra?.status) query = query.eq("status", extra.status);
      const { count } = await query;
      return count ?? 0;
    };
    const [projects, services, beforeAfter, testimonials, inquiries, newInquiries] =
      await Promise.all([
        countOf("projects"),
        countOf("services"),
        countOf("before_after"),
        countOf("testimonials"),
        countOf("inquiries"),
        countOf("inquiries", { status: "new" }),
      ]);
    setCounts({ projects, services, beforeAfter, testimonials, inquiries, newInquiries });

    const { data } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    setRecent((data ?? []) as InquiryRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-ink/60">
            Everything on the site is managed here — content is served live from Supabase.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline"
        >
          View site ↗
        </Link>
      </div>

      {loading || !counts ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {cards(counts).map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group rounded-xl border border-ink/10 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-ink/40" />
                    <ArrowRight className="h-4 w-4 text-ink/30 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="mt-4 font-display text-3xl font-bold">{card.value}</p>
                  <p className="mt-1 text-sm text-ink/60">{card.label}</p>
                </Link>
              );
            })}
          </div>

          {counts.newInquiries > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-lime bg-lime/20 px-5 py-4">
              <p className="text-sm font-semibold text-ink">
                You have {counts.newInquiries} new inquir{counts.newInquiries === 1 ? "y" : "ies"}.
              </p>
              <Link
                href="/admin/inquiries"
                className="text-sm font-bold underline underline-offset-4"
              >
                Review →
              </Link>
            </div>
          )}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Recent Inquiries</h2>
              <Link
                href="/admin/inquiries"
                className="text-sm font-semibold text-ink/60 hover:text-ink"
              >
                View all →
              </Link>
            </div>
            {recent.length === 0 ? (
              <EmptyState
                title="No inquiries yet"
                description="When someone submits the contact form, it will appear here."
              />
            ) : (
              <ul className="divide-y divide-ink/5 rounded-xl border border-ink/10 bg-white">
                {recent.map((inquiry) => (
                  <li key={inquiry.id}>
                    <Link
                      href="/admin/inquiries"
                      className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-ink/[0.02]"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {inquiry.name}
                          <span className="ml-2 font-normal text-ink/50">{inquiry.email}</span>
                        </p>
                        <p className="mt-0.5 truncate text-sm text-ink/55">{inquiry.message}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <Badge tone={inquiry.status === "new" ? "lime" : "gray"}>
                          {inquiry.status}
                        </Badge>
                        <span className="text-xs text-ink/45">{formatDate(inquiry.created_at)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
