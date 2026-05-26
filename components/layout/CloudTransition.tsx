"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef, useCallback } from "react";

/**
 * CloudTransition — adaptive page transition.
 *
 * Fast loads (< 300ms):  quick white fade in → fade out.  No clouds.
 * Slow loads (> 300ms):  fade in → clouds close → wait → clouds open.
 *
 * Two independent "ready" flags gate the opening:
 *   • closingDone — the cloud-close animation has finished
 *   • pageLoaded  — Next.js has swapped the pathname
 * Clouds only open once BOTH are true, so the animation never reverses
 * mid-close and content never leaks through.
 */

type Phase =
  | "hidden"    // nothing rendered
  | "fading"    // backdrop fading in (fast-path start)
  | "prepare"   // clouds mounted off-screen, no transition
  | "closing"   // clouds sweeping shut (CSS transition)
  | "closed"    // clouds fully shut
  | "opening"   // clouds parting (CSS transition)
  | "fade-out"; // backdrop fading out (fast-path end)

const CLOSE_DURATION    = 1200; // ms – cloud close animation
const OPEN_DURATION     = 1200; // ms – cloud open animation
const FADE_DURATION     = 250;  // ms – fast-path backdrop fade
const ESCALATION_DELAY  = 300;  // ms – wait before escalating to clouds

