"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Subscriber {
  id: string;
  endpoint: string;
  topic: string;
  created_at: string;
}

export default function NotificationsAdminPage() {
  const [metrics, setMetrics] = useState({ total: 0, blogsOnly: 0, all: 0 });
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filter, setFilter] = useState<"all" | "blogs" | "everything">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    try {
      const res = await fetch("/api/push/subscribers");
      if (res.ok) {
        const data = await res.json();
        if (data.metrics) {
          setMetrics(data.metrics);
          setSubscribers(data.subscribers);
        }
      }
    } catch (err) {
      console.error("Failed to fetch subscribers:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredSubscribers = subscribers.filter((s) => {
    if (filter === "all") return true;
    if (filter === "blogs") return s.topic === "blogs";
    if (filter === "everything") return s.topic === "all";
    return true;
  });

  return (
    <main className="flex flex-1">
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/notifications/logs"
              title="View Logs"
              className="rounded-lg bg-background border border-border-primary p-2.5 text-text-secondary shadow-sm hover:bg-footer-bg transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </Link>
            <Link
              href="/admin/notifications/new"
              title="Send Notification"
              className="rounded-lg bg-background border border-border-primary p-2.5 text-foreground shadow-sm hover:bg-footer-bg transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </Link>
          </div>
        </div>
        {/* Metrics */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 border border-border-primary rounded-xl p-5 bg-background shadow-sm">
            <p className="text-sm font-medium text-text-muted uppercase tracking-wider mb-1">Total</p>
            <p className="text-3xl font-semibold text-foreground">{metrics.total}</p>
          </div>
          <div className="flex-1 border border-border-primary rounded-xl p-5 bg-background shadow-sm">
            <p className="text-sm font-medium text-text-muted uppercase tracking-wider mb-1">Blogs Only</p>
            <p className="text-3xl font-semibold text-foreground">{metrics.blogsOnly}</p>
          </div>
          <div className="flex-1 border border-border-primary rounded-xl p-5 bg-background shadow-sm">
            <p className="text-sm font-medium text-text-muted uppercase tracking-wider mb-1">All Updates</p>
            <p className="text-3xl font-semibold text-foreground">{metrics.all}</p>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">Subscribers</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="rounded-lg border border-border-primary px-4 py-2.5 text-sm text-foreground focus:border-border-primary outline-none transition-colors appearance-none bg-background cursor-pointer pr-8"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.25em 1.25em'
            }}
          >
            <option value="all">View All</option>
            <option value="blogs">Blogs Only</option>
            <option value="everything">All Updates</option>
          </select>
        </div>

        <div className="border border-border-primary rounded-xl overflow-hidden bg-background shadow-sm">
          {loading ? (
            <p className="text-sm text-text-muted p-6">Loading subscribers...</p>
          ) : filteredSubscribers.length === 0 ? (
            <p className="text-sm text-text-muted p-6">No subscribers found.</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-footer-bg border-b border-border-primary text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Topic</th>
                  <th className="px-4 py-3 font-medium">Date Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {filteredSubscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-footer-bg">
                    <td className="px-4 py-3 text-foreground font-medium truncate max-w-[150px] sm:max-w-[250px]">
                      {s.id.slice(0, 13)}...
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${s.topic === "blogs"
                          ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                          : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                        }`}>
                        {s.topic === "blogs" ? "Blogs" : "All"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
