// Seed data for the employee's work day (design: "My Work v3.dc.html").
// Times are minutes after midnight (540 = 9:00). Demo only — nothing persists.
//
// Colours are task-palette roles (see index.css → "Task palette"):
// lilac · peach · mint · sky · butter. Calm view re-tints all of them.

/** The demo's fixed "now": Wednesday 7 October 2026, 11:02. */
export const DEMO_TODAY = "2026-10-07";
export const DEMO_NOW = 662;
export const DEMO_DATE_LONG = "Wednesday, 7 October";
export const DEMO_DATE_SHORT = "Wed 7 Oct";

/** Working day bounds used by the week grid and the scheduler. */
export const DAY_START = 540;
export const DAY_END = 1020;

const steps = (titles) => titles.map((t, id) => ({ id, t, done: false }));

export const seedTasks = [
  { id: "t1", icon: "mail", title: "Inbox and messages", start: 540, dur: 30, color: "sky", done: true },
  { id: "t2", icon: "bar_chart", title: "Q4 report: gather the numbers", start: 570, dur: 60, color: "lilac", done: true },
  { id: "b1", kind: "break", title: "Break", start: 630, dur: 15 },
  {
    id: "t3",
    icon: "edit_note",
    title: "Q4 report: draft the summary",
    start: 645,
    dur: 45,
    color: "lilac",
    steps: [
      { id: 0, t: "Open last quarter's summary", done: true, dur: 5 },
      { id: 1, t: "Write three headline numbers", done: true, dur: 10 },
      { id: 2, t: "Draft the intro paragraph", done: false, dur: 20 },
      { id: 3, t: "Read it once out loud", done: false, dur: 10 },
    ],
  },
  { id: "t4", icon: "groups", title: "Team stand-up", start: 690, dur: 30, color: "peach", note: "Camera optional" },
  { id: "b2", icon: "restaurant", kind: "break", title: "Lunch", start: 720, dur: 60 },
  {
    id: "t5",
    icon: "rate_review",
    title: "Review the onboarding brief",
    start: 780,
    dur: 60,
    color: "mint",
    steps: steps(["Skim the brief once", "Note three questions", "Leave comments in the doc"]),
  },
  { id: "b3", kind: "break", title: "Break", start: 840, dur: 15 },
  {
    id: "t6",
    icon: "chat",
    title: "Reply to client feedback",
    start: 855,
    dur: 45,
    color: "butter",
    steps: steps(["Read their notes", "Group them into yes / later / no", "Write the reply"]),
  },
  { id: "t7", icon: "event_note", title: "Plan tomorrow", start: 900, dur: 30, color: "sky" },
];

export const seedWeek = {
  mon: [
    { id: "m1", title: "Weekly planning", start: 540, dur: 45, color: "sky", done: true },
    { id: "m2", title: "Q4 kickoff", start: 600, dur: 60, color: "lilac", done: true },
    { id: "m3", title: "Design review", start: 780, dur: 60, color: "mint", done: true },
    { id: "m4", title: "Admin", start: 900, dur: 30, color: "butter", done: true },
  ],
  tue: [
    { id: "u1", title: "Inbox", start: 540, dur: 30, color: "sky", done: true },
    { id: "u2", title: "Client call", start: 630, dur: 45, color: "peach", done: true },
    { id: "u3", title: "Research notes", start: 780, dur: 90, color: "mint", done: true },
  ],
  thu: [
    { id: "h1", icon: "person", title: "1:1 with Priya", start: 570, dur: 30, color: "peach" },
    { id: "h2", icon: "design_services", title: "Onboarding flow edits", start: 630, dur: 90, color: "mint" },
    { id: "h3", icon: "restaurant", title: "Team lunch", start: 720, dur: 60, color: "butter" },
  ],
  fri: [
    { id: "f1", title: "Focus morning", start: 540, dur: 120, color: "lilac" },
    { id: "f2", title: "Retro", start: 840, dur: 45, color: "peach" },
  ],
};

export const WEEK_DAYS = [
  { key: "mon", name: "Mon", date: "5" },
  { key: "tue", name: "Tue", date: "6" },
  { key: "wed", name: "Wed", date: "7", today: true },
  { key: "thu", name: "Thu", date: "8" },
  { key: "fri", name: "Fri", date: "9" },
];

export const seedNextWeek = [{ id: "n1", icon: "folder_open", title: "Tidy the shared drive", dur: 60, color: "sky" }];

// Step plans the New task assistant offers. "b" marks a 10-minute break.
export const PLANS = {
  q4: {
    normal: [
      ["Collect last quarter's figures", 25], ["Outline the four sections", 20], "b",
      ["Draft the summary", 30], ["Draft results and risks", 30], "b",
      ["Add two charts", 25], ["Read it through and fix", 20], ["Send to Priya for review", 10],
    ],
    small: [
      ["Find last quarter's report", 10], ["Copy the key figures", 15], ["List the section headings", 10], "b",
      ["Write the summary opening", 15], ["Finish the summary", 15], ["Draft results", 15], "b",
      ["Draft risks", 15], ["Make chart one", 15], ["Make chart two", 10], "b",
      ["Read it through", 15], ["Fix what jumps out", 10], ["Send to Priya", 5],
    ],
  },
  generic: {
    normal: [
      ["Gather what you need", 20], ["Make a rough outline", 20], "b",
      ["Do the first half", 30], ["Do the second half", 30], "b",
      ["Check it over", 15], ["Share or submit", 10],
    ],
    small: [
      ["Open everything you need", 10], ["Write three bullet points", 10], ["Turn bullets into an outline", 15], "b",
      ["Start the first part", 15], ["Finish the first part", 15], "b",
      ["Start the second part", 15], ["Finish the second part", 15], "b",
      ["Check it over", 10], ["Share or submit", 5],
    ],
  },
};

export const EXAMPLE_TASK = "Draft the Q4 report by Friday, about 3 hours, urgent";
