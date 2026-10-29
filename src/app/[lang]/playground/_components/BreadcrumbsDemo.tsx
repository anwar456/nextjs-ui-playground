"use client";

import { useState } from "react";
import { buildBreadcrumbs } from "@/lib/playground/build-breadcrumbs";
import { TestCases, type TestCase } from "./TestCases";
import { ErrorMessage, Field, Output, Playground, inputClass } from "./ui";

const cases: TestCase[] = [
  {
    name: "Example 1: mapped label + encoded segment",
    expected: [
      { label: "Shop", href: "/products" },
      { label: "blue mug", href: "/products/blue%20mug" },
    ],
    run: () => buildBreadcrumbs("/products/blue%20mug", { products: "Shop" }),
  },
  {
    name: "Example 2: root has no breadcrumbs",
    expected: [],
    run: () => buildBreadcrumbs("/", {}),
  },
  {
    name: "Hyphens become spaces",
    expected: [{ label: "my cool page", href: "/my-cool-page" }],
    run: () => buildBreadcrumbs("/my-cool-page", {}),
  },
  {
    name: "Trailing slash is ignored",
    expected: [{ label: "about", href: "/about" }],
    run: () => buildBreadcrumbs("/about/", {}),
  },
  {
    name: "Labels are keyed by the decoded segment",
    expected: [{ label: "Blue Mug", href: "/blue%20mug" }],
    run: () => buildBreadcrumbs("/blue%20mug", { "blue mug": "Blue Mug" }),
  },
  {
    name: "Non-ASCII is decoded for the label, re-encoded for the href",
    expected: [{ label: "café", href: "/caf%C3%A9" }],
    run: () => buildBreadcrumbs("/caf%C3%A9", {}),
  },
  {
    name: "Encoded slash stays inside one segment",
    expected: [{ label: "a/b", href: "/a%2Fb" }],
    run: () => buildBreadcrumbs("/a%2Fb", {}),
  },
  {
    name: "Malformed percent escape does not throw",
    expected: [{ label: "100%", href: "/100%25" }],
    run: () => buildBreadcrumbs("/100%", {}),
  },
  {
    name: "Prototype keys are not treated as labels",
    expected: [{ label: "constructor", href: "/constructor" }],
    run: () => buildBreadcrumbs("/constructor", {}),
  },
  {
    name: "Every prefix is included, in order",
    expected: [
      { label: "a", href: "/a" },
      { label: "b", href: "/a/b" },
      { label: "c", href: "/a/b/c" },
    ],
    run: () => buildBreadcrumbs("/a/b/c", {}),
  },
];

export function BreadcrumbsDemo() {
  const [pathname, setPathname] = useState("/products/blue%20mug/");
  const [labelsText, setLabelsText] = useState('{ "products": "Shop" }');

  let labels: Record<string, string> = {};
  let error: string | null = null;
  try {
    const parsed: unknown = JSON.parse(labelsText);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("Labels must be a JSON object.");
    }
    labels = parsed as Record<string, string>;
  } catch (err) {
    error = err instanceof Error ? err.message : "Invalid JSON.";
  }

  const crumbs = buildBreadcrumbs(pathname, labels);

  return (
    <>
      <TestCases caption="buildBreadcrumbs — test cases" cases={cases} />

      <Playground title="Try it">
        <Field label="pathname">
          <input
            className={inputClass}
            value={pathname}
            onChange={(e) => setPathname(e.target.value)}
            spellCheck={false}
          />
        </Field>
        <Field label="labels (JSON object, keyed by decoded segment)">
          <input
            className={inputClass}
            value={labelsText}
            onChange={(e) => setLabelsText(e.target.value)}
            spellCheck={false}
          />
        </Field>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            {crumbs.length === 0 && <li className="text-muted">(no breadcrumbs)</li>}
            {crumbs.map((crumb, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden className="text-muted">
                      /
                    </span>
                  )}
                  {/* Demo only: don't navigate away from the playground page. */}
                  <a
                    href={crumb.href}
                    aria-current={last ? "page" : undefined}
                    onClick={(e) => e.preventDefault()}
                    className={`rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      last ? "font-medium" : "text-accent hover:underline"
                    }`}
                  >
                    {crumb.label}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <Output label="Result">{JSON.stringify(crumbs, null, 2)}</Output>
      </Playground>
    </>
  );
}
