export function formatDuration(d: number) {
  const s = (d % 60).toString().padStart(2, "0");
  const m = Math.floor((d / 60) % 60)
    .toString()
    .padStart(2, "0");
  const h = Math.floor(d / 3600)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
}
