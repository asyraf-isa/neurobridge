import { useEffect, useState } from "react";
import Icon from "@/components/common/Icon.jsx";
import MoodSlider from "@/components/common/MoodSlider.jsx";
import Segmented from "@/components/common/Segmented.jsx";
import { Button } from "@/components/ui/button";
import { DEMO_TODAY } from "@/data/work-day.js";
import { calmed, moodLch, moodLevel, moodScore, moodShapeColors, oklch, scoreToMood } from "@/lib/mood.js";
import { formatClock } from "@/lib/pomodoro-store.js";
import { addReflection, removeReflection } from "@/lib/reflections-store.js";
import { cn } from "@/lib/utils";
import { setQuietShield } from "@/lib/view-mode.js";
import MoodShape from "./MoodShape.jsx";

const MODES = [
  { value: "scale", label: "Scale" },
  { value: "number", label: "1–10" },
];

const CHECK_IN_TIME = "11:02";

/**
 * Quick check-in (DESIGN.md → Dashboard): the mood shape, a Scale | 1–10
 * input, "I'm not sure", a note with a voice recorder, then Check in or Save
 * as reflection (private). A low mood offers Quiet Shield.
 * `onCheckIn(value | null)` feeds today's dot in the history card.
 */
function QuickCheckIn({ calm, quiet, onCheckIn }) {
  const [value, setValue] = useState(50);
  const [touched, setTouched] = useState(false);
  const [unsure, setUnsure] = useState(false);
  const [mode, setMode] = useState("scale");
  const [note, setNote] = useState("");
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [clip, setClip] = useState(0);
  const [saved, setSaved] = useState(null); // { kind: "checkin" | "reflection", id? }

  useEffect(() => {
    if (!recording) return undefined;
    const timer = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [recording]);

  const pick = (next) => {
    setValue(next);
    setTouched(true);
    setUnsure(false);
    setSaved(null);
  };

  const colors = moodShapeColors(value, { calm, touched, unsure });
  const label = unsure ? "Not sure" : touched ? moodLevel(value) : "Neutral";
  const score = moodScore(value);
  const canCheckIn = touched || unsure;
  const canSave = canCheckIn || note.trim() || clip;
  const offerQuiet = touched && !unsure && value < 36 && !quiet;

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      setClip(Math.max(1, recSeconds));
      setSaved(null);
    } else {
      setRecSeconds(0);
      setRecording(true);
    }
  };

  const checkIn = () => {
    if (!canCheckIn) return;
    setRecording(false);
    setSaved({ kind: "checkin" });
    onCheckIn(unsure ? null : value);
  };

  const saveReflection = () => {
    if (!canSave) return;
    setRecording(false);
    const id = addReflection({
      date: DEMO_TODAY,
      time: CHECK_IN_TIME,
      source: "checkin",
      title: "Quick check-in",
      text: note.trim() || (unsure ? "Not sure how I'm feeling." : `Feeling ${label.toLowerCase()}.`),
      ...(touched && !unsure ? { v: value } : {}),
      ...(clip ? { voice: formatClock(clip) } : {}),
    });
    setSaved({ kind: "reflection", id });
  };

  const undo = () => {
    if (saved?.kind === "checkin") onCheckIn(undefined);
    if (saved?.kind === "reflection") removeReflection(saved.id);
    setSaved(null);
  };

  return (
    <section
      aria-labelledby="check-in-title"
      className="flex min-w-0 flex-col gap-5 rounded-card border border-fill p-7 transition-[background] duration-300 max-sm:p-5"
      style={{ background: `radial-gradient(120% 100% at 50% 0%, ${colors.tint} 0%, var(--color-surface-container-lowest) 100%)` }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 id="check-in-title" className="m-0 text-headline-sm">
            Quick check-in
          </h2>
          <span className="flex items-center gap-1 rounded-full bg-fill py-1 pr-2.5 pl-2 text-[0.875rem] font-extrabold tracking-[0.05em] text-slate">
            <Icon name="lock" fill className="text-[14px]" />
            PRIVATE
            <span className="sr-only">: only you can see this</span>
          </span>
        </div>
        <Segmented value={mode} onChange={setMode} options={MODES} label="Input" />
      </div>

      <div className="flex flex-wrap items-center gap-7">
        <MoodShape value={value} touched={touched} unsure={unsure} calm={calm} label={label} />

        <div className="flex min-w-0 flex-[1_1_17.5rem] flex-col gap-[1.125rem]">
          <div className="flex flex-col gap-1">
            <span className="text-body-lg font-normal text-ink-soft">How are you arriving today?</span>
            <div className="flex items-baseline gap-2.5" aria-live="polite">
              <span className={cn("text-[1.875rem] font-extrabold tracking-[-0.02em]", canCheckIn ? "text-ink" : "text-slate-soft")}>
                {label}
              </span>
              {mode === "number" && touched && !unsure ? (
                <span className="text-[1.125rem] font-extrabold text-slate tabular-nums">{score}/10</span>
              ) : null}
            </div>
          </div>

          {mode === "scale" ? (
            <MoodSlider value={value} onChange={pick} valueText={label} />
          ) : (
            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-10 gap-1.5" role="radiogroup" aria-label="Mood, 1 to 10">
                {Array.from({ length: 10 }, (_, i) => {
                  const c = calmed(moodLch((i / 9) * 100), calm);
                  const selected = touched && !unsure && score === i + 1;
                  return (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={`${i + 1} out of 10`}
                      onClick={() => pick(scoreToMood(i + 1))}
                      className={cn(
                        "h-11 cursor-pointer rounded-[0.875rem] border-2 p-0 text-body-lg font-extrabold",
                        selected ? "border-ink" : "border-transparent",
                      )}
                      style={{ background: selected ? oklch(c) : oklch([0.95, c[1] * 0.35, c[2]]) }}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-label-sm font-extrabold tracking-[0.08em] text-slate">
                <span>VERY UNPLEASANT</span>
                <span>VERY PLEASANT</span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={unsure}
              onClick={() => {
                setUnsure((u) => !u);
                setSaved(null);
              }}
              className={cn(
                "flex h-10 cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] pr-3.5 pl-2.5 text-body-md font-bold transition-colors",
                unsure ? "border-ink bg-fill" : "border-divider bg-surface-container-lowest hover:bg-fill",
              )}
            >
              <Icon name="help" className="text-[20px] text-slate" />
              I&apos;m not sure
            </button>
            {offerQuiet ? (
              <button
                type="button"
                onClick={() => setQuietShield(true)}
                className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-tint-teal pr-3.5 pl-2.5 text-body-md font-bold text-teal-ink transition-colors hover:bg-secondary-fixed-dim"
              >
                <Icon name="shield" fill className="text-[20px]" />
                Turn on Quiet Shield
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-end gap-2 rounded-3xl border border-muted-border bg-surface-container-lowest py-1.5 pr-1.5 pl-4 focus-within:border-tertiary focus-within:ring-4 focus-within:ring-tint-indigo">
              <textarea
                value={note}
                onChange={(event) => {
                  setNote(event.target.value);
                  setSaved(null);
                }}
                rows={1}
                placeholder="Add a note"
                aria-label="Note"
                className="field-sizing-content min-h-9 min-w-0 flex-1 resize-none bg-transparent py-2 text-body-lg leading-[1.4] font-normal outline-none placeholder:text-slate"
              />
              <button
                type="button"
                onClick={toggleRecording}
                aria-label={recording ? "Stop recording" : "Record a voice note"}
                className={cn(
                  "grid size-10 shrink-0 cursor-pointer place-items-center rounded-full transition-colors",
                  recording ? "bg-primary text-on-primary" : "bg-tint-indigo-soft text-primary hover:bg-tint-indigo",
                )}
              >
                <Icon name={recording ? "stop" : "mic"} fill className="text-[22px]" />
              </button>
            </div>
            {recording ? (
              <span className="flex items-center gap-2 pl-1.5 text-body-sm font-bold text-primary tabular-nums" aria-live="polite">
                <span className="size-2 rounded-full bg-primary" />
                Recording {formatClock(recSeconds)}
              </span>
            ) : null}
            {!recording && clip > 0 ? (
              <div className="flex h-9 items-center gap-2 self-start rounded-full bg-tint-indigo-soft pr-1.5 pl-3 text-body-sm font-bold">
                <Icon name="graphic_eq" className="text-[18px] text-primary" />
                Voice note · {formatClock(clip)}
                <button
                  type="button"
                  onClick={() => setClip(0)}
                  aria-label="Remove voice note"
                  className="grid size-[1.625rem] cursor-pointer place-items-center rounded-full text-slate hover:bg-on-primary"
                >
                  <Icon name="close" className="text-[18px]" />
                </button>
              </div>
            ) : null}
          </div>

          {saved ? (
            <div className="flex flex-wrap items-center gap-3" aria-live="polite">
              <span className="flex items-center gap-1.5 text-body-lg font-bold text-teal-ink">
                <Icon name={saved.kind === "checkin" ? "how_to_reg" : "check_circle"} fill className="text-[22px]" />
                {saved.kind === "checkin"
                  ? `Check-in recorded · today, ${CHECK_IN_TIME}${unsure ? " · not sure" : ` · ${score} out of 10`}`
                  : "Saved to Reflections, private"}
              </span>
              <Button variant="soft" size="sm" onClick={undo}>
                Undo
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              <Button size="lg" onClick={checkIn} disabled={!canCheckIn} className="pr-[1.375rem] pl-4">
                <Icon name="how_to_reg" className="text-[20px]" />
                Check in
              </Button>
              <Button variant="dark" size="lg" onClick={saveReflection} disabled={!canSave} className="pr-[1.375rem] pl-4">
                <Icon name="auto_stories" className="text-[20px]" />
                Save as reflection
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default QuickCheckIn;
