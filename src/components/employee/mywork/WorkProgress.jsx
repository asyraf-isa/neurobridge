import Icon from "@/components/common/Icon.jsx";
import { formatDuration } from "@/lib/time-format.js";

/** Teal ring of tasks done (x/y) and the time left in today's open tasks. */
function WorkProgress({ done, total, minutesLeft }) {
  const degrees = total ? Math.round((done / total) * 360) : 0;

  return (
    <div className="flex items-center gap-[1.125rem]">
      <div
        role="img"
        aria-label={`${done} of ${total} tasks done`}
        className="grid size-12 place-items-center rounded-full transition-[background] duration-400"
        style={{ background: `conic-gradient(var(--color-secondary) ${degrees}deg, var(--color-divider) 0)` }}
      >
        <span className="grid size-[2.375rem] place-items-center rounded-full bg-surface-container-lowest text-body-sm font-extrabold tabular-nums">
          {done}/{total}
        </span>
      </div>
      <span className="flex items-center gap-1.5 text-body-lg font-bold text-ink-soft">
        <Icon name="hourglass_top" className="text-[20px] text-slate-soft" />
        <span className="sr-only">Time left: </span>
        {formatDuration(minutesLeft)}
      </span>
    </div>
  );
}

export default WorkProgress;
