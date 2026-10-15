"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

// Section header: the eyebrow slides in, the title rises word by word, then
// the intro fades up. Plays once when the header scrolls into view.
export function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (root.getBoundingClientRect().top < window.innerHeight) return;

    const eyebrowEl = root.querySelector<HTMLElement>("[data-eyebrow]");
    const words = Array.from(root.querySelectorAll<HTMLElement>("[data-word]"));
    const introEl = root.querySelector<HTMLElement>("[data-intro]");
    const all = [eyebrowEl, ...words, introEl].filter(Boolean) as HTMLElement[];

    const clear = () =>
      all.forEach((t) => {
        t.style.removeProperty("opacity");
        t.style.removeProperty("transform");
      });

    all.forEach((t) => (t.style.opacity = "0"));

    const running: ReturnType<typeof animate>[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (eyebrowEl) {
          running.push(
            animate(eyebrowEl, { opacity: [0, 1], x: [-24, 0], duration: 700, ease: "outExpo" }),
          );
        }
        running.push(
          animate(words, {
            opacity: [0, 1],
            y: [28, 0],
            duration: 900,
            delay: stagger(80, { start: 150 }),
            ease: "outExpo",
            onComplete: clear,
          }),
        );
        if (introEl) {
          running.push(
            animate(introEl, {
              opacity: [0, 1],
              y: [16, 0],
              duration: 800,
              delay: 150 + words.length * 80,
              ease: "outExpo",
            }),
          );
        }
      },
      // Wait until the heading is well inside the screen (not just peeking in
      // at the bottom edge), so the animation is seen from its first frame.
      { threshold: 0.5, rootMargin: "0px 0px -25% 0px" },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      running.forEach((a) => a.revert());
      clear();
    };
  }, []);

  return (
    <div ref={ref}>
      <p data-eyebrow className="font-mono text-xs uppercase tracking-widest text-accent">
        {eyebrow}
      </p>
      <h2
        aria-label={title}
        className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl"
      >
        {title.split(" ").map((word, i) => (
          <span key={i} aria-hidden>
            {i > 0 && " "}
            <span data-word className="inline-block">
              {word}
            </span>
          </span>
        ))}
      </h2>
      {intro && (
        <p data-intro className="mt-4 max-w-2xl text-muted">
          {intro}
        </p>
      )}
    </div>
  );
}
