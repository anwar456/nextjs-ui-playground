import type { Dict, Locale } from "@/content";
import { locales } from "@/content";
import { LangSwitch } from "./LangSwitch";
import { DesktopNav, MobileNav } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ lang, nav }: { lang: Locale; nav: Dict["nav"] }) {
  const links = [
    { href: "#about", label: nav.about },
    { href: "#skills", label: nav.skills },
    { href: "#experience", label: nav.experience },
    { href: "#work", label: nav.work },
    { href: "#contact", label: nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <a href="#top" className="font-semibold tracking-tight">
          Anwar<span className="text-accent">.</span>
        </a>

        <DesktopNav links={links} />

        <div className="flex items-center gap-3">
          <LangSwitch lang={lang} locales={locales} />

          <ThemeToggle label={nav.theme} />

          <MobileNav links={links} label={nav.menu} />
        </div>
      </div>
    </header>
  );
}
