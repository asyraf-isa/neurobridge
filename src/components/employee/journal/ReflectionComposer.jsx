import { useEffect, useState } from "react";
import DatePicker from "@/components/common/DatePicker.jsx";
import Icon from "@/components/common/Icon.jsx";
import MoodSlider from "@/components/common/MoodSlider.jsx";
import Segmented from "@/components/common/Segmented.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { MANAGER, VOICE_TONE_NOTE, VOICE_TRANSCRIPT } from "@/data/reflections.js";
import { DEMO_TODAY } from "@/data/work-day.js";
import { moodDot, moodLevel } from "@/lib/mood.js";
import { formatClock } from "@/lib/pomodoro-store.js";
import { addReflection, updateReflection } from "@/lib/reflections-store.js";
import { cn } from "@/lib/utils";

const MODES = [
  { value: "write", label: "Write", icon: "edit" },
  { value: "speak", label: "Speak", icon: "mic" },
];

const VISIBILITY = [
  { value: "private", label: "Private", icon: "lock" },
  { value: "shared", label: `Shared with ${MANAGER.first}`, icon: "person" },
];

const ENTRY_TIME = "11:05";

/**
 * New / edit entry (DESIGN.md → Reflections → New entry): title, Write | Speak
 * (equal options), date, a check-in mood, and Private | Shared with Priya —
 * Private by default. Speak records a (simulated) voice note, adds an editable
 * transcript and a "How you sounded" note you can keep or remove.
 */
