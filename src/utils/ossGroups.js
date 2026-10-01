// Pure helpers for turning the flat oss-contributions.json item list into the
// org → repo → contribution hierarchy used by the journal page.

// The five search categories overlap (an issue you opened and were assigned to
// matches both queries), so the same node id can appear more than once. Keep
// the first occurrence — the fetch script flattens categories in a fixed order,
// so the first hit is the more specific category.
export function dedupeItems(items = []) {
  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function orgOf(item) {
  return item.repo.split('/')[0] ?? 'unknown';
}

export function repoOf(item) {
  return item.repo.split('/')[1] ?? item.repo;
}

// [{ org, count, repos: [{ repo, name, count, items: [] }] }] sorted by volume.
export function groupByOrg(items = []) {
  const orgs = new Map();

  for (const item of items) {
    const org = orgOf(item);
    if (!orgs.has(org)) orgs.set(org, new Map());
    const repos = orgs.get(org);
    const repo = item.repo;
    if (!repos.has(repo)) repos.set(repo, []);
    repos.get(repo).push(item);
  }

  return [...orgs.entries()]
    .map(([org, repoMap]) => {
      const repos = [...repoMap.entries()]
        .map(([repo, repoItems]) => ({
          repo,
          name: repoOf({ repo }),
          count: repoItems.length,
          items: repoItems
        }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
      return {
        org,
        count: repos.reduce((sum, r) => sum + r.count, 0),
        repos
      };
    })
    .sort((a, b) => b.count - a.count || a.org.localeCompare(b.org));
}

// Per-category tallies over a deduped list, so the journal's filter chips show
// honest numbers instead of double-counting overlapping categories.
export function countByCategory(items = []) {
  const counts = {};
  for (const item of items) counts[item.category] = (counts[item.category] ?? 0) + 1;
  return counts;
}
