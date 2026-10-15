import type { Dict } from "@/content";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { TechIcon } from "./TechIcon";

const card = "h-full rounded-2xl border border-line bg-card/70 p-5 backdrop-blur-sm md:p-6";

export function Skills({ skills }: { skills: Dict["skills"] }) {
  return (
    <Section id="skills" eyebrow={skills.eyebrow} title={skills.title}>
      <Reveal variant="fade">
        <p className="mb-6 flex flex-wrap gap-3 text-sm font-medium">
          <span className="rounded-lg border border-accent/70 bg-accent/20 px-4 py-1.5 text-fg">
            {skills.legendExpert}
          </span>
          <span className="rounded-lg border border-muted/40 bg-card px-4 py-1.5 text-muted">
            {skills.legendWorking}
          </span>
        </p>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        {skills.groups.map((group, i) => (
          <Reveal key={group.name} delay={(i % 2) * 120} className="h-full">
            <div className={card}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold tracking-tight">{group.name}</h3>
                <span className="font-mono text-xs text-muted">{group.items.length}</span>
              </div>

              <Reveal variant="scale" items="li" delay={150}>
                <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className={`flex flex-col items-center gap-2.5 rounded-xl border px-2 py-4 text-center text-xs leading-tight ${
                        item.level === "expert"
                          ? "border-accent/70 bg-accent/20 font-medium text-fg"
                          : "border-muted/40 bg-card text-muted"
                      }`}
                    >
                      <TechIcon name={item.name} className="h-7 w-7" />
                      {item.name}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {(
          [
            [skills.softTitle, skills.soft],
            [skills.languagesTitle, skills.languages],
          ] as const
        ).map(([title, list], i) => (
          <Reveal key={title} variant={i === 0 ? "left" : "right"} className="h-full">
            <div className={card}>
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {list.map((text) => (
                  <li
                    key={text}
                    className="rounded-full border border-line bg-bg/40 px-3 py-1 text-sm"
                  >
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
