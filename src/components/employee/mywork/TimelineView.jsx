import { useState } from "react";
import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import { formatDuration, formatMinutes } from "@/lib/time-format.js";
import {
  moveTask,
  placeStep,
  setCurrentTask,
  stepDuration,
  toggleStep,
  toggleTask,
} from "@/lib/work-day-store.js";
import { cn } from "@/lib/utils";
import DropGhost from "./DropGhost.jsx";
import NowCard from "./NowCard.jsx";
import TaskRow from "./TaskRow.jsx";

/**
 * Today's timeline (DESIGN.md → My Work): a 48px time rail beside each row.
 * Whole tasks drag to reorder; steps drag out of the current task and drop
 * before/after any other row. Every move reflows the day in the store.
 * Done tasks (and the breaks before the first open task) collapse behind a
 * "n done" chip.
 */
function TimelineView({ day, focusLabel, onStartFocus, onDone, onBreakDown }) {
  const [showDone, setShowDone] = useState(false);
  const [rowDrag, setRowDrag] = useState(null);
  const [stepDrag, setStepDrag] = useState(null);
  const [over, setOver] = useState(null); // { id, before }

  const { tasks, current } = day;
  const realTasks = tasks.filter((t) => t.kind !== "break");
  const doneCount = realTasks.filter((t) => t.done).length;
  const currentTask = tasks.find((t) => t.id === current);

  const endDrag = () => {
    setRowDrag(null);
    setStepDrag(null);
    setOver(null);
  };

  // What is being dragged, for the drop ghost.
  const draggedStep = stepDrag != null && currentTask?.steps?.find((s) => s.id === stepDrag);
  const draggedRow = rowDrag && tasks.find((t) => t.id === rowDrag);
  const dragItem = draggedStep
    ? { title: draggedStep.t, dur: stepDuration(currentTask, draggedStep), idx: tasks.indexOf(currentTask) }
    : draggedRow
      ? { title: draggedRow.title, dur: draggedRow.dur, idx: tasks.indexOf(draggedRow) }
      : null;

  // Breaks before the first open task count as "done" and collapse with it.
  const firstOpen = tasks.findIndex((t) => t.kind !== "break" && !t.done);

  return (
    <div className="flex w-full max-w-[65rem] flex-col gap-3">
      {doneCount > 0 ? (
        <Button
          variant="soft"
          size="sm"
          onClick={() => setShowDone((shown) => !shown)}
          aria-expanded={showDone}
          className="ml-16 self-start pr-3 pl-2.5 text-body-md text-slate"
        >
          <Icon name="check_circle" fill className="text-[20px] text-tertiary" />
          {showDone ? "Hide done" : `${doneCount} done`}
          <Icon name={showDone ? "expand_less" : "expand_more"} className="text-[18px]" />
        </Button>
      ) : null}

      {tasks.map((task, index) => {
        const isBreak = task.kind === "break";
        const beforeFirstOpen = firstOpen === -1 || index < firstOpen;
        if (!showDone && ((!isBreak && task.done) || (isBreak && beforeFirstOpen))) return null;

        const isCurrent = task.id === current && !task.done;
        const ghostHere = dragItem && over?.id === task.id;
        const ghostStart = ghostHere
          ? (over.before ? task.start : task.start + task.dur) - (dragItem.idx < index ? dragItem.dur : 0)
          : 0;

        const rowDragProps = {
          draggable: true,
          onDragStart: (event) => {
            event.dataTransfer.setData("text/plain", task.title);
            event.dataTransfer.effectAllowed = "move";
            setRowDrag(task.id);
          },
          onDragEnd: endDrag,
        };

        return (
          <div
            key={task.id}
            className="flex flex-col gap-3"
            onDragOver={(event) => {
              if (rowDrag ? rowDrag === task.id : stepDrag == null || isCurrent) return;
              event.preventDefault();
              const body = event.currentTarget.querySelector("[data-row-body]") || event.currentTarget;
              const rect = body.getBoundingClientRect();
              const before = event.clientY < rect.top + rect.height / 2;
              if (over?.id !== task.id || over.before !== before) setOver({ id: task.id, before });
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (rowDrag) moveTask(rowDrag, task.id, over?.before);
              else if (stepDrag != null && !isCurrent) placeStep(stepDrag, task.id, over?.before);
              endDrag();
            }}
          >
            {ghostHere && over.before ? <DropGhost start={ghostStart} title={dragItem.title} /> : null}

            <div data-row-body className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-4">
              <div className="pt-5 text-right text-body-md font-bold text-slate-soft tabular-nums">
                {isBreak ? "" : formatMinutes(task.start)}
              </div>

              {isBreak ? (
                <div
                  {...rowDragProps}
                  className={cn(
                    "flex cursor-grab items-center gap-2 py-0 pl-3.5 text-body-sm font-bold text-slate-soft",
                    rowDrag === task.id && "opacity-35",
                  )}
                >
                  <Icon name={task.icon || "coffee"} className="text-[18px]" />
                  <span className="sr-only">{task.title}, </span>
                  {formatDuration(task.dur)}
                </div>
              ) : isCurrent ? (
                <NowCard
                  task={task}
                  startLabel={focusLabel(task)}
                  onStart={() => onStartFocus(task)}
                  onDone={() => onDone(task)}
                  onBreakDown={() => onBreakDown(task)}
                  onToggleStep={toggleStep}
                  onStepDragStart={setStepDrag}
                  onStepDragEnd={endDrag}
                  draggingStep={stepDrag}
                  dragging={rowDrag === task.id}
                  dragProps={rowDragProps}
                />
              ) : (
                <TaskRow
                  task={task}
                  onSelect={() => setCurrentTask(task.id)}
                  onToggle={() => (task.done ? toggleTask(task.id) : onDone(task))}
                  dragProps={rowDragProps}
                  dragging={rowDrag === task.id}
                />
              )}
            </div>

            {ghostHere && !over.before ? <DropGhost start={ghostStart} title={dragItem.title} /> : null}
          </div>
        );
      })}
    </div>
  );
}

export default TimelineView;
