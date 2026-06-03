import { getGithubStats } from "@/lib/github";
import { FaGithub, FaStar, FaCodeBranch, FaUsers, FaFileCode } from "react-icons/fa6";
import { FiGitCommit } from "react-icons/fi";

export default async function Hero() {
  const token = process.env.GITHUB_TOKEN;
  let stats = null;
  let error = null;

  try {
    if (token) {
      stats = await getGithubStats(token, "Shreyash0712");
    } else {
      error = "GitHub token not configured";
    }
  } catch (e: any) {
    error = e.message || "Failed to load GitHub stats";
  }

  return (
    <section className="px-6 pb-6 md:px-10 md:pb-12 flex-1 flex flex-col items-center">
      <div className="w-full max-w-6xl flex-1 flex flex-col">
        {/* Intro */}
        <div className="pt-6 md:pt-10 mb-8">
          <h1
            className="text-4xl sm:text-5xl font-medium text-gray-900 tracking-tight mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Hey, I'm Shreyash.
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl">
            Welcome to my abode.
          </p>
        </div>

        {/* GitHub Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[minmax(110px,auto)]">
          {error && (
            <div className="col-span-full p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 flex items-center gap-3">
              <FaGithub className="text-xl" />
              <span>{error}</span>
            </div>
          )}

          {stats && (
            <>
              {/* Contributions Card - Large */}
              <div className="col-span-1 md:col-span-1 row-span-3 bg-white text-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-gray-500">
                    <FiGitCommit className="text-lg" />
                    <h3 className="font-medium tracking-wide text-xs uppercase">Commits</h3>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold tracking-tight">
                    {stats.commits.toLocaleString()}
                  </div>
                  <p className="text-gray-400 mt-1 text-sm">in the last 28 days</p>
                </div>

                {/* Interactive Bar Chart Graph */}
                <div className="mt-8 flex items-end gap-1.5 flex-1 min-h-[120px]">
                  {/* The Graph */}
                  <div className="flex-1 flex items-end gap-[3px] h-full pt-4">
                    {(() => {
                      const allDays = stats.calendar.flatMap((week: any) => week.contributionDays);
                      const last28Days = allDays.slice(-28);

                      return last28Days.map((day: any, i: number) => {
                        const total = day.contributionCount;
                        
                        // 0 commits: tiny subtle bar. Active days: scale up to 6 commits max for clear variation
                        const height = total === 0 ? 4 : Math.max(15, Math.min(100, (total / 6) * 100));
                        
                        const dateObj = new Date(day.date);
                        const dayDate = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

                        // distinct colors for active vs inactive days
                        const barColor = total === 0 
                          ? "bg-gray-100 group-hover/bar:bg-gray-200" 
                          : "bg-gray-300 group-hover/bar:bg-gray-800";

                        return (
                          <div key={i} className="relative flex-1 group/bar h-full flex items-end">
                            <div
                              className={`w-full rounded-t-sm transition-all duration-300 cursor-pointer ${barColor}`}
                              style={{ height: `${height}%` }}
                            />

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-white text-gray-900 border border-gray-200 text-xs whitespace-nowrap rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-lg flex flex-col items-center scale-95 group-hover/bar:scale-100">
                              <span className="font-semibold">{total} commits</span>
                              <span className="text-gray-500 text-[10px]">{dayDate}</span>
                              {/* Tooltip Arrow */}
                              <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-b border-r border-gray-200 transform rotate-45"></div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div className="col-span-1 md:col-span-1 row-span-1 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <FaStar className="text-xl" />
                  <h3 className="font-medium text-sm uppercase tracking-wider">Total Stars</h3>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">{stats.totalStars.toLocaleString()}</div>
              </div>

              {/* Followers */}
              <div className="col-span-1 md:col-span-1 row-span-1 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <FaUsers className="text-xl" />
                  <h3 className="font-medium text-sm uppercase tracking-wider">Followers</h3>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">{stats.followers.toLocaleString()}</div>
              </div>

              {/* PRs */}
              <div className="col-span-1 md:col-span-1 row-span-1 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <FaCodeBranch className="text-xl" />
                  <h3 className="font-medium text-sm uppercase tracking-wider">Pull Requests</h3>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">{stats.totalPRs.toLocaleString()}</div>
              </div>

              {/* Repositories */}
              <div className="col-span-1 md:col-span-1 row-span-1 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2 text-gray-500">
                  <FaGithub className="text-xl" />
                  <h3 className="font-medium text-sm uppercase tracking-wider">Repositories</h3>
                </div>
                <div className="flex items-baseline gap-3">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900">{stats.totalRepos.toLocaleString()}</div>
                  <div className="text-xs font-medium text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
                    Contrib: {stats.contributedTo.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Lines of Code */}
              <div className="col-span-1 md:col-span-1 row-span-1 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2 text-gray-500">
                  <FaFileCode className="text-xl" />
                  <h3 className="font-medium text-sm uppercase tracking-wider">Lines of Code</h3>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 truncate">~{stats.linesOfCode.toLocaleString()}</div>
              </div>

            </>
          )}
        </div>
      </div>
    </section>
  );
}
