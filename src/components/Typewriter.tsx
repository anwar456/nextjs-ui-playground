"use client";

import { useEffect, useState } from "react";

const TYPE_MS = 80;
const DELETE_MS = 40;
const HOLD_MS = 1800;

// Types each role, holds, deletes it, then moves to the next. The first role
// is fully visible on the server and without JS; the loop starts after hydration.
export function Typewriter({ roles }: { roles: string[] }) {
  const [text, setText] = useState(roles[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let index = 0;
    let shown = roles[0];
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const target = roles[index];
      if (deleting) {
        shown = shown.slice(0, -1);
        setText(shown);
        if (shown === "") {
          deleting = false;
          index = (index + 1) % roles.length;
        }
        timer = setTimeout(tick, DELETE_MS);
      } else {
        shown = roles[index].slice(0, shown.length + 1);
        setText(shown);
        if (shown === target) {
          deleting = true;
          timer = setTimeout(tick, HOLD_MS);
        } else {
          timer = setTimeout(tick, TYPE_MS);
        }
      }
    };

    timer = setTimeout(tick, HOLD_MS);
    return () => clearTimeout(timer);
  }, [roles]);

  return (
    <>
      <span className="sr-only">{roles.join(", ")}</span>
      <span aria-hidden>
        <span className="text-gradient">{text}</span>
        <span className="caret" />
      </span>
    </>
  );
}
