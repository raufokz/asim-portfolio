import Link from "next/link";
import BackToTop from "@/components/BackToTop";
import { site } from "@/data/site";
import type { SiteConfig } from "@/lib/content";

export default function Footer({ settings }: { settings: SiteConfig }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-paper/10 bg-ink text-paper">
      <div className="container-slim py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="font-display text-[clamp(3rem,7vw,5.5rem)] font-bold leading-none tracking-[-0.03em]">
              ASIM<sup className="text-[0.4em] text-lime">®</sup>
            </p>
            <p className="mt-5 max-w-sm leading-relaxed text-paper/60">{settings.tagline}</p>
          </div>

          <nav aria-label="Footer">
            <p className="label text-paper/50">Menu</p>
            <ul className="mt-4 space-y-2.5">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-paper/75 transition-colors hover:text-lime"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label text-paper/50">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-paper/75 transition-colors hover:text-lime"
                >
                  {settings.email}
                </a>
              </li>
              {settings.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    className="text-paper/75 transition-colors hover:text-lime"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-paper/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-paper/50">
            © {year} {settings.name}. All rights reserved.
          </p>
          <p className="text-sm text-paper/50">
            Concept portfolio — projects & testimonials are labeled placeholders.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
