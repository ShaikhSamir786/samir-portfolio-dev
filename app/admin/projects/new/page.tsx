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
            disabled={loading || !title.trim()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Draft"}
          </button>
        </form>
      </div>
    </>
  );
}
