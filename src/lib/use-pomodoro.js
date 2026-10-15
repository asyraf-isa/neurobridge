import { useEffect, useState } from "react";
import { getPomodoroState } from "@/lib/pomodoro-store.js";

// Subscribes to the global Pomodoro store. `live` also re-reads it every second,
// for components that show the countdown.
export function usePomodoro(live = false) {
  const [state, setState] = useState(getPomodoroState);

  useEffect(() => {
    const update = () => setState(getPomodoroState());
    window.addEventListener("pomodoro_state_change", update);
    window.addEventListener("storage", update);
    const interval = live ? setInterval(update, 1000) : null;
    return () => {
      window.removeEventListener("pomodoro_state_change", update);
      window.removeEventListener("storage", update);
      clearInterval(interval);
    };
  }, [live]);

  return state;
}
