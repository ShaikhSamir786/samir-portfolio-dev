import { getGithubStats } from "@/lib/github";
import { FaGithub, FaStar, FaCodeBranch, FaUsers, FaFileCode } from "react-icons/fa6";
import { FiGitCommit } from "react-icons/fi";

type GithubStats = Awaited<ReturnType<typeof getGithubStats>>;
type ContributionWeek = GithubStats["calendar"][number];
type ContributionDay = ContributionWeek["contributionDays"][number];

export default async function Hero() {
  const token = process.env.GITHUB_TOKEN;
  let stats: GithubStats | null = null;
  let error: string | null = null;

  try {
    if (token) {
      stats = await getGithubStats(token, "ShaikhSamir786");
    } else {
      error = "GitHub token not configured";
    }
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : "Failed to load GitHub stats";
  }

  return (
    <section className="px-6 pb-6 md:px-10 md:pb-12 flex-1 flex flex-col items-center">
      <div className="w-full max-w-6xl flex-1 flex flex-col">
        {/* Intro */}
        <div className="pt-6 md:pt-10 mb-8">
          <h1
            className="text-4xl sm:text-5xl font-medium text-foreground tracking-tight mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Hey, I&apos;m Samir Shaikh.
          </h1>
          <p className="text-base md:text-lg text-text-muted max-w-2xl">
            I&apos;m a backend developer who builds RAG pipelines, LLM-powered chatbots, and agentic AI systems. If you need a Node.js developer to integrate an LLM into your product, build a scalable backend for your startup, or ship AI features — let&apos;s talk.
          </p>
        </div>

        {/* GitHub Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[minmax(110px,auto)]">
          {error && (
            <div className="col-span-full p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-3xl border border-red-100 dark:border-red-800 flex items-center gap-3">
              <FaGithub className="text-xl" />
              <span>{error}</span>
            </div>
          )}

          {stats && (
            <>
              {/* Contributions Card - Large */}
              <div className="col-span-1 md:col-span-1 row-span-3 bg-background text-foreground p-6 md:p-8 rounded-3xl shadow-sm border border-border-primary flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-text-muted">
                    <FiGitCommit className="text-lg" />
                    <h3 className="font-medium tracking-wide text-xs uppercase">Commits</h3>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold tracking-tight">
                    {stats.commits.toLocaleString()}
                  </div>
                  <p className="text-text-muted mt-1 text-sm">in the last 28 days</p>
                </div>

                {/* Interactive Bar Chart Graph */}
                <div className="mt-8 flex items-end gap-1.5 flex-1 min-h-[120px]">
                  {/* The Graph */}
                  <div className="flex-1 flex items-end gap-[3px] h-full pt-4">
                    {(() => {
                      const allDays = stats.calendar.flatMap((week: ContributionWeek) => week.contributionDays);
                      const last28Days = allDays.slice(-28);

                      return last28Days.map((day: ContributionDay, i: number) => {
                        const total = day.contributionCount;

                        // 0 commits: tiny subtle bar. Active days: scale up to 6 commits max for clear variation
                        const height = total === 0 ? 4 : Math.max(15, Math.min(100, (total / 6) * 100));

                        const dateObj = new Date(day.date);
                        const dayDate = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

                        // distinct colors for active vs inactive days
                        const barColor = total === 0
                          ? "bg-hover-bg group-hover/bar:bg-border-primary"
                          : "bg-border-primary group-hover/bar:bg-green-500 dark:group-hover/bar:bg-[var(--accent-green)]";

                        return (
                          <div key={i} className="relative flex-1 group/bar h-full flex items-end">
                            <div
                              className={`w-full rounded-t-sm transition-all duration-300 cursor-pointer ${barColor}`}
                              style={{ height: `${height}%` }}
                            />

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-background text-foreground border border-border-primary text-xs whitespace-nowrap rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-lg flex flex-col items-center scale-95 group-hover/bar:scale-100">
                              <span className="font-semibold">{total} commits</span>
                              <span className="text-text-muted text-[10px]">{dayDate}</span>
                              {/* Tooltip Arrow */}
                              <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-background border-b border-r border-border-primary transform rotate-45"></div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div className="col-span-1 md:col-span-1 row-span-1 bg-background p-6 md:p-8 rounded-3xl shadow-sm border border-border-primary hover:shadow-md transition-shadow flex items-center justify-between">
                <div className="flex items-center gap-3 text-text-muted">
                  <FaStar className="text-xl" />
                  <h3 className="font-medium text-sm uppercase tracking-wider">Total Stars</h3>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground">{stats.totalStars.toLocaleString()}</div>
              </div>

              {/* Followers */}
              <div className="col-span-1 md:col-span-1 row-span-1 bg-background p-6 md:p-8 rounded-3xl shadow-sm border border-border-primary hover:shadow-md transition-shadow flex items-center justify-between">
                <div className="flex items-center gap-3 text-text-muted">
                  <FaUsers className="text-xl" />
                  <h3 className="font-medium text-sm uppercase tracking-wider">Followers</h3>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground">{stats.followers.toLocaleString()}</div>
              </div>

              {/* PRs */}
              <div className="col-span-1 md:col-span-1 row-span-1 bg-background p-6 md:p-8 rounded-3xl shadow-sm border border-border-primary hover:shadow-md transition-shadow flex items-center justify-between">
                <div className="flex items-center gap-3 text-text-muted">
                  <FaCodeBranch className="text-xl" />
                  <h3 className="font-medium text-sm uppercase tracking-wider">Pull Requests</h3>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground">{stats.totalPRs.toLocaleString()}</div>
              </div>

              {/* Repositories */}
              <div className="col-span-1 md:col-span-1 row-span-1 bg-background p-6 md:p-8 rounded-3xl shadow-sm border border-border-primary hover:shadow-md transition-shadow flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2 text-text-muted">
                  <FaGithub className="text-xl" />
                  <h3 className="font-medium text-sm uppercase tracking-wider">Repositories</h3>
                </div>
                <div className="flex items-baseline gap-3">
                  <div className="text-3xl md:text-4xl font-bold text-foreground">{stats.totalRepos.toLocaleString()}</div>
                  <div className="text-xs font-medium text-text-muted border border-border-primary rounded-full px-2 py-0.5">
                    Contrib: {stats.contributedTo.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Lines of Code */}
              <div className="col-span-1 md:col-span-1 row-span-1 bg-background p-6 md:p-8 rounded-3xl shadow-sm border border-border-primary hover:shadow-md transition-shadow flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2 text-text-muted">
                  <FaFileCode className="text-xl" />
                  <h3 className="font-medium text-sm uppercase tracking-wider">Lines of Code</h3>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground truncate">~{stats.linesOfCode.toLocaleString()}</div>
              </div>

            </>
          )}
        </div>
      </div>
    </section>
  );
}
