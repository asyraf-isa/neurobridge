import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AVATAR_TILES, STATUS } from "../team-styles.js";

// Profile fields surfaced on the card, in this order: [field label, card label, icon].
const DETAIL_KEYS = [
  ["Preferred channel", "Preferred channel", "chat"],
  ["Best focus time", "Best focus time", "schedule"],
  ["Working hours", "Working hours", "work_history"],
  ["Remote days", "Remote days", "home_work"],
  ["Feedback", "Feedback", "rate_review"],
  ["Agreed", "Agreed adjustments", "verified"],
];

/** One direct report: status, AI summary, key shared details and preferences, and View workspace. */
function EmployeeCard({ person, onOpen }) {
  const fields = person.profile.flatMap((s) => s.fields);
  const details = DETAIL_KEYS.map(([key, label, icon]) => {
    const field = fields.find((f) => f.label === key);
    return field ? { label, icon, value: field.value } : null;
  }).filter(Boolean);
  const status = STATUS[person.status];

  return (
    <article className="flex flex-col gap-[1.125rem] rounded-[1.75rem] border border-divider bg-surface-container-lowest p-6 max-sm:p-5">
      <div className="flex items-start gap-3.5">
        <span className={cn("grid size-14 shrink-0 place-items-center rounded-full text-[1.1875rem] font-extrabold", AVATAR_TILES[person.tile])}>
          {person.initials}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-1">
          <h2 className="m-0 text-[1.3125rem] leading-[1.2] font-extrabold">{person.name}</h2>
          <span className="text-body-md text-slate">
            {person.role} · {person.team}
          </span>
        </div>
        <span className={cn("shrink-0 rounded-full px-3 py-[0.3125rem] text-body-sm font-extrabold", status.className)}>{status.label}</span>
      </div>

      <p className="m-0 text-body-lg leading-[1.55] text-neutral-pill">{person.summary}</p>

      {details.length ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))] gap-2.5">
          {details.map((d) => (
            <div key={d.label} className="flex items-start gap-3 rounded-panel bg-fill-soft px-4 py-3.5">
              <Icon name={d.icon} className="mt-px text-[20px] text-tertiary" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[0.875rem] font-extrabold tracking-[0.06em] text-slate">{d.label.toUpperCase()}</span>
                <span className="text-body-lg leading-[1.45]">{d.value}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-panel bg-tint-indigo-soft px-4 py-3.5">
        <span className="flex items-center gap-2 text-[0.875rem] font-extrabold tracking-[0.06em] text-primary-hover">
          <Icon name="tune" fill className="text-[20px] text-tertiary" />
          KEY PREFERENCES
        </span>
        <div className="flex flex-[1_1_17.5rem] flex-wrap gap-2">
          {person.tags.map((tag) => (
            <span key={tag} className="flex h-[2.125rem] items-center gap-1.5 rounded-full bg-surface-container-lowest pr-3.5 pl-2.5 text-body-md font-bold">
              <Icon name="check" className="text-[17px] text-primary" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <Separator className="bg-fill" />
      <div className="flex flex-wrap items-center justify-between gap-3.5">
        <span className="text-body-sm text-slate">Last check-in {person.last.toLowerCase()}</span>
        <Button variant="dark" size="lg" onClick={onOpen} className="h-[2.875rem] pr-3.5 pl-[1.125rem]">
          View workspace
          <Icon name="chevron_right" className="text-[20px]" />
        </Button>
      </div>
    </article>
  );
}

export default EmployeeCard;
