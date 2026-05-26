"use client";

import { useRef } from "react";
import TableOfContents from "./TableOfContents";

interface ContentWithTocProps {
  html: string;
  className?: string;
}

export default function ContentWithToc({ html, className }: ContentWithTocProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <TableOfContents contentRef={contentRef} />
      <div
        ref={contentRef}
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
