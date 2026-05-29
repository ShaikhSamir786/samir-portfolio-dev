"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Auto-generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/projects/${data.id}/edit`);
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to create project");
      }
    } catch (err: any) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">New Project</h2>
        <Link
          href="/admin/projects"
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Cancel
        </Link>
      </div>

      <div className="flex-1 p-6 md:p-10">
        <form onSubmit={handleSubmit} className="max-w-xl">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Project Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-gray-400 outline-none transition-colors mb-4"
            placeholder="e.g. My Awesome App"
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            title="Create Draft"
            disabled={loading || !title.trim()}
            className="rounded-lg bg-white border border-gray-900 p-2.5 text-gray-900 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
