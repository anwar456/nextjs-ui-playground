import { Reveal } from "./Reveal";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Reveal
        variant="fade"
        className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-8 text-sm text-muted"
      >
        <p>© {new Date().getFullYear()} Anwar</p>
      </Reveal>
    </footer>
  );
}
