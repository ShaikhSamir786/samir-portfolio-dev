"use client";

import { useState, useEffect } from "react";
import { FaBell, FaTimes, FaCheck } from "react-icons/fa";

export function PushSettings() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loadingTopic, setLoadingTopic] = useState<"all" | "blogs" | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

  useEffect(() => {
    const dismissed = localStorage.getItem("push-prompt-dismissed");
    
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setSubscription(sub);
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
  if (!isVisible && !subscription) return null; 
  if (!isVisible && subscription) return null; 

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-50 w-[92%] max-w-sm bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-slide-up-fade">
      
      {!subscription ? (
        <>
          <button 
            onClick={dismiss}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 transition-colors p-1"
            aria-label="Close"
          >
            <FaTimes />
          </button>
          
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-inner">
              <FaBell className="text-blue-500 text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 tracking-tight">Stay in the loop</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Get notified when I publish a new blog or project update. Choose your preference.
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full">
            <button 
              onClick={() => subscribe("blogs")}
              disabled={loadingTopic !== null}
              className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 px-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loadingTopic === "blogs" ? (
                 <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
              ) : "Blogs Only"}
            </button>
            <button 
              onClick={() => subscribe("all")}
              disabled={loadingTopic !== null}
              className="flex-1 bg-black hover:bg-gray-800 text-white text-sm font-medium py-2.5 px-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center shadow-md"
            >
              {loadingTopic === "all" ? (
                <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
              ) : "Everything"}
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-4 py-2">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 shadow-inner text-green-600">
            <FaCheck className="text-lg" />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">
              Successfully subscribed!
            </p>
            <p className="text-sm text-gray-500">
              You're all set to receive updates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
