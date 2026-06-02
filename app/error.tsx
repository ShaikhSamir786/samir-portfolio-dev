"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <svg 
          className="w-8 h-8 text-red-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      
      <h2 
        className="text-4xl md:text-5xl font-medium text-gray-900 mb-4 tracking-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Something went wrong
      </h2>
      <p className="text-gray-500 mb-10 max-w-md mx-auto text-lg leading-relaxed">
        We apologize for the inconvenience. An unexpected error occurred while rendering this page.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm w-full sm:w-auto"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 bg-white text-gray-900 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}
