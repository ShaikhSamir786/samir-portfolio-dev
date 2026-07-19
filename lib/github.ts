export async function getGithubStats(token: string, username: string) {
  const query = `
    query($username: String!) {
      user(login: $username) {
        followers {
          totalCount
        }
        repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: STARGAZERS, direction: DESC}) {
          totalCount
          nodes {
            stargazerCount
            languages(first: 10) {
              edges {
                size
              }
            }
          }
        }
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
        repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
          totalCount
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub stats");
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  const user = data.data.user;

  let totalStars = 0;
  let totalBytes = 0;

  user.repositories.nodes.forEach((repo: any) => {
    totalStars += repo.stargazerCount;
    if (repo.languages && repo.languages.edges) {
      repo.languages.edges.forEach((edge: any) => {
        totalBytes += edge.size;
      });
    }
  });

  const linesOfCode = Math.floor(totalBytes / 35);

  return {
    followers: user.followers.totalCount,
    totalStars,
    totalRepos: user.repositories.totalCount,
    totalPRs: user.contributionsCollection.totalPullRequestContributions,
    commits: user.contributionsCollection.totalCommitContributions,
    contributedTo: user.repositoriesContributedTo.totalCount,
    linesOfCode,
    calendar: user.contributionsCollection.contributionCalendar.weeks,
  };
}

export type GithubEventsResult =
  | { ok: true; data: string }
  | { ok: false };

export async function getRecentGithubEvents(token: string, username: string): Promise<GithubEventsResult> {
  if (!token) return { ok: false };
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events/public`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return { ok: false };

    const events = await response.json();
    if (!Array.isArray(events) || events.length === 0) return { ok: false };

    const recentActivities = events
      .filter((e: any) => ["PushEvent", "PullRequestEvent", "IssuesEvent", "CreateEvent"].includes(e.type))
      .slice(0, 5)
      .map((e: any) => {
        const repoName = e.repo.name;
        const date = new Date(e.created_at).toLocaleDateString();
        
        if (e.type === "PushEvent") {
          const commits = (e.payload.commits && Array.isArray(e.payload.commits)) 
            ? e.payload.commits.map((c: any) => c.message).join(', ') 
            : "updates";
          return `- On ${date}, pushed to [${repoName}](https://github.com/${repoName}): ${commits}`;
        } else if (e.type === "PullRequestEvent") {
          return `- On ${date}, ${e.payload.action} a pull request in [${repoName}](https://github.com/${repoName}): "${e.payload.pull_request?.title || 'Unknown'}"`;
        } else if (e.type === "IssuesEvent") {
          return `- On ${date}, ${e.payload.action} an issue in [${repoName}](https://github.com/${repoName}): "${e.payload.issue?.title || 'Unknown'}"`;
        } else if (e.type === "CreateEvent") {
          return `- On ${date}, created a ${e.payload.ref_type} in [${repoName}](https://github.com/${repoName})`;
        }
        return '';
      })
      .filter((s: string) => s !== '')
      .join('\n');

    return {
      ok: true,
      data: `Recent Public GitHub Activity:\n${recentActivities || "No notable public events in the last 90 days."}`,
    };
  } catch (error) {
    console.error("Failed to fetch Github Events", error);
    return { ok: false };
  }
}