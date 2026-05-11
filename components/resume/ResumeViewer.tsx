"use client";

import dynamic from "next/dynamic";

const DynamicPDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 py-32">
      <span className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-gray-900 animate-spin mr-3" />
      <span className="text-sm text-gray-500">Loading viewer...</span>
    </div>
  ),
});

/**
 * Converts any Google Drive share/view/open URL to the embeddable /preview format.
 * Non-Drive URLs are passed through unchanged.
 */
function toEmbedUrl(url: string): string {
  try {
    // Match: drive.google.com/file/d/FILE_ID/...
    const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) {
      return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
    }

    // Match: drive.google.com/open?id=FILE_ID
    const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
    if (openMatch) {
      return `https://drive.google.com/file/d/${openMatch[1]}/preview`;
    }

    // Match: docs.google.com/...?id=FILE_ID or similar
    const docsMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (docsMatch && url.includes("google.com")) {
      return `https://drive.google.com/file/d/${docsMatch[1]}/preview`;
    }
  } catch {
    // fall through
  }
  return url;
}

function toDownloadUrl(url: string): string {
  try {
    const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) {
      return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
    }
    const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
    if (openMatch) {
      return `https://drive.google.com/uc?export=download&id=${openMatch[1]}`;
    }
  } catch {
    // fall through
  }
  return url;
}

export default function ResumeViewer({ url }: { url: string }) {
  if (!url) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 py-32">
        <p className="text-sm text-gray-400">Resume not uploaded yet.</p>
      </div>
    );
  }

  const embedUrl = toEmbedUrl(url);
  const downloadUrl = toDownloadUrl(url);

  return (
    <div className="flex flex-col gap-4">
      {/* Fallback download button in case viewer is blocked */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          If the viewer doesn&apos;t load, open it directly →
        </p>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Open in Drive ↗
        </a>
      </div>

      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 p-4 sm:p-8">
        <DynamicPDFViewer downloadUrl={downloadUrl} />
      </div>
    </div>
  );
}
