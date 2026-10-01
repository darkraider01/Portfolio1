// Rebuilds project last commit dates in src/data/projects.js from live GitHub data.
// Run daily by .github/workflows/oss-contributions.yml or manually via `npm run update:projects`.
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { projects } from '../src/data/projects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECTS_FILE = resolve(__dirname, '../src/data/projects.js');

function getToken() {
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const token = execSync('gh auth token', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (token) return token;
  } catch {
    // gh CLI not available or not logged in
  }
  return null;
}

const TOKEN = getToken();

const GRAPHQL_QUERY = /* GraphQL */ `
  query ($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      pushedAt
      defaultBranchRef {
        target {
          ... on Commit {
            committedDate
          }
        }
      }
    }
  }
`;

async function fetchRepoViaGraphQL(owner, repo) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-updater'
    },
    body: JSON.stringify({ query: GRAPHQL_QUERY, variables: { owner, name: repo } })
  });

  if (!res.ok) {
    throw new Error(`GraphQL HTTP ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map(e => e.message).join(', '));
  }
  return json.data?.repository;
}

async function fetchRepoViaRest(owner, repo) {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'portfolio-updater'
  };
  if (TOKEN) headers.Authorization = `bearer ${TOKEN}`;

  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!repoRes.ok) throw new Error(`REST repo HTTP ${repoRes.status}`);
  const repoData = await repoRes.json();

  let committedDate = null;
  try {
    const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers });
    if (commitRes.ok) {
      const commits = await commitRes.json();
      committedDate = commits[0]?.commit?.committer?.date || commits[0]?.commit?.author?.date || null;
    }
  } catch {
    // commit fetch failed, fallback to pushedAt
  }

  return {
    pushedAt: repoData.pushed_at,
    defaultBranchRef: committedDate ? { target: { committedDate } } : null
  };
}

async function getLatestActivityDate(owner, repo) {
  let data;
  if (TOKEN) {
    try {
      data = await fetchRepoViaGraphQL(owner, repo);
    } catch (err) {
      console.warn(`  GraphQL fetch failed for ${owner}/${repo} (${err.message}), falling back to REST...`);
      data = await fetchRepoViaRest(owner, repo);
    }
  } else {
    data = await fetchRepoViaRest(owner, repo);
  }

  if (!data) return null;

  const committedDate = data.defaultBranchRef?.target?.committedDate ?? null;
  const pushedAt = data.pushedAt ?? null;

  if (committedDate && pushedAt) {
    return new Date(committedDate) > new Date(pushedAt) ? committedDate : pushedAt;
  }
  return committedDate || pushedAt;
}

async function main() {
  let fileContent = readFileSync(PROJECTS_FILE, 'utf8');
  let updatedCount = 0;

  console.log(`Checking ${projects.length} projects for latest commit dates...`);

  for (const project of projects) {
    const match = project.href?.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      console.log(`- ${project.name}: skipped (not a GitHub repo link)`);
      continue;
    }

    const [, owner, rawRepo] = match;
    const repo = rawRepo.replace(/\/+$/, '');

    try {
      const latestDate = await getLatestActivityDate(owner, repo);
      if (!latestDate) {
        console.log(`- ${project.name}: no activity date found, keeping current (${project.updatedAt})`);
        continue;
      }

      if (latestDate !== project.updatedAt) {
        const regex = new RegExp(`(slug:\\s*['"]${project.slug}['"][^}]*?updatedAt:\\s*['"])[^'"]*(['"])`);
        if (regex.test(fileContent)) {
          fileContent = fileContent.replace(regex, `$1${latestDate}$2`);
          console.log(`✓ ${project.name}: updated ${project.updatedAt} -> ${latestDate}`);
          updatedCount++;
        } else {
          console.warn(`! ${project.name}: found new date ${latestDate}, but could not find updatedAt field in source`);
        }
      } else {
        console.log(`- ${project.name}: up to date (${latestDate})`);
      }
    } catch (err) {
      console.error(`✕ ${project.name} (${owner}/${repo}): error fetching updates:`, err.message);
    }
  }

  if (updatedCount > 0) {
    writeFileSync(PROJECTS_FILE, fileContent, 'utf8');
    console.log(`\nSuccessfully updated ${updatedCount} project(s) in ${PROJECTS_FILE}`);
  } else {
    console.log('\nAll projects are already up to date. No changes written.');
  }
}

main().catch(err => {
  console.error('Fatal error updating projects:', err);
  process.exit(1);
});
