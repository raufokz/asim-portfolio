import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FeaturedWork from "@/components/FeaturedWork";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import Services from "@/components/Services";
import About from "@/components/About";
import Process from "@/components/Process";
import Skills from "@/components/Skills";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import {
  getBeforeAfter,
  getProjects,
  getServices,
  getSiteSettings,
  getTestimonials,
} from "@/lib/content";

// ISR: content is cached for 60s, so admin dashboard changes appear quickly.
export const revalidate = 60;

export default async function Home() {
  const [projects, services, beforeAfter, testimonials, settings] = await Promise.all([
    getProjects(),
    getServices(),
    getBeforeAfter(),
    getTestimonials(),
    getSiteSettings(),
  ]);

  return (
    <main>
      <Hero settings={settings} />
      <Marquee />
      <FeaturedWork projects={projects} />
      <BeforeAfterSection items={beforeAfter} />
      <Services services={services} />
      <About settings={settings} />
      <Process />
      <Skills />
      <Testimonials testimonials={testimonials} />
      <Contact settings={settings} services={services} />
    </main>
  );
}
