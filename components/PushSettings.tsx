"use client";

import { useState, useEffect } from "react";

export function PushSettings() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState<"all" | "blogs">("all");

  // This must match the name in your .env
  const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setSubscription(sub);
        });
      });
    }
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = async () => {
    setLoading(true);
    try {
      // Ask for permission explicitly
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Notification permission denied!");
        setLoading(false);
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub, topic }),
      });

      setSubscription(sub);
    } catch (err) {
      console.error("Failed to subscribe:", err);
      alert("Failed to subscribe to push notifications.");
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card/50 backdrop-blur">
      <div>
        <h3 className="text-lg font-medium text-foreground">Push Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Get notified instantly when I post new updates or blogs!
        </p>
      </div>

      {!subscription ? (
        <div className="flex flex-col gap-3">
          <select 
            value={topic} 
            onChange={(e) => setTopic(e.target.value as "all" | "blogs")}
            className="p-2 bg-background border border-input rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Subscribe to All Updates</option>
            <option value="blogs">Subscribe to Blogs Only</option>
          </select>
          <button 
            onClick={subscribe} 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
          >
            {loading ? "Subscribing..." : "Enable Notifications"}
          </button>
        </div>
      ) : (
        <div className="bg-green-500/10 text-green-500 p-3 rounded-md text-sm font-medium">
          ✓ Subscribed to {topic === "blogs" ? "Blogs" : "All Updates"}
        </div>
      )}
    </div>
  );
}
