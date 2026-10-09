import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MoltenBackdrop from '../components/MoltenBackdrop';
import SectionHeading from '../components/SectionHeading';
import ContributionRow from '../components/ContributionRow';
import Reveal from '../components/Reveal';
import { countByCategory, dedupeItems, groupByOrg } from '../utils/ossGroups';
import { timeAgo } from '../utils/timeAgo';

const CATEGORY_LABELS = {
  mergedPRs: 'Merged PRs',
  openPRs: 'Open PRs',
  issuesCreated: 'Issues Raised',
  issuesAssigned: 'Issues Taken',
  reviewsGiven: 'Reviews Given'
};

const FILTERS = ['all', ...Object.keys(CATEGORY_LABELS)];

const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const orgKey = org => `o:${org}`;
const repoKey = repo => `r:${repo}`;

const Chevron = ({ open }) => (
  <span aria-hidden className="w-3 shrink-0 text-amber-dim">
    {open ? '▾' : '▸'}
  </span>
);

// "3 Merged PRs · 1 Reviews Given" — only the categories actually present.
const RepoCounts = ({ items }) => {
  const counts = countByCategory(items);
  const parts = Object.entries(CATEGORY_LABELS)
    .filter(([key]) => counts[key])
    .map(([key, label]) => `${counts[key]} ${label}`);
  return <span className="text-xs text-muted">{parts.join(' · ')}</span>;
};

