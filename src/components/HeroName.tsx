"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

// The name, letter by letter. Letters start hidden in CSS (.hero-char) and
// anime.js floats them in one after another; if JS never runs, CSS reveals
// them after a moment so the name is never lost.
export function HeroName({ name }: { name: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const chars = ref.current?.querySelectorAll<HTMLElement>(".hero-char");
    if (!chars?.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animation = animate(chars, {
      opacity: [0, 1],
      y: [36, 0],
      duration: 1000,
      delay: stagger(90, { start: 150 }),
      ease: "outExpo",
    });
    return () => {
      animation.revert();
    };
  }, []);

  return (
    <span ref={ref} aria-label={name}>
      {[...name].map((c, i) => (
        <span key={i} aria-hidden className="hero-char">
          {c}
        </span>
      ))}
      <span aria-hidden className="hero-char text-accent">
        .
      </span>
    </span>
  );
}
