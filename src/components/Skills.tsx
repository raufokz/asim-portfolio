import { skillCategories, tools } from "@/data/skills";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export default function Skills() {
  return (
    <section className="bg-paper py-24 lg:py-32">
      <div className="container-slim">
        <Reveal>
          <SectionHeading
            index="06"
            label="Software & Skills"
            title={
              <>
                Tools of the <span className="marker">Trade.</span>
              </>
            }
            description="The software I reach for and the disciplines I practice. Lists are editable in src/data/skills.ts — no invented proficiency scores."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[5fr_7fr]">
          <Reveal>
            <div className="flex h-full flex-col rounded-xl border border-ink/10 bg-white p-8">
              <h3 className="label text-ink/50">Software</h3>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {tools.map((tool) => (
                  <li
                    key={tool.name}
                    className="group rounded-full border border-ink/15 px-4 py-2.5 transition-colors hover:border-ink hover:bg-ink"
                    title={tool.note}
                  >
                    <span className="font-display font-semibold text-ink transition-colors group-hover:text-paper">
                      {tool.name}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-8 text-sm leading-relaxed text-ink/55">
                …and whatever else a project demands. The tool matters far less than the idea
                it serves.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {skillCategories.map((category, i) => (
              <Reveal key={category.title} delay={(i % 2) * 80}>
                <div className="h-full rounded-xl border border-ink/10 bg-white p-6 transition-colors hover:border-ink/25">
                  <h3 className="font-display text-lg font-bold">{category.title}</h3>
                  <ul className="mt-4 space-y-2">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-ink/70">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lime" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
