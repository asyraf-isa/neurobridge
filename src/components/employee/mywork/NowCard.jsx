import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import { formatMinutes } from "@/lib/time-format.js";
import { cn } from "@/lib/utils";
import StepRow from "./StepRow.jsx";
import { minutesLeft, stepTimes, taskProgress } from "./task-time.js";
import { toneOf } from "./task-tones.js";

/**
 * The current task, expanded (DESIGN.md → "Current task"): NOW eyebrow, time
 * left, progress, the step list (each step can be dragged out into the
 * timeline), Break it down when it has none, and Start / Done.
 */
function NowCard({ task, startLabel, onStart, onDone, onBreakDown, onToggleStep, onStepDragStart, onStepDragEnd, draggingStep, dragging, dragProps }) {
  const tone = toneOf(task.color);
  const steps = task.steps || [];
  const times = stepTimes(task);

  return (
    <div
      {...dragProps}
      className={cn("flex cursor-grab flex-col gap-4 rounded-card-sm p-5", tone.fill, dragging && "opacity-35")}
    >
      <div className="flex items-center gap-3.5">
        <span className="grid size-13 shrink-0 place-items-center rounded-tile bg-on-primary/80">
          <Icon name={task.icon || "task_alt"} fill className="text-[28px]" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-eyebrow tracking-[0.08em] text-slate">NOW</span>
          <span className="text-[1.4375rem] leading-[1.2] font-extrabold tracking-[-0.01em]">{task.title}</span>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-on-primary/80 px-3 py-[0.4375rem] text-body-sm font-extrabold tabular-nums">
          <Icon name="hourglass_top" className="text-[18px]" />
          <span className="sr-only">Time left: </span>
          {minutesLeft(task)} min
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-on-primary/70">
        <div className={cn("h-full rounded-full", tone.bar)} style={{ width: `${taskProgress(task)}%` }} />
      </div>

      {steps.length ? (
        <div className="flex flex-col gap-0.5 rounded-panel bg-on-primary/60 p-1.5">
          {steps.map((step, i) => (
            <StepRow
              key={step.id}
              time={formatMinutes(times[i])}
              title={step.t}
              done={step.done}
              onToggle={() => onToggleStep(step.id)}
              checkClassName={tone.border}
              doneClassName="border-secondary bg-secondary"
              hoverClassName="hover:bg-on-primary/80"
              dimmed={draggingStep === step.id}
              dragProps={{
                draggable: true,
                onDragStart: (event) => {
                  event.stopPropagation();
                  event.dataTransfer.setData("text/plain", step.t);
                  event.dataTransfer.effectAllowed = "move";
                  onStepDragStart(step.id);
                },
                onDragEnd: (event) => {
                  event.stopPropagation();
                  onStepDragEnd();
                },
              }}
            />
          ))}
        </div>
      ) : (
        <Button variant="ghost" onClick={onBreakDown} className="h-10 self-start bg-on-primary/80 pr-3.5 pl-2.5 hover:bg-on-primary">
          <Icon name="auto_awesome" className="text-[20px] text-tertiary" />
          Break it down
        </Button>
      )}

      <div className="flex gap-2.5">
        <Button variant="dark" size="lg" onClick={onStart} className="h-[3.125rem] flex-1">
          <Icon name="play_arrow" fill className="text-[26px]" />
          {startLabel}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={onDone}
          className="h-[3.125rem] bg-on-primary/85 pr-5 pl-4 hover:bg-on-primary"
        >
          <Icon name="check" className="text-[24px]" />
          Done
        </Button>
      </div>
    </div>
  );
}

export default NowCard;
