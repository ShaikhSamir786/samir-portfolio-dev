import Link from "next/link";
import { APP_URL } from "@/lib/site-config";

export interface Crumb {
  /** Human-readable label shown in the trail and used for the schema `name`. */
  name: string;
  /** Root-relative path, e.g. "/" or "/blogs" or "/blogs/my-post". The last item is treated as the current page. */
  href: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

/**
 * Renders an accessible breadcrumb trail plus a matching BreadcrumbList JSON-LD
 * block. This is the single source of truth for breadcrumbs — do not emit a
 * separate BreadcrumbList schema on the same page.
 */
export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${APP_URL}${item.href === "/" ? "" : item.href}`,
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={className ?? "mb-6"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-foreground font-medium">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              )}
              {!isLast && (
                <span aria-hidden="true" className="opacity-50 font-mono">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
