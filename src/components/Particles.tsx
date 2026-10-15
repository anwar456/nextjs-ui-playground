"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number; // where it is in its twinkle cycle
  pulse: number; // how fast it twinkles
};

const LINK_DISTANCE = 130;
const MOUSE_RADIUS = 140;
const SPEED = 0.22;
const GLOW_SIZE = 64; // px of the pre-rendered glow sprite

// Slowly drifting, softly glowing dots that twinkle, join up when close to
// each other and shy away from the pointer. Drawn on one fixed canvas behind
// the whole page, in the primary colour (so it follows the theme).
export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dark = window.matchMedia("(prefers-color-scheme: dark)");
    const mouse = { x: -9999, y: -9999 };
    const glow = document.createElement("canvas");
    glow.width = glow.height = GLOW_SIZE;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;
    let rgb = "129, 140, 248";
    let onDark = true;
    let raf = 0;

    // One soft glow (bright core fading out) drawn once, then stamped per particle.
    const buildGlow = () => {
      const g = glow.getContext("2d");
      if (!g) return;
      const c = GLOW_SIZE / 2;
      const core = onDark ? "255, 255, 255" : rgb;
      const grad = g.createRadialGradient(c, c, 0, c, c, c);
      grad.addColorStop(0, `rgba(${core}, 1)`);
      grad.addColorStop(0.12, `rgba(${core}, 0.95)`);
      grad.addColorStop(0.3, `rgba(${rgb}, 0.55)`);
      grad.addColorStop(0.6, `rgba(${rgb}, 0.16)`);
      grad.addColorStop(1, `rgba(${rgb}, 0)`);
      g.clearRect(0, 0, GLOW_SIZE, GLOW_SIZE);
      g.fillStyle = grad;
      g.fillRect(0, 0, GLOW_SIZE, GLOW_SIZE);
    };

    const readColor = () => {
      const css = getComputedStyle(document.documentElement);
      const hex = css.getPropertyValue("--accent").trim();
      const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
      if (m) rgb = `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
      onDark = css.colorScheme.includes("dark");
      buildGlow();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(24, Math.min(90, Math.floor((w * h) / 18000)));
      particles = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = SPEED * (0.4 + Math.random() * 0.9);
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1 + Math.random() * 1.6,
          phase: Math.random() * Math.PI * 2,
          pulse: 0.0008 + Math.random() * 0.0016,
        };
      });
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > LINK_DISTANCE) continue;
          ctx.strokeStyle = `rgba(${rgb}, ${(1 - d / LINK_DISTANCE) * 0.2})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Glows add up where they overlap on the dark theme.
      ctx.globalCompositeOperation = onDark ? "lighter" : "source-over";
      for (const p of particles) {
        const twinkle = 0.55 + 0.45 * Math.sin(time * p.pulse + p.phase);
        const size = p.r * 9;
        ctx.globalAlpha = twinkle;
        ctx.drawImage(glow, p.x - size / 2, p.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const step = (time: number) => {
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE_RADIUS && d > 0) {
          const push = (1 - d / MOUSE_RADIUS) * 0.6;
          p.x += (dx / d) * push;
          p.y += (dy / d) * push;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        else if (p.y > h + 10) p.y = -10;
      }
      draw(time);
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduceMotion.matches) draw(0);
      else if (!document.hidden) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    const onTheme = () => {
      readColor();
      if (reduceMotion.matches) draw(0);
    };

    readColor();
    resize();
    start();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", start);
    reduceMotion.addEventListener("change", start);
    dark.addEventListener("change", onTheme);
    const themeWatcher = new MutationObserver(onTheme);
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", start);
      reduceMotion.removeEventListener("change", start);
      dark.removeEventListener("change", onTheme);
      themeWatcher.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
