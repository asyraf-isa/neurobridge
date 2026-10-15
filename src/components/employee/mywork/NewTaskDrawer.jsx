import { useEffect, useRef, useState } from "react";
import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { EXAMPLE_TASK, PLANS } from "@/data/work-day.js";
import { formatDuration } from "@/lib/time-format.js";
import { schedulePlan } from "@/lib/work-day-store.js";
import { cn } from "@/lib/utils";

const ADJUST_CHIPS = [
  { label: "Smaller", icon: "compress" },
  { label: "No breaks", icon: "free_breakfast" },
  { label: "By Monday", icon: "event" },
];

function buildSteps(plan) {
  return PLANS[plan.kind][plan.small ? "small" : "normal"]
    .map((entry, id) => (entry === "b" ? { id, brk: true, t: "Break", dur: 10 } : { id, t: entry[0], dur: entry[1] }))
    .filter((step) => !(plan.noBreaks && step.brk) && !plan.removed.includes(step.id));
}

const summarise = (steps) => ({
  count: steps.filter((s) => !s.brk).length,
  total: steps.reduce((sum, s) => sum + s.dur, 0),
});

/** The assistant's reply to `text`, and the updated plan. Mock logic — no model. */
function respond(plan, text) {
  const low = text.toLowerCase();
  if (!plan) {
    const isReport = low.includes("q4") || low.includes("report");
    let title = isReport ? "Draft the Q4 report" : text.split(/,| by /i)[0];
    title = title.charAt(0).toUpperCase() + title.slice(1, 44);
    const next = {
      title,
      kind: isReport ? "q4" : "generic",
      small: false,
      noBreaks: false,
      removed: [],
      deadline: low.includes("monday") ? "Monday" : "Friday",
    };
    return { plan: next, reply: `${summarise(buildSteps(next)).count} small steps, with breaks. Sized to your profile.` };
  }
  const next = { ...plan };
  let reply = "Tap ✕ to remove a step.";
  if (low.includes("small")) {
    next.small = true;
    next.removed = [];
    reply = "Smaller steps. 15 min max.";
  } else if (low.includes("no break")) {
    next.noBreaks = true;
    reply = "Breaks removed.";
  } else if (low.includes("monday")) {
    next.deadline = "Monday";
    reply = "Due Monday.";
  }
  return { plan: next, reply };
}

/**
 * New task (DESIGN.md → My Work → New task): a right-hand drawer where one
 * natural-language line ("Draft the Q4 report by Friday, about 3 hours,
 * urgent") becomes a step plan you can adjust, then "Schedule it".
 * `seed` opens it with a first message (used by "Break it down").
 */
