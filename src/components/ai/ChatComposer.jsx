import { forwardRef, useState } from "react";
import Icon from "@/components/common/Icon.jsx";
import { cn } from "@/lib/utils";

/**
 * The pill message box: search glyph, auto-growing textarea ("Type in your own
 * words"), a mic toggle (dictation is simulated) and the dark send button.
 * Enter sends; Shift+Enter adds a line.
 */
const ChatComposer = forwardRef(function ChatComposer({ value, onChange, onSend, busy }, ref) {
  const [listening, setListening] = useState(false);
  const canSend = value.trim() && !busy;

  return (
    <div
      className={cn(
        "relative z-10 flex min-h-17 items-center gap-2.5 rounded-full border-[1.5px] bg-surface-container-lowest py-2 pr-2.5 pl-[1.375rem] transition-[border-color,box-shadow] duration-300 focus-within:ring-4 focus-within:ring-tint-indigo max-sm:pl-4",
        busy ? "border-tertiary-soft" : "border-muted-border focus-within:border-tertiary",
      )}
    >
      <Icon name="search" className="text-[26px] text-slate max-sm:hidden" />
      <textarea
        ref={ref}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (canSend) onSend(value);
          }
        }}
        rows={1}
        placeholder="Type in your own words"
        aria-label="Message"
        className="field-sizing-content max-h-35 min-h-12 min-w-0 flex-1 resize-none bg-transparent py-3 text-[1.1875rem] leading-[1.45] font-medium outline-none placeholder:text-slate"
      />
      <button
        type="button"
        onClick={() => setListening((on) => !on)}
        aria-label={listening ? "Stop dictation" : "Speak"}
        aria-pressed={listening}
        className={cn(
          "grid size-[2.875rem] shrink-0 cursor-pointer place-items-center rounded-full border-[1.5px] transition-colors",
          listening ? "border-primary bg-primary text-on-primary" : "border-muted-border bg-surface-container-lowest text-primary hover:bg-fill",
        )}
      >
        <Icon name={listening ? "stop" : "mic"} fill className="text-[22px]" />
      </button>
      <button
        type="button"
        onClick={() => canSend && onSend(value)}
        aria-label="Send"
        aria-disabled={!canSend}
        className={cn(
          "grid size-[2.875rem] shrink-0 cursor-pointer place-items-center rounded-full bg-ink text-on-primary transition-[background-color,opacity] hover:bg-primary-hover",
          !canSend && "opacity-40",
        )}
      >
        <Icon name="arrow_forward" className="text-[24px]" />
      </button>
    </div>
  );
});

export default ChatComposer;