export default function CloudTransition() {
  const pathname = usePathname();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("closed"); // initial load = clouds shut
  const currentPathRef   = useRef(pathname);
  const isNavigatingRef  = useRef(false);
  const usedCloudsRef    = useRef(false);

  // Two flags for the slow-path gate
  const [closingDone, setClosingDone] = useState(false);
  const [pageLoaded, setPageLoaded]   = useState(false);

  const timersRef      = useRef<ReturnType<typeof setTimeout>[]>([]);
  const escalationRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (escalationRef.current) {
      clearTimeout(escalationRef.current);
      escalationRef.current = null;
    }
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  }, []);

  // ── 1. Initial Load: closed → opening → hidden ──────────────────────
  useEffect(() => {
    later(() => setPhase("opening"), 100);
    later(() => setPhase("hidden"), 100 + OPEN_DURATION);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── prepare → closing on next paint ─────────────────────────────────
  useEffect(() => {
    if (phase !== "prepare") return;
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setPhase("closing");

        // Mark closing done after the animation finishes
        later(() => {
          setPhase("closed");
          setClosingDone(true);
        }, CLOSE_DURATION + 30);
      });
      timersRef.current.push(raf2 as unknown as ReturnType<typeof setTimeout>);
    });
    timersRef.current.push(raf1 as unknown as ReturnType<typeof setTimeout>);
  }, [phase, later]);

  // ── 2. Intercept link clicks ────────────────────────────────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor || !anchor.href || anchor.target === "_blank") return;

      let url: URL;
      try { url = new URL(anchor.href); } catch { return; }

      if (url.origin !== window.location.origin) return;
      if (url.pathname === currentPathRef.current) return;
      if (isNavigatingRef.current) return;

      e.preventDefault();
      isNavigatingRef.current = true;
      usedCloudsRef.current = false;
      setClosingDone(false);
      setPageLoaded(false);

      clearTimers();

      // Start with just a subtle backdrop fade
      setPhase("fading");

      // Push route immediately — the backdrop hides the DOM swap
      router.push(url.pathname + url.search + url.hash);

      // If page hasn't loaded in ESCALATION_DELAY, bring in the clouds
      escalationRef.current = setTimeout(() => {
        usedCloudsRef.current = true;
        setPhase("prepare");
      }, ESCALATION_DELAY);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [router, clearTimers, later]);

  // ── 3. Pathname changed = page loaded ───────────────────────────────
  useEffect(() => {
    if (pathname === currentPathRef.current) return;
    currentPathRef.current = pathname;

    // Cancel escalation if it hasn't fired yet (fast path)
    if (escalationRef.current) {
      clearTimeout(escalationRef.current);
      escalationRef.current = null;
    }

    if (!usedCloudsRef.current) {
      // ── Fast path: just fade out the backdrop ──
      // Small delay to ensure the backdrop is fully opaque first
      later(() => {
        setPhase("fade-out");
        later(() => {
          setPhase("hidden");
          isNavigatingRef.current = false;
        }, FADE_DURATION);
      }, 50);
    } else {
      // ── Slow path: signal that the page is ready ──
      setPageLoaded(true);
    }
  }, [pathname, later, clearTimers]);

  // ── 4. Slow-path gate: open clouds when BOTH flags are true ─────────
  useEffect(() => {
    if (!closingDone || !pageLoaded) return;

    later(() => {
      setPhase("opening");

      later(() => {
        setPhase("hidden");
        isNavigatingRef.current = false;
        usedCloudsRef.current = false;
        setClosingDone(false);
        setPageLoaded(false);
      }, OPEN_DURATION);
    }, 50);
  }, [closingDone, pageLoaded, later]);

  // ── Render ───────────────────────────────────────────────────────────
  if (phase === "hidden") return null;

  const showClouds = phase === "prepare" || phase === "closing"
                  || phase === "closed"  || phase === "opening";
  const isClosed = phase === "closing" || phase === "closed";
  const shouldAnimate = phase !== "prepare";

  // Cloud positions
  const topOffset    = showClouds && isClosed ? "0" : "-120vh";
  const bottomOffset = showClouds && isClosed ? "0" : "120vh";

  // Backdrop: opaque whenever we need to hide content
  const backdropOpaque = phase === "fading" || phase === "prepare"
                      || phase === "closing" || phase === "closed";

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      {/* Solid backdrop */}
      <div
        className="absolute inset-0 bg-white"
        style={{
          opacity: backdropOpaque ? 1 : 0,
          transition: `opacity ${FADE_DURATION}ms ease`,
        }}
      />

      {showClouds && (
        <>
          {/* Top Cloud */}
          <div
            className="absolute top-0 left-0 w-full h-[50vh] bg-gray-100 drop-shadow-[0_15px_15px_rgba(0,0,0,0.1)]"
            style={{
              transform: `translateY(${topOffset})`,
              transition: shouldAnimate
                ? `transform ${isClosed ? CLOSE_DURATION : OPEN_DURATION}ms cubic-bezier(0.65, 0, 0.35, 1)`
                : "none",
            }}
          >
            <div className="absolute bottom-0 left-[-10vw] right-[-10vw] flex items-center justify-between translate-y-[45%]">
              <div className="w-[25vw] h-[25vw] bg-gray-100 rounded-full blur-[2px]" />
              <div className="w-[35vw] h-[35vw] bg-gray-100 rounded-full blur-[2px]" />
              <div className="w-[28vw] h-[28vw] bg-gray-100 rounded-full blur-[2px]" />
              <div className="w-[40vw] h-[40vw] bg-gray-100 rounded-full blur-[2px]" />
              <div className="w-[30vw] h-[30vw] bg-gray-100 rounded-full blur-[2px]" />
              <div className="w-[25vw] h-[25vw] bg-gray-100 rounded-full blur-[2px]" />
            </div>
          </div>

          {/* Bottom Cloud */}
          <div
            className="absolute bottom-0 left-0 w-full h-[50vh] bg-gray-100 drop-shadow-[0_-15px_15px_rgba(0,0,0,0.1)]"
            style={{
              transform: `translateY(${bottomOffset})`,
              transition: shouldAnimate
                ? `transform ${isClosed ? CLOSE_DURATION : OPEN_DURATION}ms cubic-bezier(0.65, 0, 0.35, 1)`
                : "none",
            }}
          >
            <div className="absolute top-0 left-[-10vw] right-[-10vw] flex items-center justify-between -translate-y-[45%]">
              <div className="w-[30vw] h-[30vw] bg-gray-100 rounded-full blur-[2px]" />
              <div className="w-[25vw] h-[25vw] bg-gray-100 rounded-full blur-[2px]" />
              <div className="w-[40vw] h-[40vw] bg-gray-100 rounded-full blur-[2px]" />
              <div className="w-[28vw] h-[28vw] bg-gray-100 rounded-full blur-[2px]" />
              <div className="w-[35vw] h-[35vw] bg-gray-100 rounded-full blur-[2px]" />
              <div className="w-[25vw] h-[25vw] bg-gray-100 rounded-full blur-[2px]" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
