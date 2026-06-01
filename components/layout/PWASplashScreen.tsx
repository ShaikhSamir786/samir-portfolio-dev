"use client";

import { useEffect, useState } from "react";

export default function PWASplashScreen() {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    // Check if the app is launched in standalone (PWA) mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;

    if (isStandalone) {
      // Start fade out after 2.5 seconds (you can adjust this to match your video length)
      const fadeTimer = setTimeout(() => {
        setIsAnimatingOut(true);
      }, 2500);

      // Completely unmount after fade animation finishes
      const unmountTimer = setTimeout(() => {
        setIsUnmounted(true);
      }, 3000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(unmountTimer);
      };
    } else {
      // If viewed in a regular browser, unmount immediately so it doesn't affect performance
      setIsUnmounted(true);
    }
  }, []);

  if (isUnmounted) return null;

  return (
    <div
      className={`pwa-splash-screen fixed inset-0 z-[10000] items-center justify-center bg-[#F2F2F2] transition-opacity duration-500 ${isAnimatingOut ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      <video
        src="/splash_screen.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-48 md:w-64 h-auto object-contain"
      />
    </div>
  );
}
