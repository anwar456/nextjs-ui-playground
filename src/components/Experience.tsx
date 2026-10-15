import type { Dict } from "@/content";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Experience({ experience }: { experience: Dict["experience"] }) {
  return (
    <Section id="experience" eyebrow={experience.eyebrow} title={experience.title}>
      <Reveal variant="fade">
        <p className="mb-8 text-muted">
          <span className="font-medium text-fg">{experience.company}</span>
          {" · "}
          {experience.location}
        </p>
      </Reveal>

      <ol className="relative space-y-6 pl-8">
        <Reveal
          variant="grow"
          className="absolute bottom-0 left-0 top-0 w-px bg-line"
        />
        {experience.roles.map((role, i) => (
          <li key={role.title} className="relative">
            <Reveal
              variant="scale"
              delay={200}
              className="absolute -left-[2.45rem] top-7 md:top-8"
            >
              <span
                aria-hidden
                className={`block h-3 w-3 rounded-full border-2 border-accent ${
                  i === 0 ? "bg-accent" : "bg-bg"
                }`}
              />
            </Reveal>

            <Reveal variant="left">
              <div
                className={`rounded-2xl border bg-card/70 p-5 backdrop-blur-sm transition-colors hover:border-accent/60 md:p-6 ${
                  i === 0 ? "border-accent/40" : "border-line"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-lg font-semibold tracking-tight">{role.title}</h3>
                  <p className="font-mono text-xs text-muted">{role.period}</p>
                </div>

                <Reveal variant="left" items="li" delay={150}>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
                    {role.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
