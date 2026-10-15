import { useRef } from "react";
import { moodRing } from "@/lib/mood.js";

/**
 * Mood slider (DESIGN.md → Quick check-in → Scale): 28px light track, a 10px
 * fill that tints indigo → slate → teal, and a frosted-glass 64×44 thumb.
 * Pointer drag or arrow keys (±5); Home / End jump to the ends.
 */
function MoodSlider({ value, onChange, label = "Mood", valueText }) {
  const dragging = useRef(false);

  const setFromPointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onChange(Math.round(Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))));
  };

  const handleKeyDown = (event) => {
    const step = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5 }[event.key];
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      onChange(event.key === "Home" ? 0 : 100);
      return;
    }
    if (!step) return;
    event.preventDefault();
    onChange(Math.max(0, Math.min(100, value + step)));
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={valueText}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          dragging.current = true;
          setFromPointer(event);
        }}
        onPointerMove={(event) => {
          if (dragging.current) setFromPointer(event);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onKeyDown={handleKeyDown}
        className="relative h-12 cursor-pointer touch-none rounded-full outline-none focus-visible:ring-4 focus-visible:ring-tint-indigo"
      >
        <div className="absolute inset-x-0 top-2.5 h-7 rounded-full bg-track" />
        <div
          className="absolute top-[1.1875rem] left-2 h-2.5 rounded-full transition-[background] duration-200"
          style={{ width: `calc(${value}% - 8px)`, background: moodRing(value) }}
        />
        <div
          className="absolute top-0.5 -ml-8 h-11 w-16 rounded-full border border-on-primary/90 bg-on-primary/45 shadow-thumb backdrop-blur-[3px] backdrop-saturate-140"
          style={{ left: `${value}%` }}
        />
      </div>
      <div className="flex justify-between gap-3 text-body-sm font-medium tracking-[0.06em] text-slate">
        <span>VERY UNPLEASANT</span>
        <span>VERY PLEASANT</span>
      </div>
    </div>
  );
}

export default MoodSlider;
