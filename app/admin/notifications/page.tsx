"use client";

import { useEffect, useState } from "react";
import { FaPaperPlane, FaUsers, FaBlog, FaGlobe } from "react-icons/fa";

interface Subscriber {
  id: string;
  endpoint: string;
  topic: string;
  created_at: string;
}

export default function NotificationsAdmin() {
  const [metrics, setMetrics] = useState({ total: 0, blogsOnly: 0, all: 0 });
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filter, setFilter] = useState<"all" | "blogs" | "everything">("all");
  
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const [image, setImage] = useState("");
  const [targetTopic, setTargetTopic] = useState<"all" | "blogs">("all");
  
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/push/subscribers")
      .then((res) => res.json())
      .then((data) => {
        if (data.metrics) {
          setMetrics(data.metrics);
          setSubscribers(data.subscribers);
        }
      });
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setMessage("");

    try {
      const res = await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, url, image, targetTopic }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Success! Sent to ${data.count} subscribers.`);
        setTitle("");
        setBody("");
        setUrl("/");
        setImage("");
      } else {
        setMessage(data.error || "Failed to send");
      }
    } catch (err) {
      setMessage("An error occurred");
    } finally {
      setSending(false);
    }
  };

  const filteredSubscribers = subscribers.filter((s) => {
    if (filter === "all") return true;
    if (filter === "blogs") return s.topic === "blogs";
    if (filter === "everything") return s.topic === "all";
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left side: Metrics & Subscribers */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6">Notifications Center</h1>
        
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border p-4 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <FaUsers className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Subscribers</p>
              <p className="text-2xl font-bold">{metrics.total}</p>
            </div>
          </div>
          <div className="bg-white border p-4 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <FaBlog className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Blogs Only</p>
              <p className="text-2xl font-bold">{metrics.blogsOnly}</p>
            </div>
          </div>
          <div className="bg-white border p-4 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
              <FaGlobe className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Everything</p>
              <p className="text-2xl font-bold">{metrics.all}</p>
            </div>
          </div>
        </div>

        {/* Filters & List */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-lg">Subscriber List</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border rounded p-1"
            >
              <option value="all">View All</option>
              <option value="blogs">Blogs Only</option>
              <option value="everything">Everything</option>
            </select>
          </div>
          
          <div className="max-h-[500px] overflow-y-auto">
            {filteredSubscribers.length === 0 ? (
              <p className="text-gray-500 p-4 text-center">No subscribers found.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3">ID / Endpoint</th>
                    <th className="px-4 py-3">Topic</th>
                    <th className="px-4 py-3">Subscribed On</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredSubscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 truncate max-w-[200px]" title={s.endpoint}>
                        {s.id.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          s.topic === "blogs" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                        }`}>
                          {s.topic}
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
      </div>

      {/* Right side: Send Notification Form */}
      <div className="w-full lg:w-[400px]">
        <div className="bg-white border rounded-xl shadow-sm p-6 sticky top-24">
          <div className="flex items-center gap-2 mb-6">
            <FaPaperPlane className="text-blue-600" />
            <h2 className="text-xl font-bold">New Notification</h2>
          </div>

          <form onSubmit={handleSend} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New Blog Post: Next.js PWA!"
                className="w-full border rounded-lg p-2 focus:ring-2 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Learn how to turn your app into a PWA..."
                className="w-full border rounded-lg p-2 min-h-[80px] focus:ring-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Target URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/blogs/my-new-post"
                className="w-full border rounded-lg p-2 focus:ring-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://.../cover.jpg"
                className="w-full border rounded-lg p-2 focus:ring-2 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">A large preview image for the notification.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Audience</label>
              <select
                value={targetTopic}
                onChange={(e) => setTargetTopic(e.target.value as any)}
                className="w-full border rounded-lg p-2 focus:ring-2 outline-none"
              >
                <option value="all">Everything Subscribers Only</option>
                <option value="blogs">Blogs + Everything Subscribers</option>
              </select>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${message.includes("Success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-black text-white rounded-lg py-3 font-medium mt-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Notification"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
