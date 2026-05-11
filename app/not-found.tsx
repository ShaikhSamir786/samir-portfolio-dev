"use client";

import { useState, useEffect } from "react";

export default function NotFound() {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipped((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div
        className="relative flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        <div className="relative h-[1.2em] w-full text-center">
          <span
            className="block text-4xl sm:text-5xl md:text-7xl font-medium text-gray-400 tracking-tight text-center leading-tight transition-all duration-700 ease-in-out origin-bottom"
            style={{
              fontFamily: "var(--font-playfair)",
              transform: flipped ? "rotateX(-90deg)" : "rotateX(0deg)",
              opacity: flipped ? 0 : 1,
              backfaceVisibility: "hidden",
            }}
          >
            You shall not pass.
          </span>
          <span
            className="absolute top-0 left-0 right-0 text-4xl sm:text-5xl md:text-7xl font-medium text-gray-900 tracking-tight text-center leading-tight transition-all duration-700 ease-in-out origin-top"
            style={{
              fontFamily: "var(--font-playfair)",
              transform: flipped ? "rotateX(0deg)" : "rotateX(90deg)",
              opacity: flipped ? 1 : 0,
              backfaceVisibility: "hidden",
            }}
          >
            404 Page not found.
          </span>
        </div>
      </div>
    </main>
  );
}
