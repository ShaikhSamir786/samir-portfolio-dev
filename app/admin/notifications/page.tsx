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
          <Link
          href="/admin/notifications/new"
          title="Send Notification"
          className="rounded-lg bg-white border border-gray-900 p-2.5 text-gray-900 shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </Link>
        </div>
        {/* Metrics */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total</p>
            <p className="text-3xl font-semibold text-gray-900">{metrics.total}</p>
          </div>
          <div className="flex-1 border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Blogs Only</p>
            <p className="text-3xl font-semibold text-gray-900">{metrics.blogsOnly}</p>
          </div>
          <div className="flex-1 border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">All Updates</p>
            <p className="text-3xl font-semibold text-gray-900">{metrics.all}</p>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Subscribers</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-gray-400 outline-none transition-colors appearance-none bg-white cursor-pointer pr-8"
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

        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          {loading ? (
            <p className="text-sm text-gray-400 p-6">Loading subscribers...</p>
          ) : filteredSubscribers.length === 0 ? (
            <p className="text-sm text-gray-400 p-6">No subscribers found.</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Topic</th>
                  <th className="px-4 py-3 font-medium">Date Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-900 font-medium truncate max-w-[150px] sm:max-w-[250px]">
                      {s.id.slice(0, 13)}...
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${s.topic === "blogs"
                          ? "bg-gray-50 text-gray-600 border-gray-200"
                          : "bg-gray-900 text-white border-gray-900"
                        }`}>
                        {s.topic === "blogs" ? "Blogs" : "All"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
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
