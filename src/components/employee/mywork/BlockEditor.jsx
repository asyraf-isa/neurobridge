import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import { DAY_START, WEEK_DAYS } from "@/data/work-day.js";
import { formatDuration, formatMinutes } from "@/lib/time-format.js";
import { updateBlock } from "@/lib/work-day-store.js";
import { cn } from "@/lib/utils";
import { toneOf } from "./task-tones.js";

function Stepper({ icon, label, value, onLess, onMore, lessLabel, moreLabel }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon name={icon} className="w-7 text-[22px] text-slate-soft" />
      <span className="sr-only">{label}</span>
      <Button variant="outline" size="icon" onClick={onLess} aria-label={lessLabel} className="size-11 border border-muted-border">
        <Icon name="remove" className="text-[20px]" />
      </Button>
      <span className="flex-1 text-center text-title-md tabular-nums">{value}</span>
      <Button variant="outline" size="icon" onClick={onMore} aria-label={moreLabel} className="size-11 border border-muted-border">
        <Icon name="add" className="text-[20px]" />
      </Button>
    </div>
  );
}

/** Side panel for the picked week block — or a "Pick a block" hint. */
function BlockEditor({ dayKey, block, onRemoved }) {
  if (!block) {
    return (
      <aside className="sticky top-7 flex max-w-80 flex-[1_1_16.25rem] flex-col items-center gap-2.5 rounded-[1.75rem] border border-divider bg-surface-container-lowest px-[1.375rem] py-12 text-slate-soft">
        <Icon name="touch_app" className="text-[42px]" />
        <span className="text-body-lg font-bold">Pick a block</span>
      </aside>
    );
  }

  const dayInfo = WEEK_DAYS.find((d) => d.key === dayKey);
  const update = (fn) => updateBlock(dayKey, block.id, fn);

  return (
    <aside className="sticky top-7 flex max-w-80 flex-[1_1_16.25rem] flex-col gap-[1.125rem] rounded-[1.75rem] border border-divider bg-surface-container-lowest p-[1.375rem]">
      <span className={cn("h-2.5 w-14 rounded-full", toneOf(block.color).bar)} />
      <div className="flex flex-col gap-1.5">
        <span className="text-[1.4375rem] leading-[1.2] font-extrabold">{block.title}</span>
        <span className="flex items-center gap-1.5 text-body-md font-bold text-slate">
          <Icon name="event" className="text-[20px]" />
          {dayInfo.name} {dayInfo.date} · {formatMinutes(block.start)}–{formatMinutes(block.start + block.dur)}
        </span>
      </div>
      <Stepper
        icon="schedule"
        label="Start time"
        value={formatMinutes(block.start)}
        lessLabel="15 minutes earlier"
        moreLabel="15 minutes later"
        onLess={() => update((t) => ({ ...t, start: Math.max(DAY_START, t.start - 15) }))}
        onMore={() => update((t) => ({ ...t, start: Math.min(1005, t.start + 15) }))}
      />
      <Stepper
        icon="timelapse"
        label="Length"
        value={formatDuration(block.dur)}
        lessLabel="Shorter"
        moreLabel="Longer"
        onLess={() => update((t) => ({ ...t, dur: Math.max(15, t.dur - 15) }))}
        onMore={() => update((t) => ({ ...t, dur: t.dur + 15 }))}
      />
      <div className="mt-1 flex gap-2">
        <Button variant="dark" size="lg" className="flex-1" onClick={() => update((t) => ({ ...t, done: !t.done }))}>
          <Icon name={block.done ? "undo" : "check"} className="text-[20px]" />
          {block.done ? "Undo" : "Done"}
        </Button>
        <Button
          variant="outline"
          size="icon-lg"
          aria-label="Delete"
          className="border border-muted-border text-primary"
          onClick={() => {
            update(() => null);
            onRemoved();
          }}
        >
          <Icon name="delete" className="text-[20px]" />
        </Button>
      </div>
    </aside>
  );
}

export default BlockEditor;
