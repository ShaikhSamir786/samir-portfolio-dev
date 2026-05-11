"use client";

import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({ downloadUrl }: { downloadUrl: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [containerWidth, setContainerWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    
    // Initial width
    const timeoutId = setTimeout(updateWidth, 100);
    
    window.addEventListener("resize", updateWidth);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  // Use proxy to avoid CORS
  const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(downloadUrl)}`;

  return (
    <div className="flex flex-col items-center w-full" ref={containerRef}>
      <Document
        file={proxyUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex items-center justify-center py-20 text-gray-500">
            <span className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-gray-900 animate-spin mr-3" />
            Loading PDF...
          </div>
        }
        error={
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <p>Failed to load PDF.</p>
            <p className="text-sm mt-2 text-gray-500">Try using the direct link above.</p>
          </div>
        }
      >
        <div className="flex flex-col gap-6 w-full">
          {numPages && Array.from(new Array(numPages), (el, index) => (
            <div key={`page_${index + 1}`} className="shadow-md overflow-hidden bg-white w-full flex justify-center">
              <Page
                pageNumber={index + 1}
                width={containerWidth ? containerWidth : undefined}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="max-w-full"
              />
            </div>
          ))}
        </div>
      </Document>
    </div>
  );
}
