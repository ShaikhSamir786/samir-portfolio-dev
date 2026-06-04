"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import TipTapEditor from "./TipTapEditor";
import MediaLibraryModal from "./MediaLibraryModal";

interface BlogData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  is_published: boolean;
}

interface BlogFormProps {
  initialData?: BlogData;
  blogId?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogForm({ initialData, blogId }: BlogFormProps) {
  const router = useRouter();
  const isEdit = Boolean(blogId);

  const [form, setForm] = useState<BlogData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    cover_image_url: initialData?.cover_image_url || "",
    is_published: initialData?.is_published ?? false,
  });

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: isEdit ? prev.slug : slugify(title),
    }));
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
  }



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isEdit ? `/api/blogs/${blogId}` : "/api/blogs";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save blog");
      }

      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="title" className={labelClass}>
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={handleTitleChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>
            Slug *
          </label>
          <input
            id="slug"
            type="text"
            value={form.slug}
            onChange={handleSlugChange}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="excerpt" className={labelClass}>
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={form.excerpt}
          onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
          rows={3}
          className={`${inputClass} resize-y`}
          placeholder="Short summary shown in blog cards..."
        />
      </div>

      <div className="mb-4">
        <label className={labelClass}>Cover Image</label>
        <div className="flex flex-col gap-4">
          <div>
            <button
              type="button"
              onClick={() => setIsMediaModalOpen(true)}
              className="inline-block cursor-pointer rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Choose from Library
            </button>
          </div>
          {form.cover_image_url && (
            <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-gray-50 aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.cover_image_url}
                alt="Cover preview"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className={labelClass}>Content *</label>
        <TipTapEditor
          content={form.content}
          onChange={(html) => setForm((p) => ({ ...p, content: html }))}
          stickyToolbar={true}
        />
      </div>

      <div className="flex items-center gap-3 mb-8">
        <input
          id="is_published"
          type="checkbox"
          checked={form.is_published}
          onChange={(e) =>
            setForm((p) => ({ ...p, is_published: e.target.checked }))
          }
          className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-200"
        />
        <label htmlFor="is_published" className="text-sm text-gray-700">
          Publish immediately
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          title={isEdit ? "Update Blog" : "Create Blog"}
          disabled={loading}
          className="rounded-xl bg-white border border-gray-900 p-3 text-gray-900 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => setForm((prev) => ({ ...prev, cover_image_url: url }))}
      />
    </form>
  );
}
