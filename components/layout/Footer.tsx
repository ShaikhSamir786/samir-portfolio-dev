import Link from "next/link";
import Image from "next/image";
import { getCachedProjects, getCachedBlogs, getCachedSocials } from "@/lib/cache";
import { SocialIcon } from "@/components/SocialIcons";

const pageLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/contact" },
  { label: "Resume", href: "/resume" },
];

const MAX_ITEMS = 5;

export default async function Footer() {
  const [projects, blogs, socials] = await Promise.all([
    getCachedProjects(),
    getCachedBlogs(),
    getCachedSocials(),
  ]);

  const visibleProjects = projects.slice(0, MAX_ITEMS);
  const hasMoreProjects = projects.length > MAX_ITEMS;

  const visibleBlogs = blogs.slice(0, MAX_ITEMS);
  const hasMoreBlogs = blogs.length > MAX_ITEMS;

  return (
    <footer className="w-full bg-footer-bg border-t border-border-primary">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-12 md:py-16">

        {/* Top section: Logo + columns */}
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">

          {/* Brand */}
          <div className="flex-shrink-0 flex flex-col items-start gap-4">
            <Link href="/">
              <div className="relative h-16 w-16 md:h-20 md:w-20">
                <Image
                  src="/Logo.svg"
                  alt="Logo"
                  fill
                  className="rounded-full object-cover dark:invert transition-all duration-300"
                  priority
                  sizes="(max-width: 768px) 64px, 80px"
                />
              </div>
            </Link>
            <p className="text-sm text-text-muted max-w-[200px] leading-relaxed">
              Lost among the stars, I found myself.
            </p>
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-1">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-border-primary bg-background text-text-muted hover:text-foreground hover:border-foreground hover:shadow-sm transition-all duration-200 flex items-center justify-center"
                    title={social.name}
                  >
                    <SocialIcon name={social.name} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 lg:ml-auto">

            {/* Pages */}
            <div className="min-w-[120px]">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-5">
                Pages
              </p>
              <ul className="flex flex-col gap-2.5">
                {pageLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-text-secondary hover:text-foreground transition-colors duration-200 flex items-center gap-0.5 group"
                    >
                      {label}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-xs leading-none">
                        ›
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Projects */}
            <div className="min-w-[140px]">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-5">
                Projects
              </p>
              {visibleProjects.length === 0 ? (
                <p className="text-sm text-text-muted italic">No projects yet</p>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {visibleProjects.map((project) => (
                    <li key={project.slug}>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-sm text-text-secondary hover:text-foreground transition-colors duration-200 flex items-center gap-0.5 group"
                      >
                        {project.title}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-xs leading-none">
                          ›
                        </span>
                      </Link>
                    </li>
                  ))}
                  {hasMoreProjects && (
                    <li className="mt-1">
                      <Link
                        href="/projects"
                        className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200 flex items-center gap-1"
                      >
                        More <span className="text-xs">→</span>
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Blog */}
            <div className="min-w-[140px]">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-5">
                Blog
              </p>
              {visibleBlogs.length === 0 ? (
                <p className="text-sm text-text-muted italic">No posts yet</p>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {visibleBlogs.map((blog) => (
                    <li key={blog.slug}>
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="text-sm text-text-secondary hover:text-foreground transition-colors duration-200 flex items-center gap-0.5 group"
                      >
                        {blog.title}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-xs leading-none">
                          ›
                        </span>
                      </Link>
                    </li>
                  ))}
                  {hasMoreBlogs && (
                    <li className="mt-1">
                      <Link
                        href="/blogs"
                        className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200 flex items-center gap-1"
                      >
                        More <span className="text-xs">→</span>
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-border-primary" />

        {/* Bottom Section */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-text-muted">
          <p>
            © {new Date().getFullYear()} All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0">
            <Link href="/sitemap" className="hover:text-foreground transition-colors">
              Sitemap
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
