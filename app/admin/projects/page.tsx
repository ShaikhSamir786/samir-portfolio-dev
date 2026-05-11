"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  created_at: string;
  technologies: string[] | null;
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePublish(id: string, current: boolean) {
    setToggling((prev) => new Set(prev).add(id));
    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_published: !current } : p))
    );
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !current })
      });
      if (!res.ok) throw new Error("Failed");
    } catch {
      // Roll back on error
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_published: current } : p))
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
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete project");
      }
    } catch (err) {
      console.error("Delete project error:", err);
      alert("Failed to delete project");
    }
  }

  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Add Project
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-10 overflow-auto">
        {loading ? (
          <p className="text-sm text-gray-400">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-gray-400">
            No projects yet. Click &quot;Add Project&quot; to create one.
          </p>
        ) : (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700 hidden md:table-cell">Slug</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700 hidden sm:table-cell">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-900 font-medium truncate max-w-[200px]">
                      {project.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {project.slug}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <button
                        onClick={() => handleTogglePublish(project.id, project.is_published)}
                        disabled={toggling.has(project.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                          project.is_published
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        }`}
                      >
                        {toggling.has(project.id) ? (
                          <span className="w-2.5 h-2.5 rounded-full border border-current border-t-transparent animate-spin" />
                        ) : (
                          <span className={`w-1.5 h-1.5 rounded-full ${project.is_published ? "bg-green-500" : "bg-amber-500"}`} />
                        )}
                        {project.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id)}
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
