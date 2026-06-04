"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiTrash2, FiSearch } from "react-icons/fi";
import { format } from "date-fns";

interface MediaItem {
  id: string;
  url: string;
  publicId: string;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image? It cannot be undone.")) return;

    try {
      const res = await fetch(`/api/media?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert("Failed to delete media");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete media");
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };

  return (
    <main className="flex-1 p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Media Library</h1>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square bg-hover-bg animate-pulse rounded-xl border border-border-primary" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border-primary rounded-2xl bg-footer-bg">
          <FiSearch className="w-12 h-12 mb-4 text-text-muted" />
          <h3 className="text-lg font-medium text-foreground mb-2">No media found</h3>
          <p className="text-sm text-text-muted">Your uploaded images will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square bg-hover-bg rounded-xl overflow-hidden border border-border-primary shadow-sm hover:shadow-md transition-all"
            >
              <Image
                src={item.url}
                alt="Media upload"
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(item.url);
                    }}
                    className="p-1.5 bg-background/20 hover:bg-background/40 text-background rounded-md backdrop-blur-sm transition-colors"
                    title="Copy URL"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="p-1.5 bg-red-500/80 hover:bg-red-500 text-background rounded-md backdrop-blur-sm transition-colors"
                    title="Delete image"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-background text-xs font-medium truncate drop-shadow-md">
                  {format(new Date(item.createdAt), "MMM d, yyyy")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
