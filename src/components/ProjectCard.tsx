"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import { animate } from "animejs";
import type { Dict } from "@/content";
import { site } from "@/content/site";
import { Chip } from "./Section";
import { ArrowRight, ArrowUpRight } from "./icons";

type Item = Dict["work"]["items"][number];

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// A project card in the style of an image gallery: a full-bleed cover with the
// period and name along the bottom. Hovering dims the cover and brings up a
// centred "Detail" button; the whole card opens a full-height drawer that
// slides up from the bottom with the write-up and every screenshot explained.
export function ProjectCard({
  item,
  labels,
  repoSoon,
}: {
  item: Item;
  labels: Dict["work"]["labels"];
  repoSoon: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const uid = useId();
  const infoId = `${uid}-info`;
  const shotsId = `${uid}-shots`;
  const titleId = `${uid}-title`;
  const visit = item.links[0];

  const open = () => {
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    dialog.scrollTop = 0;
    if (reduced()) return;
    animate(dialog, {
      y: ["100%", "0%"],
      duration: 750,
      ease: "outExpo",
      // a leftover transform would turn the drawer into the anchor for its
      // fixed-position controls, so clear it once it has landed
      onComplete: () => dialog.style.removeProperty("transform"),
    });
  };

  const close = () => {
    const dialog = ref.current;
    if (!dialog || !dialog.open || dialog.dataset.closing) return;
    if (reduced()) {
      dialog.close();
      return;
    }
    dialog.dataset.closing = "true";
    animate(dialog, {
      y: ["0%", "100%"],
      duration: 480,
      ease: "inOutCubic",
      onComplete: () => {
        dialog.close();
        delete dialog.dataset.closing;
        dialog.style.removeProperty("transform");
      },
    });
  };

  const goTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <article className="group relative aspect-16/10 overflow-hidden rounded-2xl border border-line bg-card">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-focus-within:scale-105"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent transition-colors duration-300 group-hover:bg-black/35 group-focus-within:bg-black/35"
        />

        {/* centred button, shown on hover (pointer devices) or keyboard focus */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 scale-90 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-medium uppercase tracking-wide text-black opacity-0 shadow-xl transition-all duration-300 group-focus-within:scale-100 group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:scale-100 [@media(hover:hover)]:group-hover:opacity-100"
        >
          <ArrowRight width={18} height={18} />
          {labels.details}
        </span>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-wider text-white/75">
              {item.period}
            </p>
            <h3 className="mt-1 text-lg font-medium leading-snug">{item.name}</h3>
          </div>
        </div>

        {/* the whole card is the button */}
        <button
          type="button"
          onClick={open}
          aria-label={`${labels.details}: ${item.name}`}
          className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </article>

      <dialog
        ref={ref}
        aria-labelledby={titleId}
        onCancel={(e) => {
          e.preventDefault(); // Escape: slide down instead of vanishing
          close();
        }}
        onClick={(e) => {
          if (e.target === ref.current) close(); // the dimmed strip above the drawer
        }}
        className="fixed inset-x-0 bottom-0 top-auto m-0 h-[calc(100dvh-2rem)] max-h-none w-full max-w-none overflow-y-auto overscroll-contain rounded-t-3xl border-x border-t border-line bg-bg p-0 text-fg [scrollbar-width:none] backdrop:bg-black/60 backdrop:backdrop-blur-sm [&::-webkit-scrollbar]:hidden"
      >
        {/* top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-bg/85 px-5 py-4 backdrop-blur md:px-8">
          <p className="min-w-0 truncate text-sm">
            <span className="font-medium">{item.name}</span>
            <span className="text-muted"> · {site.name}</span>
          </p>
          <div className="flex items-center gap-1">
            {visit && (
              <a
                href={visit.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={visit.label}
                title={visit.label}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-accent-soft hover:text-fg"
              >
                <ArrowUpRight width={18} height={18} />
              </a>
            )}
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="ml-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-fg text-bg transition-transform hover:scale-105 active:scale-95"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* title */}
        <section id={infoId} className="scroll-mt-20 px-6 pb-4 pt-16 text-center md:pt-24">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">{item.period}</p>
          <h2
            id={titleId}
            className="mx-auto mt-5 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-7xl"
          >
            {item.name}
          </h2>
          <p className="mt-5 font-mono text-sm text-accent">{item.kicker}</p>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted">{item.summary}</p>

          <ul className="mt-8 flex flex-wrap justify-center gap-2" aria-label={labels.stack}>
            {item.stack.map((s) => (
              <li key={s}>
                <Chip>{s}</Chip>
              </li>
            ))}
          </ul>

          {item.links.length > 1 && (
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              {item.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-4 py-2 font-medium transition-colors hover:border-accent"
                >
                  {l.label}
                  <ArrowUpRight width={14} height={14} />
                </a>
              ))}
            </div>
          )}
        </section>

        {/* overview */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-4 px-6 sm:grid-cols-2">
          {(
            [
              [labels.context, item.context],
              [labels.role, item.role],
              [labels.built, item.built],
              [labels.outcome, item.outcome],
            ] as const
          ).map(([label, text]) => (
            <div key={label} className="rounded-2xl border border-line bg-card/70 p-5 md:p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-muted">{label}</p>
              {text.includes("\n") ? (
                <ul className="mt-2 space-y-2 text-sm leading-relaxed">
                  {text.split("\n").map((line) => (
                    <li key={line} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm leading-relaxed">{text}</p>
              )}
            </div>
          ))}
        </div>

        {/* screenshots, each explained */}
        <section id={shotsId} className="scroll-mt-20 px-6 pb-40 pt-20 md:pt-28">
          <h3 className="sr-only">{labels.screenshots}</h3>
          <div className="mx-auto max-w-5xl space-y-20 md:space-y-28">
            {item.shots.map((shot, i) => (
              <figure key={shot.title}>
                <figcaption className="mb-6 grid items-start gap-3 md:grid-cols-[9rem_1fr] md:gap-8">
                  <span className="text-gradient text-6xl font-semibold leading-none tracking-tighter md:text-8xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="text-xl font-semibold tracking-tight md:text-2xl">
                      {shot.title}
                    </h4>
                    <p className="mt-2 max-w-2xl leading-relaxed text-muted">{shot.caption}</p>
                  </div>
                </figcaption>
                {shot.portrait ? (
                  <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-line bg-accent-soft">
                    <Image
                      src={shot.image ?? item.image}
                      alt={shot.title}
                      width={1432}
                      height={1687}
                      sizes="(min-width: 768px) 576px, 100vw"
                      className="h-auto w-full"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-16/10 overflow-hidden rounded-3xl border border-line bg-accent-soft">
                    <Image
                      src={shot.image ?? item.image}
                      alt={shot.title}
                      fill
                      sizes="(min-width: 1024px) 1000px, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </figure>
            ))}
          </div>
        </section>

        {/* floating bar */}
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex items-end justify-center gap-3 px-4 md:justify-center">
          <div className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-line bg-card/90 p-1.5 shadow-2xl shadow-black/30 backdrop-blur-md">
            <button
              type="button"
              onClick={() => goTo(infoId)}
              className="cursor-pointer whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm text-muted sm:px-4 transition-colors hover:bg-accent-soft hover:text-fg"
            >
              {labels.info}
            </button>
            <button
              type="button"
              onClick={() => goTo(shotsId)}
              className="cursor-pointer whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm text-muted sm:px-4 transition-colors hover:bg-accent-soft hover:text-fg"
            >
              {labels.screenshots}
            </button>
            {visit ? (
              <a
                href={visit.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-accent px-3.5 py-2.5 text-sm font-medium text-accent-fg sm:px-4 transition-transform hover:-translate-y-0.5"
              >
                {visit.label}
                <ArrowUpRight width={14} height={14} />
              </a>
            ) : (
              item.repoSoon && <span className="whitespace-nowrap px-3.5 py-2.5 text-sm text-muted sm:px-4">{repoSoon}</span>
            )}
          </div>
        </div>

      </dialog>
    </>
  );
}

function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
