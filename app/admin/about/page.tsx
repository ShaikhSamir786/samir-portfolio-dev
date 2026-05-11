"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const TipTapEditor = dynamic(() => import("@/components/admin/TipTapEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 rounded-xl min-h-[400px] animate-pulse bg-gray-50" />
  ),
});

export default function AboutAdminPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((data) => setContent(data.description ?? ""))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: content }),
      });
      if (res.ok) setSaved(true);
    } catch (err) {
      console.error("Save about error:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">About</h2>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6 md:p-10 overflow-auto">
        {loading ? (
          <div className="border border-gray-200 rounded-xl min-h-[400px] animate-pulse bg-gray-50" />
        ) : (
          <TipTapEditor content={content} onChange={setContent} />
        )}
      </div>
    </>
  );
}
