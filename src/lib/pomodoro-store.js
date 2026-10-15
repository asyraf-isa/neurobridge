// Global Pomodoro Store with AI Task Balancing & Tab-Independent Precision Timer
const STORAGE_KEY = "neurobridge_pomodoro_state";

export const POMODORO_MODES = {
  focus: {
    id: "focus",
    label: "Focus Block",
    defaultMinutes: 25,
    emoji: "🍅",
    type: "work",
    theme: {
      bg: "bg-emerald-50/80 border-emerald-200/90",
      accent: "text-emerald-800",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      progress: "bg-emerald-600",
      btn: "bg-emerald-700 hover:bg-emerald-800 text-white",
    },
    cue: "Job Time: Dive into single-focus execution.",
  },
  gentleFocus: {
    id: "gentleFocus",
    label: "Gentle Pacing",
    defaultMinutes: 15,
    emoji: "🌱",
    type: "work",
    theme: {
      bg: "bg-teal-50/80 border-teal-200/90",
      accent: "text-teal-800",
      badge: "bg-teal-100 text-teal-800 border-teal-300",
      progress: "bg-teal-600",
      btn: "bg-teal-700 hover:bg-teal-800 text-white",
    },
    cue: "Low-Friction Starter: Overcome initial task resistance.",
  },
  shortBreak: {
    id: "shortBreak",
    label: "Short Break",
    defaultMinutes: 5,
    emoji: "☕",
    type: "rest",
    theme: {
      bg: "bg-amber-50/80 border-amber-200/90",
      accent: "text-amber-800",
      badge: "bg-amber-100 text-amber-800 border-amber-300",
      progress: "bg-amber-500",
      btn: "bg-amber-700 hover:bg-amber-800 text-white",
    },
    cue: "Rest Time: Stand up, hydrate, or rest your eyes.",
  },
  longBreak: {
    id: "longBreak",
    label: "Sensory Reset Break",
    defaultMinutes: 15,
    emoji: "🌿",
    type: "rest",
    theme: {
      bg: "bg-sky-50/80 border-sky-200/90",
      accent: "text-sky-800",
      badge: "bg-sky-100 text-sky-800 border-sky-300",
      progress: "bg-sky-600",
      btn: "bg-sky-700 hover:bg-sky-800 text-white",
    },
    cue: "Deep Rest: Dim sensory inputs and clear working memory.",
  },
};

