import { useState } from "react";
import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import { MANAGER, SELF, SOURCE_LABELS } from "@/data/reflections.js";
import { moodDot, moodLevel } from "@/lib/mood.js";
import { replyToReflection, toggleReflectionShare } from "@/lib/reflections-store.js";
import { cn } from "@/lib/utils";

const SOURCE_ICONS = { assistant: "auto_awesome", voice: "graphic_eq", entry: "edit_note", checkin: "edit_note" };

/**
 * One reflection (DESIGN.md → Reflections → Entry card): mood dot (or source
 * tile), title, time · source · level, text, the Private / Shared pill (tap to
 * change), assistant/voice notes, tags, and — when shared — the reply thread
 * with the manager. Managers can reply but not edit.
 */
function ReflectionCard({ entry, calm, onEdit }) {
  const [reply, setReply] = useState("");
  const hasMood = entry.v != null;
  const tags = [
    ...(entry.moods || []).map((label) => ({ label, icon: "mood" })),
    ...(entry.ctx || []).map((label) => ({ label, icon: "link" })),
  ];

  const sendReply = () => {
    const text = reply.trim();
    if (!text) return;
    replyToReflection(entry.id, { who: SELF.name, initials: SELF.initials, time: "Just now", text });
    setReply("");
  };

  return (
    <article className="flex flex-col gap-3.5 rounded-card-sm border border-divider-soft bg-surface-container-lowest p-5 shadow-card">
      <div className="flex gap-3.5">
        {hasMood ? (
          <span className="size-11 shrink-0 rounded-full" style={{ background: moodDot(entry.v, calm) }} aria-hidden="true" />
        ) : (
          <span className="grid size-11 shrink-0 place-items-center rounded-[0.875rem] bg-fill" aria-hidden="true">
            <Icon name={SOURCE_ICONS[entry.source] || "edit_note"} className="text-[24px] text-slate" />
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h3 className="m-0 text-[1.1875rem] font-extrabold">{entry.title}</h3>
            <span className="text-body-sm font-bold text-slate tabular-nums">
              {entry.time} · {SOURCE_LABELS[entry.source]}
              {hasMood ? ` · ${moodLevel(entry.v)}` : ""}
            </span>
            {entry.unread && entry.shared ? (
              <span className="rounded-full bg-primary px-2.5 py-1 text-label-sm font-extrabold tracking-[0.05em] text-on-primary">
                NEW REPLY
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => toggleReflectionShare(entry.id)}
              aria-label={entry.shared ? `Shared with ${MANAGER.first}. Make private` : `Private. Share with ${MANAGER.first}`}
              className={cn(
                "ml-auto flex h-[2.125rem] cursor-pointer items-center gap-1 rounded-full pr-3 pl-2 text-[0.875rem] font-extrabold tracking-[0.04em] transition-colors",
                entry.shared ? "bg-tint-indigo text-primary hover:bg-tint-indigo-border" : "bg-fill text-slate hover:bg-divider",
              )}
            >
              <Icon name={entry.shared ? "person" : "lock"} fill className="text-[16px]" />
              {entry.shared ? `SHARED WITH ${MANAGER.first.toUpperCase()}` : "PRIVATE"}
            </button>
          </div>
          <p className="m-0 text-body-lg">{entry.text}</p>
        </div>
      </div>

      {entry.source === "assistant" ? (
        <div className="flex flex-wrap items-center gap-2.5 rounded-2xl bg-fill-soft px-3 py-2.5">
          <Icon name="auto_awesome" fill className="text-[20px] text-primary" />
          <span className="flex-[1_1_12.5rem] text-body-md text-ink-soft">Saved from your chat with the assistant.</span>
          <Button variant="soft" size="sm" onClick={onEdit} className="h-[2.125rem] pr-3 pl-2">
            <Icon name="edit" className="text-[18px]" />
            Edit
          </Button>
        </div>
      ) : null}

      {entry.emotion ? (
        <div className="flex gap-2.5 rounded-2xl bg-fill-soft px-3.5 py-3">
          <Icon name="graphic_eq" className="text-[20px] text-primary" />
          <span className="flex-1 text-body-md leading-[1.45] text-ink-soft">{entry.emotion}</span>
        </div>
      ) : null}

      {entry.voice || tags.length ? (
        <div className="flex flex-wrap gap-1.5">
          {entry.voice ? (
            <span className="flex h-[2.125rem] items-center gap-1.5 rounded-full bg-fill pr-3 pl-2 text-body-sm font-bold">
              <Icon name="play_circle" fill className="text-[18px] text-primary" />
              Voice · {entry.voice}
            </span>
          ) : null}
          {tags.map((tag) => (
            <span key={`${tag.icon}-${tag.label}`} className="flex h-[2.125rem] items-center gap-1 rounded-full bg-fill pr-3 pl-2.5 text-body-sm font-bold">
              <Icon name={tag.icon} className="text-[16px] text-slate" />
              {tag.label}
            </span>
          ))}
        </div>
      ) : null}

      {entry.shared ? (
        <div className="flex flex-col gap-2.5 rounded-[1.25rem] bg-fill-soft p-3.5">
          {entry.thread.map((message, i) => (
            <div key={i} className="flex gap-2.5">
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full text-label-sm font-extrabold",
                  message.who === SELF.name ? "bg-fill text-ink" : "bg-tint-indigo text-primary",
                )}
              >
                {message.initials}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-body-sm font-extrabold">
                  {message.who} <span className="font-semibold text-slate">· {message.time}</span>
                </span>
                <span className="text-body-lg leading-[1.45]">{message.text}</span>
              </div>
            </div>
          ))}
          {!entry.thread.length ? (
            <span className="text-body-md text-slate">Shared with {MANAGER.first}. No replies yet.</span>
          ) : null}
          <form
            className="flex items-center gap-2 rounded-full border border-divider bg-surface-container-lowest py-1 pr-1 pl-3.5 focus-within:border-tertiary"
            onSubmit={(event) => {
              event.preventDefault();
              sendReply();
            }}
          >
            <input
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder="Reply"
              aria-label={`Reply to ${MANAGER.first}`}
              className="h-9 min-w-0 flex-1 bg-transparent text-body-md font-normal outline-none placeholder:text-slate"
            />
            <Button type="submit" variant="dark" size="icon" aria-label="Send reply" disabled={!reply.trim()} className="size-9">
              <Icon name="arrow_upward" className="text-[20px]" />
            </Button>
          </form>
        </div>
      ) : null}
    </article>
  );
}

export default ReflectionCard;