function ReflectionComposer({ draft: initial, editId, calm, onClose }) {
  const [draft, setDraft] = useState(initial);
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  useEffect(() => {
    if (!recording) return undefined;
    const timer = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [recording]);

  const canSave = draft.text.trim() || draft.clip;
  const mood = draft.v ?? 50;

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      set({
        clip: Math.max(1, recSeconds),
        text: draft.text || VOICE_TRANSCRIPT,
        emotion: VOICE_TONE_NOTE,
        emotionKept: false,
      });
    } else {
      setRecSeconds(0);
      setRecording(true);
    }
  };

  const save = () => {
    if (!canSave) return;
    const base = {
      title: draft.title.trim() || (draft.clip ? "Voice reflection" : "Reflection"),
      text: draft.text.trim(),
      date: draft.date || DEMO_TODAY,
      shared: draft.shared,
      ...(draft.v != null ? { v: draft.v } : {}),
    };
    if (editId) {
      updateReflection(editId, base);
    } else {
      addReflection({
        ...base,
        time: ENTRY_TIME,
        source: draft.clip ? "voice" : "entry",
        voice: draft.clip ? formatClock(draft.clip) : null,
        emotion: draft.emotion && draft.emotionKept ? draft.emotion : null,
      });
    }
    onClose(true);
  };

  return (
    <section aria-labelledby="composer-title" className="flex flex-col gap-[1.125rem] rounded-card border border-divider bg-surface-container-lowest p-7 max-sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="composer-title" className="m-0 text-headline-sm">
          {editId ? "Edit entry" : "New entry"}
        </h2>
        <Segmented
          value={draft.mode}
          onChange={(mode) => set({ mode })}
          options={MODES}
          label="How to reflect"
          itemClassName="h-[2.375rem] pr-4 pl-3 text-body-md font-bold [&_.icon]:text-[20px]"
        />
      </div>

      <Input
        value={draft.title}
        onChange={(event) => set({ title: event.target.value })}
        placeholder="Title"
        aria-label="Title"
        className="h-13 rounded-full border px-[1.125rem] text-[1.1875rem] font-bold"
      />

      {draft.mode === "write" ? (
        <Textarea
          value={draft.text}
          onChange={(event) => set({ text: event.target.value })}
          rows={4}
          placeholder="What happened, and how did it feel?"
          aria-label="Reflection"
          className="min-h-32 resize-y border px-[1.125rem] py-3.5 leading-[1.55]"
        />
      ) : (
        <>
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-tint-indigo-soft px-5 py-[1.625rem]">
            <button
              type="button"
              onClick={toggleRecording}
              aria-label={recording ? "Stop recording" : "Start recording"}
              className={cn(
                "grid size-19 cursor-pointer place-items-center rounded-full text-on-primary transition-colors duration-200",
                recording ? "bg-primary" : "bg-ink hover:bg-primary-hover",
              )}
            >
              <Icon name={recording ? "stop" : "mic"} fill className="text-[36px]" />
            </button>
            <span className="text-body-lg font-bold tabular-nums" aria-live="polite">
              {recording
                ? `Recording ${formatClock(recSeconds)}`
                : draft.clip
                  ? `Voice note · ${formatClock(draft.clip)} · tap to record again`
                  : "Tap to start"}
            </span>
            <span className="text-center text-body-sm text-slate">
              Speak as long as you like. A transcript is added so you can edit it.
            </span>
          </div>

          {draft.clip && !recording ? (
            <>
              <Textarea
                value={draft.text}
                onChange={(event) => set({ text: event.target.value })}
                rows={3}
                aria-label="Transcript"
                className="resize-y border px-[1.125rem] py-3.5 leading-[1.55]"
              />
              {draft.emotion ? (
                <div className="flex flex-wrap items-start gap-3 rounded-[1.25rem] bg-fill-soft p-4">
                  <Icon name="graphic_eq" fill className="text-[22px] text-primary" />
                  <div className="flex flex-[1_1_15rem] flex-col gap-1">
                    <span className="text-body-sm font-extrabold tracking-[0.06em] text-slate">HOW YOU SOUNDED</span>
                    <span className="text-body-lg">{draft.emotion}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      variant={draft.emotionKept ? "dark" : "ghost"}
                      size="sm"
                      aria-pressed={draft.emotionKept}
                      onClick={() => set({ emotionKept: true })}
                      className={cn("h-[2.375rem]", !draft.emotionKept && "bg-surface-container-lowest")}
                    >
                      {draft.emotionKept ? "Kept" : "Keep"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => set({ emotion: null, emotionKept: false })}
                      className="h-[2.375rem] bg-surface-container-lowest"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </>
      )}

      <div className="flex flex-wrap gap-x-7 gap-y-[1.125rem]">
        <div className="flex flex-col gap-2">
          <span className="text-body-sm font-extrabold tracking-[0.06em] text-slate">
            DATE
          </span>
          <DatePicker
            value={draft.date}
            onChange={(date) => set({ date })}
            ariaLabel="Date"
            className="w-48"
          />
        </div>
        <div className="flex flex-[1_1_22.5rem] flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-body-sm font-extrabold tracking-[0.06em] text-slate">CHECK-IN</span>
            <span className={cn("flex items-center gap-2 text-body-lg font-extrabold", draft.v != null ? "text-ink" : "text-slate-soft")}>
              <span
                className={cn("size-5 rounded-full transition-[background] duration-200", draft.v == null && "bg-divider")}
                style={draft.v != null ? { background: moodDot(draft.v, calm) } : undefined}
              />
              {draft.v != null ? moodLevel(draft.v) : "Not set"}
            </span>
          </div>
          <MoodSlider value={mood} onChange={(v) => set({ v })} valueText={draft.v != null ? moodLevel(draft.v) : "Not set"} />
        </div>
      </div>

      <Separator />

      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={draft.shared ? "shared" : "private"}
          onChange={(value) => set({ shared: value === "shared" })}
          options={VISIBILITY}
          label="Visibility"
          itemClassName="h-[2.375rem] pr-3.5 pl-2.5 text-body-md font-bold [&_.icon]:text-[18px] [&_.icon]:[font-variation-settings:'FILL'_1]"
        />
        <div className="ml-auto flex gap-2">
          <Button variant="soft" size="lg" onClick={() => onClose(false)} className="px-[1.125rem]">
            Cancel
          </Button>
          <Button variant="dark" size="lg" onClick={save} disabled={!canSave} className="pr-[1.375rem] pl-4">
            <Icon name="auto_stories" className="text-[20px]" />
            Save entry
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ReflectionComposer;
