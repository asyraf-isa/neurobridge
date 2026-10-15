import { useEffect, useState } from "react";
import { DAY_END, DEMO_NOW, seedNextWeek, seedTasks, seedWeek } from "@/data/work-day.js";

// The employee's work day, shared by My Work and the dashboard's "Current
// focus" card (DESIGN.md: "Linked to My Work: same task, same steps, same
// timer"). Module state + a window event, like pomodoro-store.js — but kept in
// memory only, so a refresh restores the seed day.
const EVENT = "work_day_change";

const isBreak = (task) => task.kind === "break";
const isOpen = (task) => !isBreak(task) && !task.done;

let state = {
  tasks: seedTasks,
  current: "t3",
  week: seedWeek,
  nextWeek: seedNextWeek,
};

function commit(next) {
  state = { ...state, ...next };
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** Restart every start time from the day's first slot, in list order. */
function reflow(tasks, base) {
  let at = base;
  return tasks.map((task) => {
    const placed = { ...task, start: at };
    at += task.dur;
    return placed;
  });
}

/** The task running at DEMO_NOW, else keep `fallback`, else the first open task. */
function pickCurrent(tasks, fallback) {
  const live = tasks.find((t) => isOpen(t) && t.start <= DEMO_NOW && DEMO_NOW < t.start + t.dur);
  if (live) return live.id;
  if (tasks.some((t) => t.id === fallback)) return fallback;
  return tasks.find(isOpen)?.id ?? null;
}

/** Minutes a step takes: its own `dur`, else an even share of the parent. */
export const stepDuration = (task, step) => step.dur || Math.round(task.dur / task.steps.length);

export function getWorkDay() {
  return state;
}

export function useWorkDay() {
  const [snapshot, setSnapshot] = useState(state);
  useEffect(() => {
    const update = () => setSnapshot(state);
    window.addEventListener(EVENT, update);
    return () => window.removeEventListener(EVENT, update);
  }, []);
  return snapshot;
}

export function setCurrentTask(id) {
  const task = state.tasks.find((t) => t.id === id);
  if (task && !task.done) commit({ current: id });
}

/** Tick a task done/undone. Finishing the current task moves "Now" to the next open one. */
export function toggleTask(id) {
  const tasks = state.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  let current = state.current;
  const task = tasks.find((t) => t.id === id);
  if (id === state.current && task.done) {
    const idx = tasks.findIndex((t) => t.id === id);
    const next = tasks.slice(idx + 1).concat(tasks.slice(0, idx)).find(isOpen);
    current = next ? next.id : current;
  }
  commit({ tasks, current });
}

/** Tick a step of the current task. */
export function toggleStep(stepId) {
  commit({
    tasks: state.tasks.map((t) =>
      t.id === state.current
        ? { ...t, steps: t.steps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s)) }
        : t,
    ),
  });
}

/**
 * Replace the current task's steps (from the assistant's "Break down").
 * `steps` are `{ t, dur? }`. Returns `{ taskId, previous }` so the change can
 * be undone with `restoreSteps`.
 */
export function setCurrentSteps(steps) {
  const task = state.tasks.find((t) => t.id === state.current);
  if (!task) return null;
  const previous = task.steps;
  commit({
    tasks: state.tasks.map((t) =>
      t.id === task.id ? { ...t, steps: steps.map((step, id) => ({ id, t: step.t, dur: step.dur, done: false })) } : t,
    ),
  });
  return { taskId: task.id, previous };
}

/** Put back a task's steps saved by `setCurrentSteps`. */
export function restoreSteps({ taskId, previous }) {
  commit({ tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, steps: previous } : t)) });
}

/** The current task, if any. */
export const getCurrentTask = () => state.tasks.find((t) => t.id === state.current) ?? null;

/** Drag a whole task before/after another; every start time reflows. */
export function moveTask(id, targetId, before) {
  if (id === targetId) return;
  const item = state.tasks.find((t) => t.id === id);
  const tasks = state.tasks.filter((t) => t.id !== id);
  tasks.splice(tasks.findIndex((t) => t.id === targetId) + (before ? 0 : 1), 0, item);
  const out = reflow(tasks, state.tasks[0].start);
  commit({ tasks: out, current: pickCurrent(out, state.current) });
}

/**
 * Drag a step out of the current task and drop it next to another task. It
 * becomes a standalone task with a "from" label; the parent shrinks by the
 * step's time.
 */
