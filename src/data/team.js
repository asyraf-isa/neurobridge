// Priya's team (design: "Employer Portal.dc.html"). Only what each employee
// chose to share is here. Demo data — nothing persists.

export const MANAGER_NAME = "Priya Shah";
export const MANAGER_INITIALS = "PS";
export const INCLUSION_LEAD = "Sam Okafor";
export const EMPLOYER_DATE = "Wed 7 Oct";

const section = (title, fields) => ({
  title,
  fields: fields.map(([label, value, sensitive]) => ({ label, value, sensitive: !!sensitive })),
});
const levels = (mild, moderate, severe) => ({ mild, moderate, severe });

export const seedPeople = [
  {
    id: "maya", name: "Maya Lin", initials: "ML", tile: "indigo", role: "Content designer", team: "Product",
    status: "request", last: "Today, 9:12", lastMin: 110,
    tags: ["Written messages", "Quiet space", "Agenda before meetings"],
    urgency: "mild", alertWhen: "Today, 11:04", alertIcon: "support",
    alert: "Maya would like a short check-in about workload today. Written is best.",
    summary:
      "Maya works best with written instructions, one task per message, and dates for deadlines. She focuses best in the morning and needs a quiet space. Sudden changes to the plan are hard for her, so share changes in writing the day before.",
    profile: [
      section("About me", [["Name", "Maya Lin"], ["Role and team", "Content designer · Product team"], ["Working hours", "9:00 – 16:00, flexible start"]]),
      section("Communication preferences", [["Preferred channel", "Written messages"], ["How to give me instructions", "In writing, one task per message. Give the deadline as a date."]]),
      section("Sensory preferences", [["Sound", "Quiet space · Noise-cancelling headphones"]]),
      section("Work environment", [["Remote days", "Fridays"]]),
      section("Focus and energy", [["Best focus time", "Mornings, 9:00 – 12:00"]]),
      section("Work strengths", [["My strengths", "I notice small details and gaps. I write clear, plain instructions. I can stay with a hard problem for a long time."]]),
      section("Meetings and feedback", [["Before a meeting", "An agenda the day before."], ["During a meeting", "Camera optional. I may take notes instead of speaking."], ["Feedback", "Direct and literal. In writing first, then a short chat if needed."]]),
      section("Early signs and what helps", [["Early signs", "I go quiet in chat and reply in very short messages."], ["What helps", "A written check-in, not a call."]]),
      section("Sensitive details", [["Specific triggers", "Sudden changes to the day's plan without notice.", true], ["Diagnosis", "ADHD", true]]),
      section("Workplace adjustments", [["Agreed", "Written notes after stand-ups. Flexible start between 9:00 and 10:00."], ["In review", "Quiet room on Tuesdays and Thursdays."]]),
    ],
    guide: {
      signs: ["Goes quiet in chat and replies in very short messages.", "Finds sudden changes to the day's plan hard, especially without notice."],
      levels: levels("Send a short written check-in. Do not call.", "Offer to move one deadline. Agree the order of tasks in writing.", "Pause non-urgent requests and contact the Inclusion team (Sam Okafor) the same day."),
      dos: ["Give instructions in writing, one task per message.", "Give deadlines as dates.", "Send the agenda the day before a meeting.", "Give feedback directly, in writing first."],
      donts: ["Change the day's plan without notice.", "Call without warning.", "Expect the camera on in meetings.", "Use hints or sarcasm in feedback."],
      comms: "Start with a short written message that says why you are writing and what you need. Offer two times for a chat and let Maya choose, or keep it in writing.",
    },
    strengthNotes: [{ from: "Priya Shah", when: "2 Oct", text: "Your research synthesis made the client meeting easy to follow. You spotted two gaps nobody else had noticed." }],
    record: [
      { id: "m1", kind: "reflection", date: "6 Oct", sort: 6, sev: "medium", title: "Workload feels heavy this week", text: "Three deadlines on Friday. I am not sure which one to do first.", shared: true,
        thread: [{ from: "Priya Shah", initials: "PS", when: "6 Oct, 16:20", text: "Thanks for telling me. Let's agree the order in writing tomorrow morning." }] },
      { id: "m2", kind: "note", date: "2 Oct", sort: 2, sev: "low", title: "Stand-up moved without notice", text: "Stand-up moved to 9:00 at short notice. Maya found the change hard and missed the first part.", response: "Meeting changes are sent in writing the day before.", shared: true, thread: [] },
      { id: "m3", kind: "reflection", date: "29 Sep", sort: -1, sev: "low", title: "Written notes after stand-up helped", text: "Getting the notes in writing made the morning easy. I knew what to do first.", shared: true, thread: [] },
      { id: "m4", kind: "note", date: "25 Sep", sort: -5, sev: "low", title: "Quiet room request", text: "Maya asked about a quiet room on Tuesdays and Thursdays. Sent to Facilities.", response: "Follow up with Facilities by 9 Oct.", shared: false, thread: [] },
    ],
  },
  {
    id: "aisha", name: "Aisha Rahman", initials: "AR", tile: "teal", role: "Data analyst", team: "Product",
    status: "checkin", last: "Yesterday, 16:40", lastMin: 1100,
    tags: ["Written messages", "Fewer notifications"],
    urgency: "urgent", alertWhen: "Today, 10:20", alertIcon: "emergency_home",
    alert: "Aisha has asked for urgent support. Please contact her today, in writing first.",
    summary: "Aisha prefers written messages and batched notifications. She does her best focused work after lunch, so interruptions at that time have the most impact.",
    profile: [
      section("Communication preferences", [["Preferred channel", "Written messages"], ["Notifications", "Batch non-urgent messages. Check chat at 11:00 and 15:00."]]),
      section("Focus and energy", [["Best focus time", "Afternoons, 13:00 – 16:00"]]),
      section("Work strengths", [["My strengths", "Finding patterns in messy data. Explaining numbers simply."]]),
      section("Early signs and what helps", [["Early signs", "Works late to catch up."], ["What helps", "Protected focus time in the calendar."]]),
    ],
    guide: {
      signs: ["Works late to catch up after interruptions."],
      levels: levels("Ask in writing if focus time is being protected.", "Block 13:00 – 16:00 as focus time for the team.", "Contact the Inclusion team the same day."),
      dos: ["Batch non-urgent requests.", "Put requests in writing."],
      donts: ["Send chat pings during focus time.", "Ask for same-hour replies to non-urgent messages."],
      comms: "Reply to the reflection in writing. Suggest one concrete change, for example blocking 13:00 – 16:00 as focus time.",
    },
    strengthNotes: [],
    record: [{ id: "a1", kind: "reflection", date: "Yesterday", sort: 5, sev: "medium", title: "Afternoon interruptions", text: "Lots of pings after lunch made it hard to finish the dashboard.", shared: true, thread: [] }],
  },
  {
    id: "daniel", name: "Daniel Brooks", initials: "DB", tile: "slate", role: "Front-end developer", team: "Product",
    status: "stable", last: "Today, 8:55", lastMin: 130,
    tags: ["Video call", "Pairing"],
    summary: "Daniel likes short video calls and pairing for complex work. He prefers a clear plan for the week on Monday morning.",
    profile: [
      section("Communication preferences", [["Preferred channel", "Video call"], ["How to give me instructions", "A short call, then a written summary."]]),
      section("Meetings and feedback", [["Feedback", "In a 1:1, with examples."]]),
      section("Workplace adjustments", [["Agreed", "Weekly plan shared on Monday at 9:30."]]),
    ],
    guide: {
      signs: ["Asks the same question several times."],
      levels: levels("Offer a short pairing session.", "Write the week's priorities down together.", "Contact the Inclusion team the same day."),
      dos: ["Share the week's plan on Monday.", "Follow a call with a written summary."],
      donts: ["Change priorities mid-week without a summary."],
      comms: "Offer a 15-minute call and send a short written summary after.",
    },
    strengthNotes: [],
    record: [{ id: "d1", kind: "note", date: "30 Sep", sort: 0, sev: "low", title: "Weekly plan agreed", text: "Agreed to share the week's plan every Monday.", response: "Plan sent on Mondays at 9:30.", shared: true, thread: [] }],
  },
  {
    id: "leo", name: "Leo Martins", initials: "LM", tile: "indigo", role: "QA engineer", team: "Product",
    status: "stable", last: "2 days ago", lastMin: 2900,
    tags: ["In person", "Short meetings"],
    summary: "Leo prefers to talk in person and keep meetings short. He has shared a few sections so far.",
    profile: [
      section("Communication preferences", [["Preferred channel", "In person"], ["Meetings", "Under 30 minutes, with a clear end time."]]),
      section("Work strengths", [["My strengths", "Careful testing. Finding edge cases early."]]),
    ],
    guide: {
      signs: ["Skips optional meetings."],
      levels: levels("Check in briefly in person.", "Shorten or cancel optional meetings for the week.", "Contact the Inclusion team the same day."),
      dos: ["Keep meetings short with a clear end time."],
      donts: ["Let meetings run over."],
      comms: "Ask in person, briefly, and say how long it will take.",
    },
    strengthNotes: [],
    record: [{ id: "l1", kind: "reflection", date: "5 Oct", sort: 4, sev: "low", title: "Pairing sessions are working well", text: "The pairing sessions with Daniel help me test earlier.", shared: true, thread: [] }],
  },
  {
    id: "hana", name: "Hana Sato", initials: "HS", tile: "teal", role: "Product designer", team: "Product",
    status: "stable", last: "Today, 10:02", lastMin: 60,
    tags: ["Written messages", "Remote Mondays"],
    summary: "Hana prefers written messages and works remotely on Mondays. She likes feedback with clear next steps.",
    profile: [
      section("Communication preferences", [["Preferred channel", "Written messages"]]),
      section("Work environment", [["Remote days", "Mondays"]]),
      section("Meetings and feedback", [["Feedback", "Written, with clear next steps."]]),
    ],
    guide: {
      signs: ["Delays sharing work in progress."],
      levels: levels("Ask in writing what would help.", "Agree a smaller first review.", "Contact the Inclusion team the same day."),
      dos: ["Give written feedback with next steps."],
      donts: ["Give feedback in front of the group first."],
      comms: "Write first. Offer a short call if Hana would like one.",
    },
    strengthNotes: [],
    record: [{ id: "h1", kind: "note", date: "4 Oct", sort: 3, sev: "low", title: "Shared two more profile sections", text: "Hana shared Work environment and Meetings and feedback.", shared: true, thread: [] }],
  },
];

