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
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Resume</h2>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-10">
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
    </>
  );
}
