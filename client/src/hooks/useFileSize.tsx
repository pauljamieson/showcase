export function useFileSize(size: number) {
  function formatSize(s: number) {
    const kb = s / 1024;
    if (kb < 1000) return `${kb.toFixed(2)}kb`;
    const mb = s / 1024 / 1024;
    if (mb < 1000) return `${mb.toFixed(2)}mb`;
    const gb = s / 1024 / 1024 / 1024;
    if (gb < 1000) return `${gb.toFixed(2)}gb`;
    return "That sucker is huge!";
  }
  return formatSize(size);
}
