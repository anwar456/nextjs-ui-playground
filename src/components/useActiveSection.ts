"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CLICK_LOCK_MS = 1000;

// Which section the visitor is on, for highlighting the menu. Follows scrolling
// (a section counts once it crosses a thin band near the middle of the screen)
// and also reacts instantly to a menu click, holding that choice while the page
// smooth-scrolls so the highlight doesn't flicker through the sections in between.
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const lockedUntil = useRef(0);
  const key = ids.join(",");

  useEffect(() => {
    const list = key.split(",");
    const watched = ["top", ...list];
    const inBand = new Set<string>();

    const update = () => {
      if (Date.now() < lockedUntil.current) return;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setActive(list[list.length - 1]);
        return;
      }
      const current = list.find((id) => inBand.has(id));
      if (current) setActive(current);
      else if (inBand.has("top")) setActive(null);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }
        update();
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of watched) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    const onScroll = () => {
      if (Date.now() >= lockedUntil.current) update();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [key]);

  const select = useCallback((id: string) => {
    lockedUntil.current = Date.now() + CLICK_LOCK_MS;
    setActive(id);
  }, []);

  return { active, select };
}
