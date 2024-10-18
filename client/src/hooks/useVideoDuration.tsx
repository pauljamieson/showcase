export default function useVideoDuration(seconds: number) {
  function formatDuration(d: number) {
    const h = Math.floor(d / 3600).toString();
    const s = (d % 60).toString().padStart(2, "0");
    const m =
      +h > 0
        ? Math.floor((d / 60) % 60)
            .toString()
            .padStart(2, "0")
        : Math.floor((d / 60) % 60).toString();

    return +h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  }

  return formatDuration(seconds);
}
