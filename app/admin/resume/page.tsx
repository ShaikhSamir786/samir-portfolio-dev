"use client";

import { useState, useEffect } from "react";
import ResumeViewer from "@/components/resume/ResumeViewer";

export default function ResumeAdminPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/resume")
      .then((r) => r.json())
      .then((data) => setUrl(data.resume ?? ""))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: url }),
      });
      if (res.ok) setSaved(true);
    } catch (err) {
      console.error("Save resume error:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex flex-1">
      <div className="flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Resume</h1>
          <button
          onClick={handleSave}
          title="Save"
          disabled={saving || loading}
          className="rounded-lg bg-white border border-gray-900 p-2.5 text-gray-900 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {saving ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : saved ? (
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
          )}
        </button>
        </div>
        <div className="max-w-xl">
          <label
            htmlFor="resume-url"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            PDF Link
          </label>
          <p className="text-xs text-gray-400 mb-3">
            Paste a Google Drive or any direct PDF link. For Google Drive, use the{" "}
            <span className="font-mono">preview</span> URL format:{" "}
            <span className="font-mono text-gray-500">
              https://drive.google.com/file/d/FILE_ID/preview
            </span>
          </p>
          <input
            id="resume-url"
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setSaved(false);
            }}
            placeholder="https://drive.google.com/file/d/.../preview"
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors"
          />

          {/* Live preview */}
          {url && (
            <div className="mt-6 max-w-4xl">
              <p className="text-xs font-medium text-gray-500 mb-2">Preview</p>
              <ResumeViewer url={url} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
