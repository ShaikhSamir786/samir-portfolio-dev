"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import type { TipTapEditorHandle } from "@/components/admin/TipTapEditor";

const TipTapEditor = dynamic(() => import("@/components/admin/TipTapEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-border-primary rounded-xl min-h-[200px] animate-pulse bg-footer-bg" />
  ),
});

export default function AboutAdminPage() {
  const [past, setPast] = useState("");
  const [present, setPresent] = useState("");
  const [future, setFuture] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Refs to each editor for imperative HTML import
  const pastRef = useRef<TipTapEditorHandle>(null);
  const presentRef = useRef<TipTapEditorHandle>(null);
  const futureRef = useRef<TipTapEditorHandle>(null);

  // HTML import modal state
  const [importModal, setImportModal] = useState<{
    open: boolean;
    sectionKey: "past" | "present" | "future";
    draft: string;
  }>({ open: false, sectionKey: "past", draft: "" });

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((data) => {
        setPast(data.description ?? "");
        setPresent(data.present ?? "");
        setFuture(data.future ?? "");
      })
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
        body: JSON.stringify({ description: past, present, future }),
      });
      if (res.ok) setSaved(true);
    } catch (err) {
      console.error("Save about error:", err);
    } finally {
      setSaving(false);
    }
  }

  const openImport = useCallback((sectionKey: "past" | "present" | "future") => {
    setImportModal({ open: true, sectionKey, draft: "" });
  }, []);

  function applyImport() {
    const { sectionKey, draft } = importModal;
    const refMap = { past: pastRef, present: presentRef, future: futureRef };
    refMap[sectionKey].current?.setHtmlContent(draft);
    setImportModal((m) => ({ ...m, open: false, draft: "" }));
  }

  const SaveIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  );
  const SpinnerIcon = () => (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
  const CheckIcon = () => (
    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const sections = [
    {
      key: "past" as const,
      ref: pastRef,
      label: "Past",
      badge: "v1.0 — foundation",
      badgeVariant: "default" as const,
      description: "Your background, education, and early career.",
      value: past,
      onChange: setPast,
    },
    {
      key: "present" as const,
      ref: presentRef,
      label: "Present",
      badge: "HEAD → main",
      badgeVariant: "active" as const,
      description: "What you're building and doing right now.",
      value: present,
      onChange: setPresent,
    },
    {
      key: "future" as const,
      ref: futureRef,
      label: "Future",
      badge: "roadmap / next",
      badgeVariant: "dashed" as const,
      description: "Where you're headed and what you're aiming for.",
      value: future,
      onChange: setFuture,
    },
  ];

  return (
    <main className="flex flex-1">
      <div className="flex-1 p-6 md:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">About</h1>
            <p className="text-sm text-text-muted mt-1 font-mono">
              past → present → future
            </p>
          </div>
          <button
            onClick={handleSave}
            title="Save all sections"
            disabled={saving || loading}
            className="rounded-lg bg-background border border-border-primary p-2.5 text-foreground shadow-sm hover:bg-footer-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {saving ? <SpinnerIcon /> : saved ? <CheckIcon /> : <SaveIcon />}
          </button>
        </div>

        {/* Three section editors */}
        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <div key={section.key}>
              {/* Section label row */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span
                  className={`font-mono text-xs px-2 py-0.5 rounded border ${
                    section.badgeVariant === "active"
                      ? "text-green-600 dark:text-green-400 border-green-500/40 bg-green-500/10 font-semibold"
                      : section.badgeVariant === "dashed"
                      ? "text-text-muted border-dashed border-border-primary"
                      : "text-text-muted border-border-primary"
                  }`}
                >
                  {section.badge}
                </span>
                <h2 className="text-base font-semibold tracking-tight">
                  {section.label}
                </h2>
                <span className="text-xs text-text-muted">{section.description}</span>
                {/* Import HTML button */}
                <button
                  type="button"
                  onClick={() => openImport(section.key)}
                  className="ml-auto font-mono text-[11px] px-2 py-0.5 rounded border border-border-primary text-text-muted hover:bg-footer-bg hover:text-foreground transition-colors"
                  title="Paste raw HTML to set content"
                >
                  &lt;/&gt; set HTML
                </button>
              </div>

              {/* Editor */}
              {loading ? (
                <div className="border border-border-primary rounded-xl min-h-[200px] animate-pulse bg-footer-bg" />
              ) : (
                <TipTapEditor
                  ref={section.ref}
                  content={section.value}
                  onChange={section.onChange}
                />
              )}
            </div>
          ))}
        </div>

        {/* Bottom save button */}
        {!loading && (
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-background border border-border-primary px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-footer-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <SpinnerIcon /> : saved ? <CheckIcon /> : <SaveIcon />}
              {saving ? "Saving…" : saved ? "Saved!" : "Save all"}
            </button>
          </div>
        )}
      </div>

      {/* HTML Import Modal */}
      {importModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border-primary rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold tracking-tight">
                Set HTML — <span className="font-mono text-sm text-text-muted capitalize">{importModal.sectionKey}</span>
              </h3>
              <button
                onClick={() => setImportModal((m) => ({ ...m, open: false }))}
                className="text-text-muted hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-text-muted">
              Paste raw HTML below. TipTap will parse and render it properly in the editor.
            </p>
            <textarea
              autoFocus
              className="font-mono text-xs bg-footer-bg border border-border-primary rounded-lg p-3 min-h-[240px] resize-y outline-none focus:border-green-500/50 transition-colors text-foreground"
              placeholder="<p>Your <strong>content</strong> here...</p>"
              value={importModal.draft}
              onChange={(e) => setImportModal((m) => ({ ...m, draft: e.target.value }))}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setImportModal((m) => ({ ...m, open: false }))}
                className="px-4 py-2 text-sm rounded-lg border border-border-primary text-text-muted hover:bg-footer-bg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyImport}
                disabled={!importModal.draft.trim()}
                className="px-4 py-2 text-sm rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Apply HTML
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
