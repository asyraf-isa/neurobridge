import Icon from "@/components/common/Icon.jsx";
import { cn } from "@/lib/utils";

/**
 * One step of a task: start time (fixed 40px column, tabular), round
 * checkbox, title, and an optional drag handle. Used by the "Now" card in My
 * Work and the dashboard's Current focus.
 */
function StepRow({ time, title, done, onToggle, checkClassName, doneClassName, dragProps, dimmed, hoverClassName = "hover:bg-fill" }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      onClick={onToggle}
      {...dragProps}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-[0.5625rem] text-left text-body-lg transition-[background-color,opacity] duration-200",
        hoverClassName,
        dimmed && "opacity-40",
      )}
    >
      <span className="w-10 shrink-0 text-body-sm font-bold text-slate tabular-nums">{time}</span>
      <span
        className={cn(
          "grid size-[1.375rem] shrink-0 place-items-center rounded-full border-2 bg-surface-container-lowest text-on-primary transition-colors",
          checkClassName,
          done && doneClassName,
        )}
      >
        {done ? <Icon name="check" className="text-[15px] font-bold" /> : null}
      </span>
      <span className={cn("min-w-0 flex-1", done && "text-slate line-through")}>{title}</span>
      {dragProps ? <Icon name="drag_indicator" className="cursor-grab text-[20px] text-slate-soft" /> : null}
    </button>
  );
}

export default StepRow;
