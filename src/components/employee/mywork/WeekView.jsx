import { useState } from "react";
import { DAY_END, DAY_START, DEMO_NOW, WEEK_DAYS } from "@/data/work-day.js";
import { cn } from "@/lib/utils";
import BlockEditor from "./BlockEditor.jsx";
import { toneOf } from "./task-tones.js";

// 1.6px per minute → a 9:00–17:00 day is 768px (one hour = 96px).
const PX_PER_MIN = 1.6;
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];

/**
 * Week (DESIGN.md → My Work → Views): Mon–Fri columns of time blocks; today
 * is highlighted and carries the "now" line. Picking a block opens the editor
 * on the right (start ±15 min, length ±15 min, done, delete).
 */
function WeekView({ day }) {
  const [selected, setSelected] = useState(null); // { day, id }

  const blocksFor = (key) => (key === "wed" ? day.tasks.filter((t) => t.kind !== "break") : day.week[key]);
  const selectedBlock = selected
    ? (selected.day === "wed" ? day.tasks : day.week[selected.day]).find((b) => b.id === selected.id)
    : null;

  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="min-w-0 flex-[1_1_40rem] overflow-x-auto rounded-[1.75rem] border border-divider bg-surface-container-lowest px-5 pt-5 pb-6">
        <div className="grid min-w-[50rem] grid-cols-[3.25rem_repeat(5,minmax(8.75rem,1fr))] gap-x-2.5 gap-y-3.5">
          <div />
          {WEEK_DAYS.map((d) => (
            <div
              key={d.key}
              className={cn("flex items-baseline gap-1.5 rounded-2xl px-3.5 py-3", d.today && "bg-tint-indigo")}
            >
              <span className="text-title-md">{d.name}</span>
              <span className="text-[1.1875rem] font-semibold text-slate">{d.date}</span>
            </div>
          ))}

          <div className="relative h-[48rem]" aria-hidden="true">
            {HOURS.map((hour, i) => (
              <span
                key={hour}
                className="absolute right-0 -translate-y-1/2 text-body-sm font-bold text-slate-soft tabular-nums"
                style={{ top: i * 96 }}
              >
                {hour}:00
              </span>
            ))}
          </div>

          {WEEK_DAYS.map((d) => (
            <div
              key={d.key}
              className="relative h-[48rem] rounded-2xl bg-surface-container-lowest bg-[repeating-linear-gradient(to_bottom,var(--color-divider)_0,var(--color-divider)_1px,transparent_1px,transparent_6rem)]"
            >
              {blocksFor(d.key)
                .filter((b) => b.start >= DAY_START && b.start < DAY_END)
                .map((b) => {
                  const isSelected = selected?.day === d.key && selected.id === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelected({ day: d.key, id: b.id })}
                      aria-pressed={isSelected}
                      className={cn(
                        "absolute right-1 left-1 cursor-pointer overflow-hidden rounded-lg px-2.5 py-[0.4375rem] text-left text-body-md leading-[1.3] font-bold",
                        toneOf(b.color).fill,
                        b.done && "line-through opacity-50",
                        isSelected && "ring-2 ring-ink",
                      )}
                      style={{
                        top: (b.start - DAY_START) * PX_PER_MIN + 1,
                        height: Math.max(26, Math.min(b.dur, DAY_END - b.start) * PX_PER_MIN - 3),
                      }}
                    >
                      {b.title}
                    </button>
                  );
                })}
              {d.today ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 -left-1 h-0.5 bg-ink"
                  style={{ top: (DEMO_NOW - DAY_START) * PX_PER_MIN }}
                >
                  <span className="absolute -top-1 left-0 size-2.5 rounded-full bg-ink" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <BlockEditor
        dayKey={selected?.day}
        block={selectedBlock}
        onRemoved={() => setSelected(null)}
      />
    </div>
  );
}

export default WeekView;
