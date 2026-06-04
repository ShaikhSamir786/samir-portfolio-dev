"use client";

import { useState } from "react";
import { deleteNotificationLog } from "@/app/admin/notifications/logs/actions";

export function DeleteLogButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this log?")) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteNotificationLog(id);
      if (!res.success) {
        alert(res.error || "Failed to delete log");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete log");
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        title="Delete"
        className="rounded-md bg-white border border-gray-200 p-2 text-gray-600 shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center disabled:opacity-50"
      >
        {isDeleting ? (
          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        )}
      </button>
    </div>
  );
}
