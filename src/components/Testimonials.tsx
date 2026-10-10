import type { Testimonial } from "@/data/testimonials";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="bg-paper pb-24 lg:pb-32">
      <div className="container-slim">
        <Reveal>
          <SectionHeading
            index="07"
            label="Client Feedback"
            title={
              <>
                Kind Words, <span className="marker">Honestly Marked.</span>
              </>
            }
            description="No testimonials have been supplied yet, so these cards are clearly-labeled placeholders. Add genuine client feedback in the admin dashboard — never invent quotes."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 90}>
              <figure className="flex h-full flex-col rounded-xl border border-ink/10 bg-white p-6">
                {t.isPlaceholder && (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-lime px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
                    Placeholder
                  </span>
                )}
                <blockquote className="flex-1 text-sm leading-relaxed text-ink/80">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-ink/10 pt-4">
                  <p className="font-display font-bold">{t.name}</p>
                  <p className="mt-0.5 text-sm text-ink/55">
                    {t.role}
                    {t.company ? ` · ${t.company}` : ""}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
