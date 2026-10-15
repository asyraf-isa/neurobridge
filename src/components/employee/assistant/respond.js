import { BIG_STEPS, NOTIFY_MESSAGES, SMALL_STEPS, WELLBEING_PATTERN } from "@/data/assistant.js";

const stepsCard = (steps) => ({ kind: "steps", steps, status: "pending" });

/**
 * The assistant's reply to one message — mock rules, no model.
 * Returns `{ bot: { text, card? }, saveNote?: boolean, instant?: boolean }`.
 * `saveNote` = the user's message is a wellbeing note, saved as a private
 * reflection. `instant` replies skip the "Thinking" pause.
 */
export function respond(text, { length = "short" } = {}) {
  const low = text.toLowerCase();

  if (low.startsWith("what happens today")) {
    const note = text.slice(18).replace(/^[\s.,:…-]+/, "") || text;
    return {
      instant: true,
      bot: {
        text: "I saved this as a private reflection. You can edit it or share it from Reflections.",
        card: { kind: "reflection", message: note, status: "applied" },
      },
    };
  }
  if (/smaller steps/.test(low)) {
    return { instant: true, bot: { text: "Here are smaller steps. Remove any you do not need.", card: stepsCard(SMALL_STEPS) } };
  }
  if (/no breaks?/.test(low)) {
    return { instant: true, bot: { text: "Here it is without the break.", card: stepsCard(BIG_STEPS.filter((s) => !s.brk)) } };
  }
  if (/by monday/.test(low)) {
    return { instant: true, bot: { text: "Due Monday. Here are the same steps.", card: stepsCard(BIG_STEPS) } };
  }
  if (/break (it |this |my task )?down|break down/.test(low)) {
    return { instant: true, bot: { text: "Here is your current task in a few big steps, sized to your profile.", card: stepsCard(BIG_STEPS) } };
  }
  if (/overwhelm/.test(low)) {
    return {
      instant: true,
      saveNote: true,
      bot: {
        text:
          "That sounds like a lot. You do not need to sort it all out now. You could take a 5-minute break, or turn on Quiet Shield for the next hour.\n\nIf you would like support, I can let your employer know. You choose the level and see the message first.",
        card: { kind: "notify", level: "prompt", message: NOTIFY_MESSAGES.prompt, status: "pending" },
      },
    };
  }

  const saveNote = WELLBEING_PATTERN.test(text);
  const detailed = length === "detailed";

  if (/^draft|message to priya/.test(low)) {
    const topic = text.replace(/^draft (a )?(short )?message to priya( about)?/i, "").trim() || "my workload this week";
    return {
      saveNote,
      bot: {
        text: "Here is a short draft. Edit it before you send.",
        card: {
          kind: "draft",
          status: "pending",
          message: `Hi Priya,\n\nCould we talk briefly about ${topic.replace(/[.?!]+$/, "")}? Written is best for me. Any time before 15:00 works.\n\nThanks,\nMaya`,
        },
      },
    };
  }
  if (/deadline|first|priorit|friday/.test(low)) {
    return {
      saveNote,
      bot: {
        text: detailed
          ? "Start with the client reply. It is the shortest and someone is waiting for it. Then the Q4 summary, in the morning when you focus best. The onboarding brief can move to Monday if you ask Priya. Your 1:1 on Thursday at 9:30 is a good time to agree this."
          : "Start with the client reply. Then the Q4 summary. The onboarding brief can move to Monday if you ask Priya.",
      },
    };
  }
  if (/1:1|one to one|meeting|stand-?up/.test(low)) {
    return {
      saveNote,
      bot: {
        text: "Your 1:1 with Priya is on Thursday at 9:30. You could bring three things:\n- What went well this week\n- One thing taking longer than planned\n- One question about next week",
      },
    };
  }
  if (/next|today|now|what should i/.test(low)) {
    return {
      saveNote,
      bot: {
        text: "You are on \"Q4 report: draft the summary\" until 11:30. Two steps are left: draft the intro paragraph, then read it once out loud. Team stand-up is next. Camera is optional.",
      },
    };
  }
  if (saveNote) {
    return {
      saveNote,
      bot: { text: "Thank you for telling me. I saved this as a private reflection. Would a short break or Quiet Shield help right now?" },
    };
  }
  return {
    bot: {
      text: "I can help with today's tasks, your reflections and messages to Priya. Try \"Break down my task\", or tell me what is on your mind.",
    },
  };
}
