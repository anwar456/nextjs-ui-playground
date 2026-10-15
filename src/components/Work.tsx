import type { Dict } from "@/content";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { ProjectCard } from "./ProjectCard";

export function Work({ work }: { work: Dict["work"] }) {
  return (
    <Section id="work" eyebrow={work.eyebrow} title={work.title} intro={work.intro}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {work.items.map((item, i) => (
          <Reveal key={item.name} delay={(i % 3) * 120}>
            <ProjectCard item={item} labels={work.labels} repoSoon={work.repoSoon} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
