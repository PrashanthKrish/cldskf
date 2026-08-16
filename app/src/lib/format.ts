export function fmtSEK(v: number): string {
  return `SEK ${(v / 1_000_000).toFixed(1)}M`;
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-GB", { hour12: false });
}
