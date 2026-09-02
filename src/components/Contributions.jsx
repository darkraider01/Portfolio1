import { useEffect, useState } from 'react';
import MoltenBackdrop from './MoltenBackdrop';
import SectionHeading from './SectionHeading';
import SpotlightCard from './reactbits/SpotlightCard';
import Reveal from './Reveal';
import { timeAgo } from '../utils/timeAgo';

const CATEGORY_LABELS = {
  mergedPRs: 'Merged PRs',
  issuesCreated: 'Issues Raised',
  issuesAssigned: 'Issues Taken',
  reviewsGiven: 'Reviews Given'
};

const FILTERS = ['all', ...Object.keys(CATEGORY_LABELS)];

const Contributions = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('all');
  const [oldestFirst, setOldestFirst] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetch('/data/oss-contributions.json')
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true));
  }, []);

  const items = data?.items ?? [];
  const filtered = items
    .filter(item => filter === 'all' || item.category === filter)
    .sort((a, b) =>
      oldestFirst
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  return (
    <section
      id="contributions"
      className="relative overflow-hidden border-b border-line px-6 py-24 md:px-16 md:py-32 scroll-mt-24"
    >
      <MoltenBackdrop />
      <div className="relative z-10 mb-14 grid gap-10 md:grid-cols-[200px_1fr] md:gap-16">
        <SectionHeading number="04" text="Contributions" />
        <div className="max-w-xl">
          <p className="font-sans text-lg text-bone-dim">
            Live OSS activity across every public repo I've touched — merged
            PRs, issues, and reviews. Pulled from GitHub once a day, not on
            page load.
          </p>
          {data && (
            <p className="mt-3 font-mono text-xs text-muted">
              last updated: {timeAgo(data.last_updated)}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="relative z-10 font-mono text-sm text-muted">
          Couldn't load contribution data right now — try again later.
        </p>
      )}

      {!error && !data && (
        <p className="relative z-10 font-mono text-sm text-muted">Loading…</p>
      )}

      {data && (
        <div className="relative z-10">
          <div className="mb-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <div key={key}>
                <p className="font-mono text-3xl text-bone">{data.summary[key] ?? 0}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              {FILTERS.map(key => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                    filter === key ? 'text-amber' : 'text-muted hover:text-bone'
                  }`}
                >
                  {key === 'all' ? 'All' : CATEGORY_LABELS[key]}
                </button>
              ))}
            </div>
            <button
              onClick={() => setOldestFirst(v => !v)}
              className="font-mono text-xs text-muted transition-colors hover:text-amber"
            >
              {oldestFirst ? 'oldest first' : 'newest first'} &#8645;
            </button>
          </div>

          {filtered.length === 0 && (
            <p className="font-mono text-sm text-muted">Nothing here yet.</p>
          )}

          <div className="flex flex-col gap-3">
            {filtered.map(item => {
              const rowKey = `${item.category}-${item.id}`;
              const expanded = expandedId === rowKey;
              return (
                <Reveal key={rowKey}>
                  <SpotlightCard className="p-5 md:p-6">
                    <button
                      onClick={() => setExpandedId(expanded ? null : rowKey)}
                      className="flex w-full flex-col gap-2 text-left md:flex-row md:items-baseline md:gap-6"
                    >
                      <span className="font-mono text-xs text-amber-dim md:w-32 md:shrink-0">
                        {item.state}
                      </span>
                      <span className="flex-1 font-sans text-base text-bone">{item.title}</span>
                      <span className="font-mono text-xs text-muted md:shrink-0">
                        {item.repo}
                      </span>
                      <span className="font-mono text-xs text-muted md:w-20 md:shrink-0 md:text-right">
                        {timeAgo(item.createdAt)}
                      </span>
                    </button>

                    {expanded && (
                      <div className="mt-4 border-t border-line pt-4">
                        {item.body && (
                          <p className="whitespace-pre-line font-sans text-sm leading-relaxed text-bone-dim">
                            {item.body}
                            {item.body.length >= 300 ? '…' : ''}
                          </p>
                        )}
                        <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs text-muted">
                          {item.labels.length > 0 && <span>{item.labels.join(', ')}</span>}
                          <span>{item.commentCount} comments</span>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted transition-colors hover:text-amber"
                          >
                            view on GitHub &rarr;
                          </a>
                        </div>
                      </div>
                    )}
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default Contributions;
