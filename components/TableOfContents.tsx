"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Parse HTML string and extract h1/h2 headings.
 * Also injects `id` attributes into the actual DOM headings.
 */
function useHeadings(contentRef: React.RefObject<HTMLElement | null>): TocItem[] {
  const [headings, setHeadings] = useState<TocItem[]>([]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const nodes = el.querySelectorAll("h1, h2");
    const items: TocItem[] = [];
    const usedIds = new Set<string>();

    nodes.forEach((node) => {
      const text = (node as HTMLElement).innerText.trim();
      if (!text) return;

      let id = slugify(text);
      // ensure unique ids
      if (usedIds.has(id)) {
        let i = 2;
        while (usedIds.has(`${id}-${i}`)) i++;
        id = `${id}-${i}`;
      }
      usedIds.add(id);

      node.setAttribute("id", id);
      items.push({
        id,
        text,
        level: node.tagName === "H1" ? 1 : 2,
      });
    });

    setHeadings(items);
  }, [contentRef]);

  return headings;
}

function useActiveHeading(headings: TocItem[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that is currently intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

export default function TableOfContents({
  contentRef,
}: {
  contentRef: React.RefObject<HTMLElement | null>;
}) {
  const headings = useHeadings(contentRef);
  const activeId = useActiveHeading(headings);
  const [mobileOpen, setMobileOpen] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Update URL hash without jumping
        window.history.replaceState(null, "", `#${id}`);
      }
      setMobileOpen(false);
    },
    []
  );

  // Close mobile TOC on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    function handleOutside(e: MouseEvent) {
      if (tocRef.current && !tocRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [mobileOpen]);

  if (headings.length === 0) return null;

  const tocLinks = (
    <nav aria-label="Table of contents">
      <ul className="toc-list">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 2 ? "toc-indent" : ""}>
            <a
              href={`#${h.id}`}
              onClick={(e) => handleClick(e, h.id)}
              className={`toc-link ${activeId === h.id ? "toc-active" : ""}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* ── Desktop: sticky sidebar ── */}
      <aside className="toc-desktop" aria-label="Table of contents">
        <div className="toc-sticky">
          <p className="toc-title">On this page</p>
          {tocLinks}
        </div>
      </aside>

      {/* ── Mobile: floating button + dropdown ── */}
      <div className="toc-mobile" ref={tocRef}>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="toc-mobile-btn"
          aria-expanded={mobileOpen}
          aria-label="Toggle table of contents"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="10" y2="18" />
          </svg>
        </button>

        {mobileOpen && (
          <div className="toc-mobile-dropdown">
            <p className="toc-title">On this page</p>
            {tocLinks}
          </div>
        )}
      </div>
    </>
  );
}
