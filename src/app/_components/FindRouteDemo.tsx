"use client";

import { useState } from "react";
import { findRoute } from "@/lib/playground/find-route";
import { TestCases, type TestCase } from "./TestCases";
import { Field, Output, Playground, inputClass } from "./ui";

const cases: TestCase[] = [
  {
    name: "Example 1: /products/:id ← /products/42",
    expected: 0,
    run: () => findRoute(["/products/:id", "/about"], "/products/42"),
  },
  {
    name: "Example 2: extra segment does not match",
    expected: -1,
    run: () => findRoute(["/products/:id"], "/products/42/reviews"),
  },
  {
    name: "Example 3: trailing slash on the path",
    expected: 0,
    run: () => findRoute(["/about"], "/about/"),
  },
  {
    name: "Trailing slash on the pattern",
    expected: 0,
    run: () => findRoute(["/about/"], "/about"),
  },
  {
    name: "Literal segment must match fully (/about vs /aboutus)",
    expected: -1,
    run: () => findRoute(["/about"], "/aboutus"),
  },
  {
    name: "Pattern shorter than the path",
    expected: -1,
    run: () => findRoute(["/products"], "/products/42"),
  },
  {
    name: "Pattern longer than the path",
    expected: -1,
    run: () => findRoute(["/products/:id"], "/products"),
  },
  {
    name: "Root matches root",
    expected: 0,
    run: () => findRoute(["/"], "/"),
  },
  {
    name: "Only one trailing slash is ignored",
    expected: -1,
    run: () => findRoute(["/about"], "/about//"),
  },
  {
    name: ":id does not match an empty segment",
    expected: -1,
    run: () => findRoute(["/products/:id"], "/products//"),
  },
  {
    name: "First matching pattern wins",
    expected: 0,
    run: () => findRoute(["/users/:id", "/users/new"], "/users/new"),
  },
  {
    name: "Falls through to a later pattern",
    expected: 1,
    run: () => findRoute(["/users/:id/edit", "/users/:id"], "/users/7"),
  },
  {
    name: "Several params",
    expected: 0,
    run: () => findRoute(["/shop/:category/:id"], "/shop/mugs/12"),
  },
  {
    name: "No patterns",
    expected: -1,
    run: () => findRoute([], "/about"),
  },
];

export function FindRouteDemo() {
  const [patterns, setPatterns] = useState("/products/:id\n/about\n/blog/:slug/comments");
  const [pathname, setPathname] = useState("/products/42");

  const list = patterns.split("\n").filter((line) => line.trim() !== "");
  const index = findRoute(list, pathname);

  return (
    <>
      <TestCases caption="findRoute — test cases" cases={cases} />

      <Playground title="Try it">
        <Field label="patterns (one per line, in priority order)">
          <textarea
            className={`${inputClass} h-28`}
            value={patterns}
            onChange={(e) => setPatterns(e.target.value)}
            spellCheck={false}
          />
        </Field>
        <Field label="pathname">
          <input
            className={inputClass}
            value={pathname}
            onChange={(e) => setPathname(e.target.value)}
            spellCheck={false}
          />
        </Field>
        <Output label="Result">
          {index === -1 ? "-1 (no pattern matches)" : `${index} → ${list[index]}`}
        </Output>
      </Playground>
    </>
  );
}
