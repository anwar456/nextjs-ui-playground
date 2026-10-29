import { BreadcrumbsDemo } from "./_components/BreadcrumbsDemo";
import { DemoSection } from "./_components/DemoSection";
import { FindRouteDemo } from "./_components/FindRouteDemo";
import { ProductCardDemo } from "./_components/ProductCardDemo";
import { SearchProductsDemo } from "./_components/SearchProductsDemo";
import { TabsDemo } from "./_components/TabsDemo";

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
    demo: <ProductCardDemo />,
  },
  {
    title: "Build an Accessible Tabs Component",
    tags: "React / Next.js · Component",
    brief:
      "Tabs: a controlled tab list with proper tab roles and ARIA wiring between each tab button and its panel.",
    demo: <TabsDemo />,
  },
];

export default function PlaygroundPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Code playground</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Small TypeScript and React exercises, each with a live demo and test cases you can
          run right here.
        </p>

        <nav aria-label="Exercises" className="mt-6">
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {exercises.map((c, i) => (
              <li key={c.title}>
                <a
                  href={`#demo-${i + 1}`}
                  className="text-accent underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {c.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10">
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
