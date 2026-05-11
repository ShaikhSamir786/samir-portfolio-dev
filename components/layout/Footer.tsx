import Link from "next/link";
import Image from "next/image";

const links = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Resume", href: "/resume" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative h-16 w-16 md:h-20 md:w-20">
              <Image
                src="/Logo.png"
                alt="Logo"
                fill
                className="rounded-full object-cover"
                priority
                sizes="(max-width: 768px) 64px, 80px"
              />
            </div>
          </Link>

          {/* Links */}
          <ul className="flex flex-wrap items-center justify-center gap-5 text-sm font-medium">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-gray-200" />

        {/* Copyright */}
        <p className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
