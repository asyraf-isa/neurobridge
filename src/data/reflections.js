// Seed reflections for Maya (design: "Reflections.dc.html").
// `source`: checkin · entry · voice · assistant. `v` is the 0–100 mood value
// (see lib/mood.js). Shared entries carry a reply thread with Priya.
import { DEMO_TODAY } from "@/data/work-day.js";

export const MANAGER = { name: "Priya Shah", first: "Priya", initials: "PS" };
export const SELF = { name: "You", initials: "ML" };

export const SOURCE_LABELS = {
  checkin: "Check-in",
  entry: "Entry",
  voice: "Voice",
  assistant: "From AI Assistant",
};

// What the demo "transcribes" when you record a voice reflection.
export const VOICE_TRANSCRIPT =
  "Stand-up ran long and I lost the thread of what I was doing before it. Took a minute to get back in.";
export const VOICE_TONE_NOTE = "You sounded a little tired but steady. You spoke more slowly than on Monday.";

export const seedReflections = [
  {
    id: "e1", date: DEMO_TODAY, time: "11:02", source: "assistant",
    title: "Reading it out loud helped",
    text: "The intro paragraph took longer than planned. Reading it out loud helped me spot what was missing.",
    ctx: ["Q4 report"], moods: ["Focused"], thread: [],
  },
  {
    id: "e2", date: DEMO_TODAY, time: "9:12", source: "checkin", v: 50,
    title: "Morning check-in", text: "Slept okay. A bit foggy, coffee is helping.",
    moods: ["Tired"], ctx: [], thread: [],
  },
  {
    id: "e3", date: "2026-10-06", time: "16:40", source: "voice", v: 32,
    title: "Busy afternoon",
    text: "Lots of pings after lunch. I turned on Quiet Shield for an hour and that helped.",
    voice: "00:18", emotion: "You sounded tired and a little tense. You spoke faster than usual.",
    moods: ["Overwhelmed"], ctx: ["Workload"], thread: [],
  },
  {
    id: "e4", date: "2026-10-06", time: "9:05", source: "checkin", v: 74,
    title: "Good start", text: "Written notes after stand-up made the morning easy.",
    moods: ["Calm"], ctx: ["Stand-up"], shared: true, unread: true,
    thread: [{ who: "Priya Shah", initials: "PS", time: "Tue 10:20", text: "Glad the notes help. I will keep sending them after every stand-up." }],
  },
  {
    id: "e5", date: "2026-10-05", time: "17:10", source: "checkin", v: 22,
    title: "Heavy week", text: "Workload feels heavy this week. Three deadlines on Friday.",
    moods: ["Anxious"], ctx: ["Workload"], shared: true,
    thread: [
      { who: "Priya Shah", initials: "PS", time: "Tue 8:40", text: "Thanks for telling me. Can we look at the Friday deadlines together on Thursday at 9:30?" },
      { who: "You", initials: "ML", time: "Tue 8:55", text: "Yes, that works." },
    ],
  },
  {
    id: "e6", date: "2026-10-02", time: "15:30", source: "entry", v: 92,
    title: "Research synthesis done",
    text: "Finished the research synthesis. Long focus block with headphones on.",
    moods: ["Proud"], ctx: [], thread: [],
  },
];
