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
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub stats");
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  const user = data.data.user;

  // Calculate lines of code (matching old Python script)
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

  const linesOfCode = Math.floor(totalBytes / 35); // Approximate 35 bytes per line of code

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
