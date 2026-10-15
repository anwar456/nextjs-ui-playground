"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger, utils } from "animejs";
import { useActiveSection } from "./useActiveSection";

type NavLink = { href: string; label: string };

const idOf = (href: string) => href.slice(1);

// Desktop menu. A pill slides under whichever section is current.
export function DesktopNav({ links }: { links: NavLink[] }) {
  const { active, select } = useActiveSection(links.map((l) => idOf(l.href)));
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  useEffect(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const link = active ? nav.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
    if (!link) {
      placed.current = false;
      animate(pill, { opacity: 0, duration: instant ? 0 : 250, ease: "outQuad" });
      return;
    }

    const to = { x: link.offsetLeft, width: link.offsetWidth };
    if (!placed.current) {
      // First time it shows: jump into place, then fade in.
      utils.set(pill, to);
      animate(pill, { opacity: 1, duration: instant ? 0 : 300, ease: "outQuad" });
      placed.current = true;
    } else {
      animate(pill, { ...to, opacity: 1, duration: instant ? 0 : 550, ease: "outExpo" });
    }

    // Keep the pill on its link if the menu changes size (window resize).
    let initial = true; // the observer reports once on start; skip it so the slide isn't cut short
    const observer = new ResizeObserver(() => {
      if (initial) {
        initial = false;
        return;
      }
      utils.set(pill, { x: link.offsetLeft, width: link.offsetWidth });
    });
    observer.observe(nav);
    return () => observer.disconnect();
  }, [active]);

  return (
    <nav ref={navRef} className="relative hidden items-center text-sm md:flex">
      <span
        ref={pillRef}
        aria-hidden
        className="absolute inset-y-0 left-0 rounded-full border border-accent/30 bg-accent-soft opacity-0"
      />
      {links.map((l) => {
        const isActive = active === idOf(l.href);
        return (
          <a
            key={l.href}
            href={l.href}
            onClick={() => select(idOf(l.href))}
            aria-current={isActive ? "true" : undefined}
            className={`relative rounded-full px-4 py-1.5 transition-colors duration-300 ${
              isActive ? "font-medium text-fg" : "text-muted hover:text-fg"
            }`}
          >
            {l.label}
          </a>
        );
      })}
    </nav>
  );
}

// Mobile menu. The panel pops out of the hamburger button like a bubble
// (grows from the top-right corner with a little overshoot), its links drop in
// one by one, and it shrinks back on close. Same highlighting as the desktop menu.
export function MobileNav({ links, label }: { links: NavLink[]; label: string }) {
  const { active, select } = useActiveSection(links.map((l) => idOf(l.href)));
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const first = useRef(true);
  const closing = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const icon = iconRef.current;
    if (!panel || !icon) return;
    if (first.current) {
      first.current = false;
      return;
    }
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = (n: number) => (instant ? 0 : n);
    const items = Array.from(panel.querySelectorAll<HTMLElement>("a"));

    animate(icon, { rotate: [open ? -90 : 90, 0], duration: ms(450), ease: "outBack" });

    if (open) {
      closing.current?.pause(); // reopened before the close finished
      panel.style.display = "block";
      animate(panel, {
        scale: [0.2, 1],
        opacity: [0, 1],
        duration: ms(600),
        ease: "outBack(2)",
      });
      animate(items, {
        opacity: [0, 1],
        y: [-10, 0],
        duration: ms(450),
        delay: stagger(55, { start: ms(160) }),
        ease: "outExpo",
      });
    } else {
      closing.current = animate(panel, {
        scale: 0.6,
        opacity: 0,
        duration: ms(200),
        ease: "inQuad",
        onComplete: () => {
          panel.style.display = "none";
        },
      });
    }
  }, [open]);

  // Close when tapping elsewhere or pressing Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line"
      >
        <svg
          ref={iconRef}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d={open ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} />
        </svg>
      </button>

      <nav
        ref={panelRef}
        id="mobile-menu"
        style={{ display: "none" }}
        className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-line bg-card p-2 shadow-lg shadow-accent/10"
      >
        {links.map((l) => {
          const isActive = active === idOf(l.href);
          return (
            <a
              key={l.href}
              href={l.href}
              onClick={() => {
                select(idOf(l.href));
                setOpen(false);
              }}
              aria-current={isActive ? "true" : undefined}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-accent-soft font-medium text-fg"
                  : "text-muted hover:bg-accent-soft hover:text-fg"
              }`}
            >
              {l.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
