"use client";

import { useState, useEffect } from "react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  seen: boolean;
  created_at: string;
}

export default function ContactAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleSeen(id: string, currentSeen: boolean) {
    try {
      // Optimistic update
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, seen: !currentSeen } : msg))
      );
      
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seen: !currentSeen }),
      });
      
      if (!res.ok) {
        // Revert on error
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, seen: currentSeen } : msg))
        );
      }
    } catch (error) {
      console.error("Failed to toggle seen status:", error);
    }
  }

  async function markAllSeen() {
    try {
      setMessages((prev) => prev.map((msg) => ({ ...msg, seen: true })));
      await fetch("/api/contact/seen-all", { method: "POST" });
    } catch (error) {
      console.error("Failed to mark all as seen:", error);
    }
  }

  async function sendReply() {
    if (!replyingTo || !replyText.trim()) return;
    
    setSendingReply(true);
    try {
      const res = await fetch(`/api/contact/${replyingTo.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText }),
      });
      
      if (res.ok) {
        alert("Reply sent successfully!");
        setReplyingTo(null);
        setReplyText("");
        // Mark as seen if it wasn't
        if (!replyingTo.seen) {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === replyingTo.id ? { ...msg, seen: true } : msg))
          );
        }
      } else {
        const data = await res.json();
        alert(`Failed to send reply: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
      alert("Failed to send reply. Please check console.");
    } finally {
      setSendingReply(false);
    }
  }

  if (loading) {
    return <div className="p-10 text-text-muted">Loading messages...</div>;
  }

  return (
    <main className="flex flex-1">
      <div className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Contact Messages</h1>
          <button
          onClick={markAllSeen}
          className="rounded-lg bg-hover-bg px-4 py-2 text-sm font-medium text-text-secondary hover:bg-gray-200 transition-colors"
        >
          Mark all as seen
        </button>
        </div>
        {messages.length === 0 ? (
          <p className="text-text-muted text-sm">No messages yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col p-5 rounded-xl border transition-colors ${
                  msg.seen ? "bg-background border-border-primary" : "bg-footer-bg border-border-primary shadow-sm"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-medium text-foreground flex items-center gap-2">
                      {msg.name} 
                      {!msg.seen && (
                        <span className="w-2 h-2 rounded-full bg-blue-500" title="New Message"></span>
                      )}
                    </h3>
                    <a href={`mailto:${msg.email}`} className="text-sm text-text-muted hover:underline">
                      {msg.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-xs text-text-muted">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                    <button
                      onClick={() => toggleSeen(msg.id, msg.seen)}
                      className="p-1.5 text-text-muted hover:text-text-secondary transition-colors"
                      title={msg.seen ? "Mark as unread" : "Mark as seen"}
                    >
                      {msg.seen ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => setReplyingTo(msg)}
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-md"
                    >
                      Reply
                    </button>
                  </div>
                </div>
                <div className="border-t border-border-primary pt-3">
                  <p className="font-medium text-sm text-foreground mb-1">Subject: {msg.subject}</p>
                  <p className="text-sm text-text-muted whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-background rounded-2xl p-6 w-full max-w-2xl shadow-xl">
            <h3 className="text-lg font-semibold mb-1">Reply to {replyingTo.name}</h3>
            <p className="text-sm text-text-muted mb-4">Re: {replyingTo.subject}</p>
            
            <textarea
              className="w-full rounded-lg border border-border-primary p-3 text-sm focus:border-border-primary outline-none resize-y min-h-[200px] mb-4"
              placeholder="Write your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={sendingReply}
            />
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setReplyingTo(null)}
                disabled={sendingReply}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:bg-hover-bg rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                disabled={sendingReply || !replyText.trim()}
                className="px-4 py-2 text-sm font-medium text-background bg-foreground hover:opacity-90 rounded-lg transition-colors disabled:opacity-50"
              >
                {sendingReply ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
