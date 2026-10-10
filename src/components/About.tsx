import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { SiteConfig } from "@/lib/content";

const specializations = [
  "Brand Identity",
  "Packaging",
  "Campaigns",
  "Editorial & Print",
  "Social Content",
  "Typography",
];

const tools = [
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe InDesign",
  "Adobe After Effects",
  "Figma",
  "Canva",
];

export default function About({ settings }: { settings: SiteConfig }) {
  return (
    <section id="about" className="bg-paper py-24 lg:py-32">
      <div className="container-slim grid items-center gap-14 lg:grid-cols-[5fr_7fr]">
        <Reveal>
          <figure className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
              <Image
                src="/about/asim-portrait.jpg"
                alt="Portrait of Muhammad Asim, graphic designer — placeholder image, replace with a real photo"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover grayscale contrast-[1.05]"
              />
            </div>
            {/* Offset lime block behind the portrait */}
            <span
              aria-hidden="true"
              className="absolute -right-4 -bottom-4 -z-10 h-full w-full rounded-xl bg-lime"
            />
            <figcaption className="mt-4 text-xs text-ink/50">
              Muhammad Asim — portrait placeholder · replace in{" "}
              <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono">public/about/</code>
            </figcaption>
          </figure>
        </Reveal>

        <div>
          <Reveal>
            <SectionHeading
              index="04"
              label="About"
              title={
                <>
                  Good Design Is More Than Decoration.{" "}
                  <span className="marker">It’s Communication.</span>
                </>
              }
            />
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-8 text-lg leading-relaxed text-ink/75">
              I’m <strong className="font-semibold text-ink">Muhammad Asim</strong>, a graphic
              designer passionate about building distinctive visual identities and creative
              communication. I combine visual storytelling, typography, composition, and strategic
              thinking to create designs that help brands express their personality.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <blockquote className="mt-7 border-l-4 border-lime pl-6 font-display text-xl font-medium italic leading-snug text-ink/85">
              “Design is how a brand speaks before it says a word.”
            </blockquote>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-7 leading-relaxed text-ink/70">
              {settings.location}. I work with startups, studios, and established brands that care
              about craft — taking projects from first conversation to final, production-ready
              artwork.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="label text-ink/50">Specializations</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {specializations.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-ink/15 px-3 py-1.5 text-sm font-medium text-ink/80"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="label text-ink/50">Tools I Work In</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {tools.map((t) => (
                    <li
                      key={t}
                      className="rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-paper"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
