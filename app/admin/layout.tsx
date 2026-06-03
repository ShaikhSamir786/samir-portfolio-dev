"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const tabs = ["Projects", "Blogs", "Experience", "About", "Resume", "Contact", "Socials", "Notifications"] as const;

const getIcon = (tab: string) => {
  switch (tab) {
    case "Projects":
      return <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
    case "Blogs":
      return <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" /></svg>;
    case "Experience":
      return <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    case "About":
      return <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
    case "Resume":
      return <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    case "Contact":
      return <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    case "Socials":
      return <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
    case "Notifications":
      return <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
    default:
      return null;
  }
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  function isActive(tab: string) {
    const lower = tab.toLowerCase();
    if (lower === "projects") {
      return pathname === "/admin" || pathname.startsWith("/admin/projects");
    }
    return pathname.startsWith(`/admin/${lower}`);
  }

  return (
    <div className="flex flex-1 items-start">
      {/* Sidebar */}
      <aside
        className={`sticky top-[var(--navbar-h)] h-[calc(100vh-var(--navbar-h))] overflow-y-auto flex-shrink-0 border-r border-gray-200 bg-white transition-all duration-300 flex flex-col ${
          isSidebarOpen ? "w-48 md:w-56" : "w-16"
        }`}
      >
        <div className={`flex items-center pt-6 pb-2 border-b border-gray-100 ${isSidebarOpen ? "px-4 justify-between" : "justify-center"}`}>
          {isSidebarOpen && <span className="font-semibold text-sm uppercase tracking-wider text-gray-500">Menu</span>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        <nav className={`flex flex-col gap-1 py-4 ${isSidebarOpen ? "px-4" : "px-2 items-center"}`}>
          {tabs.map((tab) => {
            const active = isActive(tab);
            const href = `/admin/${tab.toLowerCase()}`;
            return (
              <Link
                key={tab}
                href={href}
                className={`relative flex items-center rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isSidebarOpen ? "px-4 py-2.5 justify-start w-full" : "w-10 h-10 justify-center"
                } ${
                  active
                    ? "text-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                title={!isSidebarOpen ? tab : undefined}
              >
                <span className={`flex items-center ${isSidebarOpen ? "gap-3 w-full" : "justify-center"}`}>
                  <span className={`${active ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"} transition-colors flex items-center justify-center`}>
                    {getIcon(tab)}
                  </span>
                  {isSidebarOpen && <span>{tab}</span>}
                </span>
                {/* Underline — matches Navbar style */}
                {isSidebarOpen && (
                  <span
                    className={`absolute bottom-1 left-4 h-0.5 bg-gray-900 transition-all duration-300 ${
                      active ? "w-[calc(100%-2rem)]" : "w-0 group-hover:w-8"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Right Content */}
      <main className="flex-1 flex flex-col min-w-0">{children}</main>
    </div>
  );
}
