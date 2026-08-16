// Lightweight, dependency-free text utilities used by the agent pipeline.
// No external NLP libraries or APIs — everything runs locally and deterministically.

export function normalize(text: string): string {
  return text.toLowerCase();
}

export function detectLanguage(text: string): "zh" | "en" | "mixed" {
  const hasCJK = /[一-鿿]/.test(text);
  const hasLatin = /[a-zA-Z]{3,}/.test(text);
  if (hasCJK && hasLatin) return "mixed";
  if (hasCJK) return "zh";
  return "en";
}

export function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  const h = normalize(haystack);
  const n = normalize(needle);
  let count = 0;
  let idx = h.indexOf(n);
  while (idx !== -1) {
    count++;
    idx = h.indexOf(n, idx + n.length);
  }
  return count;
}

// Token-overlap similarity (Jaccard-style) used for fuzzy entity resolution.
// Operates on character bigrams so it degrades gracefully for CJK text,
// which has no whitespace token boundaries.
export function bigrams(text: string): Set<string> {
  const t = normalize(text).replace(/\s+/g, "");
  const grams = new Set<string>();
  for (let i = 0; i < t.length - 1; i++) {
    grams.add(t.slice(i, i + 2));
  }
  return grams;
}

export function similarity(a: string, b: string): number {
  const ga = bigrams(a);
  const gb = bigrams(b);
  if (ga.size === 0 || gb.size === 0) return 0;
  let intersection = 0;
  for (const g of ga) {
    if (gb.has(g)) intersection++;
  }
  const union = ga.size + gb.size - intersection;
  return union === 0 ? 0 : intersection / union;
}
