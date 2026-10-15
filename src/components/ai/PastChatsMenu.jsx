import Icon from "@/components/common/Icon.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import CircleButton from "./CircleButton.jsx";

/** "Past chats" popover. `chats`: [{ id, title, when, who?, current? }]. */
function PastChatsMenu({ chats, onSelect, open, onOpenChange }) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <CircleButton icon="history" label="Past chats" />
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={10} className="flex w-[21.25rem] max-w-[calc(100vw-2rem)] flex-col gap-1.5 rounded-3xl border-divider px-2.5 pt-3.5 pb-2.5 shadow-float">
        <span className="px-2.5 text-body-sm font-extrabold tracking-[0.06em] text-slate">PAST CHATS</span>
        <div className="flex flex-col gap-0.5">
          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              aria-current={chat.current ? "true" : undefined}
              onClick={() => onSelect(chat.id)}
              className={cn(
                "flex min-h-[2.875rem] cursor-pointer items-center gap-2.5 rounded-[0.875rem] px-3 py-2 text-left transition-colors hover:bg-fill",
                chat.current && "bg-tint-indigo hover:bg-tint-indigo",
              )}
            >
              <Icon name="chat_bubble" className="text-[20px] text-slate" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className={cn("truncate text-body-lg", chat.current ? "font-extrabold" : "font-semibold")}>{chat.title}</span>
                {chat.who ? <span className="text-[0.875rem] font-bold text-slate">{chat.who}</span> : null}
              </span>
              <span className="shrink-0 text-body-sm text-slate">{chat.when}</span>
            </button>
          ))}
          {!chats.length ? <span className="px-3 py-2.5 text-body-md text-slate">No past chats yet.</span> : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default PastChatsMenu;
