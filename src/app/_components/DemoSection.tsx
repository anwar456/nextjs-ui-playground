import type { ReactNode } from "react";

// One exercise on the playground page: number, title and tags, the
// short brief, then whatever demo / test harness goes inside.
export function DemoSection({
  number,
  title,
  tags,
  brief,
  children,
}: {
  number: number;
  title: string;
  tags: string;
  brief: string;
  children: ReactNode;
}) {
  const headingId = `demo-${number}-title`;

  return (
    <section
      id={`demo-${number}`}
      aria-labelledby={headingId}
      className="scroll-mt-20 border-t border-line py-12 first:border-t-0"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        {tags}
      </p>
      <h2 id={headingId} className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
        {number}. {title}
      </h2>
      <p className="mt-3 max-w-3xl text-muted">{brief}</p>
      <div className="mt-8 space-y-6">{children}</div>
    </section>
  );
}

export function Pending() {
  return (
    <p className="rounded-xl border border-dashed border-line p-6 text-sm text-muted">
      Not implemented yet.
    </p>
  );
}
