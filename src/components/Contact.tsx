import type { Dict } from "@/content";
import { site } from "@/content/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { Github, Linkedin, Mail } from "./icons";

const secondary =
  "inline-flex items-center gap-2 rounded-full border border-line bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent";

export function Contact({ contact }: { contact: Dict["contact"] }) {
  return (
    <Section id="contact" eyebrow={contact.eyebrow} title={contact.title}>
      <Reveal>
        <p className="max-w-2xl text-lg leading-relaxed text-muted">{contact.body}</p>
      </Reveal>
      <Reveal
        variant="scale"
        items="a"
        delay={150}
        className="mt-8 flex flex-wrap items-center gap-3"
      >
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5"
          >
            <Mail />
            {contact.emailCta}
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={secondary}>
            <Linkedin />
            LinkedIn
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className={secondary}>
            <Github />
            GitHub
          </a>
      </Reveal>
      <Reveal variant="fade" delay={400}>
        <p className="mt-6 font-mono text-sm text-muted">{site.email}</p>
      </Reveal>
    </Section>
  );
}
