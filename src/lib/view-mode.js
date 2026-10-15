import { useEffect, useState } from "react";

// Global "View" preference (Standard / Calm) and Quiet Shield.
// DESIGN.md: the avatar menu on every page switches the view; Quiet Shield on
// the dashboard holds notifications and forces Calm. Same pattern as
// pomodoro-store.js — module state mirrored to localStorage and broadcast on a
// window event so every subscriber (and other tabs) stays in sync.
const STORAGE_KEY = "neurobridge_view_mode";
const EVENT = "view_mode_change";

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { view: parsed.view === "calm" ? "calm" : "standard", quiet: !!parsed.quiet };
    }
  } catch {
    // fall through to defaults
  }
  return { view: "standard", quiet: false };
}

let state = read();

function write(patch) {
  state = { ...state, ...patch };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable — state still lives for this tab
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function setView(view) {
  write({ view: view === "calm" ? "calm" : "standard" });
}

export function setQuietShield(quiet) {
  write({ quiet: !!quiet });
}

/** `{ view, quiet, calm }` — `calm` is true when Calm is chosen or Quiet Shield is on. */
export function useViewMode() {
  const [snapshot, setSnapshot] = useState(state);

  useEffect(() => {
    const update = () => setSnapshot(state);
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        state = read();
        update();
      }
    };
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return { ...snapshot, calm: snapshot.view === "calm" || snapshot.quiet };
}
