// Mood colour engine (DESIGN.md → "Mood colours"). A 0–100 mood value maps to
// an OKLCH colour along seven stops (indigo → slate → teal → warm). Calm view
// drops chroma to ~55%; an untouched check-in drops it to ~35% so the shape
// reads as "unset". These colours are computed, so components apply them with
// inline styles — there is no static token for them.

export const LEVELS = [
  "Very unpleasant",
  "Unpleasant",
  "Slightly unpleasant",
  "Neutral",
  "Slightly pleasant",
  "Pleasant",
  "Very pleasant",
];

const STOPS = [
  [0.52, 0.2, 295],
  [0.58, 0.18, 272],
  [0.68, 0.13, 245],
  [0.8, 0.1, 215],
  [0.79, 0.13, 165],
  [0.87, 0.15, 95],
  [0.79, 0.16, 62],
];

/** [L, C, H] for a mood value 0–100. */
export function moodLch(v) {
  const x = (v / 100) * 6;
  const i = Math.min(5, Math.floor(x));
  const f = x - i;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  return a.map((n, j) => n + (b[j] - n) * f);
}

/** CSS oklch() string, optional alpha. */
export const oklch = ([L, C, H], alpha) =>
  `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)}${alpha != null ? ` / ${alpha}` : ""})`;

export const calmed = ([L, C, H], calm) => (calm ? [L, C * 0.55, H] : [L, C, H]);

/** Named level ("Slightly pleasant") for a mood value. */
export const moodLevel = (v) => LEVELS[Math.min(6, Math.floor((v / 100) * 7))];

/** 1–10 score for a mood value. */
export const moodScore = (v) => Math.round((v / 100) * 9) + 1;

/** Mood value for a 1–10 score. */
export const scoreToMood = (score) => Math.round(((score - 1) / 9) * 100);

/** Slider fill: low → indigo, middle → slate, high → teal (tokens). */
export const moodRing = (v) =>
  v < 45 ? "var(--color-mood-low)" : v > 55 ? "var(--color-mood-high)" : "var(--color-mood-mid)";

/** The round "mood dot" fill used in history, calendars and entry cards. */
export function moodDot(v, calm = false) {
  const c = calmed(moodLch(v), calm);
  const light = [Math.min(0.98, c[0] + 0.12), c[1] * 0.5, c[2]];
  const deep = [Math.max(0.3, c[0] - 0.12), c[1] * 1.1, c[2] - 8];
  return `radial-gradient(circle at 35% 30%, ${oklch(light)} 0%, ${oklch(c)} 50%, ${oklch(deep)} 100%)`;
}

/**
 * Colours for the big check-in shape. `touched` false → desaturated "unset";
 * `unsure` → a neutral grey.
 */
export function moodShapeColors(v, { calm = false, touched = true, unsure = false } = {}) {
  let col = unsure ? [0.78, 0.02, 255] : moodLch(v);
  col = calmed(col, calm);
  if (!touched && !unsure) col = [col[0], col[1] * 0.35, col[2]];
  return {
    color: oklch(col),
    light: oklch([Math.min(0.98, col[0] + 0.14), col[1] * 0.45, col[2]]),
    deep: oklch([Math.max(0.3, col[0] - 0.16), Math.min(0.25, col[1] * 1.15), col[2] - 8]),
    halo: oklch(col, 0.35),
    tint: oklch([0.955, col[1] * 0.4, col[2]]),
  };
}

/**
 * Blob outline for the mood shape: spiky when unpleasant (u < 0), round and
 * flower-like when pleasant (u > 0). `u` is −1…1.
 */
export function moodBlob(u) {
  let n = 10;
  let a = 0;
  let f = (c) => c;
  if (u < 0) {
    a = 0.24 * -u;
    f = (c) => 2 * Math.pow((c + 1) / 2, 3) - 1;
  } else if (u > 0) {
    n = 5;
    a = 0.15 * u;
    f = (c) => 1 - 2 * Math.pow((1 - c) / 2, 2);
  }
  const points = [];
  for (let i = 0; i < 200; i += 1) {
    const th = (i / 200) * Math.PI * 2;
    const r = 60 * (1 + a * f(Math.cos(n * (th + Math.PI / 2))));
    points.push(`${(100 + r * Math.cos(th)).toFixed(1)} ${(100 + r * Math.sin(th)).toFixed(1)}`);
  }
  return `M${points.join("L")}Z`;
}

const WEEKDAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
export const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

/** "TODAY · WEDNESDAY 7 OCTOBER" / "TUESDAY 6 OCTOBER" for an ISO date. */
export function dayLabel(iso, today) {
  const d = new Date(`${iso}T12:00:00`);
  const label = `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  return iso === today ? `TODAY · ${label}` : label;
}
