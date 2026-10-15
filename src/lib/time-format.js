// Time helpers for the work day. Minutes are minutes after midnight.

/** 645 → "10:45" (24h, no leading zero on the hour — DESIGN.md → Copy). */
export const formatMinutes = (minutes) => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;

/** 45 → "45 min", 90 → "1 h 30 min", 120 → "2 h". */
export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  return minutes % 60 ? `${Math.floor(minutes / 60)} h ${minutes % 60} min` : `${minutes / 60} h`;
};

/** "10:45 – 11:30" */
export const formatRange = (start, dur) => `${formatMinutes(start)} – ${formatMinutes(start + dur)}`;
