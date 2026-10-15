import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AssistantHeader from "@/components/ai/AssistantHeader.jsx";
import AssistantStage from "@/components/ai/AssistantStage.jsx";
import ChatComposer from "@/components/ai/ChatComposer.jsx";
import ChatThread from "@/components/ai/ChatThread.jsx";
import CircleButton from "@/components/ai/CircleButton.jsx";
import PastChatsMenu from "@/components/ai/PastChatsMenu.jsx";
import QuickActions from "@/components/ai/QuickActions.jsx";
import Icon from "@/components/common/Icon.jsx";
import { respondForEmployer } from "@/components/employer/assistant/respond.js";
import { AVATAR_TILES, firstName } from "@/components/employer/team-styles.js";
import { archiveChat, removePastChat, useTeam } from "@/lib/team-store.js";
import { cn } from "@/lib/utils";

const REPLY_DELAY = 900;
let messageId = 0;
const newId = () => `e${Date.now()}-${messageId++}`;

// Employer AI Assistant (design: Employer Portal → ai). Pick "General" or a
// person; answers use only what that person chose to share. Mock replies.
function EmployerAssistant() {
  const [params] = useSearchParams();
  const { people, past } = useTeam();
  const composerRef = useRef(null);
  const [pid, setPid] = useState(() => (people.some((p) => p.id === params.get("person")) ? params.get("person") : "maya"));
  const [chats, setChats] = useState({}); // pid → messages
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const person = pid === "general" ? null : people.find((p) => p.id === pid);
  const who = person ? firstName(person.name) : "your team";
  const messages = chats[pid] || [];
  const active = messages.length > 0 || thinking;

  const archiveCurrent = () => {
    if (messages.length) archiveChat({ pid, title: messages[0].text.slice(0, 44), when: "Today", msgs: messages });
  };

  const ask = (raw) => {
    const text = raw.trim();
    if (!text || thinking) return;
    const target = pid;
    const userMessage = { id: newId(), role: "user", text };
    setInput("");
    setChats((c) => ({ ...c, [target]: [...(c[target] || []), userMessage] }));
    setThinking(true);
    setTimeout(() => {
      const reply = { id: newId(), role: "bot", text: respondForEmployer(text, person) };
      setChats((c) => ({ ...c, [target]: [...(c[target] || []), reply] }));
      setThinking(false);
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

  // General + the first two people, plus whoever is selected.
  const pickers = [
    { id: "general", label: "General" },
    ...people.filter((p, i) => i < 2 || p.id === pid).map((p) => ({ id: p.id, label: firstName(p.name), person: p })),
  ];

  return (
    <AssistantStage title={`How can I help you support ${who} today?`} active={active}>
      <AssistantHeader subtitle={`Works only from what ${person ? who : "your team"} chose to share`}>
        {pickers.map((pick) => {
          const on = pick.id === pid;
          return (
            <button
              key={pick.id}
              type="button"
              aria-pressed={on}
              aria-label={`Support ${pick.label}`}
              onClick={() => setPid(pick.id)}
              className={cn(
                "flex h-10 cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] pr-3 pl-[0.3125rem] text-body-sm font-bold transition-colors",
                on ? "border-ink bg-ink text-on-primary" : "border-divider bg-surface-container-lowest hover:bg-fill",
              )}
            >
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full text-label-sm font-extrabold text-ink",
                  pick.person ? AVATAR_TILES[pick.person.tile] : "bg-tint-indigo-soft",
                )}
              >
                {pick.person ? pick.person.initials : <Icon name="groups" className="text-[17px] text-primary" />}
              </span>
              {pick.label}
            </button>
          );
        })}
        <PastChatsMenu
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          chats={past.map((c) => ({
            id: c.id,
            title: c.title,
            when: c.when,
            who: c.pid === "general" ? "General" : firstName(people.find((p) => p.id === c.pid).name),
          }))}
          onSelect={(id) => {
            const chat = past.find((c) => c.id === id);
            archiveCurrent();
            removePastChat(id);
            setPid(chat.pid);
            setChats((c) => ({ ...c, [chat.pid]: chat.msgs }));
            setThinking(false);
            setHistoryOpen(false);
          }}
        />
        <CircleButton
          icon="add"
          label="New chat"
          onClick={() => {
            archiveCurrent();
            setChats((c) => ({ ...c, [pid]: [] }));
            setInput("");
            setThinking(false);
          }}
        />
      </AssistantHeader>

      {active ? <ChatThread messages={messages} thinking={thinking} /> : null}

      <ChatComposer ref={composerRef} value={input} onChange={setInput} onSend={ask} busy={thinking} />

      <QuickActions
        actions={[
          { icon: "chat", label: "Start a check-in", sub: `How to open with ${who}`, tone: "indigo", onClick: () => ask(`How should I start a check-in with ${who}?`) },
          { icon: "block", label: "What to avoid", sub: "Do and do not", tone: "indigo-soft", onClick: () => ask(`What should I avoid saying to ${who}?`) },
          { icon: "event_repeat", label: "Change of plan", sub: "Share it clearly", tone: "teal", onClick: () => ask(`How do I share a change of plan with ${who}?`) },
          { icon: "mail", label: "Draft", sub: `A message to ${who}`, tone: "slate", onClick: () => prefill(`Draft a short message to ${who} about `) },
        ]}
      />
    </AssistantStage>
  );
}

export default EmployerAssistant;
