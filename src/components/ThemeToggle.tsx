"use client";

import { animate } from "animejs";

// Switches between light and dark. Which icon shows is decided in CSS from
// <html data-theme> (or the system setting), so the server and client markup
// always match and there is no flash. On click the new icon spins and pops in,
// and the page colours fade to the new theme instead of snapping.
export function ThemeToggle({ label }: { label: string }) {
  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const motion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (motion) {
      root.classList.add("theme-fade");
      window.setTimeout(() => root.classList.remove("theme-fade"), 600);
    }
    const dark =
      root.dataset.theme === "dark" ||
      (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const next = dark ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    if (motion) {
      animate(e.currentTarget.querySelectorAll("svg"), {
        rotate: [-140, 0],
        scale: [0.3, 1],
        duration: 700,
        ease: "outBack(1.8)",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line text-muted transition-all duration-300 hover:border-accent hover:text-fg hover:shadow-md hover:shadow-accent/20 active:scale-90"
    >
      <svg
        className="theme-moon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg
        className="theme-sun"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
