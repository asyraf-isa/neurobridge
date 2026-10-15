import Icon from "@/components/common/Icon.jsx";
import { cn } from "@/lib/utils";

/** Starter tiles under the composer. `actions`: [{ icon, label, sub, tone, onClick }]. */
const TONES = {
  indigo: "bg-tint-indigo text-primary",
  "indigo-soft": "bg-tint-indigo-soft text-tertiary",
  teal: "bg-tint-teal text-secondary",
  slate: "bg-fill text-ink",
};

function QuickActions({ actions, calm }) {
  return (
    <div className="relative z-10 flex flex-col gap-2.5">
      <span className="text-[0.875rem] font-extrabold tracking-[0.14em] text-slate">QUICK ACTIONS</span>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(10.625rem,1fr))] gap-2.5">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className="flex min-h-16 cursor-pointer items-center gap-3 rounded-[1.25rem] border-[1.5px] border-divider bg-surface-container-lowest px-3.5 py-2.5 text-left transition-[background-color,border-color,transform] duration-200 hover:border-muted-border hover:bg-canvas active:scale-[.97]"
          >
            <span className={cn("grid size-[2.375rem] shrink-0 place-items-center rounded-lg", TONES[action.tone], calm && "bg-fill")}>
              <Icon name={action.icon} fill className="text-[22px]" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="text-body-lg font-extrabold">{action.label}</span>
              <span className="text-body-sm text-slate">{action.sub}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
