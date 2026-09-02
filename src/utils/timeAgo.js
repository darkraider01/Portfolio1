export function timeAgo(isoDate) {
  const then = new Date(isoDate).getTime();
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));

  const units = [
    ['y', 60 * 60 * 24 * 365],
    ['mo', 60 * 60 * 24 * 30],
    ['d', 60 * 60 * 24],
    ['h', 60 * 60],
    ['m', 60]
  ];

  for (const [label, secondsPerUnit] of units) {
    const value = Math.floor(seconds / secondsPerUnit);
    if (value >= 1) return `${value}${label} ago`;
  }
  return 'just now';
}
