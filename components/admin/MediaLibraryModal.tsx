"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FiUpload, FiX, FiCheck, FiTrash2, FiSearch } from "react-icons/fi";

interface MediaItem {
  id: string;
  url: string;
  publicId: string;
  createdAt: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  title = "Media Library"
}: MediaLibraryModalProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && activeTab === "library") {
      fetchMedia();
    }
  }, [isOpen, activeTab]);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onSelect(data.url);
        onClose();
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`/api/media?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
        if (selectedMedia?.id === id) {
          setSelectedMedia(null);
        }
      } else {
        alert("Failed to delete media");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-900/50">
          <button
            onClick={() => setActiveTab("library")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "library"
                ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
            }`}
          >
            Library
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "upload"
                ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
            }`}
          >
            Upload New
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {activeTab === "library" ? (
            isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : media.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
                <FiSearch className="w-12 h-12 mb-4 text-neutral-600" />
                <p>No images found in library.</p>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="mt-4 text-blue-400 hover:text-blue-300"
                >
                  Upload one now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {media.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMedia(item)}
                    className={`relative group cursor-pointer aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedMedia?.id === item.id
                        ? "border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.3)]"
                        : "border-transparent hover:border-neutral-700"
                    }`}
                  >
                    <Image
                      src={item.url}
                      alt="Media item"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                    
                    {/* Overlay */}
                    <div className={`absolute inset-0 bg-black/40 transition-opacity ${
                      selectedMedia?.id === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      {selectedMedia?.id === item.id && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white p-1 rounded-md">
                          <FiCheck className="w-4 h-4" />
                        </div>
                      )}
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete image"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleUpload}
                disabled={isUploading}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex flex-col items-center justify-center w-full max-w-md p-12 border-2 border-dashed border-neutral-700 rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                ) : (
                  <FiUpload className="w-10 h-10 mb-4 text-neutral-500 group-hover:text-blue-400 transition-colors" />
                )}
                <span className="text-lg font-medium text-neutral-300">
                  {isUploading ? "Uploading..." : "Click to select file"}
                </span>
                <span className="text-sm text-neutral-500 mt-2">
                  Images will be optimized automatically
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === "library" && (
          <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedMedia) {
                  onSelect(selectedMedia.url);
                  onClose();
                }
              }}
              disabled={!selectedMedia}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
            >
              <FiCheck className="w-4 h-4" />
              Select Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
