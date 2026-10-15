import { useState } from "react";
import Icon from "@/components/common/Icon.jsx";
import { usePomodoro } from "@/lib/use-pomodoro.js";
import { endPomodoro, formatClock, pausePomodoro, POMODORO_MODES, startPomodoro } from "@/lib/pomodoro-store.js";

/**
 * Floating focus timer (DESIGN.md → Layout): bottom-right on every screen once
 * a focus block has started. A dark card with Pause/Resume and End that can be
 * minimised to a pill showing the time left and the current task.
 * Reads and writes the global pomodoro store only.
 */
export default function PomodoroFloatingWidget() {
  const pom = usePomodoro(true);
  const [minimised, setMinimised] = useState(false);

  if (!pom.hasStarted && !pom.isRunning) return null;

  const mode = POMODORO_MODES[pom.modeKey] || POMODORO_MODES.focus;
  const clock = formatClock(pom.timeLeft);
  const progress = pom.totalDuration ? (1 - pom.timeLeft / pom.totalDuration) * 100 : 0;
  const status = pom.isRunning ? "Running" : pom.timeLeft === 0 ? "Done" : "Paused";
  const toggle = () => (pom.isRunning ? pausePomodoro() : startPomodoro());

  if (minimised) {
    return (
      <button
        type="button"
        onClick={() => setMinimised(false)}
        aria-label={`Focus timer, ${clock} left. Expand`}
        className="fixed right-6 bottom-6 z-40 flex h-[3.25rem] max-w-80 cursor-pointer items-center gap-2.5 rounded-full bg-ink pr-[1.125rem] pl-3 text-on-primary shadow-float-strong max-sm:right-4 max-sm:bottom-4"
      >
        <span className="size-6 shrink-0 rounded-full bg-tertiary-soft" />
        <span className="text-[1.125rem] font-extrabold tabular-nums">{clock}</span>
        <span className="min-w-0 truncate text-body-sm text-muted-border">{pom.taskTitle}</span>
      </button>
    );
  }

  return (
    <aside
      aria-label="Focus timer"
      className="fixed right-6 bottom-6 z-40 flex w-[18.75rem] flex-col gap-3 rounded-card-sm bg-ink p-[1.125rem] text-on-primary shadow-float-strong max-sm:right-4 max-sm:bottom-4"
    >
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-tertiary-soft px-2.5 py-[0.3125rem] text-label-sm font-extrabold tracking-[0.04em] text-ink uppercase">
          {mode.type === "work" ? "Focus" : "Break"}
        </span>
        <span className="flex-1 text-label-sm text-muted-border" aria-live="polite">
          {status}
        </span>
        <button
          type="button"
          onClick={() => setMinimised(true)}
          aria-label="Minimise"
          className="grid size-[1.875rem] cursor-pointer place-items-center rounded-full bg-on-primary/12 text-on-primary transition-colors hover:bg-on-primary/20"
        >
          <Icon name="remove" className="text-[18px]" />
        </button>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[2.625rem] leading-none font-extrabold tracking-[-0.02em] tabular-nums">{clock}</span>
        <span className="truncate text-body-sm text-muted-border">{pom.taskTitle}</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-on-primary/15">
        <div className="h-full rounded-full bg-tertiary-soft transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={toggle}
          className="h-10 flex-1 cursor-pointer rounded-full bg-on-primary text-body-md font-bold text-ink transition-colors hover:bg-tint-indigo"
        >
          {pom.isRunning ? "Pause" : "Resume"}
        </button>
        <button
          type="button"
          onClick={() => endPomodoro()}
          className="h-10 flex-1 cursor-pointer rounded-full bg-on-primary/12 text-body-md font-bold text-on-primary transition-colors hover:bg-on-primary/20"
        >
          End
        </button>
      </div>
    </aside>
  );
}
