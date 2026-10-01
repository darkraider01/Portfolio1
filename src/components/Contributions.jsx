import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MoltenBackdrop from './MoltenBackdrop';
import SectionHeading from './SectionHeading';
import ContributionGraph from './ContributionGraph';
import Reveal from './Reveal';
import { timeAgo } from '../utils/timeAgo';
import { countByCategory, dedupeItems } from '../utils/ossGroups';

const CATEGORY_LABELS = {
  mergedPRs: 'Merged PRs',
  openPRs: 'Open PRs',
  issuesCreated: 'Issues Raised',
  issuesAssigned: 'Issues Taken',
  reviewsGiven: 'Reviews Given'
};

const Contributions = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/data/oss-contributions.json')
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true));
  }, []);

  // Deduped so a contribution filed under two search categories is counted once.
  const unique = useMemo(() => dedupeItems(data?.items ?? []), [data]);
  const counts = useMemo(() => countByCategory(unique), [unique]);

  const orgs = useMemo(
    () => [...new Set(unique.map(item => item.repo.split('/')[0]))].length,
    [unique]
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
          <div className="mb-14 grid grid-cols-2 gap-6 md:grid-cols-5">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <div key={key}>
                <p className="font-mono text-3xl text-bone">{counts[key] ?? 0}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <Reveal>
            <ContributionGraph />
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-12 flex flex-col gap-3 border-t border-line pt-8 md:flex-row md:items-baseline md:justify-between">
              <div>
                <p className="font-sans text-base text-bone">
                  Every contribution, filed by organisation and repo.
                </p>
                <p className="mt-1 font-mono text-xs text-muted">
                  {unique.length} contributions across {orgs} organisation{orgs === 1 ? '' : 's'}
                </p>
              </div>
              <Link
                to="/oss"
                className="font-mono text-xs uppercase tracking-widest text-amber transition-colors hover:text-bone"
              >
                read the full journal &rarr;
              </Link>
            </div>
          </Reveal>
        </div>
      )}
    </section>
  );
};

export default Contributions;
