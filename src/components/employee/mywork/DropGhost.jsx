import { formatMinutes } from "@/lib/time-format.js";

/** Drop target shown while dragging a task or step: dashed indigo outline + new start time. */
function DropGhost({ start, title }) {
  return (
    <div className="pointer-events-none ml-16 flex items-center gap-3 rounded-[1.25rem] border-2 border-dashed border-tertiary bg-tint-indigo-soft px-3.5 py-3 text-body-lg font-bold text-primary">
      <span className="text-body-sm font-bold tabular-nums">{formatMinutes(start)}</span>
      <span className="min-w-0 flex-1">{title}</span>
    </div>
  );
}

export default DropGhost;
