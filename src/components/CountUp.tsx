"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

// Counts from 0 up to `to` with anime.js. The server renders the final number,
// so it still reads correctly without JS or with reduced motion.
export function CountUp({ to, delay = 500 }: { to: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const counter = { value: 0 };
    el.textContent = "0";
    const animation = animate(counter, {
      value: to,
      duration: 1600,
      delay,
      ease: "outExpo",
      onUpdate: () => {
        el.textContent = String(Math.round(counter.value));
      },
      onComplete: () => {
        el.textContent = String(to);
      },
    });
    return () => {
      animation.revert();
      el.textContent = String(to);
    };
  }, [to, delay]);

  return <span ref={ref}>{to}</span>;
}