// "MM:SS" for a number of seconds — the clock shown by every timer surface.
export function formatClock(seconds) {
  const safe = Math.max(0, Math.round(seconds || 0));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

// Parse task duration string (e.g. "2h 30m", "1h 40m", "80-100 min", "45 min", 45) into minutes
export function parseTaskDurationMinutes(durationStr) {
  if (typeof durationStr === "number") return durationStr;
  if (!durationStr) return 45;
  const str = String(durationStr).toLowerCase().trim();

  // Match patterns like "2h 30m", "1h", "2 hours 15 mins"
  const hourMatch = str.match(/(\d+)\s*(?:h|hr|hrs|hours?)/);
  const minMatch = str.match(/(\d+)\s*(?:m|min|mins|minutes?)/);

  let total = 0;
  if (hourMatch) {
    total += parseInt(hourMatch[1], 10) * 60;
  }
  if (minMatch) {
    total += parseInt(minMatch[1], 10);
  }
  if (total > 0) return total;

  // Fallback to simple number
  const numMatch = str.match(/(\d+)/);
  return numMatch ? parseInt(numMatch[1], 10) : 45;
}

// Flexible Pacing & Balancing Engine: Calculates flexible work and rest intervals based on task expected time
export function generateAIPomodoroSchedule(totalMinutes = 45) {
  const mins = parseTaskDurationMinutes(totalMinutes);

  // Short tasks (under 30m)
  if (mins <= 30) {
    return [
      { id: "s1", type: "work", modeKey: "focus", label: "Focus Block", minutes: Math.min(25, Math.max(10, mins - 5)), cue: "Dive into single-focus execution" },
      { id: "s2", type: "rest", modeKey: "shortBreak", label: "Short Break", minutes: 5, cue: "Rest eyes, stretch, and hydrate" },
    ];
  }

  // Medium tasks (31m to 60m)
  if (mins <= 60) {
    return [
      { id: "s1", type: "work", modeKey: "focus", label: "Focus Block", minutes: 25, cue: "Deep uninterrupted work" },
      { id: "s2", type: "work", modeKey: "gentleFocus", label: "Gentle Pacing", minutes: 15, cue: "Steady progress without friction" },
      { id: "s3", type: "rest", modeKey: "shortBreak", label: "Short Break", minutes: 5, cue: "Stand up and rest your eyes" },
    ];
  }

  // Tasks between 61m and 75m
  if (mins <= 75) {
    return [
      { id: "s1", type: "work", modeKey: "focus", label: "Focus Block", minutes: 25, cue: "Deep uninterrupted work" },
      { id: "s2", type: "rest", modeKey: "shortBreak", label: "Short Break", minutes: 5, cue: "Hydrate and breathe" },
      { id: "s3", type: "work", modeKey: "focus", label: "Focus Block", minutes: 25, cue: "Second focused sprint" },
      { id: "s4", type: "rest", modeKey: "longBreak", label: "Sensory Reset Break", minutes: 15, cue: "Deep rest and reset" },
    ];
  }

  // Tasks between 76m and 105m (User's specific 80-100 min pacing pattern!)
  if (mins <= 105) {
    return [
      { id: "s1", type: "work", modeKey: "focus", label: "Focus Block", minutes: 25, cue: "Primary deep focus session" },
      { id: "s2", type: "work", modeKey: "gentleFocus", label: "Gentle Pacing", minutes: 10, cue: "Low-friction steady continuation" },
      { id: "s3", type: "rest", modeKey: "shortBreak", label: "Short Break", minutes: 10, cue: "Mind & physical recovery break" },
      { id: "s4", type: "work", modeKey: "focus", label: "Focus Block", minutes: 25, cue: "Second core focus session" },
      { id: "s5", type: "work", modeKey: "gentleFocus", label: "Gentle Pacing", minutes: 15, cue: "Wrap-up and verification pacing" },
      { id: "s6", type: "rest", modeKey: "longBreak", label: "Sensory Reset Break", minutes: 15, cue: "Full sensory recharge" },
    ];
  }

  // Long tasks (106m+ / 2 hours to 2.5 hours, e.g. 150m for Monthly Procurement Report)
  return [
    { id: "s1", type: "work", modeKey: "focus", label: "Focus Block", minutes: 25, cue: "Deep data analysis & synthesis" },
    { id: "s2", type: "work", modeKey: "gentleFocus", label: "Gentle Pacing", minutes: 15, cue: "Steady documentation progress" },
    { id: "s3", type: "rest", modeKey: "shortBreak", label: "Short Break", minutes: 10, cue: "Movement, water, and rest eyes" },
    { id: "s4", type: "work", modeKey: "focus", label: "Focus Block", minutes: 25, cue: "Reconcile variance flags" },
    { id: "s5", type: "work", modeKey: "gentleFocus", label: "Gentle Pacing", minutes: 15, cue: "Prepare summary deck" },
    { id: "s6", type: "rest", modeKey: "shortBreak", label: "Short Break", minutes: 10, cue: "Cognitive breathing break" },
    { id: "s7", type: "work", modeKey: "focus", label: "Focus Block", minutes: 25, cue: "Final review & verification" },
    { id: "s8", type: "work", modeKey: "gentleFocus", label: "Gentle Pacing", minutes: 10, cue: "Definition of done check" },
    { id: "s9", type: "rest", modeKey: "longBreak", label: "Sensory Reset Break", minutes: 15, cue: "Full reset & sensory recovery" },
  ];
}

// Gentle, melodic Web Audio API sound for mode and pace switches (lasts 2 seconds)
export function playModeSwitchChime(modeKey = "focus") {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const createNote = (freq, startTime, duration, vol = 0.12) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(vol, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    };

    if (modeKey === "focus") {
      // Ascending energetic yet calming 3-tone chime (Focus mode activated)
      createNote(523.25, now, 0.8, 0.12);        // C5
      createNote(659.25, now + 0.25, 0.9, 0.14); // E5
      createNote(783.99, now + 0.55, 1.4, 0.15); // G5
    } else if (modeKey === "gentleFocus") {
      // Soft gentle 2-tone harmonic (Gentle Pacing)
      createNote(440.0, now, 0.9, 0.1);          // A4
      createNote(554.37, now + 0.3, 1.5, 0.12);  // C#5
    } else if (modeKey === "shortBreak") {
      // Gentle descending relaxation chime (Break time)
      createNote(783.99, now, 0.7, 0.12);        // G5
      createNote(659.25, now + 0.25, 0.8, 0.13); // E5
      createNote(523.25, now + 0.55, 1.4, 0.14); // C5
    } else {
      // Long Break / Sensory Reset: Deep resonant calming bell
      createNote(392.0, now, 1.8, 0.14);         // G4
      createNote(587.33, now + 0.35, 1.9, 0.12); // D5
    }
  } catch {
    // Audio context may require prior user interaction
  }
}

// Initial state
function getInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Recalculate remaining time if timer was running
      if (parsed.isRunning && parsed.endTime) {
        const remaining = Math.max(0, Math.round((parsed.endTime - Date.now()) / 1000));
        return {
          ...parsed,
          timeLeft: remaining,
          isRunning: remaining > 0,
          hasStarted: remaining > 0,
        };
      }
      return {
        ...parsed,
        isRunning: false,
        hasStarted: false,
      };
    }
  } catch {
    // fallback
  }

  return {
    taskTitle: "Supplier PO Reconciliation",
    taskDuration: 45,
    modeKey: "focus",
    timeLeft: 25 * 60,
    totalDuration: 25 * 60,
    isRunning: false,
    hasStarted: false,
    endTime: null,
    completedSessions: 0,
    soundEnabled: true,
    activeScheduleStep: 0,
  };
}

