"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = ["Projects", "Blogs", "About", "Resume", "Contact"] as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function isActive(tab: string) {
    const lower = tab.toLowerCase();
    if (lower === "projects") {
      return pathname === "/admin" || pathname.startsWith("/admin/projects");
    }
    return pathname.startsWith(`/admin/${lower}`);
  }

  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <aside className="w-48 md:w-56 flex-shrink-0 border-r border-gray-200 bg-white">
        <nav className="flex flex-col p-4 gap-1">
          {tabs.map((tab) => {
            const active = isActive(tab);
            const href =
              tab === "Projects" ? "/admin" : `/admin/${tab.toLowerCase()}`;
            return (
              <Link
                key={tab}
                href={href}
                className={`relative text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                  active
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
                {/* Underline — matches Navbar style */}
                <span
                  className={`absolute bottom-1 left-4 h-0.5 bg-gray-900 transition-all duration-300 ${
                    active ? "w-[calc(100%-2rem)]" : "w-0 group-hover:w-8"
                  }`}
                />
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
