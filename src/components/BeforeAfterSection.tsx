"use client";

import { useState } from "react";
import type { BeforeAfterItem } from "@/data/beforeAfter";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import SectionHeading from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

export default function BeforeAfterSection({ items }: { items: BeforeAfterItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const active = items.find((item) => item.id === activeId) ?? items[0];

  if (!active) {
    return (
      <section id="before-after" className="bg-paper py-24 lg:py-32">
        <div className="container-slim">
          <SectionHeading
            index="02"
            label="Before & After"
            title={
              <>
                From Ordinary to <span className="marker">Extraordinary.</span>
              </>
            }
          />
        </div>
      </section>
    );
  }

  return (
    <section id="before-after" className="bg-paper py-24 lg:py-32">
      <div className="container-slim">
        <SectionHeading
          index="02"
          label="Before & After"
          title={
            <>
              From Ordinary to <span className="marker">Extraordinary.</span>
            </>
          }
          description="See how thoughtful design transforms the way a brand communicates. Drag the handle — or focus it and use the arrow keys."
        />
        <p className="mt-4 text-xs text-ink/50">
          Illustrative concept comparisons — not client work. Manage them in the{" "}
          <a href="/admin/before-after" className="underline underline-offset-2">
            admin dashboard
          </a>
          .
        </p>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <BeforeAfterSlider item={active} />
            <div className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <h3 className="font-display text-lg font-bold">{active.title}</h3>
              <p className="text-sm text-ink/60">{active.description}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {items.map((item, i) => {
              const isActive = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex items-start gap-4 rounded-lg border p-4 text-left transition-all",
                    isActive
                      ? "border-ink bg-white shadow-sm"
                      : "border-ink/10 bg-transparent hover:border-ink/30",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold",
                      isActive ? "bg-lime text-ink" : "bg-ink/5 text-ink/50",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display font-bold leading-snug">{item.title}</span>
                    <span className="mt-1 block text-sm text-ink/60">{item.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
