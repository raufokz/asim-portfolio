import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  aspect: string;
};

export default function ProjectCard({ project, aspect }: ProjectCardProps) {
  return (
    <Link href={`/work/${project.slug}`} className="group block h-full">
      <figure
        className={`relative w-full overflow-hidden rounded-md bg-paper/5 ${aspect}`}
      >
        <Image
          src={project.cover}
          alt={`${project.title} — ${project.category} concept artwork`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 45vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        {project.isConcept && (
          <span className="absolute left-3 top-3 rounded-full bg-lime px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
            Concept
          </span>
        )}
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </figure>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-bold tracking-tight">
            {project.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-paper/60">
            {project.description}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="label text-paper/50">{project.category}</p>
          <p className="mt-1 text-sm text-paper/50">{project.year}</p>
        </div>
      </div>
    </Link>
  );
}
