"use client";

import { useState } from "react";
import { Tabs, type TabItem } from "@/components/playground/Tabs";
import { Playground, secondaryButtonClass } from "./ui";

function HelpfulButton() {
  const [count, setCount] = useState(0);
  return (
    <button type="button" className={secondaryButtonClass} onClick={() => setCount((c) => c + 1)}>
      Helpful ({count})
    </button>
  );
}

const tabs: TabItem[] = [
  {
    id: "overview",
    label: "Overview",
    content: (
      <p className="max-w-prose text-sm text-muted">
        A hand-glazed ceramic mug that holds 350 ml and is dishwasher safe. Each piece is
        slightly different.
      </p>
    ),
  },
  {
    id: "reviews",
    label: "Reviews",
    content: (
      <div className="space-y-3 text-sm">
        <p className="max-w-prose text-muted">
          “Sturdy, and the handle is comfortable.” — 4.8 average from 126 reviews.
        </p>
        {/* Something focusable inside the panel, to try Tab from the tab list. */}
        <HelpfulButton />
      </div>
    ),
  },
  {
    id: "shipping",
    label: "Shipping",
    content: (
      <p className="max-w-prose text-sm text-muted">
        Ships within 2 business days. Free delivery on orders above Rp 250.000.
      </p>
    ),
  },
];

export function TabsDemo() {
  const [activeId, setActiveId] = useState("reviews");
  const [log, setLog] = useState<string[]>([]);

  function onChange(id: string) {
    setLog((prev) => [...prev, `onChange("${id}")`]);
    setActiveId(id);
  }

  return (
    <>
      <div className="rounded-md border border-line bg-card px-4 pt-2 pb-0 md:px-6">
        <Tabs tabs={tabs} activeId={activeId} onChange={onChange} />
      </div>

      <Playground title="Controlled from outside">
        <p className="text-sm text-muted">
          The parent owns <code className="font-mono">activeId</code>, so changing it from here
          updates the tabs too. Keyboard: focus a tab, then use ← → to move, Home / End to jump,
          and Tab to enter the panel.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={secondaryButtonClass} onClick={() => setActiveId("overview")}>
            Go to Overview
          </button>
          <p className="font-mono text-xs text-muted">
            activeId = <span className="text-fg">{activeId}</span>
          </p>
        </div>
        <ul
          role="log"
          aria-label="onChange calls"
          className="min-h-16 space-y-1 rounded-md border border-line bg-bg p-3 font-mono text-xs"
        >
          {log.length === 0 && <li className="text-muted">No calls yet.</li>}
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </Playground>
    </>
  );
}
