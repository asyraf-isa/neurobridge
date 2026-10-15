import { useState } from "react";
import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/time-format.js";
import { cn } from "@/lib/utils";
import { toneOf } from "./task-tones.js";

const COLUMNS = [
  { label: "Today", icon: "wb_sunny", capacity: 180 },
  { label: "Tomorrow", icon: "wb_twilight", capacity: 240 },
  { label: "Next week", icon: "date_range", capacity: 480 },
];

/**
 * "Can wait": drag (or use the arrows on) open work between Today, Tomorrow and
 * Next week. Each column shows its load against a soft capacity; over it, the
 * bar turns indigo. "Done planning" applies the board to the timeline.
 */
function CanWaitView({ items, onMove, onDone }) {
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-body-lg font-bold text-slate">
          <Icon name="drag_pan" className="text-[24px] text-slate-soft" />
          Drag to move
        </span>
        <Button size="lg" onClick={onDone} className="h-[2.875rem] pr-[1.375rem] pl-4">
          <Icon name="check" className="text-[24px]" />
          Done planning
        </Button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] items-start gap-5">
        {COLUMNS.map((column, ci) => {
          const list = items.filter((w) => w.col === ci);
          const load = list.reduce((sum, w) => sum + w.dur, 0);
          const over = load > column.capacity;

          return (
            <section
              key={column.label}
              aria-label={column.label}
              onDragOver={(event) => {
                event.preventDefault();
                if (dragOver !== ci) setDragOver(ci);
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (dragId) onMove(dragId, ci);
                setDragId(null);
                setDragOver(null);
              }}
              className={cn(
                "flex min-h-90 flex-col gap-2.5 rounded-[1.75rem] border-2 bg-surface-container-lowest p-[1.125rem] transition-colors",
                dragOver === ci ? "border-secondary" : "border-divider",
              )}
            >
              <div className="flex flex-col gap-3 px-0.5 pt-0.5 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-10 place-items-center rounded-[0.8125rem] bg-fill">
                    <Icon name={column.icon} fill className="text-[22px] text-slate" />
                  </span>
                  <span className="text-[1.25rem] font-extrabold">{column.label}</span>
                  <span className={cn("ml-auto flex items-center gap-1 text-body-md font-extrabold", over ? "text-primary" : "text-ink-soft")}>
                    <Icon name="schedule" className="text-[18px]" />
                    {formatDuration(load)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-divider">
                  <div
                    className={cn("h-full rounded-full transition-[width] duration-300", over ? "bg-primary" : "bg-secondary")}
                    style={{ width: `${Math.min(100, (load / column.capacity) * 100)}%` }}
                  />
                </div>
              </div>

              {list.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "move";
                    setDragId(item.id);
                  }}
                  onDragEnd={() => {
                    setDragId(null);
                    setDragOver(null);
                  }}
                  className={cn("flex cursor-grab items-center gap-2.5 rounded-panel p-2.5", toneOf(item.color).fill)}
                >
                  <span className="grid size-[2.375rem] shrink-0 place-items-center rounded-lg bg-on-primary/75">
                    <Icon name={item.icon || "task_alt"} fill className="text-[20px]" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-px">
                    <span className="text-body-lg leading-[1.3] font-bold">{item.title}</span>
                    <span className="text-body-sm font-bold text-slate">{formatDuration(item.dur)}</span>
                  </div>
                  {ci > 0 ? (
                    <button
                      type="button"
                      onClick={() => onMove(item.id, ci - 1)}
                      aria-label={`Move ${item.title} earlier`}
                      className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-on-primary/75 hover:bg-on-primary"
                    >
                      <Icon name="chevron_left" className="text-[20px]" />
                    </button>
                  ) : null}
                  {ci < COLUMNS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => onMove(item.id, ci + 1)}
                      aria-label={`Move ${item.title} later`}
                      className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-on-primary/75 hover:bg-on-primary"
                    >
                      <Icon name="chevron_right" className="text-[20px]" />
                    </button>
                  ) : null}
                </div>
              ))}

              {!list.length ? (
                <div className="grid flex-1 place-items-center rounded-panel border-[1.5px] border-dashed border-muted-border p-6 text-muted-border">
                  <Icon name="inbox" className="text-[34px]" />
                  <span className="sr-only">Nothing here</span>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default CanWaitView;
