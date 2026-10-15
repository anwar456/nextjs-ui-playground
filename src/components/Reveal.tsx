"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, stagger } from "animejs";

type Variant = "up" | "left" | "right" | "scale" | "grow" | "fade";

const FROM: Record<Variant, Record<string, number[]>> = {
  up: { y: [36, 0] },
  left: { x: [-44, 0] },
  right: { x: [44, 0] },
  scale: { scale: [0.82, 1] },
  grow: { scaleY: [0, 1] },
  fade: {},
};

// Animates its content in with anime.js when it scrolls into view.
// - variant: how it arrives (rise, slide from a side, pop, grow downwards, fade)
// - items: a selector; when set, those children arrive one after another
//   instead of the wrapper arriving as a whole
// Content stays visible during SSR and without JS; only blocks below the fold
// are hidden after hydration, then revealed on scroll.
export function Reveal({
  children,
  delay = 0,
  variant = "up",
  items,
  className = "",
}: {
  children?: ReactNode;
  delay?: number;
  variant?: Variant;
  items?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const targets = items ? Array.from(el.querySelectorAll<HTMLElement>(items)) : [el];
    if (!targets.length) return;

    const clear = () =>
      targets.forEach((t) => {
        t.style.removeProperty("opacity");
        t.style.removeProperty("transform");
        t.style.removeProperty("transform-origin");
      });

    targets.forEach((t) => {
      t.style.opacity = "0";
      if (variant === "grow") t.style.transformOrigin = "top";
    });

    let animation: ReturnType<typeof animate> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        animation = animate(targets, {
          opacity: [0, 1],
          ...FROM[variant],
          duration: 850,
          delay: items ? stagger(70, { start: delay }) : delay,
          ease: "outExpo",
          onComplete: clear,
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      animation?.revert();
      clear();
    };
  }, [variant, items, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