const OssJournal = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('all');
  const [oldestFirst, setOldestFirst] = useState(false);
  const [activeOrg, setActiveOrg] = useState(null);
  // Collapsed node ids; everything starts expanded so the page reads as one
  // continuous journal until you start folding branches.
  const [collapsed, setCollapsed] = useState(() => new Set());
  const mainRef = useRef(null);

  useEffect(() => {
    document.title = 'OSS Journal — Ishan Ghosh';
    return () => {
      document.title = 'Ishan Ghosh — Backend / Systems Engineer';
    };
  }, []);

  useEffect(() => {
    fetch('/data/oss-contributions.json')
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true));
  }, []);

  const unique = useMemo(() => dedupeItems(data?.items ?? []), [data]);

  const filtered = useMemo(
    () =>
      unique
        .filter(item => filter === 'all' || item.category === filter)
        .sort((a, b) =>
          oldestFirst
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt)
        ),
    [unique, filter, oldestFirst]
  );

  // The rail always lists every org so it doesn't jump around while filtering;
  // counts reflect the current filter.
  const rail = useMemo(() => {
    const all = groupByOrg(unique);
    const visible = new Map(groupByOrg(filtered).map(entry => [entry.org, entry.count]));
    return all.map(entry => ({ ...entry, visibleCount: visible.get(entry.org) ?? 0 }));
  }, [unique, filtered]);

  const groups = useMemo(() => groupByOrg(filtered), [filtered]);

  const counts = useMemo(() => countByCategory(unique), [unique]);
  const orgCount = rail.length;

  const allNodeKeys = useMemo(
    () =>
      groups.flatMap(group => [
        orgKey(group.org),
        ...group.repos.map(repo => repoKey(repo.repo))
      ]),
    [groups]
  );

  const allCollapsed = allNodeKeys.length > 0 && allNodeKeys.every(key => collapsed.has(key));

  const toggle = key =>
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const isOpen = key => !collapsed.has(key);

  const onToggleAll = () =>
    setCollapsed(allCollapsed ? new Set() : new Set(allNodeKeys));

  // Highlight whichever org section is currently under the reading position.
  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const sections = [...root.querySelectorAll('[data-org]')];
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveOrg(visible.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach(section => io.observe(section));
    return () => io.disconnect();
  }, [groups]);

  return (
    <div className="relative min-h-screen bg-ink">
      <section className="relative overflow-hidden border-b border-line px-6 py-24 md:px-16 md:py-32">
        <MoltenBackdrop />

        <div className="relative z-10">
          <Link
            to="/#contributions"
            className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-amber"
          >
            &larr; back to portfolio
          </Link>

          <header className="mb-14 mt-10 grid gap-10 md:grid-cols-[200px_1fr] md:gap-16">
            <SectionHeading number="04" text="OSS Journal" />
            <div className="max-w-xl">
              <p className="font-sans text-lg text-bone-dim">
                The full record — every PR, issue and review, filed by
                organisation, then by the repo it landed in. Refreshed from
                GitHub once a day.
              </p>
              <p className="mt-3 font-mono text-xs text-muted">
                {unique.length} contributions · {orgCount} organisation
                {orgCount === 1 ? '' : 's'}
                {data && <> · updated {timeAgo(data.last_updated)}</>}
              </p>
            </div>
          </header>

          {error && (
            <p className="font-mono text-sm text-muted">
              Couldn't load contribution data right now — try again later.
            </p>
          )}

          {!error && !data && (
            <p className="font-mono text-sm text-muted">Loading…</p>
          )}

          {data && (
            <>
              <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
                <div className="flex flex-wrap gap-4">
                  {FILTERS.map(key => (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                        filter === key ? 'text-amber' : 'text-muted hover:text-bone'
                      }`}
                    >
                      {key === 'all'
                        ? `All (${unique.length})`
                        : `${CATEGORY_LABELS[key]} (${counts[key] ?? 0})`}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-5 font-mono text-xs">
                  <button
                    onClick={onToggleAll}
                    className="text-muted transition-colors hover:text-amber"
                  >
                    {allCollapsed ? 'expand all' : 'collapse all'}
                  </button>
                  <button
                    onClick={() => setOldestFirst(v => !v)}
                    className="text-muted transition-colors hover:text-amber"
                  >
                    {oldestFirst ? 'oldest first' : 'newest first'} &#8645;
                  </button>
                </div>
              </div>

              <div className="grid gap-12 md:grid-cols-[200px_1fr] md:gap-16">
                <aside className="md:sticky md:top-24 md:self-start">
                  <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">
                    Organisations
                  </p>
                  <ul className="flex flex-col gap-3">
                    {rail.map(org => (
                      <li key={org.org}>
                        <a
                          href={`#org-${slugify(org.org)}`}
                          onClick={e => {
                            e.preventDefault();
                            document
                              .getElementById(`org-${slugify(org.org)}`)
                              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className={`flex items-baseline justify-between gap-3 font-mono text-xs transition-colors ${
                            org.visibleCount === 0
                              ? 'cursor-default text-muted/40'
                              : activeOrg === `org-${slugify(org.org)}`
                                ? 'text-amber'
                                : 'text-muted hover:text-bone'
                          }`}
                        >
                          <span className="truncate">{org.org}</span>
                          <span>{org.visibleCount}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </aside>

                <div ref={mainRef} className="flex flex-col gap-16">
                  {groups.length === 0 && (
                    <p className="font-mono text-sm text-muted">Nothing here yet.</p>
                  )}

                  {groups.map(group => {
                    const oKey = orgKey(group.org);
                    const orgOpen = isOpen(oKey);
                    const slug = slugify(group.org);

                    return (
                      <section
                        key={group.org}
                        id={`org-${slug}`}
                        data-org
                        className="scroll-mt-24 font-mono"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3">
                          <button
                            onClick={() => toggle(oKey)}
                            aria-expanded={orgOpen}
                            className="group flex items-baseline gap-3 text-left"
                          >
                            <Chevron open={orgOpen} />
                            <span className="text-xl text-bone transition-colors group-hover:text-amber">
                              {group.org}
                            </span>
                            <span className="text-xs text-muted">
                              {group.repos.length} repos · {group.count}
                            </span>
                          </button>
                          <a
                            href={`https://github.com/${group.org}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted transition-colors hover:text-amber"
                          >
                            view org &rarr;
                          </a>
                        </div>

                        {orgOpen && (
                          <div className="ml-2 mt-5 flex flex-col gap-6 border-l border-line pl-5">
                            {group.repos.map(repo => {
                              const rKey = repoKey(repo.repo);
                              const repoOpen = isOpen(rKey);

                              return (
                                <div key={repo.repo}>
                                  <button
                                    onClick={() => toggle(rKey)}
                                    aria-expanded={repoOpen}
                                    className="group flex w-full flex-wrap items-baseline gap-x-3 gap-y-1 text-left"
                                  >
                                    <Chevron open={repoOpen} />
                                    <span className="text-sm text-amber-dim transition-colors group-hover:text-amber">
                                      {repo.name}
                                    </span>
                                    <span className="text-xs text-muted">
                                      <RepoCounts items={repo.items} />
                                    </span>
                                  </button>

                                  {repoOpen && (
                                    <div className="ml-5 mt-3 flex flex-col gap-3 border-l border-line pl-5">
                                      {repo.items.map(item => (
                                        <ContributionRow
                                          key={item.id}
                                          item={item}
                                          showRepo={false}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </section>
                    );
                  })}

                  <Reveal>
                    <p className="border-t border-line pt-8 font-mono text-xs text-muted">
                      End of journal · {unique.length} contributions recorded so far
                    </p>
                  </Reveal>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default OssJournal;
