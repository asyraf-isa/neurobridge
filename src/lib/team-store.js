import { useEffect, useState } from "react";
import { ALERTS, seedEmployerChats, seedPeople } from "@/data/team.js";

// The employer's view of the team: people (shared profile, guide, support
// record), which alerts were marked seen, and past assistant chats. Shared by
// every employer page; in-memory only.
const EVENT = "team_change";

let state = { people: seedPeople, seen: Object.fromEntries(ALERTS.filter((a) => a.seen).map((a) => [a.id, true])), past: seedEmployerChats };

function commit(patch) {
  state = { ...state, ...patch };
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useTeam() {
  const [snapshot, setSnapshot] = useState(state);
  useEffect(() => {
    const update = () => setSnapshot(state);
    window.addEventListener(EVENT, update);
    return () => window.removeEventListener(EVENT, update);
  }, []);
  return snapshot;
}

export const getPerson = (id) => state.people.find((p) => p.id === id);

export function updatePerson(id, fn) {
  commit({ people: state.people.map((p) => (p.id === id ? fn(p) : p)) });
}

export function markAlertSeen(id) {
  commit({ seen: { ...state.seen, [id]: true } });
}

/** Add a support note to someone's record. A check-in note moves an open request to "Needs check-in". */
export function addRecordNote(pid, note, { checkIn = false } = {}) {
  updatePerson(pid, (p) => ({
    ...p,
    status: checkIn && p.status === "request" ? "checkin" : p.status,
    record: [{ id: `n${Date.now()}`, kind: "note", thread: [], ...note }, ...p.record],
  }));
}

export function replyInRecord(pid, recordId, message) {
  updatePerson(pid, (p) => ({
    ...p,
    record: p.record.map((r) => (r.id === recordId ? { ...r, thread: [...r.thread, message] } : r)),
  }));
}

export function addStrengthNote(pid, note) {
  updatePerson(pid, (p) => ({ ...p, strengthNotes: [...p.strengthNotes, note] }));
}

/** Archive a finished chat into "Past chats". */
export function archiveChat(chat) {
  if (!chat.msgs.length) return;
  commit({ past: [{ id: `h${Date.now()}`, ...chat }, ...state.past] });
}

export function removePastChat(id) {
  commit({ past: state.past.filter((c) => c.id !== id) });
}
