import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { SiteConfig } from "@/lib/content";

const collage = [
  {
    src: "/work/noir-cover.jpg",
    alt: "NOIR — premium fashion brand identity concept artwork",
    tag: "Brand Identity",
    frame: "w-[56%] right-0 top-0 rotate-2 z-10",
    inner: "aspect-[3/4]",
    floatDelay: "-1s",
    floatDuration: "7s",
  },
  {
    src: "/work/culture-cover.jpg",
    alt: "CULTURE — music festival poster concept artwork",
    tag: "Poster Design",
    frame: "w-[46%] left-0 top-[15%] -rotate-3 z-20",
    inner: "aspect-[3/4]",
    floatDelay: "-3s",
    floatDuration: "8s",
  },
  {
    src: "/work/fuellab-cover.jpg",
    alt: "FUEL LAB — energy drink packaging concept artwork",
    tag: "Packaging",
    frame: "w-[44%] right-[4%] bottom-[11%] rotate-1 z-30",
    inner: "aspect-square",
    floatDelay: "-5s",
    floatDuration: "6.5s",
  },
  {
    src: "/work/socialkit-cover.jpg",
    alt: "SOCIAL KIT — social media campaign concept artwork",
    tag: "Social Campaign",
    frame: "w-[36%] left-[9%] bottom-0 -rotate-2 z-0",
    inner: "aspect-[4/5]",
    floatDelay: "-2s",
    floatDuration: "7.5s",
  },
];

function RotatingBadge() {
  return (
    <div className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2">
      <svg
        viewBox="0 0 100 100"
        className="h-24 w-24 animate-spin-slow drop-shadow-lg sm:h-28 sm:w-28"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="50" fill="#D7FF64" />
        <defs>
          <path
            id="badge-circle"
            d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
          />
        </defs>
        <text
          fontSize="7.6"
          letterSpacing="1.1"
          fill="#111111"
          fontFamily="inherit"
          fontWeight="600"
        >
          <textPath href="#badge-circle">
            GRAPHIC DESIGN • BRANDING • PACKAGING • POSTERS •
          </textPath>
        </text>
        <text
          x="50"
          y="56"
          textAnchor="middle"
          fontSize="17"
          fontWeight="700"
          fill="#111111"
          fontFamily="inherit"
        >
          A®
        </text>
      </svg>
    </div>
  );
}

export default function Hero({ settings }: { settings: SiteConfig }) {
  return (
    <section id="home" className="relative overflow-hidden pt-10 lg:pt-16">
      <div className="container-slim grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Copy */}
        <div className="max-w-2xl">
          <p
            className="label hero-in flex items-center gap-2.5 text-ink/60"
            style={{ animationDelay: "0ms" }}
          >
            <span className="inline-block h-2 w-2 rounded-full bg-lime" />
            Independent Graphic Designer — {settings.name}
          </p>

          <h1
            className="hero-in mt-6 font-display text-[clamp(2.7rem,6.2vw,5.4rem)] font-bold leading-[1.02] tracking-[-0.03em]"
            style={{ animationDelay: "90ms" }}
          >
            Designs That Make Brands{" "}
            <span className="marker">Impossible to Ignore.</span>
          </h1>

          <p
            className="hero-in mt-6 max-w-lg text-lg leading-relaxed text-ink/70"
            style={{ animationDelay: "180ms" }}
          >
            {settings.heroDescription}
          </p>

          <div
            className="hero-in mt-9 flex flex-wrap gap-3"
            style={{ animationDelay: "270ms" }}
          >
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-display font-semibold text-paper transition-colors hover:bg-lime hover:text-ink"
            >
              Explore My Work
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 font-display font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              Let’s Discuss a Project
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <p
            className="hero-in mt-7 flex items-center gap-2.5 text-sm text-ink/60"
            style={{ animationDelay: "360ms" }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
            </span>
            {settings.availability}
          </p>
        </div>

        {/* Artwork collage */}
        <div
          className="hero-in relative mx-auto w-full max-w-lg"
          style={{ animationDelay: "200ms" }}
        >
          <div className="relative aspect-[4/5]">
            {collage.map((card) => (
              <div
                key={card.src}
                className={`absolute ${card.frame} rounded-md border border-ink/10 bg-white p-2 shadow-xl`}
              >
                <figure
                  className={`relative w-full overflow-hidden rounded-sm ${card.inner} animate-float`}
                  style={{
                    animationDelay: card.floatDelay,
                    animationDuration: card.floatDuration,
                  }}
                >
                  <Image
                    src={card.src}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 1024px) 60vw, 30vw"
                    className="object-cover"
                  />
                </figure>
                <figcaption className="absolute -bottom-2.5 left-2.5 rounded-full bg-lime px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink shadow">
                  {card.tag}
                </figcaption>
              </div>
            ))}
            <RotatingBadge />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="container-slim hero-in mt-16 flex items-center gap-3 pb-10" style={{ animationDelay: "480ms" }}>
        <span className="label text-ink/50">Scroll</span>
        <span className="relative h-9 w-px overflow-hidden bg-ink/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-line bg-ink" />
        </span>
      </div>
    </section>
  );
}
