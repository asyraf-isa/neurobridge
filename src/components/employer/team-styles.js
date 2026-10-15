// Literal Tailwind class maps for employer UI states (so Tailwind can see them).

export const STATUS = {
  request: { label: "Open request", className: "bg-amber-tint text-amber-ink", rank: 0 },
  checkin: { label: "Needs check-in", className: "bg-tint-indigo text-indigo-ink", rank: 1 },
  stable: { label: "Stable", className: "bg-tint-teal text-teal-ink", rank: 2 },
};

export const SEVERITY = {
  low: { label: "LOW", className: "bg-fill text-ink-soft" },
  medium: { label: "MEDIUM", className: "bg-tint-indigo text-indigo-ink" },
  high: { label: "HIGH", className: "bg-red-tint text-red-ink" },
};

export const GUIDE_LEVELS = [
  { k: "mild", label: "MILD", className: "bg-fill", ink: "text-ink-soft" },
  { k: "moderate", label: "MODERATE", className: "bg-tint-indigo", ink: "text-indigo-ink" },
  { k: "severe", label: "SEVERE", className: "bg-red-tint", ink: "text-red-ink" },
];

// Alert urgency: urgent (red, act now) · mild (amber, check in today).
export const URGENCY = {
  urgent: {
    label: "URGENT", icon: "emergency_home", rank: 0,
    surface: "border-alert-red-border bg-alert-red-surface",
    tile: "bg-alert-red-tile text-alert-red-tile-ink",
    ink: "text-alert-red-ink",
  },
  mild: {
    label: "TODAY", icon: "support", rank: 1,
    surface: "border-alert-amber-border bg-alert-amber-surface",
    tile: "bg-alert-amber-tile text-alert-amber-tile-ink",
    ink: "text-amber-ink",
  },
};

export const AVATAR_TILES = { indigo: "bg-tint-indigo", teal: "bg-tint-teal", slate: "bg-fill" };

export const ACTIVITY_TONES = {
  indigo: "bg-tint-indigo text-primary",
  teal: "bg-tint-teal text-teal-ink",
  slate: "bg-fill text-ink-soft",
};

export const firstName = (name) => name.split(" ")[0];
