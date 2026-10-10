import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getBeforeAfterForProject, getProjects } from "@/lib/content";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { CardMockup, PosterMockup } from "@/components/Mockups";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// New projects added in the admin dashboard appear within 60s (ISR).
export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Concept Case Study`,
    description: project.description,
    openGraph: {
      title: `${project.title} — ${project.category}`,
      description: project.description,
      images: [project.cover],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const comparison = await getBeforeAfterForProject(project.slug);

  return (
    <main className="bg-paper pb-24 pt-28 lg:pt-36">
      <div className="container-slim">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-ink/55">
          <Link href="/#work" className="transition-colors hover:text-ink hover:underline">
            Work
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink">{project.title}</span>
        </nav>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-ink px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-paper">
              {project.category}
            </span>
            <span className="rounded-full border border-ink/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink/60">
              {project.year}
            </span>
            {project.isConcept && (
              <span className="rounded-full bg-lime px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink">
                Concept Project
              </span>
            )}
          </div>
          <h1 className="mt-6 font-display text-[clamp(2.6rem,6vw,5rem)] font-bold leading-[1] tracking-[-0.03em]">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">
            {project.description}
          </p>
        </header>

        <figure className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-xl bg-ink/5">
          <Image
            src={project.cover}
            alt={`${project.title} — hero artwork`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </figure>

        <div className="mt-14 grid gap-14 lg:grid-cols-[320px_1fr] lg:gap-16">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <dl className="space-y-8">
              <div>
                <dt className="label text-ink/50">Client</dt>
                <dd className="mt-2 font-semibold">{project.client}</dd>
              </div>
              <div>
                <dt className="label text-ink/50">Year</dt>
                <dd className="mt-2 font-semibold">{project.year}</dd>
              </div>
              <div>
                <dt className="label text-ink/50">Services</dt>
                <dd className="mt-2">
                  <ul className="space-y-1.5">
                    {project.services.map((s) => (
                      <li key={s} className="text-sm text-ink/75">
                        {s}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="label text-ink/50">Color Palette</dt>
                <dd className="mt-3 flex flex-wrap gap-3">
                  {project.palette.map((c) => (
                    <span key={c.hex} className="flex flex-col items-center gap-1.5">
                      <span
                        className="h-10 w-10 rounded-full border border-ink/10"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.name} ${c.hex}`}
                      />
                      <span className="font-mono text-[10px] text-ink/55">{c.hex}</span>
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="label text-ink/50">Typography</dt>
                <dd className="mt-2 space-y-3">
                  {project.fonts.map((f) => (
                    <p key={f.name}>
                      <span className="block font-display font-bold">{f.name}</span>
                      <span className="text-xs text-ink/55">{f.role}</span>
                    </p>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>

          {/* Body */}
          <div className="space-y-14">
            <section>
              <h2 className="label text-ink/50">(01) — Overview</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink/80">{project.overview}</p>
            </section>

            <section>
              <h2 className="label text-ink/50">(02) — The Brief</h2>
              <blockquote className="mt-4 border-l-4 border-lime pl-6 font-display text-xl font-medium leading-snug text-ink/85">
                {project.brief}
              </blockquote>
            </section>

            <section>
              <h2 className="label text-ink/50">(03) — The Challenge</h2>
              <p className="mt-4 leading-relaxed text-ink/80">{project.challenge}</p>
            </section>

            <section>
              <h2 className="label text-ink/50">(04) — The Approach</h2>
              <p className="mt-4 leading-relaxed text-ink/80">{project.approach}</p>
            </section>

            <section>
              <h2 className="label text-ink/50">(05) — Process</h2>
              <ol className="mt-4 space-y-3">
                {project.process.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="shrink-0 font-display text-sm font-bold text-ink/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-ink/80">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="label text-ink/50">(06) — Applications</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <PosterMockup src={project.cover} title={project.title} />
                <CardMockup title={project.title} />
              </div>
            </section>

            {comparison && (
              <section>
                <h2 className="label text-ink/50">(07) — Before &amp; After</h2>
                <p className="mt-4 text-sm text-ink/60">
                  {comparison.description} — illustrative concept comparison, not client work.
                </p>
                <div className="mt-4">
                  <BeforeAfterSlider item={comparison} />
                </div>
              </section>
            )}

            <section>
              <Link
                href={`/work/${next.slug}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-ink/12 bg-white p-6 transition-colors hover:bg-ink hover:text-paper"
              >
                <span>
                  <span className="label text-ink/50 group-hover:text-paper/60">
                    Next Project
                  </span>
                  <span className="mt-2 block font-display text-2xl font-bold">
                    {next.title}
                  </span>
                  <span className="mt-1 block text-sm text-ink/60 group-hover:text-paper/60">
                    {next.category} · {next.year}
                  </span>
                </span>
                <ArrowRight
                  className="h-8 w-8 shrink-0 transition-transform group-hover:translate-x-2"
                  aria-hidden="true"
                />
              </Link>
            </section>

            <section className="rounded-xl bg-lime p-8 text-ink">
              <h2 className="font-display text-2xl font-bold">Have a project in mind?</h2>
              <p className="mt-2 text-ink/75">
                Every brand has a story — let’s design the way the world sees it.
              </p>
              <a
                href="/#contact"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-display font-semibold text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                Start a Project
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
