import type { Dict } from "@/content";
import { CountUp } from "./CountUp";

// One compact card with the three numbers side by side, split by hairlines.
// On phones each cell is centred with a small label; from sm up they are left-aligned.
export function Highlights({ items }: { items: Dict["highlights"] }) {
  return (
    <dl className="grid w-full grid-cols-3 divide-x divide-line overflow-hidden rounded-2xl border border-line bg-card/70 backdrop-blur-sm sm:inline-grid sm:w-auto">
      {items.map((item) => {
        const to = Number.parseInt(item.value, 10);
        const plus = item.value.endsWith("+");
        return (
          <div
            key={item.label}
            className="flex flex-col-reverse items-center justify-end gap-1.5 px-2 py-4 text-center sm:items-start sm:px-8 sm:py-5 sm:text-left"
          >
            <dt className="text-balance text-[11px] leading-tight text-muted sm:text-xs sm:leading-snug">
              {item.label}
            </dt>
            <dd className="text-3xl font-semibold leading-none tracking-tight tabular-nums sm:text-4xl">
              {Number.isNaN(to) ? item.value : <CountUp to={to} />}
              {plus && <span className="text-accent">+</span>}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
