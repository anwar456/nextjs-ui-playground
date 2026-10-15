"use client";

import { useEffect, useState } from "react";
import { ArrowDown } from "./icons";

// Phone version of the hero's "get to know me" cue: a small pill pinned to the
// bottom of the screen while the hero is in view, fading away once the visitor
// has scrolled past it. (Larger screens use the cue built into the hero.)
export function ScrollCueMobile({ label }: { label: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;

    // Shown only while the hero's bottom edge is still in the lower part of the
    // screen; once the visitor has scrolled well into the hero, it goes away.
    let frame = 0;
    const update = () => {
      frame = 0;
      const bottom = hero.getBoundingClientRect().bottom;
      setVisible(bottom > window.innerHeight * 0.65);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center transition-all duration-300 md:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <a
        href="#about"
        tabIndex={visible ? 0 : -1}
        className={`group inline-flex items-center gap-2 rounded-full border border-line bg-bg/80 py-2 pl-4 pr-2 text-sm font-medium shadow-lg shadow-black/20 backdrop-blur transition-colors hover:border-accent ${
          visible ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {label}
        <span className="scroll-cue flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-fg transition-transform duration-300 group-hover:scale-110">
          <ArrowDown width={14} height={14} />
        </span>
      </a>
    </div>
  );
}
