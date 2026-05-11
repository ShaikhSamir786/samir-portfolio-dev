"use client";

import { useState, useEffect } from "react";

export default function Hero() {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipped((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-6 pb-6 pt-4 md:px-10 md:pb-10 md:pt-0 flex-1 flex flex-col">
      <div className="relative w-full flex-1 rounded-b-3xl overflow-hidden">
        {/* Text */}
        <div
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ perspective: "1000px" }}
        >
          <div className="relative h-[1.2em] w-full text-center">
            {/* First text - flips out */}
            <span
              className="block text-4xl sm:text-5xl md:text-7xl font-medium text-gray-400 tracking-tight text-center leading-tight transition-all duration-700 ease-in-out origin-bottom"
              style={{
                fontFamily: "var(--font-playfair)",
                transform: flipped ? "rotateX(-90deg)" : "rotateX(0deg)",
                opacity: flipped ? 0 : 1,
                backfaceVisibility: "hidden",
              }}
            >
              Backend Engineer. AI Enthusiast.
            </span>
            {/* Second text - flips in */}
            <span
              className="absolute top-0 left-0 right-0 text-4xl sm:text-5xl md:text-7xl font-medium text-gray-900 tracking-tight text-center leading-tight transition-all duration-700 ease-in-out origin-top"
              style={{
                fontFamily: "var(--font-playfair)",
                transform: flipped ? "rotateX(0deg)" : "rotateX(90deg)",
                opacity: flipped ? 1 : 0,
                backfaceVisibility: "hidden",
              }}
            >
              Shreyash Swami
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
