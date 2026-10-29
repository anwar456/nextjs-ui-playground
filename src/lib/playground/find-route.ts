// Drops one trailing slash, then splits into segments. "/" has no segments.
function toSegments(path: string): string[] {
  const trimmed = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  if (trimmed === "/" || trimmed === "") return [];
  return trimmed.slice(1).split("/");
}

// Returns the index of the first pattern that matches `pathname`, or -1.
// ":name" matches exactly one non-empty segment; every other segment must be
// equal, and the pattern must use up every segment of the path.
export function findRoute(patterns: string[], pathname: string): number {
  const segments = toSegments(pathname);

  for (let i = 0; i < patterns.length; i++) {
    const pattern = toSegments(patterns[i]);
    if (pattern.length !== segments.length) continue;

    const matches = pattern.every((part, j) =>
      part.startsWith(":") ? segments[j] !== "" : part === segments[j],
    );
    if (matches) return i;
  }

  return -1;
}
