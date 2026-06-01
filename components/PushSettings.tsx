"use client";

import { useState, useEffect } from "react";
import { FaBell, FaTimes, FaCheck } from "react-icons/fa";

export function PushSettings() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loadingTopic, setLoadingTopic] = useState<"all" | "blogs" | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // This must match the name in your .env
  const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

  useEffect(() => {
    const dismissed = localStorage.getItem("push-prompt-dismissed");
    
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setSubscription(sub);
          // Show the prompt if not subscribed and not dismissed, 
          // adding a slight delay for better UX
          if (!sub && !dismissed) {
             setTimeout(() => setIsVisible(true), 1500);
          }
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

  const subscribe = async (topic: "all" | "blogs") => {
    setLoadingTopic(topic);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Notification permission denied!");
        setLoadingTopic(null);
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
      
      // Keep it visible briefly to show the success state, then hide
      setTimeout(() => setIsVisible(false), 3000); 
    } catch (err) {
      console.error("Failed to subscribe:", err);
      alert("Failed to subscribe to push notifications.");
    } finally {
      setLoadingTopic(null);
    }
  };

  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem("push-prompt-dismissed", "true");
  };

  if (!isSupported) return null;
  if (!isVisible && !subscription) return null; // Hidden if dismissed or not ready
  if (!isVisible && subscription) return null; // Hidden if successfully subscribed

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-50 w-[92%] max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-2xl animate-slide-up-fade">
      
      {!subscription ? (
        <>
          <button 
            onClick={dismiss}
            className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1"
            aria-label="Close"
          >
            <FaTimes />
          </button>
          
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0 shadow-inner">
              <FaBell className="text-blue-500 text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Stay in the loop</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Get notified when I publish a new blog or project update. Choose your preference.
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full">
            <button 
              onClick={() => subscribe("blogs")}
              disabled={loadingTopic !== null}
              className="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-sm font-medium py-2.5 px-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loadingTopic === "blogs" ? (
                 <span className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></span>
              ) : "Blogs Only"}
            </button>
            <button 
              onClick={() => subscribe("all")}
              disabled={loadingTopic !== null}
              className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium py-2.5 px-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center shadow-md"
            >
              {loadingTopic === "all" ? (
                <span className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></span>
              ) : "Everything"}
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-4 py-2">
          <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center flex-shrink-0 shadow-inner text-green-600 dark:text-green-500">
            <FaCheck className="text-lg" />
          </div>
          <div>
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Successfully subscribed!
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              You're all set to receive updates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
