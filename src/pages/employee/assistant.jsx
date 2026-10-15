import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssistantHeader from "@/components/ai/AssistantHeader.jsx";
import AssistantStage from "@/components/ai/AssistantStage.jsx";
import ChatComposer from "@/components/ai/ChatComposer.jsx";
import ChatThread from "@/components/ai/ChatThread.jsx";
import CircleButton from "@/components/ai/CircleButton.jsx";
import PastChatsMenu from "@/components/ai/PastChatsMenu.jsx";
import QuickActions from "@/components/ai/QuickActions.jsx";
import Icon from "@/components/common/Icon.jsx";
import Segmented from "@/components/common/Segmented.jsx";
import ActionCard from "@/components/employee/assistant/ActionCard.jsx";
import { respond } from "@/components/employee/assistant/respond.js";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { seedChats } from "@/data/assistant.js";
import { DEMO_TODAY } from "@/data/work-day.js";
import { addReflection, removeReflection } from "@/lib/reflections-store.js";
import { useViewMode } from "@/lib/view-mode.js";
import { restoreSteps, setCurrentSteps } from "@/lib/work-day-store.js";

const LENGTHS = [
  { value: "short", label: "Short" },
  { value: "detailed", label: "Detailed" },
];
const REPLY_DELAY = 900;
const NOW_TIME = "11:05";

let messageId = 0;
const newId = () => `m${Date.now()}-${messageId++}`;
const blankChat = () => ({ id: `n${Date.now()}`, title: "New chat", when: "Now", msgs: [] });

/** Save text as a private reflection "From AI Assistant"; returns its id. */
const saveAsReflection = (text, title = "From a chat with the assistant") =>
  addReflection({ date: DEMO_TODAY, time: NOW_TIME, source: "assistant", title, text });

