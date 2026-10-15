import { useState } from "react";
import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import { STRENGTH_NOTES } from "@/data/support-profile.js";

/** "From people you work with" — encouragement notes with prev/next and Say thanks. */
function StrengthNotes() {
  const [index, setIndex] = useState(0);
  const [thanked, setThanked] = useState({});
  const note = STRENGTH_NOTES[index];
  const step = (by) => setIndex((i) => (i + STRENGTH_NOTES.length + by) % STRENGTH_NOTES.length);

  return (
    <div className="mt-0.5 mb-3.5 flex flex-col gap-3 rounded-3xl bg-tint-teal px-[1.375rem] py-5 transition-colors duration-300">
      <div className="flex items-center justify-between gap-3">
        <span className="text-body-sm font-extrabold tracking-[0.06em] text-teal-ink">FROM PEOPLE YOU WORK WITH</span>
        <div className="flex gap-1.5">
          <Button variant="ghost" size="icon-sm" aria-label="Previous note" onClick={() => step(-1)} className="bg-surface-container-lowest hover:bg-fill">
            <Icon name="chevron_left" className="text-[20px]" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Next note" onClick={() => step(1)} className="bg-surface-container-lowest hover:bg-fill">
            <Icon name="chevron_right" className="text-[20px]" />
          </Button>
        </div>
      </div>
      <p className="m-0 text-[1.1875rem] leading-[1.45] font-bold" aria-live="polite">
        “{note.text}”
      </p>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="flex-[1_1_10rem] text-body-md text-ink-soft">
          {note.from} · {note.meta}
        </span>
        <Button
          variant="ghost"
          size="sm"
          aria-pressed={!!thanked[index]}
          onClick={() => setThanked((t) => ({ ...t, [index]: !t[index] }))}
          className="h-[2.375rem] bg-surface-container-lowest pr-3.5 pl-2.5 text-body-md hover:bg-fill"
        >
          <Icon name="favorite" fill={!!thanked[index]} className="text-[19px] text-secondary" />
          {thanked[index] ? "Thanks sent" : "Say thanks"}
        </Button>
      </div>
    </div>
  );
}

export default StrengthNotes;
