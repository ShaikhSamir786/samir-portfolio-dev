"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const TipTapEditor = dynamic(() => import("@/components/admin/TipTapEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-border-primary rounded-xl min-h-[400px] animate-pulse bg-footer-bg" />
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
    <main className="flex flex-1">
      <div className="flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">About</h1>
          <button
            onClick={handleSave}
            title="Save"
            disabled={saving || loading}
            className="rounded-lg bg-background border border-border-primary p-2.5 text-foreground shadow-sm hover:bg-footer-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {saving ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : saved ? (
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            )}
          </button>
        </div>
        {loading ? (
          <div className="border border-border-primary rounded-xl min-h-[400px] animate-pulse bg-footer-bg" />
        ) : (
          <TipTapEditor content={content} onChange={setContent} />
        )}
      </div>
    </main>
  );
}
