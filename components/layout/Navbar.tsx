"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Resume", href: "/resume" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-24 md:h-[132px] bg-nav-bg backdrop-blur-md border-b border-nav-border"
      >
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="relative h-16 w-16 md:h-[88px] md:w-[88px]">
            <Image
              src="/Logo.svg"
              alt="Logo"
              fill
              className="rounded-full object-cover dark:invert transition-all duration-300"
              priority
              sizes="(max-width: 768px) 64px, 88px"
            />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          {links.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative text-sm font-medium transition-colors duration-200 px-1 py-1 group ${
                  active ? "text-foreground" : "text-text-muted hover:text-foreground"
                }`}
              >
                {label}
                {/* Active underline */}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
          
          <div className="relative ml-2 flex items-center">
            <Link
              href="https://github.com/sponsors/Shreyash0712"
              target="_blank"
              className="group relative overflow-hidden flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-pink-600 dark:text-pink-400 hover:text-white dark:hover:text-white border border-pink-200 dark:border-pink-900 rounded-full bg-background hover:border-pink-500 dark:hover:border-pink-500 transition-colors duration-300 z-10"
            >
              <span className="absolute inset-0 bg-pink-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out -z-10" />
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-pink-500 group-hover:text-white transition-colors duration-300">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              Sponsor
            </Link>
            <div className="ml-4 flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-5 h-5 rounded-md hover:bg-hover-bg transition-colors"
        >
          <span
            className={`block h-0.5 w-5 bg-foreground rounded transition-all duration-300 origin-center ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-foreground rounded transition-all duration-300 ${
              menuOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-foreground rounded transition-all duration-300 origin-center ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Full-Page Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {links.map(({ label, href }, i) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{ transitionDelay: menuOpen ? `${i * 50}ms` : "0ms" }}
              className={`text-xl font-semibold tracking-tight transition-all duration-300 ${
                menuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              } ${active ? "text-foreground underline underline-offset-4" : "text-text-muted hover:text-foreground"}`}
            >
              {label}
            </Link>
          );
        })}

        <Link
          href="https://github.com/sponsors/Shreyash0712"
          target="_blank"
          onClick={() => setMenuOpen(false)}
          style={{ transitionDelay: menuOpen ? `${links.length * 50}ms` : "0ms" }}
          className={`group relative overflow-hidden flex items-center gap-2 px-6 py-3 mt-4 text-lg font-semibold text-pink-600 dark:text-pink-400 hover:text-white dark:hover:text-white bg-background border border-pink-200 dark:border-pink-900 hover:border-pink-500 dark:hover:border-pink-500 rounded-full transition-colors duration-300 z-10 ${
            menuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <span className="absolute inset-0 bg-pink-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out -z-10" />
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-pink-500 group-hover:text-white transition-colors duration-300">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          Sponsor
        </Link>

        <div className={`mt-4 transition-all duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}>
          <ThemeToggle />
        </div>
      </div>

      {/* Spacer so content doesn't hide under fixed navbar */}
      <div className="h-[var(--navbar-h)]" />
    </>
  );
}
