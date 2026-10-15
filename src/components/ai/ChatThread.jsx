import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import AssistantAvatar from "./AssistantAvatar.jsx";

/**
 * The conversation: user messages as light-indigo bubbles on the right, the
 * assistant's replies as plain text beside its avatar (with optional
 * `renderBelowUser` / `renderCard` slots), and a "Thinking" indicator.
 * Scrolls to the newest message. `fill` lets it grow to the available height.
 */
function ChatThread({ messages, thinking, renderCard, renderBelowUser, fill = false }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const toBottom = () => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    const frame = requestAnimationFrame(toBottom);
    return () => cancelAnimationFrame(frame);
  }, [messages, thinking]);

  return (
    <div
      ref={scrollRef}
      aria-live="polite"
      className={cn(
        "relative z-10 -mx-2 flex animate-msg-in flex-col gap-[1.375rem] overflow-y-auto overscroll-contain px-2 py-1.5",
        fill ? "min-h-30 flex-1 basis-0" : "max-h-[calc(100dvh-29.375rem)] min-h-65",
      )}
    >
      {messages.map((message) => (
        <div key={message.id} className="flex animate-msg-in flex-col gap-2">
          {message.role === "user" ? (
            <>
              <div className="max-w-[78%] self-end rounded-[1.375rem_1.375rem_0.375rem_1.375rem] bg-tint-indigo px-[1.125rem] py-3.5 text-body-lg whitespace-pre-wrap">
                {message.text}
              </div>
              {renderBelowUser?.(message)}
            </>
          ) : (
            <div className="flex max-w-[92%] gap-3">
              <AssistantAvatar />
              <div className="flex min-w-0 flex-1 flex-col gap-3 pt-[0.3125rem]">
                {message.text ? <p className="m-0 text-body-lg leading-[1.55] whitespace-pre-wrap">{message.text}</p> : null}
                {message.card ? renderCard?.(message) : null}
              </div>
            </div>
          )}
        </div>
      ))}

      {thinking ? (
        <div className="flex animate-msg-in items-center gap-3">
          <AssistantAvatar />
          <span className="flex items-center gap-1.5 text-body-lg text-slate">
            Thinking
            <span className="flex gap-1" aria-hidden="true">
              <span className="size-1.5 animate-thinking rounded-full bg-tertiary" />
              <span className="size-1.5 animate-thinking rounded-full bg-tertiary [animation-delay:.15s]" />
              <span className="size-1.5 animate-thinking rounded-full bg-tertiary [animation-delay:.3s]" />
            </span>
          </span>
        </div>
      ) : null}
    </div>
  );
}

export default ChatThread;