export const ALERTS = [
  { id: "al1", pid: "aisha", urgency: "urgent", date: "Wed 7 Oct 2026", rel: "Today", time: "10:20", sort: 10, text: "Aisha needs support now." },
  { id: "al2", pid: "maya", urgency: "mild", date: "Wed 7 Oct 2026", rel: "Today", time: "11:04", sort: 11, text: "Maya would like a check-in today." },
  { id: "al3", pid: "daniel", urgency: "mild", date: "Tue 6 Oct 2026", rel: "Yesterday", time: "15:30", sort: 6, text: "Daniel asked for a short check-in about the release plan." },
  { id: "al6", pid: "hana", urgency: "urgent", date: "Mon 28 Sep 2026", rel: "", time: "9:15", sort: -2, text: "Hana needed support right away. Resolved the same day.", seen: true },
];

export const ACTIVITY = [
  { pid: "aisha", icon: "auto_stories", tone: "indigo", tab: "support-log", text: 'Aisha shared a reflection: "Afternoon interruptions"', when: "Yesterday" },
  { pid: "maya", icon: "auto_stories", tone: "indigo", tab: "support-log", text: 'Maya shared a reflection: "Workload feels heavy this week"', when: "6 Oct" },
  { pid: "leo", icon: "auto_stories", tone: "indigo", tab: "support-log", text: 'Leo shared a reflection: "Pairing sessions are working well"', when: "5 Oct" },
  { pid: "hana", icon: "person_add", tone: "teal", tab: "", text: "Hana shared two more profile sections", when: "4 Oct" },
  { pid: "maya", icon: "note_alt", tone: "slate", tab: "support-log", text: 'You added a support note for Maya: "Stand-up moved without notice"', when: "2 Oct" },
];

