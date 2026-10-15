// Maya's support profile (design: "My Profile.dc.html", User Flow 9 Oct 2026).
// Field `vis`: "always" (HR, always shared) · "shared" · "private".
// Everything the employee adds starts Private.

const text = (id, label, value, vis, extra = {}) => ({ id, label, type: "text", value, vis, ...extra });
const chips = (id, label, options, value, vis) => ({ id, label, type: "chips", options, value, vis });

export const PROFILE_SECTIONS = [
  {
    k: "about", title: "About me", desc: "Basic details from HR. Some of these are always shared.",
    fields: [
      text("name", "Name", "Maya Lin", "always"),
      text("role", "Role and team", "Content designer · Product team", "always"),
      text("hours", "Working hours", "9:00 – 16:00, flexible start", "shared"),
      text("loc", "Where I work", "London, hybrid", "private"),
    ],
  },
  {
    k: "comm", title: "Communication preferences", desc: "How you like to receive and send information.",
    fields: [
      chips("channel", "Preferred channel", ["Written messages", "Video call", "Phone", "In person"], ["Written messages"], "shared"),
      text("instr", "How to give me instructions", "In writing, one task per message. Give the deadline as a date.", "shared"),
      text("reply", "Reply time", "I may need until the end of the day to reply.", "private"),
    ],
  },
  {
    k: "sensory", title: "Sensory preferences", desc: "Sound, light and space.",
    fields: [
      chips("sound", "Sound", ["Quiet space", "Noise-cancelling headphones", "Background music"], ["Quiet space", "Noise-cancelling headphones"], "shared"),
      text("light", "Light", "Softer lighting, away from windows.", "private"),
      text("overload", "What overloads me", "Open-plan noise after lunch and strong smells.", "private"),
    ],
  },
  {
    k: "env", title: "Work environment", desc: "Where and how you work best.",
    fields: [text("remote", "Remote days", "Fridays", "shared"), text("desk", "Desk and space", "", "private")],
  },
  {
    k: "focus", title: "Focus and energy", desc: "My Work uses this to size steps and breaks.",
    fields: [
      text("best", "Best focus time", "Mornings, 9:00 – 12:00", "shared"),
      text("breaks", "Breaks", "A short break every 45 minutes.", "private"),
      chips("steps", "How I like tasks", ["One item, no steps", "A few big steps", "Small steps"], ["A few big steps"], "private"),
      text("helps", "What helps me focus", "Headphones on and notifications held.", "private"),
    ],
  },
  {
    k: "strengths", title: "Work strengths", desc: "In your own words, plus notes from people you work with.",
    fields: [
      text("own", "My strengths", "I notice small details and gaps. I write clear, plain instructions. I can stay with a hard problem for a long time.", "shared"),
    ],
  },
  {
    k: "meet", title: "Meetings and feedback", desc: "What makes meetings and feedback work for you.",
    fields: [
      text("agenda", "Before a meeting", "An agenda the day before.", "shared"),
      text("camera", "During a meeting", "Camera optional. I may take notes instead of speaking.", "shared"),
      text("feedback", "Feedback", "Direct and literal. In writing first, then a short chat if needed.", "shared"),
    ],
  },
  {
    k: "signs", title: "Early signs and what helps", desc: "So others know what to look for and what to do.",
    fields: [
      text("signs", "Early signs", "I go quiet in chat and reply in very short messages.", "shared"),
      text("helpsme", "What helps", "A written check-in, not a call.", "shared"),
      text("nothelp", "What does not help", "", "private"),
    ],
  },
  {
    k: "sensitive", title: "Sensitive details", desc: "Each item is shared on its own. You can turn sharing off at any time.",
    fields: [
      text("med", "Medication", "I take medication at 13:00 and may need a short break after.", "private", { sensitive: true }),
      text("triggers", "Specific triggers", "Sudden changes to the day's plan without notice.", "shared", { sensitive: true }),
      text("diag", "Diagnosis", "ADHD", "shared", { sensitive: true }),
    ],
  },
  {
    k: "adj", title: "Workplace adjustments", desc: "Adjustments that are agreed or in review.",
    fields: [
      text("agreed", "Agreed", "Written notes after stand-ups. Flexible start between 9:00 and 10:00.", "shared"),
      text("requested", "In review", "Quiet room on Tuesdays and Thursdays.", "shared"),
      text("more", "Anything else I would like to ask for", "", "private"),
    ],
  },
];

export const PROFILE_TABS = [
  { k: "about", label: "About", secs: ["about", "comm"] },
  { k: "work", label: "Work style", secs: ["focus", "env", "meet", "strengths"] },
  { k: "well", label: "Wellbeing", secs: ["sensory", "signs", "sensitive"] },
  { k: "adj", label: "Adjustments", secs: ["adj"] },
];

// Encouragement notes shown under Work strengths.
export const STRENGTH_NOTES = [
  { from: "Priya Shah", meta: "Manager · 2 Oct", text: "Your research synthesis made the client meeting easy to follow. You spotted two gaps nobody else had noticed." },
  { from: "Alex Chen", meta: "Coach · 18 Sep", text: "You explain complex things in plain words. The team now uses your onboarding checklist." },
];

// Self-insight from private reflections. Each adds to a field, as private.
export const PROFILE_SUGGESTIONS = [
  { id: "s1", add: "A short walk before deep work helps me focus.", sec: "focus", field: "helps" },
  { id: "s2", add: "Being asked if I am okay in front of the group.", sec: "signs", field: "nothelp" },
];

export const PROFILE_HISTORY = [
  { what: 'Shared "How to give me instructions"', sec: "Communication preferences", when: "2 Oct, 14:10" },
  { what: 'Added "Quiet room on Tuesdays and Thursdays"', sec: "Workplace adjustments", when: "2 Oct, 9:30" },
  { what: "Saved section", sec: "Sensitive details", when: "28 Sep, 16:05" },
];

// Demo switch for the "manager changed" flow: when true, shared sensitive
// items pause until the employee re-shares or keeps them private.
export const MANAGER_CHANGED = false;
export const CURRENT_MANAGER = MANAGER_CHANGED ? "Jordan Reyes" : "Priya Shah";
export const NOW_LABEL = "Today, 11:05";
