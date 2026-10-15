// Employee AI Assistant seed data (design: "AI Assistant.dc.html").
// Replies are mock logic (see components/employee/assistant/respond.js) —
// there is no model behind this demo.

// "Break down my task" for the current task — a few big steps, or smaller ones.
export const BIG_STEPS = [
  { t: "Draft the intro paragraph", d: "12 min" },
  { t: "Short break", d: "5 min", brk: true },
  { t: "Read it out loud and fix what sounds off", d: "8 min" },
  { t: "Send the draft to Priya", d: "3 min" },
];

export const SMALL_STEPS = [
  { t: "Write one sentence on what the report is for", d: "4 min" },
  { t: "List the three headline numbers in plain words", d: "4 min" },
  { t: "Join them into a rough paragraph", d: "4 min" },
  { t: "Short break", d: "5 min", brk: true },
  { t: "Read it out loud once", d: "4 min" },
  { t: "Fix the one thing that sounds off", d: "4 min" },
  { t: "Send the draft to Priya", d: "3 min" },
];

export const NOTIFY_MESSAGES = {
  prompt: "Maya would like a short check-in about workload today. Written is best.",
  urgent: "Maya has asked for urgent support. Please contact her today.",
};

export const WELLBEING_PATTERN = /(overwhelm|tired|exhausted|stress|anxious|worried|sad|upset|burn)/i;

let nextId = 1;
const msg = (role, text, card) => ({ id: `seed-${nextId++}`, role, text, card });
const stepsCard = (steps) => ({ kind: "steps", steps, status: "pending" });

export const seedChats = [
  {
    id: "c0", title: "Intro paragraph feels stuck", when: "Today",
    msgs: [
      msg("user", "I have 30 minutes before stand-up and the intro paragraph feels stuck."),
      msg("bot", "Here is your current task in a few big steps, sized to your profile.", stepsCard(BIG_STEPS)),
    ],
  },
  {
    id: "c1", title: "Friday deadlines", when: "Mon",
    msgs: [
      msg("user", "I have three deadlines on Friday. Which one should I do first?"),
      msg("bot", "Start with the client reply. It is the shortest and someone is waiting for it. Then the Q4 summary. The onboarding brief can move to Monday if you ask Priya."),
    ],
  },
  {
    id: "c2", title: "Questions for my 1:1", when: "29 Sep",
    msgs: [
      msg("user", "Help me prepare for my 1:1 with Priya."),
      msg("bot", "You could bring three things:\n1. What went well this week.\n2. One thing that is taking longer than planned.\n3. One question about next week's priorities."),
    ],
  },
];
