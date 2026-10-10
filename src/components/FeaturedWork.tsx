import type { Project } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

/** Art-directed grid spans (12-column grid on large screens). */
const spans: Record<string, string> = {
  noir: "md:col-span-6 lg:col-span-7",
  "fuel-lab": "md:col-span-6 lg:col-span-5",
  culture: "md:col-span-6 lg:col-span-5",
  form: "md:col-span-6 lg:col-span-7",
  nova: "lg:col-span-12",
  mono: "md:col-span-6 lg:col-span-4",
  urban: "md:col-span-6 lg:col-span-4",
  "social-kit": "md:col-span-6 lg:col-span-4",
  prime: "md:col-span-6 lg:col-span-6",
  abstract: "md:col-span-6 lg:col-span-6",
};

const aspects: Record<string, string> = {
  noir: "aspect-[4/3]",
  "fuel-lab": "aspect-[4/3]",
  culture: "aspect-[4/3]",
  form: "aspect-[4/3]",
  nova: "aspect-[21/9]",
  mono: "aspect-square",
  urban: "aspect-square",
  "social-kit": "aspect-square",
  prime: "aspect-[4/3]",
  abstract: "aspect-[4/3]",
};

export default function FeaturedWork({ projects }: { projects: Project[] }) {
  return (
    <section id="work" className="grain bg-ink py-24 text-paper lg:py-32">
      <div className="container-slim">
        <Reveal>
          <SectionHeading
            dark
            index="01"
            label="Selected Work"
            title={
              <>
                Work With a <span className="marker">Point of View.</span>
              </>
            }
            description="Concept projects across identity, packaging, print, and digital — each one labeled honestly as concept work. Click any project for the full case study."
          />
        </Reveal>
        <p className="mt-4 text-xs text-paper/40">
          All projects are self-initiated concept work unless marked otherwise — manage them in the{" "}
          <a href="/admin/projects" className="underline underline-offset-2">
            admin dashboard
          </a>
          .
        </p>

        <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-12">
          {projects.map((project, i) => (
            <Reveal
              key={project.slug}
              delay={(i % 3) * 90}
              className={`col-span-12 ${spans[project.slug]}`}
            >
              <ProjectCard project={project} aspect={aspects[project.slug]} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-16 flex justify-center">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full border border-paper/20 px-6 py-3.5 font-display font-semibold text-paper transition-colors hover:bg-lime hover:text-ink hover:border-lime"
            >
              Have a project in mind? Let’s talk
              <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
