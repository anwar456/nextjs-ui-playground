import type { ReactNode } from "react";
import { SectionHeading } from "./SectionHeading";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="section-blob section-blob-1" />
        <div className="section-blob section-blob-2" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
        <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
        <div className="mt-10 md:mt-12">{children}</div>
      </div>
    </section>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-line bg-card px-2 py-1 font-mono text-xs text-muted">
      {children}
    </span>
  );
}
