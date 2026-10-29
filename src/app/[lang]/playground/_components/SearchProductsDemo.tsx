"use client";

import { useState, type FormEvent } from "react";
import { searchProducts, type Product } from "@/lib/playground/search-products";
import { TestCases, type TestCase } from "./TestCases";
import {
  ErrorMessage,
  Field,
  Output,
  Playground,
  buttonClass,
  inputClass,
  secondaryButtonClass,
} from "./ui";

const fruits: Product[] = [
  { id: 2, name: "Pear" },
  { id: 1, name: "Apple" },
  { id: 3, name: "Apricot" },
];

const mixed: Product[] = [
  { id: 1, name: "banana" },
  { id: 2, name: "Apple" },
  { id: 3, name: "cherry" },
  { id: 4, name: "apricot" },
];

const ids = (products: Product[]) => products.map((p) => p.id);

const cases: TestCase[] = [
  {
    name: "Example 1: query “ap”, page 1, size 1",
    expected: [{ id: 1, name: "Apple" }],
    run: () => searchProducts(fruits, "ap", 1, 1),
  },
  {
    name: "Example 2: no match",
    expected: [],
    run: () => searchProducts([{ id: 1, name: "Apple" }], "zz", 1, 10),
  },
  {
    name: "Page 2 of “ap”, size 1",
    expected: [{ id: 3, name: "Apricot" }],
    run: () => searchProducts(fruits, "ap", 2, 1),
  },
  {
    name: "Query is case-insensitive (“AP”)",
    expected: [1, 3],
    run: () => ids(searchProducts(fruits, "AP", 1, 10)),
  },
  {
    name: "Sorted ignoring case (Apple, apricot, banana, cherry)",
    expected: [2, 4, 1, 3],
    run: () => ids(searchProducts(mixed, "", 1, 10)),
  },
  {
    name: "Names equal ignoring case keep input order",
    expected: [2, 1],
    run: () =>
      ids(
        searchProducts(
          [
            { id: 2, name: "Apple" },
            { id: 1, name: "apple" },
          ],
          "",
          1,
          10,
        ),
      ),
  },
  {
    name: "page 0 is treated as page 1",
    expected: [2],
    run: () => ids(searchProducts(mixed, "", 0, 1)),
  },
  {
    name: "Negative page is treated as page 1",
    expected: [2],
    run: () => ids(searchProducts(mixed, "", -5, 1)),
  },
  {
    name: "pageSize 0 returns []",
    expected: [],
    run: () => searchProducts(mixed, "", 1, 0),
  },
  {
    name: "Negative pageSize returns []",
    expected: [],
    run: () => searchProducts(mixed, "", 1, -3),
  },
  {
    name: "Page past the end returns []",
    expected: [],
    run: () => searchProducts(mixed, "", 3, 2),
  },
  {
    name: "Empty product list returns []",
    expected: [],
    run: () => searchProducts([], "a", 1, 10),
  },
  {
    name: "Input array is not mutated",
    expected: true,
    run: () => {
      const input = mixed.map((p) => ({ ...p }));
      const before = JSON.stringify(input);
      searchProducts(input, "a", 1, 10);
      return JSON.stringify(input) === before;
    },
  },
];

const words = ["Apple", "apricot", "BANANA", "cherry", "Mango", "melon", "Peach", "pear", "Plum"];

function generateProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${words[Math.floor(Math.random() * words.length)]} ${Math.floor(Math.random() * 1e6)}`,
  }));
}

type Result = { items: Product[]; ms: number; total: number };

const SHOWN = 50;

export function SearchProductsDemo() {
  const [json, setJson] = useState(JSON.stringify(fruits, null, 2));
  const [big, setBig] = useState<Product[] | null>(null);
  const [query, setQuery] = useState("ap");
  const [page, setPage] = useState("1");
  const [pageSize, setPageSize] = useState("10");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  function run(e: FormEvent) {
    e.preventDefault();

    let products = big;
    if (!products) {
      try {
        const parsed: unknown = JSON.parse(json);
        if (!Array.isArray(parsed)) throw new Error("Products must be a JSON array.");
        products = parsed as Product[];
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid JSON.");
        return;
      }
    }

    setError(null);
    const start = performance.now();
    const items = searchProducts(products, query, Number(page), Number(pageSize));
    setResult({ items, ms: performance.now() - start, total: products.length });
  }

  return (
    <>
      <TestCases caption="searchProducts — test cases" cases={cases} />

      <Playground title="Try it">
        <form onSubmit={run} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="query">
              <input
                className={inputClass}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Field>
            <Field label="page">
              <input
                className={inputClass}
                type="number"
                value={page}
                onChange={(e) => setPage(e.target.value)}
              />
            </Field>
            <Field label="pageSize">
              <input
                className={inputClass}
                type="number"
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
              />
            </Field>
          </div>

          {big ? (
            <p className="text-sm text-muted">
              Using a generated list of {big.length.toLocaleString("en-US")} products.
            </p>
          ) : (
            <Field label="products (JSON array)">
              <textarea
                className={`${inputClass} h-40`}
                value={json}
                onChange={(e) => setJson(e.target.value)}
                spellCheck={false}
              />
            </Field>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className={buttonClass}>
              Run
            </button>
            {big ? (
              <button type="button" className={secondaryButtonClass} onClick={() => setBig(null)}>
                Back to JSON input
              </button>
            ) : (
              <button
                type="button"
                className={secondaryButtonClass}
                onClick={() => setBig(generateProducts(100_000))}
              >
                Generate 100,000 products
              </button>
            )}
          </div>
        </form>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {result && (
          <Output
            label={`${result.items.length} result(s) from ${result.total.toLocaleString("en-US")} products in ${result.ms.toFixed(1)} ms${
              result.items.length > SHOWN ? ` (first ${SHOWN} shown)` : ""
            }`}
          >
            {JSON.stringify(result.items.slice(0, SHOWN), null, 2)}
          </Output>
        )}
      </Playground>
    </>
  );
}
