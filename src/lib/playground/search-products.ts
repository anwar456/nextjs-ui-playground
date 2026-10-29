export type Product = { id: number; name: string };

// Filters by name (case-insensitive "contains"), sorts the matches by name
// (case-insensitive, ascending) and returns the requested one-based page.
// Never mutates `products`. O(n log n): each key is lowercased once, not on
// every comparison.
export function searchProducts(
  products: Product[],
  query: string,
  page: number,
  pageSize: number,
): Product[] {
  if (!(pageSize >= 1)) return [];

  const size = Math.floor(pageSize);
  const safePage = page >= 1 ? Math.floor(page) : 1;
  const q = query.toLowerCase();

  const matches: { product: Product; key: string }[] = [];
  for (const product of products) {
    const key = product.name.toLowerCase();
    if (key.includes(q)) matches.push({ product, key });
  }

  // Array.prototype.sort is stable, so names equal ignoring case keep their input order.
  matches.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));

  const start = (safePage - 1) * size;
  return matches.slice(start, start + size).map((m) => m.product);
}