// Employee AI Assistant (design: "AI Assistant.dc.html"). Starters, action
// cards with Proceed / Adjust / Reject, wellbeing notes saved as private
// reflections, past chats and answer length. Replies are mock logic.
function EmployeeAssistant() {
  const navigate = useNavigate();
  const { calm } = useViewMode();
  const composerRef = useRef(null);
  const [chats, setChats] = useState(() => [blankChat(), ...structuredClone(seedChats)]);
  const [activeId, setActiveId] = useState(() => chats[0].id);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [length, setLength] = useState("short");
  const [historyOpen, setHistoryOpen] = useState(false);

  const active = chats.find((c) => c.id === activeId);
  const hasMessages = active.msgs.length > 0 || thinking;

  const updateActive = (fn) => setChats((list) => list.map((c) => (c.id === activeId ? fn(c) : c)));
  const pushMessages = (...msgs) => updateActive((c) => ({ ...c, msgs: [...c.msgs, ...msgs] }));
  const updateMessage = (id, fn) => updateActive((c) => ({ ...c, msgs: c.msgs.map((m) => (m.id === id ? fn(m) : m)) }));
  const updateCard = (id, patch) => updateMessage(id, (m) => ({ ...m, card: { ...m.card, ...patch } }));

  const ask = (raw) => {
    const text = raw.trim();
    if (!text || thinking) return;
    setInput("");
    if (active.title === "New chat") updateActive((c) => ({ ...c, title: text.slice(0, 40) }));

    const reply = respond(text, { length });
    const user = { id: newId(), role: "user", text };
    if (reply.saveNote) user.saved = { on: true, refId: saveAsReflection(text, "Noted in a chat") };

    const bot = { id: newId(), role: "bot", ...reply.bot };
    if (bot.card?.kind === "reflection") bot.card = { ...bot.card, refId: saveAsReflection(bot.card.message, "What happened today") };

    if (reply.instant) {
      pushMessages(user, bot);
      return;
    }
    pushMessages(user);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setChats((list) => list.map((c) => (c.id === activeId ? { ...c, msgs: [...c.msgs, bot] } : c)));
    }, REPLY_DELAY);
  };

  const prefill = (text) => {
    setInput(text);
    requestAnimationFrame(() => {
      const el = composerRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(text.length, text.length);
      }
    });
  };

  const proceed = (message) => {
    const { card } = message;
    if (card.kind === "steps") {
      const undo = setCurrentSteps(
        card.steps.filter((s) => !s.brk).map((s) => ({ t: s.t, dur: parseInt(s.d, 10) || undefined })),
      );
      updateCard(message.id, { status: "applied", adjusting: false, undo });
      return;
    }
    updateCard(message.id, { status: "applied", adjusting: false });
  };

  const undo = (message) => {
    const { card } = message;
    if (card.kind === "reflection") {
      if (card.status === "applied") {
        removeReflection(card.refId);
        updateCard(message.id, { status: "undone" });
      } else {
        updateCard(message.id, { status: "applied", refId: saveAsReflection(card.message, "What happened today") });
      }
      return;
    }
    if (card.kind === "steps" && card.undo) restoreSteps(card.undo);
    updateCard(message.id, { status: "pending", undo: null });
  };

  const toggleSavedNote = (message) => {
    if (message.saved.on) {
      removeReflection(message.saved.refId);
      updateMessage(message.id, (m) => ({ ...m, saved: { on: false } }));
    } else {
      updateMessage(message.id, (m) => ({ ...m, saved: { on: true, refId: saveAsReflection(m.text, "Noted in a chat") } }));
    }
  };

  const newChat = () => {
    setHistoryOpen(false);
    setInput("");
    if (!active.msgs.length) return;
    const chat = blankChat();
    setChats((list) => [chat, ...list]);
    setActiveId(chat.id);
    setThinking(false);
  };

  return (
    <AssistantStage title="What can I help you with today?" active={hasMessages} calm={calm}>
      <AssistantHeader subtitle="Private chat">
        <PastChatsMenu
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          chats={chats
            .filter((c) => c.msgs.length || c.id === activeId)
            .map((c) => ({ id: c.id, title: c.title, when: c.when, current: c.id === activeId }))}
          onSelect={(id) => {
            setActiveId(id);
            setThinking(false);
            setHistoryOpen(false);
          }}
        />
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Answer settings"
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-muted-border bg-surface-container-lowest pr-2.5 pl-3.5 text-body-sm font-extrabold tracking-[0.04em] hover:bg-fill aria-expanded:border-tertiary"
            >
              <span className="size-2 rounded-full bg-secondary" />
              {length === "short" ? "SHORT" : "DETAILED"}
              <Icon name="expand_more" className="text-[20px] text-slate" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" sideOffset={10} className="flex w-[21.25rem] max-w-[calc(100vw-2rem)] flex-col gap-4 rounded-3xl border-divider px-5 py-[1.125rem] shadow-float">
            <span className="text-body-sm font-extrabold tracking-[0.06em] text-slate">HOW IT ANSWERS</span>
            <div className="flex items-center justify-between gap-3">
              <span className="text-body-lg font-bold">Length</span>
              <Segmented value={length} onChange={setLength} options={LENGTHS} label="Answer length" />
            </div>
          </PopoverContent>
        </Popover>
        <CircleButton icon="add" label="New chat" onClick={newChat} />
      </AssistantHeader>

      {hasMessages ? (
        <ChatThread
          messages={active.msgs}
          thinking={thinking}
          renderBelowUser={(message) =>
            message.saved ? (
              <div
                className={`flex items-center gap-2 self-end text-body-sm font-bold ${message.saved.on ? "text-teal-ink" : "text-slate"}`}
                role="status"
              >
                <Icon name={message.saved.on ? "auto_stories" : "undo"} fill className="text-[18px]" />
                {message.saved.on ? "Saved to Reflections, private" : "Not saved"}
                <Button variant="soft" size="xs" onClick={() => toggleSavedNote(message)} className="h-[1.875rem]">
                  {message.saved.on ? "Undo" : "Save again"}
                </Button>
              </div>
            ) : null
          }
          renderCard={(message) => (
            <ActionCard
              card={message.card}
              calm={calm}
              onUpdate={(patch) => updateCard(message.id, patch)}
              onProceed={() => proceed(message)}
              onUndo={() => undo(message)}
              onReplace={(label) => {
                updateCard(message.id, { status: "rejected", replaced: true, adjusting: false });
                ask(label);
              }}
              onOpen={() => navigate(message.card.kind === "steps" ? "/employee/work" : "/employee/journal")}
            />
          )}
        />
      ) : null}

      <ChatComposer ref={composerRef} value={input} onChange={setInput} onSend={ask} busy={thinking} />

      <QuickActions
        calm={calm}
        actions={[
          { icon: "edit_note", label: "Reflect", sub: "What happens today …", tone: "indigo", onClick: () => prefill("What happens today ") },
          { icon: "format_list_numbered", label: "Break down", sub: "My current task", tone: "indigo-soft", onClick: () => ask("Break down my task") },
          { icon: "spa", label: "Get support", sub: "I felt overwhelmed …", tone: "teal", onClick: () => prefill("I felt overwhelmed ") },
          { icon: "mail", label: "Draft", sub: "A message to Priya", tone: "slate", onClick: () => prefill("Draft a message to Priya about ") },
        ]}
      />
    </AssistantStage>
  );
}

export default EmployeeAssistant;
