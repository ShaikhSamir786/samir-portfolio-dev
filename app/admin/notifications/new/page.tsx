"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

export default function NewNotificationPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const [image, setImage] = useState("");
  const [targetTopic, setTargetTopic] = useState<"all" | "blogs">("all");

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");



  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, url, image, targetTopic }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/notifications");
      } else {
        setError(data.error || "Failed to send");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <main className="flex flex-1">
      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-semibold mb-8 tracking-tight">
          New Notification
        </h1>

        <form onSubmit={handleSend} className="w-full">
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New Blog Post!"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Target URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/blogs/my-new-post"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className={labelClass}>Audience *</label>
            <select
              value={targetTopic}
              onChange={(e) => setTargetTopic(e.target.value as any)}
              className={`${inputClass} appearance-none bg-white cursor-pointer pr-8`}
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25em 1.25em'
              }}
            >
              <option value="all">All Update Subscribers</option>
              <option value="blogs">Blogs Only + All Update Subscribers</option>
            </select>
          </div>

          <div className="mb-8">
            <label className={labelClass}>Notification Image</label>
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
              {image && (
                <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-gray-50 aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt="Notification preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className={labelClass}>Description *</label>
            <textarea
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Check out my latest updates..."
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              title="Dispatch Notification"
              disabled={sending}
              className="rounded-xl bg-white border border-gray-900 p-3 text-gray-900 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {sending ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              )}
            </button>
            <button type="button" onClick={() => router.push("/admin/notifications")} className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => setImage(url)}
      />
    </main>
  );
}
