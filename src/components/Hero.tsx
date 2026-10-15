import Image from "next/image";
import type { CSSProperties } from "react";
import type { Dict } from "@/content";
import { site } from "@/content/site";
import { HeroName } from "./HeroName";
import { Highlights } from "./Highlights";
import { ProfileTilt } from "./ProfileTilt";
import { ScrollCueMobile } from "./ScrollCueMobile";
import { ArrowDown, Download } from "./icons";
import { Typewriter } from "./Typewriter";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

// Fills the first screen (viewport minus the 3.5rem sticky header) so the
// intro and the stats are all that shows until the visitor scrolls.
export function Hero({
  hero,
  highlights,
}: {
  hero: Dict["hero"];
  highlights: Dict["highlights"];
}) {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col justify-center overflow-x-clip"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-[-8rem] h-96 w-96 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute -bottom-32 left-[-6rem] h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-6 md:pb-32 md:pt-16">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-14">
          <div className="hero-in w-fit shrink-0 md:order-2" style={step(1)}>
            <ProfileTilt name={hero.name}>
              <Image
                src={site.photo}
                alt={site.name}
                width={640}
                height={640}
                priority
                draggable={false}
                className="block h-24 w-24 object-cover sm:h-40 sm:w-40 md:h-72 md:w-72"
              />
            </ProfileTilt>
          </div>

          <div className="min-w-0">
            <p
              className="hero-in inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs text-muted"
              style={step(0)}
            >
              <span className="status-dot h-2 w-2 rounded-full bg-green-500" />
              {hero.status}
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:mt-8 md:text-7xl">
              <HeroName name={hero.name} />
            </h1>

            <p
              className="hero-in mt-4 text-2xl font-medium text-accent sm:text-3xl"
              style={step(2)}
            >
              <Typewriter roles={hero.roles} />
            </p>

            <p
              className="hero-in mt-4 max-w-2xl text-base leading-relaxed text-muted md:mt-6 md:text-lg"
              style={step(3)}
            >
              {hero.intro}
            </p>

            <div className="hero-in mt-6 flex flex-wrap items-center gap-3 md:mt-10" style={step(4)}>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5"
              >
                {hero.ctaContact}
                <ArrowDown />
              </a>
              {site.cvPath && (
                <a
                  href={site.cvPath}
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent"
                >
                  <Download />
                  {hero.ctaCv}
                </a>
              )}
            </div>

            <div className="hero-in mt-6 md:mt-10" style={step(5)}>
              <Highlights items={highlights} />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-5 flex justify-center max-md:hidden">
        <a
          href="#about"
          className="group flex flex-col items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
            {hero.scroll}
          </span>
          <span className="scroll-cue flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card transition-all duration-300 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg group-hover:shadow-lg group-hover:shadow-accent/30">
            <ArrowDown />
          </span>
        </a>
      </div>

      <ScrollCueMobile label={hero.scroll} />
    </section>
  );
}
