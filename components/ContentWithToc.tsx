"use client";

import { useRef } from "react";
import TableOfContents from "./TableOfContents";
import HtmlParser from "./HtmlParser";

interface ContentWithTocProps {
  html: string;
  className?: string;
}

export default function ContentWithToc({ html, className }: ContentWithTocProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <TableOfContents contentRef={contentRef} />
      <div ref={contentRef}>
        <HtmlParser html={html} className={className} />
      </div>
    </div>
  );
}
