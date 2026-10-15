import { useEffect, useState } from "react";
import { seedReflections } from "@/data/reflections.js";

// Maya's reflections, shared by the Reflections page, the dashboard check-in
// ("Save as reflection") and the AI Assistant (notes saved as private
// reflections). In-memory only — a refresh restores the seed.
const EVENT = "reflections_change";

let entries = seedReflections;

function commit(next) {
  entries = next;
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useReflections() {
  const [snapshot, setSnapshot] = useState(entries);
  useEffect(() => {
    const update = () => setSnapshot(entries);
    window.addEventListener(EVENT, update);
    return () => window.removeEventListener(EVENT, update);
  }, []);
  return snapshot;
}

/** Add an entry at the top. Private by default. Returns its id (for Undo). */
export function addReflection(entry) {
  const id = `e${Date.now()}`;
  commit([{ id, thread: [], moods: [], ctx: [], shared: false, ...entry }, ...entries]);
  return id;
}

export function updateReflection(id, patch) {
  commit(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
}

export function removeReflection(id) {
  commit(entries.filter((e) => e.id !== id));
}

export function toggleReflectionShare(id) {
  commit(entries.map((e) => (e.id === id ? { ...e, shared: !e.shared } : e)));
}

/** Append a reply to a shared entry's thread (and mark it read). */
export function replyToReflection(id, reply) {
  commit(entries.map((e) => (e.id === id ? { ...e, unread: false, thread: [...e.thread, reply] } : e)));
}
