import type { Dict } from "@/content";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function About({ about }: { about: Dict["about"] }) {
  return (
    <Section id="about" eyebrow={about.eyebrow} title={about.title}>
      <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
        {about.paragraphs.map((p, i) => (
          <Reveal key={i} variant="left" delay={i * 120}>
            <p>{p}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
