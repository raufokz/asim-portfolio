import { processSteps } from "@/data/process";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export default function Process() {
  return (
    <section className="grain bg-ink py-24 text-paper lg:py-32">
      <div className="container-slim">
        <Reveal>
          <SectionHeading
            dark
            index="05"
            label="Creative Process"
            title={
              <>
                From First Sketch to <span className="marker">Final File.</span>
              </>
            }
            description="A simple, transparent process — you always know what happens next, and what you’ll receive at the end."
          />
        </Reveal>

        <ol className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <Reveal key={step.id} delay={i * 100} className="h-full">
              <li className="h-full border-t border-paper/15 pt-7">
                <span className="font-display text-5xl font-bold text-lime">
                  {step.id}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/60">
                  {step.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
