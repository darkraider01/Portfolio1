import { useState } from 'react';
import SpotlightCard from './reactbits/SpotlightCard';
import Reveal from './Reveal';
import { timeAgo } from '../utils/timeAgo';

// One expandable contribution row. Shared by the homepage summary and the
// full OSS journal so both render identically.
const ContributionRow = ({ item, showRepo = true }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Reveal>
      <SpotlightCard className="p-5 md:p-6">
        <button
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
          className="flex w-full flex-col gap-2 text-left md:flex-row md:items-baseline md:gap-6"
        >
          <span className="font-mono text-xs text-amber-dim md:w-32 md:shrink-0">
            {item.state}
          </span>
          <span className="flex-1 font-sans text-base text-bone">{item.title}</span>
          {showRepo && (
            <span className="font-mono text-xs text-muted md:shrink-0">{item.repo}</span>
          )}
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
                onClick={e => e.stopPropagation()}
              >
                view on GitHub &rarr;
              </a>
            </div>
          </div>
        )}
      </SpotlightCard>
    </Reveal>
  );
};

export default ContributionRow;
