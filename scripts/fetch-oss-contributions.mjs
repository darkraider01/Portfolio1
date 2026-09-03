// Rebuilds public/data/oss-contributions.json from live GitHub search.
// Run daily by .github/workflows/oss-contributions.yml — never called from the browser.
import { writeFileSync } from 'fs';

const USERNAME = 'darkraider01';
const TOKEN = process.env.GH_TOKEN;
if (!TOKEN) throw new Error('GH_TOKEN env var is required');

// Global search queries auto-discover every public repo the user has touched —
// no hardcoded repo list, so new repos show up automatically.
// -user:USERNAME excludes their own repos: this tracks OSS contributions, not personal projects.
const CATEGORIES = [
  ['mergedPRs', `is:pr is:merged author:${USERNAME} -user:${USERNAME}`],
  ['openPRs', `is:pr is:open author:${USERNAME} -user:${USERNAME}`],
  ['issuesCreated', `is:issue author:${USERNAME} -user:${USERNAME}`],
  ['issuesAssigned', `is:issue assignee:${USERNAME} -user:${USERNAME}`],
  ['reviewsGiven', `is:pr reviewed-by:${USERNAME} -author:${USERNAME} -user:${USERNAME}`]
];

const QUERY = /* GraphQL */ `
  query ($q: String!, $after: String) {
    rateLimit { remaining resetAt }
    search(query: $q, type: ISSUE, first: 50, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        ... on PullRequest {
          id title url state createdAt mergedAt closedAt bodyText
          comments { totalCount }
          labels(first: 10) { nodes { name } }
          repository { nameWithOwner }
        }
        ... on Issue {
          id title url state createdAt closedAt bodyText
          comments { totalCount }
          labels(first: 10) { nodes { name } }
          repository { nameWithOwner }
        }
      }
    }
  }
`;

async function graphql(query, variables, attempt = 1) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  });

  if (res.status === 403 || res.status === 429) {
    if (attempt > 3) throw new Error(`GitHub API rate-limited after ${attempt} attempts`);
    const wait = 2 ** attempt * 1000;
    await new Promise(r => setTimeout(r, wait));
    return graphql(query, variables, attempt + 1);
  }

  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function fetchCategory(category, searchQuery) {
  const items = [];
  let after = null;
  // ponytail: 500-item cap per category, raise if a category ever legitimately exceeds it
  while (items.length < 500) {
    const data = await graphql(QUERY, { q: searchQuery, after });
    for (const node of data.search.nodes) {
      items.push({
        id: node.id,
        category,
        type: node.mergedAt !== undefined ? 'pr' : 'issue',
        title: node.title,
        repo: node.repository.nameWithOwner,
        url: node.url,
        state: node.mergedAt ? 'MERGED' : node.state,
        createdAt: node.createdAt,
        mergedAt: node.mergedAt ?? null,
        closedAt: node.closedAt,
        body: (node.bodyText || '').slice(0, 300),
        labels: node.labels.nodes.map(l => l.name),
        commentCount: node.comments.totalCount
      });
    }
    if (!data.search.pageInfo.hasNextPage) break;
    after = data.search.pageInfo.endCursor;
    if (data.rateLimit.remaining < 100) await new Promise(r => setTimeout(r, 5000));
  }
  return items;
}

const results = await Promise.all(CATEGORIES.map(([category, q]) => fetchCategory(category, q)));
const items = results.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const summary = Object.fromEntries(
  CATEGORIES.map(([category]) => [category, items.filter(i => i.category === category).length])
);

writeFileSync(
  'public/data/oss-contributions.json',
  JSON.stringify({ last_updated: new Date().toISOString(), username: USERNAME, summary, items }, null, 2)
);

console.log(`wrote ${items.length} items`);