export function placeStep(stepId, targetId, before) {
  const parent = state.tasks.find((t) => t.id === state.current);
  const step = parent?.steps?.find((s) => s.id === stepId);
  if (!step || targetId === parent.id) return;
  const minutes = stepDuration(parent, step);
  const tasks = state.tasks.map((t) =>
    t.id === parent.id
      ? { ...t, dur: Math.max(5, t.dur - minutes), steps: t.steps.filter((s) => s.id !== stepId) }
      : t,
  );
  tasks.splice(tasks.findIndex((t) => t.id === targetId) + (before ? 0 : 1), 0, {
    id: `s${Date.now()}`,
    icon: parent.icon,
    title: step.t,
    dur: minutes,
    color: parent.color,
    done: step.done,
    from: parent.from || parent.title,
  });
  const out = reflow(tasks, state.tasks[0].start);
  commit({ tasks: out, current: pickCurrent(out, state.current) });
}

/** Edit (or, when `fn` returns null, delete) a block in the week grid. `day` "wed" is today. */
export function updateBlock(day, id, fn) {
  if (day === "wed") {
    const tasks = state.tasks
      .map((t) => (t.id === id ? fn(t) : t))
      .filter(Boolean)
      .sort((a, b) => a.start - b.start);
    commit({ tasks, current: pickCurrent(tasks, state.current) });
    return;
  }
  commit({ week: { ...state.week, [day]: state.week[day].map((t) => (t.id === id ? fn(t) : t)).filter(Boolean) } });
}

/** Snapshot of what "Can wait" starts from: open work for today, Thursday and next week. */
export function buildCanWait() {
  const today = state.tasks.filter(isOpen).map((t) => ({ ...pick(t), col: 0, src: "today" }));
  const tomorrow = state.week.thu.filter((t) => !t.done).map((t) => ({ ...pick(t), col: 1, src: "thu" }));
  const next = state.nextWeek.map((t) => ({ ...pick(t), col: 2, src: "next" }));
  return [...today, ...tomorrow, ...next];
}

const pick = ({ id, title, dur, color, icon }) => ({ id, title, dur, color, icon });

/** Apply the "Can wait" board: column 0 = today, 1 = tomorrow (Thursday), 2 = next week. */
export function applyCanWait(wait) {
  const at = (id) => wait.find((w) => w.id === id);
  const tasks = state.tasks.filter((t) => !at(t.id) || at(t.id).col === 0);
  const thu = state.week.thu.filter((t) => !at(t.id) || at(t.id).col === 1);
  const nextWeek = wait.filter((w) => w.col === 2).map(pick);

  let end = Math.max(...tasks.map((t) => t.start + t.dur));
  wait
    .filter((w) => w.col === 0 && w.src !== "today")
    .forEach((w) => {
      tasks.push({ ...pick(w), start: end });
      end += w.dur;
    });
  let thuEnd = Math.max(780, ...thu.map((t) => t.start + t.dur));
  wait
    .filter((w) => w.col === 1 && w.src !== "thu")
    .forEach((w) => {
      thu.push({ ...pick(w), start: thuEnd });
      thuEnd += w.dur;
    });

  const current = tasks.some((t) => t.id === state.current) ? state.current : tasks.find(isOpen)?.id ?? null;
  commit({ tasks, week: { ...state.week, thu }, nextWeek, current });
}

/**
 * Schedule a plan's steps after today's last task; whatever doesn't fit by
 * DAY_END spills to Thursday, then next week. Returns the "Scheduled: …" line.
 */
export function schedulePlan(planSteps) {
  let cur = Math.max(...state.tasks.map((t) => t.start + t.dur));
  let thuCur = Math.max(780, ...state.week.thu.map((t) => t.start + t.dur));
  const add = [];
  const thuAdd = [];
  const next = [];
  let today = true;
  const counts = { today: 0, thu: 0, next: 0 };

  planSteps.forEach((step, i) => {
    const id = `p${Date.now()}${i}`;
    const base = { id, title: step.t, dur: step.dur, color: "lilac", icon: "edit_note" };
    if (today && cur + step.dur > DAY_END) today = false;
    if (today) {
      add.push(step.brk ? { id, kind: "break", title: "Break", start: cur, dur: step.dur } : { ...base, start: cur });
      cur += step.dur;
      if (!step.brk) counts.today += 1;
    } else if (!step.brk && thuCur + step.dur <= DAY_END) {
      thuAdd.push({ ...base, start: thuCur });
      thuCur += step.dur;
      counts.thu += 1;
    } else if (!step.brk) {
      next.push(base);
      counts.next += 1;
    }
  });
  while (add.length && isBreak(add[add.length - 1])) add.pop();

  commit({
    tasks: [...state.tasks, ...add],
    week: { ...state.week, thu: [...state.week.thu, ...thuAdd] },
    nextWeek: [...state.nextWeek, ...next],
  });

  const parts = [];
  if (counts.today) parts.push(`${counts.today} today`);
  if (counts.thu) parts.push(`${counts.thu} Thursday`);
  if (counts.next) parts.push(`${counts.next} next week`);
  return `Scheduled: ${parts.join(" · ")}`;
}