function NewTaskDrawer({ open, seed, onOpenChange, onSeeTimeline }) {
  // A `seed` (from "Break it down") is answered straight away. The page gives
  // the drawer a new `key` per seed, so this initial state is per request.
  const [initial] = useState(() => (seed ? respond(null, seed) : null));
  const [messages, setMessages] = useState(() =>
    initial ? [{ role: "user", text: seed }, { role: "ai", text: initial.reply }] : [],
  );
  const [plan, setPlan] = useState(initial?.plan ?? null);
  const [input, setInput] = useState("");
  const [scheduled, setScheduled] = useState(false);
  const scrollRef = useRef(null);

  const send = (raw) => {
    const text = (raw || "").trim();
    if (!text) return;
    const { plan: next, reply } = respond(plan, text);
    setPlan(next);
    setMessages((list) => [...list, { role: "user", text }, { role: "ai", text: reply }]);
    setInput("");
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, plan, scheduled]);

  const reset = () => {
    setMessages([]);
    setPlan(null);
    setInput("");
    setScheduled(false);
  };

  const handleOpenChange = (next) => {
    if (!next && scheduled) reset();
    onOpenChange(next);
  };

  const steps = plan ? buildSteps(plan) : [];
  const { count, total } = summarise(steps);
  let stepNumber = 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-3 right-3 bottom-3 left-auto flex w-[min(27.5rem,calc(100%-1.5rem))] max-w-none! translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-[1.75rem] p-0 data-open:slide-in-from-right-8 data-open:zoom-in-100"
      >
        <div className="flex items-center gap-3 border-b border-divider px-5 py-[1.125rem]">
          <span className="grid size-10 place-items-center rounded-[0.8125rem] bg-tint-indigo">
            <Icon name="auto_awesome" fill className="text-[24px] text-tertiary" />
          </span>
          <DialogTitle className="flex-1 text-[1.3125rem] font-extrabold">New task</DialogTitle>
          <DialogDescription className="sr-only">Describe a task and the assistant breaks it into steps.</DialogDescription>
          <Button variant="soft" size="icon" aria-label="Close" onClick={() => handleOpenChange(false)} className="bg-divider">
            <Icon name="close" className="text-[20px]" />
          </Button>
        </div>

        <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-5" aria-live="polite">
          <div className="max-w-[88%] self-start rounded-[1.25rem_1.25rem_1.25rem_0.375rem] border border-divider bg-surface-container-lowest px-4 py-3 text-body-lg font-normal">
            What&apos;s the task? Add a deadline and rough time.
          </div>

          {!messages.length ? (
            <button
              type="button"
              onClick={() => send(EXAMPLE_TASK)}
              className="flex cursor-pointer items-center gap-2 self-start rounded-[0.875rem] border border-muted-border bg-surface-container-lowest px-3.5 py-2.5 text-left text-body-md leading-[1.4] text-slate hover:bg-fill"
            >
              <Icon name="lightbulb" className="text-[20px] text-tertiary" />
              {EXAMPLE_TASK}
            </button>
          ) : null}

          {messages.map((message, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[88%] px-4 py-3 text-body-lg font-normal",
                message.role === "user"
                  ? "self-end rounded-[1.25rem_1.25rem_0.375rem_1.25rem] bg-primary text-on-primary"
                  : "self-start rounded-[1.25rem_1.25rem_1.25rem_0.375rem] bg-surface-container-lowest",
              )}
            >
              {message.text}
            </div>
          ))}

          {plan ? (
            <div className="flex flex-col gap-1.5 rounded-3xl border border-divider bg-surface-container-lowest p-3.5">
              <div className="flex flex-col gap-2 px-1 pt-0.5 pb-2">
                <span className="text-[1.125rem] font-extrabold">{plan.title}</span>
                <div className="flex flex-wrap gap-3.5 text-body-sm font-bold text-slate">
                  <span className="flex items-center gap-1">
                    <Icon name="format_list_numbered" className="text-[18px]" />
                    {count} steps
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="schedule" className="text-[18px]" />
                    {formatDuration(total)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="flag" className="text-[18px]" />
                    {plan.deadline}
                  </span>
                </div>
              </div>

              {steps.map((step) =>
                step.brk ? (
                  <div
                    key={step.id}
                    className="flex items-center gap-2.5 rounded-[0.875rem] border-[1.5px] border-dashed border-muted-border py-1.5 pr-2.5 pl-3 text-slate"
                  >
                    <Icon name="coffee" className="w-[1.375rem] text-center text-[18px]" />
                    <span className="flex-1 text-body-sm font-bold">{formatDuration(step.dur)}</span>
                    {!scheduled ? (
                      <RemoveButton label="Remove break" onClick={() => setPlan((p) => ({ ...p, removed: [...p.removed, step.id] }))} />
                    ) : null}
                  </div>
                ) : (
                  <div key={step.id} className="flex items-center gap-2.5 rounded-[0.875rem] bg-tint-indigo py-[0.5625rem] pr-2.5 pl-3">
                    <span className="grid size-[1.375rem] shrink-0 place-items-center rounded-full bg-surface-container-lowest text-label-sm font-extrabold">
                      {++stepNumber}
                    </span>
                    <span className="flex-1 text-body-md font-bold">{step.t}</span>
                    <span className="text-[0.875rem] font-bold text-slate">{formatDuration(step.dur)}</span>
                    {!scheduled ? (
                      <RemoveButton label="Remove step" onClick={() => setPlan((p) => ({ ...p, removed: [...p.removed, step.id] }))} />
                    ) : null}
                  </div>
                ),
              )}
            </div>
          ) : null}

          {plan && !scheduled ? (
            <>
              <div className="flex flex-wrap gap-2">
                {ADJUST_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => send(chip.label)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full border border-muted-border bg-fill py-2 pr-3.5 pl-2.5 text-body-sm font-bold text-primary hover:bg-divider"
                  >
                    <Icon name={chip.icon} className="text-[18px]" />
                    {chip.label}
                  </button>
                ))}
              </div>
              <Button
                size="lg"
                className="h-[3.125rem]"
                onClick={() => {
                  const line = schedulePlan(steps);
                  setScheduled(true);
                  setMessages((list) => [...list, { role: "user", text: "Schedule it" }, { role: "ai", text: line }]);
                }}
              >
                <Icon name="event_available" className="text-[24px]" />
                Schedule it
              </Button>
            </>
          ) : null}

          {scheduled ? (
            <Button
              variant="dark"
              className="self-start pr-[1.125rem] pl-3.5"
              onClick={() => {
                reset();
                onSeeTimeline();
              }}
            >
              <Icon name="view_timeline" className="text-[20px]" />
              See timeline
            </Button>
          ) : null}
        </div>

        <form
          className="border-t border-divider px-4 pt-3.5 pb-[1.125rem]"
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
        >
          <div className="flex items-center gap-2 rounded-full border border-muted-border bg-surface-container-lowest py-1.5 pr-1.5 pl-[1.125rem] focus-within:border-tertiary focus-within:ring-4 focus-within:ring-tint-indigo">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={plan ? "Reply…" : "Describe a task…"}
              aria-label="Message"
              className="h-10 min-w-0 flex-1 bg-transparent text-body-lg font-medium outline-none placeholder:text-slate"
            />
            <Button type="submit" size="icon" aria-label="Send">
              <Icon name="arrow_upward" className="text-[20px]" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RemoveButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-[1.625rem] cursor-pointer place-items-center rounded-full bg-on-primary/80 text-slate hover:bg-on-primary"
    >
      <Icon name="close" className="text-[17px]" />
    </button>
  );
}

export default NewTaskDrawer;
