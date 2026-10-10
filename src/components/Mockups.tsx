import Image from "next/image";

/** A poster application mockup: artwork framed on a dark "wall". */
export function PosterMockup({ src, title }: { src: string; title: string }) {
  return (
    <figure className="rounded-xl bg-ink p-6 sm:p-10">
      <div className="relative mx-auto aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-sm bg-white shadow-2xl">
        <Image
          src={src}
          alt={`${title} — poster application mockup`}
          fill
          sizes="260px"
          className="object-cover"
        />
      </div>
      <figcaption className="mt-5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-paper/50">
        Poster Application
      </figcaption>
    </figure>
  );
}

/** A business-card application mockup built from the project wordmark. */
export function CardMockup({ title }: { title: string }) {
  return (
    <figure className="flex flex-col rounded-xl border border-ink/10 bg-white p-6 sm:p-10">
      <div className="relative mx-auto flex aspect-[7/4] w-full max-w-[340px] items-center justify-center rounded-md bg-lime shadow-2xl">
        <span className="select-none font-display font-bold uppercase tracking-tight text-ink text-[clamp(1.5rem,3vw,2.3rem)]">
          {title}
        </span>
      </div>
      <figcaption className="mt-5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
        Business Card Application
      </figcaption>
    </figure>
  );
}
