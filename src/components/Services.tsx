"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { serviceCategories, type Service } from "@/data/services";
import SectionHeading from "@/components/SectionHeading";
import ServiceArt from "@/components/ServiceArt";
import Reveal from "@/components/Reveal";
import { cn } from "@/lib/utils";

const filters = [{ id: "all", label: "All Services" }, ...serviceCategories] as const;

type FilterId = (typeof filters)[number]["id"];

export default function Services({ services }: { services: Service[] }) {
  const [filter, setFilter] = useState<FilterId>("all");
  const visible = services.filter((s) => filter === "all" || s.category === filter);

  const inquire = (serviceId: string) => {
    // Lets the contact form pre-select this service and scroll to itself.
    window.dispatchEvent(new CustomEvent("asim:inquire", { detail: serviceId }));
  };

  return (
    <section id="services" className="bg-paper py-24 lg:py-32">
      <div className="container-slim">
        <Reveal>
          <SectionHeading
            index="03"
            label="Creative Expertise"
            title={
              <>
                Every Pixel With <span className="marker">a Purpose.</span>
              </>
            }
            description={`What I can design for you — ${services.length} services across branding, print, digital, campaigns, photo, and product. Filter by discipline, or inquire directly from a card.`}
          />
        </Reveal>

        {/* Filters */}
        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter services by category">
          {filters.map((f) => {
            const isActive = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-ink text-paper"
                    : "border border-ink/15 text-ink/70 hover:border-ink hover:text-ink",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((service, i) => (
            <Reveal key={service.id} delay={(i % 3) * 70}>
              <article className="group flex h-full flex-col rounded-xl border border-ink/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/25 hover:shadow-lg">
                <div className="overflow-hidden rounded-lg">
                  <ServiceArt seed={i} title={service.title} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold leading-snug">
                  {service.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                  {service.description}
                </p>
                <a
                  href="#contact"
                  onClick={() => inquire(service.id)}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline"
                >
                  Inquire about this
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
