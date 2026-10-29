export type Breadcrumb = { label: string; href: string };

// A malformed escape such as "%E0%A4%A" makes decodeURIComponent throw; keep
// the raw segment instead of failing the whole trail.
function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

// One breadcrumb per non-empty path prefix. `labels` is keyed by the decoded
// segment; without a label the decoded segment is used, hyphens as spaces.
// Each href is the encoded prefix up to and including that segment.
export function buildBreadcrumbs(
  pathname: string,
  labels: Record<string, string>,
): Breadcrumb[] {
  const crumbs: Breadcrumb[] = [];
  let href = "";

  for (const raw of pathname.split("/")) {
    if (raw === "") continue;

    const segment = safeDecode(raw);
    href += `/${encodeURIComponent(segment)}`;
    crumbs.push({
      // hasOwn so a segment like "constructor" does not pick up Object.prototype.
      label: Object.hasOwn(labels, segment) ? labels[segment] : segment.replaceAll("-", " "),
      href,
    });
  }

  return crumbs;
}
