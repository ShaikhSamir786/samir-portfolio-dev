"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  category: string;
  year: number;
  summary: string;
  thumbnail: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
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
      console.error("Delete error:", err);
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
                  <th className="text-left px-4 py-3 font-medium text-gray-700">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700 hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700 hidden sm:table-cell">
                    Year
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-900 font-medium truncate max-w-[200px]">
                      {project.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {project.category}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                      {project.year}
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