let seedMsg = 1;
const m = (role, text) => ({ id: `ps-${seedMsg++}`, role, text });

export const seedEmployerChats = [
  { id: "h1", pid: "maya", title: "Preparing Thursday 1:1 with Maya", when: "Mon", msgs: [
    m("user", "Help me prepare for my 1:1 with Maya on Thursday."),
    m("bot", "Send the agenda in writing on Wednesday. Keep it to three points:\n- What went well this week\n- One thing taking longer than planned\n- Priorities for next week\nCamera is optional for Maya. Let her take notes instead of speaking if she prefers."),
  ] },
  { id: "h2", pid: "general", title: "Writing clearer meeting agendas", when: "2 Oct", msgs: [
    m("user", "How can I make meeting agendas clearer for the whole team?"),
    m("bot", "Send the agenda the day before. For each item, write the topic, the decision needed and who leads it. Add the end time. Keep it to one screen."),
  ] },
  { id: "h3", pid: "aisha", title: "Protecting focus time for Aisha", when: "29 Sep", msgs: [
    m("user", "How do I reduce interruptions for Aisha in the afternoon?"),
    m("bot", "Block 13:00 to 16:00 as focus time in the team calendar. Batch non-urgent requests and send them at 11:00 or 15:00, in writing."),
  ] },
];
