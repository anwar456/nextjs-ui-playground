# Next.js UI Playground

Small TypeScript and React exercises built with the Next.js App Router, each with a live demo and test cases you can run in the browser.

## Exercises

| # | Exercise | Where |
|---|----------|-------|
| 1 | Filter, sort and paginate products | `src/lib/playground/search-products.ts` |
| 2 | Resolve the best matching route | `src/lib/playground/find-route.ts` |
| 3 | Build a safe breadcrumb trail | `src/lib/playground/build-breadcrumbs.ts` |
| 4 | Product card component | `src/components/playground/ProductCard.tsx` |
| 5 | Accessible tabs component | `src/components/playground/Tabs.tsx` |

The demos live in `src/app/_components/`, and the page that lists them is `src/app/page.tsx`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run lint`, `npm run build`, `npm run start`.

## Stack

Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4.
