import Icon from "@/components/common/Icon.jsx";
import { formatDuration } from "@/lib/time-format.js";
import { cn } from "@/lib/utils";
import { toneOf } from "./task-tones.js";

/**
 * Upcoming or done task in the timeline: icon tile, title, duration (+ "from"
 * label when it was pulled out of a parent), and a round done button.
 * Clicking the row makes it the current task.
 */
function TaskRow({ task, onSelect, onToggle, dragProps, dragging }) {
  const tone = toneOf(task.color);

  return (
    <div
      {...dragProps}
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer items-center gap-3.5 rounded-[1.25rem] border border-divider bg-surface-container-lowest py-2.5 pr-3 pl-2.5 transition-[border-color,opacity] duration-200 hover:border-muted-border",
        task.done && "opacity-50",
        dragging && "opacity-35",
      )}
    >
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-[0.875rem]", tone.fill)}>
        <Icon name={task.icon || "task_alt"} fill className="text-[22px]" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={cn("text-[1.125rem] leading-[1.3] font-bold", task.done && "line-through")}>{task.title}</span>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-body-sm text-slate">
          <span>{formatDuration(task.dur)}</span>
          {task.from ? (
            <span className="flex min-w-0 items-center gap-0.5">
              <Icon name="subdirectory_arrow_right" className="text-[16px]" />
              <span className="sr-only">From </span>
              {task.from}
            </span>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        role="checkbox"
        aria-checked={!!task.done}
        aria-label={`Mark ${task.title} done`}
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        className={cn(
          "grid size-[1.875rem] shrink-0 cursor-pointer place-items-center rounded-full border-2 text-on-primary transition-colors",
          tone.border,
          task.done ? "border-secondary bg-secondary" : "bg-surface-container-lowest",
        )}
      >
        {task.done ? <Icon name="check" className="text-[17px]" /> : null}
      </button>
    </div>
  );
}

export default TaskRow;
