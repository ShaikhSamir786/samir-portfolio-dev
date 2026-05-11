"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  created_at: string;
}

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePublish(id: string, current: boolean) {
    setToggling((prev) => new Set(prev).add(id));
    // Optimistic update
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, is_published: !current } : b))
    );
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed");
    } catch {
      // Roll back on error
      setBlogs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, is_published: current } : b))
      );
    } finally {
      setToggling((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert("Failed to delete blog");
      }
    } catch (err) {
      console.error("Delete blog error:", err);
      alert("Failed to delete blog");
    }
  }

  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Blogs</h2>
        <Link
          href="/admin/blogs/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Add Blog
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-10 overflow-auto">
        {loading ? (
          <p className="text-sm text-gray-400">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-sm text-gray-400">
            No blogs yet. Click &quot;Add Blog&quot; to create one.
          </p>
        ) : (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700 hidden md:table-cell">
                    Slug
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700 hidden sm:table-cell">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-900 font-medium truncate max-w-[200px]">
                      {blog.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {blog.slug}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <button
                        onClick={() => handleTogglePublish(blog.id, blog.is_published)}
                        disabled={toggling.has(blog.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                          blog.is_published
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        }`}
                      >
                        {toggling.has(blog.id) ? (
                          <span className="w-2.5 h-2.5 rounded-full border border-current border-t-transparent animate-spin" />
                        ) : (
                          <span className={`w-1.5 h-1.5 rounded-full ${blog.is_published ? "bg-green-500" : "bg-amber-500"}`} />
                        )}
                        {blog.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blogs/${blog.id}/edit`}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
