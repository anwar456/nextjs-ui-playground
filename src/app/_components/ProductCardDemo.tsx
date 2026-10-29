"use client";

import { useState } from "react";
import { ProductCard, type Product } from "@/components/playground/ProductCard";
import { formatIdr } from "@/lib/playground/format-idr";
import { TestCases, type TestCase } from "./TestCases";
import { Playground, secondaryButtonClass } from "./ui";

const products: Product[] = [
  {
    id: "p-1",
    name: "Ceramic Coffee Mug",
    price: 12500,
    imageUrl: "/products/mug.svg",
    available: true,
  },
  {
    id: "p-2",
    name: "Hardcover Dotted Notebook with a Very Long Name That Needs to Be Clamped",
    price: 89000,
    imageUrl: "/products/notebook.svg",
    available: true,
  },
  {
    id: "p-3",
    name: "Wireless Over-Ear Headphones",
    price: 1250000,
    imageUrl: "/products/headphones.svg",
    available: true,
  },
  {
    id: "p-4",
    name: "Adjustable Desk Lamp",
    price: 245000,
    imageUrl: "/products/lamp.svg",
    available: false,
  },
];

const cases: TestCase[] = [
  { name: "12500", expected: "Rp 12.500", run: () => formatIdr(12500) },
  { name: "0", expected: "Rp 0", run: () => formatIdr(0) },
  { name: "999 (no separator)", expected: "Rp 999", run: () => formatIdr(999) },
  { name: "1250000", expected: "Rp 1.250.000", run: () => formatIdr(1250000) },
  {
    name: "Uses a normal space, not U+00A0",
    expected: false,
    run: () => formatIdr(12500).includes(" "),
  },
  { name: "No decimals (12500.6 rounds)", expected: "Rp 12.501", run: () => formatIdr(12500.6) },
];

export function ProductCardDemo() {
  const [log, setLog] = useState<string[]>([]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={(id) => setLog((prev) => [...prev, `onAdd("${id}")`])}
          />
        ))}
      </div>

      <Playground title="Callback log">
        <p className="text-sm text-muted">
          Each click on “Add to cart” should log one call with the product id. The out-of-stock
          card has a disabled button, so it never logs.
        </p>
        {/* role="log" is a polite live region, so screen readers hear each new call. */}
        <ul
          role="log"
          aria-label="onAdd calls"
          className="min-h-20 space-y-1 rounded-md border border-line bg-bg p-3 font-mono text-xs"
        >
          {log.length === 0 && <li className="text-muted">No calls yet.</li>}
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
        <button type="button" className={secondaryButtonClass} onClick={() => setLog([])}>
          Clear log
        </button>
      </Playground>

      <TestCases caption="formatIdr — test cases" cases={cases} />
    </>
  );
}