let state = getInitialState();

export function getPomodoroState() {
  // Always verify live time left if running to prevent background tab drift
  if (state.isRunning && state.endTime) {
    const liveRemaining = Math.max(0, Math.round((state.endTime - Date.now()) / 1000));
    if (liveRemaining !== state.timeLeft) {
      state.timeLeft = liveRemaining;
      if (liveRemaining <= 0) {
        state.isRunning = false;
        state.endTime = null;
      }
    }
  }
  return { ...state };
}

function persistAndBroadcast() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent("pomodoro_state_change", { detail: state }));
}

export function startPomodoro(taskTitle, taskDuration) {
  // Started for another task from outside My Work: no longer tied to a task card.
  if (taskTitle && taskTitle !== state.taskTitle) state.taskId = null;
  if (taskTitle) state.taskTitle = taskTitle;
  if (taskDuration) state.taskDuration = parseTaskDurationMinutes(taskDuration);

  const durationSec = POMODORO_MODES[state.modeKey]?.defaultMinutes * 60 || 25 * 60;
  if (!state.timeLeft || state.timeLeft <= 0) {
    state.timeLeft = durationSec;
    state.totalDuration = durationSec;
  }

  state.hasStarted = true;
  state.isRunning = true;
  state.endTime = Date.now() + state.timeLeft * 1000;
  persistAndBroadcast();
}

export function pausePomodoro() {
  if (state.isRunning && state.endTime) {
    state.timeLeft = Math.max(0, Math.round((state.endTime - Date.now()) / 1000));
  }
  state.isRunning = false;
  state.endTime = null;
  persistAndBroadcast();
}

export function switchPomodoroMode(modeKey, customMinutes = null, playSound = true, stepIndex = null) {
  const mode = POMODORO_MODES[modeKey] || POMODORO_MODES.focus;
  const minutes = customMinutes || mode.defaultMinutes;
  const seconds = minutes * 60;

  state.modeKey = modeKey;
  state.timeLeft = seconds;
  state.totalDuration = seconds;
  if (stepIndex !== null) {
    state.activeScheduleStep = stepIndex;
  }

  if (state.isRunning) {
    state.endTime = Date.now() + seconds * 1000;
  } else {
    state.endTime = null;
  }

  if (playSound && state.soundEnabled) {
    playModeSwitchChime(modeKey);
  }

  persistAndBroadcast();
}

export function resetPomodoro() {
  const mode = POMODORO_MODES[state.modeKey] || POMODORO_MODES.focus;
  const seconds = mode.defaultMinutes * 60;
  state.hasStarted = false;
  state.isRunning = false;
  state.endTime = null;
  state.timeLeft = seconds;
  state.totalDuration = seconds;
  persistAndBroadcast();
}

// Starts (or resumes) a focus block for one task. A different task starts fresh
// from the first block of its AI pacing schedule.
export function startFocusBlock(taskId, taskTitle, taskDuration) {
  if (state.taskId !== taskId || !state.hasStarted) {
    const minutes = parseTaskDurationMinutes(taskDuration);
    const [first] = generateAIPomodoroSchedule(minutes);
    state.taskId = taskId;
    state.taskTitle = taskTitle;
    state.taskDuration = minutes;
    state.modeKey = first.modeKey;
    state.activeScheduleStep = 0;
    state.timeLeft = first.minutes * 60;
    state.totalDuration = first.minutes * 60;
  }
  startPomodoro();
}

// Stops the timer and hides the floating widget. With a taskId, only if that task is the one running.
export function endPomodoro(taskId) {
  if (taskId && state.taskId !== taskId) return;
  const seconds = POMODORO_MODES.focus.defaultMinutes * 60;
  state.taskId = null;
  state.modeKey = "focus";
  state.activeScheduleStep = 0;
  state.hasStarted = false;
  state.isRunning = false;
  state.endTime = null;
  state.timeLeft = seconds;
  state.totalDuration = seconds;
  persistAndBroadcast();
}

export function advanceToNextStep(playSound = true) {
  const schedule = generateAIPomodoroSchedule(state.taskDuration);
  const nextStepIdx = (state.activeScheduleStep + 1) % schedule.length;
  const nextStep = schedule[nextStepIdx];

  state.activeScheduleStep = nextStepIdx;
  if (nextStep.type === "work") {
    state.completedSessions += 1;
  }

  switchPomodoroMode(nextStep.modeKey, nextStep.minutes, playSound);
}

export function setPomodoroSound(enabled) {
  state.soundEnabled = enabled;
  persistAndBroadcast();
}
