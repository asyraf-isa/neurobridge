// Task palette roles → Tailwind classes. Literal strings so Tailwind can see
// them. The values behind them swap under Calm view (index.css).
export const TASK_TONES = {
  lilac: { fill: "bg-task-lilac", accent: "text-task-lilac-accent", border: "border-task-lilac-accent", bar: "bg-task-lilac-accent" },
  peach: { fill: "bg-task-peach", accent: "text-task-peach-accent", border: "border-task-peach-accent", bar: "bg-task-peach-accent" },
  mint: { fill: "bg-task-mint", accent: "text-task-mint-accent", border: "border-task-mint-accent", bar: "bg-task-mint-accent" },
  sky: { fill: "bg-task-sky", accent: "text-task-sky-accent", border: "border-task-sky-accent", bar: "bg-task-sky-accent" },
  butter: { fill: "bg-task-butter", accent: "text-task-butter-accent", border: "border-task-butter-accent", bar: "bg-task-butter-accent" },
};

export const toneOf = (color) => TASK_TONES[color] || TASK_TONES.lilac;
