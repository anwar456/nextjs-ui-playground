"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { animate, utils } from "animejs";
import type { Locale } from "@/content";

// EN / ID switch. On click the pill slides to the chosen language right away
// and only then does the page change, so the motion starts on the tap instead
// of after the new page has loaded. The new page puts the pill straight at its
// final spot, so nothing jumps.
export function LangSwitch({ lang, locales }: { lang: Locale; locales: readonly Locale[] }) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  // The language we are sliding towards while the page is still changing.
  const [pending, setPending] = useState<Locale | null>(null);
  const [seen, setSeen] = useState(lang);
  if (seen !== lang) {
    setSeen(lang); // the page changed language: stop showing the pending one
    setPending(null);
  }
  const shown = pending ?? lang;

  useEffect(() => {
    busy.current = false;
    const wrap = wrapRef.current;
    const pill = pillRef.current;
    const target = wrap?.querySelector<HTMLElement>(`a[hreflang="${lang}"]`);
    if (!wrap || !pill || !target) return;
    utils.set(pill, { x: target.offsetLeft, width: target.offsetWidth, opacity: 1 });
    wrap.dataset.ready = "true";
  }, [lang]);

  const choose = (e: React.MouseEvent<HTMLAnchorElement>, l: Locale) => {
    const plain = !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0);
    if (!plain || l === lang) return; // let the browser handle new-tab clicks, etc.
    e.preventDefault();
    if (busy.current) return;

    const pill = pillRef.current;
    const target = wrapRef.current?.querySelector<HTMLElement>(`a[hreflang="${l}"]`);
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!pill || !target || instant) {
      router.push(`/${l}`);
      return;
    }

    busy.current = true;
    setPending(l);
    router.prefetch(`/${l}`);
    animate(pill, {
      x: target.offsetLeft,
      width: target.offsetWidth,
      duration: 380,
      ease: "outExpo",
      onComplete: () => router.push(`/${l}`),
    });
  };

  return (
    <div
      ref={wrapRef}
      role="group"
      aria-label="Language"
      className="group/lang relative flex rounded-full border border-line p-0.5 font-mono text-xs"
    >
      <span
        ref={pillRef}
        aria-hidden
        className="absolute bottom-0.5 left-0.5 top-0.5 rounded-full bg-accent opacity-0 shadow-md shadow-accent/30"
      />
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}`}
          hrefLang={l}
          aria-current={l === lang ? "true" : undefined}
          onClick={(e) => choose(e, l)}
          className={`relative rounded-full px-2.5 py-1 uppercase transition-colors duration-300 active:scale-90 aria-current:bg-accent group-data-[ready=true]/lang:aria-current:bg-transparent ${
            l === shown ? "text-accent-fg" : "text-muted hover:text-fg"
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
