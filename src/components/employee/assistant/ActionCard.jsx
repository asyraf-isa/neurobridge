import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NOTIFY_MESSAGES } from "@/data/assistant.js";
import { cn } from "@/lib/utils";

const EYEBROWS = {
  steps: ["ADD TO MY WORK", "playlist_add"],
  notify: ["NOTIFY YOUR EMPLOYER", "support"],
  draft: ["MESSAGE TO PRIYA", "mail"],
  reflection: ["SAVED TO REFLECTIONS", "auto_stories"],
};

const LEVELS = [
  { k: "prompt", label: "Prompt", icon: "chat_bubble", hint: "Not urgent. Sent when you press Send prompt." },
  { k: "urgent", label: "Urgent", icon: "emergency_home", hint: "Safety concern. Flagged and sent right away." },
];

const ADJUST_REPLIES = ["Smaller steps", "No breaks", "By Monday"];

/**
 * An assistant action (DESIGN.md → AI Assistant → Action cards): every
 * suggestion has Proceed / Adjust / Reject, and applied actions can be undone.
 * Kinds: steps (add to My Work) · notify (Prompt or Urgent to the employer) ·
 * draft (a message to Priya) · reflection (already saved, private).
 */
function ActionCard({ card, calm, onUpdate, onProceed, onUndo, onReplace, onOpen }) {
  const pending = card.status === "pending";
  const applied = card.status === "applied";
  const urgent = card.kind === "notify" && card.level === "urgent";
  const [eyebrow, icon] = EYEBROWS[card.kind];

  const doneText = applied
    ? {
        steps: 'Added to My Work under "Q4 report: draft the summary"',
        notify: urgent ? "Sent to Sam Okafor and flagged urgent" : "Sent to Priya. She sees the message above, not this chat.",
        draft: "Sent to Priya",
        reflection: "Saved to Reflections, private",
      }[card.kind]
    : card.replaced
      ? "Replaced by a new version below"
      : card.kind === "reflection"
        ? "Removed from Reflections"
        : "Not applied";

  const canUndo = !card.replaced && !(urgent && applied);
  const message = card.kind !== "steps" && card.kind !== "notify" ? card.message : null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 rounded-3xl border p-[1.125rem] transition-colors duration-300",
        urgent && pending ? "border-urgent-border bg-urgent-container" : "border-divider bg-surface-container-lowest",
      )}
    >
      <div className="flex items-center gap-2">
        <Icon name={icon} fill className={cn("text-[20px]", urgent ? "text-urgent" : "text-primary")} />
        <span className="text-body-sm font-extrabold tracking-[0.06em] text-slate">{eyebrow}</span>
      </div>

      {card.kind === "steps" ? (
        <ol className="m-0 flex list-none flex-col gap-0.5 rounded-2xl bg-fill-soft p-1.5">
          {card.steps.map((step, i) => (
            <li key={i} className={cn("flex items-center gap-3 p-2.5 text-body-lg", step.brk ? "text-slate" : "text-ink")}>
              <span
                className={cn(
                  "grid size-[1.625rem] shrink-0 place-items-center rounded-full",
                  step.brk ? "bg-fill" : calm ? "bg-fill" : "bg-tint-indigo",
                )}
              >
                <Icon name={step.brk ? "coffee" : "radio_button_unchecked"} className={cn("text-[16px]", step.brk ? "text-slate" : "text-primary")} />
              </span>
              <span className="min-w-0 flex-1">{step.t}</span>
              <span className="shrink-0 text-body-sm font-bold text-slate tabular-nums">{step.d}</span>
            </li>
          ))}
        </ol>
      ) : null}

      {card.kind === "notify" ? (
        <>
          <div role="radiogroup" aria-label="Urgency" className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
            {LEVELS.map((level) => {
              const on = card.level === level.k;
              const isUrgent = level.k === "urgent";
              return (
                <button
                  key={level.k}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  disabled={!pending}
                  onClick={() => onUpdate({ level: level.k, message: NOTIFY_MESSAGES[level.k] })}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-panel border-2 bg-surface-container-lowest px-3.5 py-3 text-left enabled:cursor-pointer",
                    on ? (isUrgent ? "border-urgent" : "border-primary") : "border-divider",
                  )}
                >
                  <span className={cn("flex items-center gap-1.5 text-body-md font-extrabold", isUrgent ? "text-urgent-ink" : "text-primary")}>
                    <Icon name={level.icon} fill className="text-[18px]" />
                    {level.label}
                  </span>
                  <span className="text-body-sm leading-[1.4] text-slate">{level.hint}</span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-body-sm font-extrabold tracking-[0.06em] text-slate">
              WHAT WILL BE SENT · TO {urgent ? "SAM OKAFOR, WELLBEING LEAD" : "PRIYA SHAH, LINE MANAGER"}
            </span>
            {!card.adjusting ? <p className="m-0 rounded-2xl bg-fill-soft px-4 py-3.5 text-body-lg whitespace-pre-wrap">{card.message}</p> : null}
            <span className="text-body-sm text-slate">
              {urgent
                ? "Sent right away and clearly flagged. Use this for a safety concern. Your chat is not shared."
                : "Priya sees only this message and the level. Your chat stays private."}
            </span>
          </div>
        </>
      ) : null}

      {message && !card.adjusting ? (
        <p className="m-0 rounded-2xl bg-fill-soft px-4 py-3.5 text-body-lg leading-[1.55] whitespace-pre-wrap">{message}</p>
      ) : null}

      {card.adjusting && card.kind !== "steps" && pending ? (
        <Textarea
          value={card.message}
          onChange={(event) => onUpdate({ message: event.target.value })}
          rows={3}
          aria-label="Edit message"
          className="resize-y rounded-2xl border px-3.5 py-3"
        />
      ) : null}

      {card.adjusting && card.kind === "steps" && pending ? (
        <div className="flex flex-wrap gap-1.5">
          {ADJUST_REPLIES.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => onReplace(label)}
              className="h-[2.375rem] cursor-pointer rounded-full border-[1.5px] border-tint-indigo-border bg-tint-indigo-soft px-3.5 text-body-sm font-bold hover:bg-tint-indigo"
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {pending && card.kind !== "reflection" ? (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={urgent ? "destructive" : "dark"}
            onClick={onProceed}
            className="pr-[1.125rem] pl-3.5 text-body-md"
          >
            <Icon name={card.kind === "steps" ? "check" : "send"} className="text-[20px]" />
            {card.kind === "steps" ? "Proceed" : card.kind === "notify" ? (urgent ? "Send urgent" : "Send prompt") : "Send"}
          </Button>
          <Button
            variant={card.adjusting ? "dark" : "soft"}
            aria-pressed={!!card.adjusting}
            onClick={() => onUpdate({ adjusting: !card.adjusting })}
            className="px-4 text-body-md"
          >
            {card.adjusting ? "Done" : "Adjust"}
          </Button>
          <Button variant="ghost" onClick={() => onUpdate({ status: "rejected", adjusting: false })} className="px-4 text-body-md text-slate">
            Reject
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2.5" role="status">
          <span
            className={cn(
              "flex items-center gap-1.5 text-body-md font-bold",
              applied ? (urgent ? "text-urgent-ink" : "text-teal-ink") : "text-slate",
            )}
          >
            <Icon name={applied ? "check_circle" : "remove_circle"} fill className="text-[20px]" />
            {doneText}
          </span>
          {canUndo ? (
            <Button variant="soft" size="sm" onClick={onUndo} className="h-[2.125rem]">
              Undo
            </Button>
          ) : null}
          {applied && (card.kind === "steps" || card.kind === "reflection") ? (
            <Button variant="soft" size="sm" onClick={onOpen} className="h-[2.125rem] pr-3 pl-2">
              <Icon name="open_in_new" className="text-[18px]" />
              {card.kind === "steps" ? "Open My Work" : "Open Reflections"}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default ActionCard;
