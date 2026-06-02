import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Server-side in-memory cache variables
let statsCache = null;
let statsCacheTime = 0;
const CACHE_DURATION = 3600 * 1000; // Cache for 1 hour

export async function GET() {
  try {
    const now = Date.now();
    // Return cached version if valid
    if (statsCache && now - statsCacheTime < CACHE_DURATION) {
      return NextResponse.json(statsCache, { status: 200 });
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.warn("GITHUB_TOKEN not found in environment, returning static fallback stats");
      const fallbackStats = {
        name: "Nikhil Verma",
        avatarUrl: "https://avatars.githubusercontent.com/u/99318181?v=4",
        repoCount: 77,
        commits: "1,480+",
        loc: "12,400+",
        languages: "JS/TS/Py",
        totalStars: 45,
      };
      // Keep a fallback cache
      statsCache = fallbackStats;
      statsCacheTime = now;
      return NextResponse.json(fallbackStats, { status: 200 });
    }

    const query = `
    {
      user(login: "nickhil-verma") {
        name
        avatarUrl
        repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC) {
          totalCount
          nodes {
            name
            stargazerCount
            forkCount
            diskUsage
            primaryLanguage {
              name
            }
          }
        }
        contributionsCollection {
          totalCommitContributions
        }
      }
    }`;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "nickhil-verma-portfolio"
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      if (statsCache) {
        // Return stale cache if GraphQL fails
        return NextResponse.json(statsCache, { status: 200 });
      }
      return NextResponse.json({ error: "GraphQL query failed", details: result.errors }, { status: 500 });
    }

    const user = result.data?.user;
    if (!user) {
      if (statsCache) return NextResponse.json(statsCache, { status: 200 });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Process nodes to get stargazers, sizes, and top languages
    const repos = user.repositories?.nodes || [];
    const publicReposCount = user.repositories?.totalCount || 0;
    const totalCommitContributions = user.contributionsCollection?.totalCommitContributions || 0;

    const totalStars = repos.reduce((acc, r) => acc + (r.stargazerCount || 0), 0);
    const totalSizeKB = repos.reduce((acc, r) => acc + (r.diskUsage || 0), 0);

    // Dynamic languages
    const langCounts = {};
    repos.forEach(r => {
      const langName = r.primaryLanguage?.name;
      if (langName) {
        langCounts[langName] = (langCounts[langName] || 0) + 1;
      }
    });
    const sortedLangs = Object.keys(langCounts).sort((a, b) => langCounts[b] - langCounts[a]);
    const langMapper = (l) => {
      const map = {
        "JavaScript": "JS",
        "TypeScript": "TS",
        "Python": "Py",
        "C++": "C++",
        "HTML": "HTML",
        "CSS": "CSS",
        "Jupyter Notebook": "Ipynb",
        "Shell": "Sh"
      };
      return map[l] || l.slice(0, 4);
    };
    const dynamicLanguages = sortedLangs.slice(0, 3).map(langMapper).join("/") || "JS/TS/Py";

    // Estimated LOC (20 LOC per KB disk usage)
    const estimatedLOC = Math.round(totalSizeKB * 20);
    const dynamicLOC = estimatedLOC > 0 ? estimatedLOC.toLocaleString() + "+" : "12,400+";

    // Dynamic Commits
    const dynamicCommits = totalCommitContributions > 0 ? totalCommitContributions.toLocaleString() + "+" : "1,480+";

    const payload = {
      name: user.name || "Nikhil Verma",
      avatarUrl: user.avatarUrl || "https://avatars.githubusercontent.com/u/99318181?v=4",
      repoCount: publicReposCount,
      commits: dynamicCommits,
      loc: dynamicLOC,
      languages: dynamicLanguages,
      totalStars: totalStars,
    };

    // Save to cache
    statsCache = payload;
    statsCacheTime = now;

    return NextResponse.json(payload, { status: 200 });

  } catch (error) {
    console.error("Error in GET /api/github-stats:", error);
    // Serve stale cache if available
    if (statsCache) {
      console.warn("Serving stale GitHub stats cache due to request error");
      return NextResponse.json(statsCache, { status: 200 });
    }
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
