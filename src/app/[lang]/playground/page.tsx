import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/content";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BreadcrumbsDemo } from "./_components/BreadcrumbsDemo";
import { DemoSection, Pending } from "./_components/DemoSection";
import { FindRouteDemo } from "./_components/FindRouteDemo";
import { SearchProductsDemo } from "./_components/SearchProductsDemo";

export const metadata: Metadata = {
  title: "Code Playground",
  description: "Five small TypeScript and React exercises, each with a live demo.",
};

const exercises = [
  {
    title: "Filter, Sort, and Paginate Products",
    tags: "TypeScript · Data transformation",
    brief:
      "searchProducts: match names containing the query (case-insensitive), sort them ascending case-insensitively, and return the requested one-based page without mutating the input.",
    demo: <SearchProductsDemo />,
  },
  {
    title: "Resolve the Best Matching Route",
    tags: "App Router · Route matching",
    brief:
      "findRoute: return the index of the first App Router-style pattern that matches the pathname, or -1. A :segment matches exactly one non-empty segment.",
    demo: <FindRouteDemo />,
  },
  {
    title: "Build a Safe Breadcrumb Trail",
    tags: "Next.js routing · Strings",
    brief:
      "buildBreadcrumbs: one { label, href } per path prefix, with decoded labels (mapped or de-hyphenated) and encoded hrefs.",
    demo: <BreadcrumbsDemo />,
  },
  {
    title: "Build a Product Card Component",
    tags: "React / Next.js · Component",
    brief:
      "ProductCard: image, name, IDR price and an “Add to cart” button that calls onAdd(id); “Out of stock” and disabled when unavailable.",
    demo: <Pending />,
  },
  {
    title: "Build an Accessible Tabs Component",
    tags: "React / Next.js · Component",
    brief:
      "Tabs: a controlled tab list with proper tab roles and ARIA wiring between each tab button and its panel.",
    demo: <Pending />,
  },
];

export default async function PlaygroundPage({ params }: PageProps<"/[lang]/playground">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
          <a href={`/${lang}`} className="font-semibold tracking-tight">
            Anwar<span className="text-accent">.</span>
          </a>
          <ThemeToggle label="Toggle theme" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-12 md:py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          Playground · 5 small exercises
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
          Code playground
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Small TypeScript and React exercises, each with a live demo and test cases you can
          run right here.
        </p>

        <nav aria-label="Exercises" className="mt-8">
          <ol className="grid gap-2 sm:grid-cols-2">
            {exercises.map((c, i) => (
              <li key={c.title}>
                <a
                  href={`#demo-${i + 1}`}
                  className="flex gap-3 rounded-lg border border-line bg-card px-4 py-3 text-sm transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="font-mono text-accent">{i + 1}</span>
                  <span>{c.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12">
          {exercises.map((c, i) => (
            <DemoSection
              key={c.title}
              number={i + 1}
              title={c.title}
              tags={c.tags}
              brief={c.brief}
            >
              {c.demo}
            </DemoSection>
          ))}
        </div>
      </main>
    </>
  );
}
