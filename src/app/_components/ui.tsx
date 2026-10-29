import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-lg border border-line bg-bg px-3 py-2 font-mono text-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent";

export const buttonClass =
  "rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export const secondaryButtonClass =
  "rounded-lg border border-line bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-muted">{label}</span>
      {children}
    </label>
  );
}

export function Playground({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-card p-4 md:p-6">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

export function Output({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-sm text-muted">{label}</p>
      <pre className="max-h-72 overflow-auto rounded-lg border border-line bg-bg p-3 font-mono text-xs whitespace-pre-wrap break-all">
        {children}
      </pre>
    </div>
  );
}

export function ErrorMessage({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="text-sm text-bad">
      {children}
    </p>
  );
}
