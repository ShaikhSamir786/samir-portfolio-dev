"use client";

import React, { useEffect, useState, useRef } from "react";

export default function Cursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Use refs for positions to avoid React state batching and re-renders on every frame
  const cursorDotPos = useRef({ x: 0, y: 0 });
  const cursorRingPos = useRef({ x: 0, y: 0 });

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const requestRef = useRef<number>(0);

  useEffect(() => {
    // Check if device supports hover (not a touch device)
    if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
      setIsVisible(true);
    } else {
      return; // Do not initialize on touch devices
    }

    const onMouseMove = (e: MouseEvent) => {
      cursorDotPos.current.x = e.clientX;
      cursorDotPos.current.y = e.clientY;

      // Update dot instantly for better responsiveness
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Check if we're hovering over something clickable
      const target = e.target as HTMLElement;
      const isClickable =
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button');

      setIsHovering(!!isClickable);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    // Handle cursor leaving the window
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Animation loop for the ring (smooth follow)
    const render = () => {
      // Lerp factor for the ring (0.2 is fast/smooth, avoiding the "slow fluid" feel)
      const lerp = 0.25;

      cursorRingPos.current.x += (cursorDotPos.current.x - cursorRingPos.current.x) * lerp;
      cursorRingPos.current.y += (cursorDotPos.current.y - cursorRingPos.current.y) * lerp;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${cursorRingPos.current.x}px, ${cursorRingPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    // Add global style to hide default cursor
    document.body.style.cursor = "none";
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      * { cursor: none !important; }
    `;
    document.head.appendChild(styleEl);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(requestRef.current);

      document.body.style.cursor = "auto";
      if (document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-2 border-white mix-blend-difference transition-all duration-200 ease-out flex items-center justify-center`}
        style={{
          width: isClicking ? '24px' : isHovering ? '40px' : '32px',
          height: isClicking ? '24px' : isHovering ? '40px' : '32px',
          willChange: 'transform, width, height'
        }}
      />
    </>
  );
}
