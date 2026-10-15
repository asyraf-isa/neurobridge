import { DEMO_NOW } from "@/data/work-day.js";
import { stepDuration } from "@/lib/work-day-store.js";

/** Time left in a task at the demo's "now", clamped to 1…dur minutes. */
export const minutesLeft = (task) => Math.min(task.dur, Math.max(1, task.start + task.dur - DEMO_NOW));

/** Progress through a task at the demo's "now", 4–100%. */
export const taskProgress = (task) => Math.min(100, Math.max(4, ((DEMO_NOW - task.start) / task.dur) * 100));

/** Start time of each step: the parent's start plus the steps before it. */
export const stepTimes = (task) => {
  let at = task.start;
  return (task.steps || []).map((step) => {
    const time = at;
    at += stepDuration(task, step);
    return time;
  });
};
