import { DEMO_TODAY } from "@/data/work-day.js";

/** A blank composer draft (Private by default). */
export const newDraft = (mode = "write") => ({
  mode, title: "", text: "", date: DEMO_TODAY, shared: false, clip: 0, v: null, emotion: null, emotionKept: false,
});

/** A draft pre-filled from an existing entry, for Edit. */
export const draftFromEntry = (entry) => ({
  ...newDraft("write"),
  title: entry.title,
  text: entry.text,
  date: entry.date,
  shared: !!entry.shared,
  v: entry.v ?? null,
});
