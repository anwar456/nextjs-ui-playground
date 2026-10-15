"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, stagger } from "animejs";

const MAX_X = 60; // how far it may tip up or down, in degrees
const SENSITIVITY = 0.6; // degrees of rotation per pixel dragged
const FRICTION = 0.94; // how quickly a release coasts to a stop

// Floating badges around the photo (decoration only).
const BADGES = [
  // On phones they stack beside the photo; from md up they sit around it.
  {
    label: "React",
    className: "left-[calc(100%+1.25rem)] top-0 md:-left-8 md:top-8",
    delay: "0s",
  },
  {
    label: "Next.js",
    className: "left-[calc(100%+1.25rem)] top-[2.6rem] md:left-auto md:-right-5 md:-top-3",
    delay: "-4s",
  },
  {
    label: "Express",
    className:
      "left-[calc(100%+1.25rem)] top-[5.2rem] md:left-auto md:top-auto md:right-2 md:bottom-12 lg:-right-9",
    delay: "-1s",
  },
];

// The photo as a two-sided 3D card you can pick up and spin: the cursor turns
// into a grab hand, dragging rotates it freely (it flips to its back side and
// coasts on release), a click without dragging snaps it back to facing front,
// and a double-click sends it through a full spin.
export function ProfileTilt({
  children,
  name,
}: {
  children: ReactNode;
  name: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = { x: 0, y: 0, vx: 0, vy: 0 };
    const last = { x: 0, y: 0 };
    let dragging = false;
    let travel = 0; // pixels moved since pointerdown, to tell a click from a drag
    let lastReset = 0;
    let raf = 0;
    let spin: ReturnType<typeof animate> | undefined;

    const clampX = (v: number) => Math.max(-MAX_X, Math.min(MAX_X, v));
    const apply = () => {
      card.style.transform = `rotateX(${s.x}deg) rotateY(${s.y}deg)`;
    };

    // Coasting after release.
    const coast = () => {
      s.y += s.vy;
      s.x = clampX(s.x + s.vx);
      s.vy *= FRICTION;
      s.vx *= FRICTION;
      apply();
      raf =
        Math.abs(s.vy) > 0.02 || Math.abs(s.vx) > 0.02 ? requestAnimationFrame(coast) : 0;
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      spin?.pause();
      s.vx = s.vy = 0;
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      stop();
      dragging = true;
      travel = 0;
      last.x = e.clientX;
      last.y = e.clientY;
      card.setPointerCapture(e.pointerId);
      card.dataset.dragging = "true";
    };

    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      glare.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
      glare.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
      if (!dragging) return;

      const dx = (e.clientX - last.x) * SENSITIVITY;
      const dy = (e.clientY - last.y) * SENSITIVITY;
      travel += Math.abs(dx) + Math.abs(dy);
      last.x = e.clientX;
      last.y = e.clientY;
      s.y += dx;
      s.x = clampX(s.x - dy);
      s.vy = dx;
      s.vx = -dy;
      apply();
    };

    // Back to facing front, taking the shortest way round.
    const reset = () => {
      lastReset = Date.now();
      const turned = Math.abs(s.y - Math.round(s.y / 360) * 360) > 1 || Math.abs(s.x) > 1;
      if (!turned) return;
      if (reduceMotion) {
        s.y = Math.round(s.y / 360) * 360;
        s.x = 0;
        apply();
        return;
      }
      spin = animate(s, {
        y: Math.round(s.y / 360) * 360,
        x: 0,
        duration: 800,
        ease: "outCubic",
        onUpdate: apply,
      });
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      delete card.dataset.dragging;
      if (e.type !== "pointercancel" && travel < 5) {
        reset();
        return;
      }
      if (reduceMotion) {
        s.vx = s.vy = 0;
        return;
      }
      raf = requestAnimationFrame(coast);
    };

    const onDouble = () => {
      if (reduceMotion || Date.now() - lastReset < 500) return;
      stop();
      spin = animate(s, {
        y: (Math.round(s.y / 360) + 1) * 360,
        x: 0,
        duration: 1500,
        ease: "inOutCubic",
        onUpdate: apply,
      });
    };

    card.addEventListener("pointerdown", onDown);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerup", onUp);
    card.addEventListener("pointercancel", onUp);
    card.addEventListener("dblclick", onDouble);
    return () => {
      stop();
      spin?.revert();
      card.removeEventListener("pointerdown", onDown);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerup", onUp);
      card.removeEventListener("pointercancel", onUp);
      card.removeEventListener("dblclick", onDouble);
    };
  }, []);

  // Entrance: the frame draws in, the photo slides into it, then the dots and
  // badges pop in. Pieces start hidden via .enter-hidden (with a CSS fallback
  // that reveals them if JS never runs) and lose that class when they land.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pick = (name: string) =>
      Array.from(root.querySelectorAll<HTMLElement>(`[data-enter="${name}"]`));
    const land = (els: HTMLElement[]) => () =>
      els.forEach((el) => {
        el.classList.remove("enter-hidden");
        el.style.removeProperty("opacity");
        el.style.removeProperty("transform");
      });

    const glow = pick("glow");
    const frame = pick("frame");
    const photo = pick("photo");
    const dots = pick("dots");
    const badges = pick("badge");

    const runs = [
      animate(glow, { opacity: [0, 0.4], duration: 1200, delay: 100, ease: "outQuad", onComplete: land(glow) }),
      animate(frame, {
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 1000,
        delay: 200,
        ease: "outExpo",
        onComplete: land(frame),
      }),
      animate(photo, {
        opacity: [0, 1],
        x: [-56, 0],
        y: [-56, 0],
        scale: [0.88, 1],
        duration: 1200,
        delay: 500,
        ease: "outExpo",
        onComplete: land(photo),
      }),
      animate(dots, { opacity: [0, 0.6], duration: 800, delay: 900, ease: "outQuad", onComplete: land(dots) }),
      animate(badges, {
        opacity: [0, 1],
        scale: [0.4, 1],
        y: [24, 0],
        duration: 800,
        delay: stagger(140, { start: 1100 }),
        ease: "outBack",
        onComplete: land(badges),
      }),
    ];
    return () => runs.forEach((a) => a.revert());
  }, []);

  return (
    <div>
      <div ref={rootRef} className="relative">
        <div
          aria-hidden
          data-enter="glow"
          className="enter-hidden absolute inset-4 rounded-3xl bg-linear-to-br from-accent to-accent-2 opacity-40 blur-2xl"
        />
        <div
          aria-hidden
          data-enter="frame"
          className="enter-hidden absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border-2 border-accent/50 md:translate-x-4 md:translate-y-4"
        />
        <div
          aria-hidden
          data-enter="dots"
          className="enter-hidden absolute -left-5 -top-5 h-20 w-20 opacity-60 md:h-24 md:w-24"
          style={{
            backgroundImage: "radial-gradient(circle, var(--accent) 1.5px, transparent 1.6px)",
            backgroundSize: "12px 12px",
          }}
        />

        <div data-enter="photo" className="enter-hidden perspective-[900px]">
          <div
            ref={cardRef}
            onDragStart={(e) => e.preventDefault()}
            className="group relative cursor-grab touch-pan-y select-none transform-3d will-change-transform data-[dragging=true]:cursor-grabbing"
          >
            <div className="relative overflow-hidden rounded-3xl ring-1 ring-line backface-hidden">
              {children}
              <div
                ref={glareRef}
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.32), transparent 55%)",
                }}
              />
            </div>

            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-3xl bg-linear-to-br from-accent to-accent-2 text-5xl font-semibold tracking-tight text-white ring-1 ring-line backface-hidden"
              style={{ transform: "rotateY(180deg)" }}
            >
              {name}
              <span className="text-white/60">.</span>
            </div>
          </div>
        </div>

        {BADGES.map((b) => (
          <span
            key={b.label}
            aria-hidden
            data-enter="badge"
            className={`enter-hidden pointer-events-none absolute ${b.className}`}
          >
            <span
              style={{ animationDelay: b.delay }}
              className="float inline-flex items-center gap-2 rounded-full border border-accent/50 bg-[color-mix(in_srgb,var(--accent)_20%,var(--card))] px-2.5 py-1 font-mono text-[11px] font-medium md:px-3 md:py-1.5 md:text-xs text-fg shadow-lg shadow-accent/25"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {b.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
