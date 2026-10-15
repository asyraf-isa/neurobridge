import { firstName } from "../team-styles.js";

const bullets = (items) => items.map((item) => `- ${item}`).join("\n");

/**
 * The employer assistant's reply — mock rules that only use what the person
 * shared (their guide), or general guidance for "General". No model.
 */
export function respondForEmployer(text, person) {
  const low = text.toLowerCase();

  if (!person) {
    if (/agenda|meeting/.test(low)) {
      return "Send the agenda the day before. For each item, write the topic, the decision needed and who leads it. Add the end time.";
    }
    if (/change|plan/.test(low)) {
      return "Share changes in writing, as early as you can. Say what changes, when, and what stays the same.\n- Give the new time as a date and time\n- Offer a short chat for questions";
    }
    return "Here are general practices that help most people:\n- Put requests in writing, one task per message\n- Give deadlines as dates\n- Share plan changes the day before\n- Ask each person how they prefer feedback\nFor one person, pick their name above. I only use what they chose to share.";
  }

  const first = firstName(person.name);
  const { guide } = person;

  if (/start a check-?in|open with|check-?in/.test(low)) return guide.comms;
  if (/avoid|not say|do not/.test(low)) {
    return `Avoid these with ${first}:\n${bullets(guide.donts)}\nInstead:\n${bullets(guide.dos.slice(0, 2))}`;
  }
  if (/change of plan|change|plan/.test(low)) {
    return `Share the change in writing, as early as you can. ${first} finds it easier when:\n${bullets(guide.dos.slice(0, 2))}\nDo not:\n${bullets(guide.donts.slice(0, 1))}`;
  }
  if (/^draft|message/.test(low)) {
    const topic = text.replace(/^draft (a )?(short )?message to \w+( about)?/i, "").trim() || "this week's priorities";
    return `Here is a short draft:\n\nHi ${first},\n\nI would like to check in about ${topic.replace(/[.?!]+$/, "")}. No action needed today. Reply in writing when it suits you, or pick a time for a short chat.\n\nThanks,\nPriya`;
  }
  if (/sign|notice|look for/.test(low)) return `Early signs ${first} shared:\n${bullets(guide.signs)}`;
  return `From what ${first} shared: ${person.summary}\nDo:\n${bullets(guide.dos.slice(0, 2))}`;
}
