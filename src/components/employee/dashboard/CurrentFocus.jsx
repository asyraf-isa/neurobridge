import { useNavigate } from "react-router-dom";
import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import StepRow from "@/components/employee/mywork/StepRow.jsx";
import { minutesLeft, stepTimes, taskProgress } from "@/components/employee/mywork/task-time.js";
import { toneOf } from "@/components/employee/mywork/task-tones.js";
import { endPomodoro, formatClock, pausePomodoro, startFocusBlock, startPomodoro } from "@/lib/pomodoro-store.js";
import { formatMinutes, formatRange } from "@/lib/time-format.js";
import { usePomodoro } from "@/lib/use-pomodoro.js";
import { toggleStep } from "@/lib/work-day-store.js";

/**
 * Current focus (DESIGN.md → Dashboard): the same task, steps and timer as My
 * Work. Starting a 25-minute focus block drives the global floating timer.
 */
function CurrentFocus({ task }) {
  const navigate = useNavigate();
  const pomodoro = usePomodoro(true);

  if (!task) {
    return (
      <section className="flex flex-col items-center gap-3 rounded-card border border-divider bg-surface-container-lowest p-7 text-center">
        <Icon name="celebration" fill className="text-[34px] text-secondary" />
        <span className="text-headline-sm">All done for today</span>
      </section>
    );
  }

  const tone = toneOf(task.color);
  const steps = task.steps || [];
  const times = stepTimes(task);
  const active = pomodoro.hasStarted && pomodoro.taskId === task.id;

  return (
    <section aria-labelledby="focus-title" className="flex flex-col gap-[1.125rem] rounded-card border border-divider bg-surface-container-lowest p-7 max-sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-body-sm font-extrabold tracking-[0.06em] text-slate">CURRENT FOCUS</span>
        <button
          type="button"
          onClick={() => navigate("/employee/work")}
          className="flex cursor-pointer items-center gap-1 text-body-md font-bold text-primary hover:text-primary-hover"
        >
          <Icon name="link" className="text-[18px]" />
          My Work
        </button>
      </div>

      <div className="flex items-center gap-3.5">
        <span className={`grid size-13 shrink-0 place-items-center rounded-tile ${tone.fill}`}>
          <Icon name={task.icon || "task_alt"} fill className="text-[28px]" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span id="focus-title" className="text-[1.4375rem] leading-[1.2] font-extrabold tracking-[-0.01em]">
            {task.title}
          </span>
          <span className="text-body-md text-slate tabular-nums">{formatRange(task.start, task.dur)}</span>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-fill px-3 py-[0.4375rem] text-body-sm font-extrabold tabular-nums">
          <Icon name="hourglass_top" className="text-[16px]" />
          <span className="sr-only">Time left: </span>
          {active ? formatClock(pomodoro.timeLeft) : `${minutesLeft(task)} min`}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-fill">
        <div className="h-full rounded-full bg-primary" style={{ width: `${taskProgress(task)}%` }} />
      </div>

      {steps.length ? (
        <div className="flex flex-col gap-0.5 rounded-panel bg-fill-soft p-1.5">
          {steps.map((step, i) => (
            <StepRow
              key={step.id}
              time={formatMinutes(times[i])}
              title={step.t}
              done={step.done}
              onToggle={() => toggleStep(step.id)}
              checkClassName="border-primary"
              doneClassName="bg-primary"
            />
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2.5">
        {active ? (
          <>
            <Button
              variant="dark"
              size="lg"
              onClick={() => (pomodoro.isRunning ? pausePomodoro() : startPomodoro())}
              className="h-[3.125rem] min-w-45 flex-1 tabular-nums"
            >
              <Icon name={pomodoro.isRunning ? "pause" : "play_arrow"} fill className="text-[24px]" />
              {pomodoro.isRunning ? "Pause" : "Resume"} · {formatClock(pomodoro.timeLeft)}
            </Button>
            <Button variant="soft" size="lg" onClick={() => endPomodoro()} className="h-[3.125rem] pr-5 pl-4">
              <Icon name="stop" fill className="text-[22px]" />
              End
            </Button>
          </>
        ) : (
          <Button
            variant="dark"
            size="lg"
            onClick={() => {
              endPomodoro();
              startFocusBlock(task.id, task.title, task.dur);
            }}
            className="h-[3.125rem] min-w-45 flex-1"
          >
            <Icon name="play_arrow" fill className="text-[24px]" />
            Focus · 25 min
          </Button>
        )}
      </div>
    </section>
  );
}

export default CurrentFocus;
