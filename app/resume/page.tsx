import type { Metadata } from "next";
import { query } from "@/lib/db";
import ResumeViewer from "@/components/resume/ResumeViewer";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Resume | Shreyash Swami",
  description: "View and download my resume.",
};

async function getResumeUrl(): Promise<string> {
  try {
    const result = await query("SELECT resume FROM resume LIMIT 1");
    return ((result.rows[0] as { resume: string } | undefined)?.resume) ?? "";
  } catch {
    return "";
  }
}

export default async function ResumePage() {
  const url = await getResumeUrl();

  return (
    <main className="flex flex-col flex-1 px-6 pb-20 md:px-10">
      <PageHeader title="Resume">
        {url && (
          <a
            href={(() => {
              const m = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
              return m ? `https://drive.google.com/uc?export=download&id=${m[1]}` : url;
            })()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v8M5 7l3 3 3-3M2 12h12" />
            </svg>
            Download
          </a>
        )}
      </PageHeader>
      <div className="max-w-4xl mx-auto w-full">
        <ResumeViewer url={url} />
      </div>
    </main>
  );
}
