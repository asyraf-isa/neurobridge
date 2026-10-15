import { useState } from "react";
import Icon from "@/components/common/Icon.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import Segmented from "@/components/common/Segmented.jsx";
import { Button } from "@/components/ui/button";
import CanWaitView from "@/components/employee/mywork/CanWaitView.jsx";
import NewTaskDrawer from "@/components/employee/mywork/NewTaskDrawer.jsx";
import TimelineView from "@/components/employee/mywork/TimelineView.jsx";
import WeekView from "@/components/employee/mywork/WeekView.jsx";
import WorkProgress from "@/components/employee/mywork/WorkProgress.jsx";
import { DEMO_DATE_SHORT } from "@/data/work-day.js";
import { endPomodoro, startFocusBlock } from "@/lib/pomodoro-store.js";
import { usePomodoro } from "@/lib/use-pomodoro.js";
import { applyCanWait, buildCanWait, toggleTask, useWorkDay } from "@/lib/work-day-store.js";

const VIEWS = [
  { value: "timeline", label: "Today", icon: "view_timeline" },
  { value: "week", label: "Week", icon: "calendar_view_week" },
  { value: "wait", label: "Can wait", icon: "low_priority" },
];

// My Work (design: "My Work v3.dc.html"). Today's timeline, the week, and the
// "Can wait" triage board, all over the shared work-day store. Focus blocks
// run on the global pomodoro timer (the floating widget follows you).
function MyWork() {
  const day = useWorkDay();
  const pomodoro = usePomodoro();
  const [view, setView] = useState("timeline");
  const [wait, setWait] = useState([]);
  const [drawer, setDrawer] = useState({ open: false, seed: "", key: 0 });

  const realTasks = day.tasks.filter((t) => t.kind !== "break");
  const done = realTasks.filter((t) => t.done).length;
  const minutesLeft = realTasks.filter((t) => !t.done).reduce((sum, t) => sum + t.dur, 0);

  const changeView = (next) => {
    if (next === "wait") setWait(buildCanWait());
    setView(next);
  };

  const openDrawer = (seed = "") =>
    setDrawer((d) => (seed ? { open: true, seed, key: d.key + 1 } : { ...d, open: true }));

  const startFocus = (task) => {
    endPomodoro();
    startFocusBlock(task.id, task.title, task.dur);
  };

  const finishTask = (task) => {
    toggleTask(task.id);
    endPomodoro(task.id);
  };

  return (
    <div className="flex flex-col gap-[1.625rem]">
      <PageHeader
        eyebrow={DEMO_DATE_SHORT}
        eyebrowIcon="today"
        title="My Work"
        actions={
          <Button size="lg" onClick={() => openDrawer()} className="h-[2.875rem] pr-5 pl-4">
            <Icon name="add" className="text-[24px]" />
            New task
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Segmented
          value={view}
          onChange={changeView}
          options={VIEWS}
          size="lg"
          label="View"
          className="border border-divider bg-surface-container-lowest p-[0.3125rem]"
          itemClassName="pr-[1.125rem] pl-3.5 text-body-md font-bold [&_.icon]:text-[20px]"
        />
        <WorkProgress done={done} total={realTasks.length} minutesLeft={minutesLeft} />
      </div>

      {view === "timeline" ? (
        <TimelineView
          day={day}
          focusLabel={(task) => (pomodoro.hasStarted && pomodoro.taskId === task.id ? "Restart" : "25 min")}
          onStartFocus={startFocus}
          onDone={finishTask}
          onBreakDown={(task) => openDrawer(task.title)}
        />
      ) : null}

      {view === "week" ? <WeekView day={day} /> : null}

      {view === "wait" ? (
        <CanWaitView
          items={wait}
          onMove={(id, col) => setWait((list) => list.map((w) => (w.id === id ? { ...w, col } : w)))}
          onDone={() => {
            applyCanWait(wait);
            setView("timeline");
          }}
        />
      ) : null}

      <NewTaskDrawer
        key={drawer.key}
        open={drawer.open}
        seed={drawer.seed}
        onOpenChange={(open) => setDrawer((d) => ({ ...d, open }))}
        onSeeTimeline={() => {
          setDrawer((d) => ({ open: false, seed: "", key: d.key + 1 }));
          setView("timeline");
        }}
      />
    </div>
  );
}

export default MyWork;
