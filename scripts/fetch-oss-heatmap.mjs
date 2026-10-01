// Rebuilds public/data/oss-heatmap.json from GitHub's contribution calendar.
// Run daily by .github/workflows/oss-contributions.yml — never called from the browser.
//
// contributionsCollection caps a single request at one calendar year, so this
// queries year by year. The calendar covers every contribution GitHub has
// ever recorded for the account, so the graph shows real history rather than
// whatever happens to fit in the search-derived oss-contributions.json.
import { writeFileSync } from 'fs';

const USERNAME = 'darkraider01';
const TOKEN = process.env.GH_TOKEN;
if (!TOKEN) throw new Error('GH_TOKEN env var is required');

// Current year plus this many prior years. Three is plenty for a per-year
// toggle without spending more than a few hundred nodes per run.
const YEARS_BACK = 3;

const QUERY = /* GraphQL */ `
  query ($login: String!, $from: DateTime!, $to: DateTime!) {
    rateLimit {
      remaining
      resetAt
    }
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
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

const currentYear = new Date().getUTCFullYear();
const years = [];

// Newest first: the UI defaults to the current year.
for (let year = currentYear; year > currentYear - YEARS_BACK; year--) {
  const from = `${year}-01-01T00:00:00Z`;
  // GitHub rejects a future end date, so clamp the in-progress year to now.
  const to = year === currentYear ? new Date().toISOString() : `${year}-12-31T23:59:59Z`;

  const data = await graphql(QUERY, { login: USERNAME, from, to });
  const calendar = data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar) {
    console.warn(`no contribution calendar returned for ${year}, skipping`);
    continue;
  }

  const days = calendar.weeks
    .flatMap(week => week.contributionDays)
    .map(day => ({ date: day.date, count: day.contributionCount }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  years.push({ year, total: calendar.totalContributions, days });
  console.log(`${year}: ${calendar.totalContributions} contributions across ${days.length} days`);

  if (data.rateLimit?.remaining < 100) await new Promise(r => setTimeout(r, 5000));
}

if (years.length === 0) throw new Error('no contribution calendars fetched');

writeFileSync(
  'public/data/oss-heatmap.json',
  JSON.stringify(
    { last_updated: new Date().toISOString(), username: USERNAME, years },
    null,
    2
  )
);

console.log(`wrote ${years.length} year(s)`);
