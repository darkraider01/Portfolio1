import { useEffect, useMemo, useState } from 'react';

// Contribution calendar per calendar year, fed by scripts/fetch-oss-heatmap.mjs.
// Layout mirrors GitHub's grid: 7 rows (Sun–Sat), one column per week.

const CELL = 10; // px
const GAP = 3; // px
const STEP = CELL + GAP;

// 0 / 1 / 2–3 / 4–6 / 7+ — same shape as GitHub's buckets, amber instead of green.
const LEVEL_CLASS = [
  'bg-ink-soft',
  'bg-amber/20',
  'bg-amber/40',
  'bg-amber/65',
  'bg-amber'
];

const levelFor = count => {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
};

const buildGrid = days => {
  if (days.length === 0) return { cells: [], columns: 0, months: [] };

  // Pad the front so day 0 lands in its real weekday column (Sun = 0).
  const offset = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const cells = [...Array(offset).fill(null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);
  const columns = cells.length / 7;

  const months = [];
  let previousMonth = null;
  for (let col = 0; col < columns; col++) {
    const day = cells.slice(col * 7, col * 7 + 7).find(Boolean);
    if (!day) continue;
    const month = Number(day.date.slice(5, 7));
    if (month !== previousMonth) {
      months.push({ month, col });
      previousMonth = month;
    }
  }

  return { cells, columns, months };
};

const MONTH_LABEL = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ContributionGraph = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [year, setYear] = useState(null);

  useEffect(() => {
    fetch('/data/oss-heatmap.json')
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(json => {
        setData(json);
        setYear(json.years[0]?.year ?? null);
      })
      .catch(() => setError(true));
  }, []);

  const active = useMemo(
    () => data?.years.find(entry => entry.year === year) ?? null,
    [data, year]
  );
  const grid = useMemo(() => buildGrid(active?.days ?? []), [active]);

  if (error) return null;

  if (!data) {
    return <p className="font-mono text-xs text-muted">loading contribution graph…</p>;
  }

  return (
    <figure className="m-0">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex flex-wrap gap-4">
          {data.years.map(entry => (
            <button
              key={entry.year}
              onClick={() => setYear(entry.year)}
              className={`font-mono text-xs tracking-widest transition-colors ${
                entry.year === year ? 'text-amber' : 'text-muted hover:text-bone'
              }`}
            >
              {entry.year}
            </button>
          ))}
        </div>
        <figcaption className="font-mono text-xs text-muted">
          <span className="text-bone">{active?.total ?? 0}</span> contributions in {year}
        </figcaption>
      </div>

      <div className="-mx-1 overflow-x-auto pb-1">
        <div
          className="inline-block min-w-full px-1"
          role="img"
          aria-label={`${active?.total ?? 0} contributions in ${year}`}
        >
          <div className="relative mb-1 h-3" style={{ width: grid.columns * STEP - GAP }}>
            {grid.months.map(({ month, col }) => (
              <span
                key={`${month}-${col}`}
                className="absolute top-0 font-mono text-[10px] text-muted"
                style={{ left: col * STEP }}
              >
                {MONTH_LABEL[month]}
              </span>
            ))}
          </div>

          <div
            className="grid grid-flow-col grid-rows-7 gap-[3px]"
            style={{ width: grid.columns * STEP - GAP }}
          >
            {grid.cells.map((day, index) =>
              day ? (
                <span
                  key={day.date}
                  title={`${day.count} contribution${day.count === 1 ? '' : 's'} · ${day.date}`}
                  className={`h-[10px] w-[10px] rounded-[2px] ${LEVEL_CLASS[levelFor(day.count)]}`}
                />
              ) : (
                <span key={`pad-${index}`} className="h-[10px] w-[10px]" />
              )
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-muted">
        <span>Less</span>
        {LEVEL_CLASS.map((cls, level) => (
          <span key={level} className={`h-[10px] w-[10px] rounded-[2px] ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </figure>
  );
};

export default ContributionGraph;
