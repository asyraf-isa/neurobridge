import { useState } from "react";
import Icon from "@/components/common/Icon.jsx";
import Segmented from "@/components/common/Segmented.jsx";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ALERTS } from "@/data/team.js";
import { markAlertSeen } from "@/lib/team-store.js";
import { cn } from "@/lib/utils";
import { firstName, URGENCY } from "../team-styles.js";

const matches = (alert, filter) =>
  filter === "all" ? true : filter === "seen" ? alert.seen : !alert.seen && alert.urgency === filter;

/**
 * Alerts (design: Employer Portal → dashboard): support requests sorted unseen
 * first, then urgent, then newest. Search, filter (All · Urgent · Today ·
 * Seen), Reply (opens the workspace) and Mark as seen.
 */
function AlertsPanel({ people, seen, onReply }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const all = ALERTS.map((a) => ({ ...a, person: people.find((p) => p.id === a.pid), seen: !!seen[a.id] })).sort(
    (a, b) => a.seen - b.seen || URGENCY[a.urgency].rank - URGENCY[b.urgency].rank || b.sort - a.sort,
  );
  const q = query.trim().toLowerCase();
  const list = all.filter(
    (a) => matches(a, filter) && (!q || `${a.person.name} ${a.text} ${a.date} ${a.rel}`.toLowerCase().includes(q)),
  );
  const unseen = all.filter((a) => !a.seen).length;

  const options = [
    { value: "all", label: "All" },
    { value: "urgent", label: "Urgent", dot: "bg-alert-red-tile" },
    { value: "mild", label: "Today", dot: "bg-alert-amber-tile" },
    { value: "seen", label: "Seen" },
  ].map((o) => ({
    value: o.value,
    label: (
      <>
        {o.dot ? <span className={cn("size-2 rounded-full", o.dot)} /> : null}
        {o.label}
        <span className="text-label-sm font-extrabold opacity-70">{all.filter((a) => matches(a, o.value)).length}</span>
      </>
    ),
  }));

  return (
    <section aria-labelledby="alerts-title" className="flex flex-col gap-3.5 rounded-[1.75rem] border border-divider bg-surface-container-lowest px-6 py-[1.375rem] max-sm:px-4">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <h2 id="alerts-title" className="m-0 text-headline-sm">
            Alerts
          </h2>
          <span className="grid h-[1.625rem] min-w-[1.625rem] place-items-center rounded-full bg-red-tint px-2 text-body-sm font-extrabold text-alert-red-ink">
            {unseen}
            <span className="sr-only"> not seen</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-[0.875rem] font-bold text-slate">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-alert-red-tile" />
            Urgent: act now
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-alert-amber-tile" />
            Today: check in today
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <InputGroup className="flex-[1_1_13.75rem] border-[1.5px]">
          <InputGroupAddon>
            <Icon name="search" className="text-[20px] text-slate" />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name or message"
            aria-label="Search alerts"
            className="text-body-md font-normal"
          />
        </InputGroup>
        <Segmented
          value={filter}
          onChange={setFilter}
          options={options}
          label="Filter alerts"
          className="flex-wrap"
          itemClassName="h-[2.375rem] px-3.5"
        />
      </div>

      {list.map((alert) => {
        const u = URGENCY[alert.urgency];
        return (
          <div
            key={alert.id}
            className={cn(
              "flex flex-wrap items-center gap-x-3.5 gap-y-3 rounded-[1.25rem] border-[1.5px] py-3.5 pr-4 pl-3.5 transition-opacity duration-300",
              u.surface,
              alert.seen && "opacity-70",
            )}
          >
            <span className={cn("grid size-11 shrink-0 place-items-center rounded-[0.875rem]", u.tile)}>
              <Icon name={u.icon} fill className="text-[24px]" />
            </span>
            <div className="flex min-w-0 flex-[1_1_16.25rem] flex-col gap-[0.1875rem]">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-body-lg font-extrabold">{alert.person.name}</span>
                <span className={cn("rounded-full px-2.5 py-0.5 text-[0.75rem] font-extrabold tracking-[0.08em]", u.tile)}>{u.label}</span>
              </span>
              <span className="text-body-md leading-[1.45]">{alert.text}</span>
              <span className="mt-0.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[0.875rem] font-bold text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <Icon name="calendar_today" className="text-[17px] text-slate" />
                  {alert.rel ? <span className="text-ink">{alert.rel} ·</span> : null}
                  {alert.date}
                </span>
                <span className="flex items-center gap-1.5 tabular-nums">
                  <Icon name="schedule" className="text-[17px] text-slate" />
                  {alert.time}
                </span>
              </span>
            </div>
            {!alert.seen ? (
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => onReply(alert.pid)} className={cn("h-[2.625rem] px-4 text-body-sm hover:brightness-95", u.tile)}>
                  Reply
                </Button>
                <Button variant="ghost" onClick={() => markAlertSeen(alert.id)} className="h-[2.625rem] bg-surface-container-lowest px-3.5 text-body-sm hover:bg-fill">
                  Mark as seen
                </Button>
              </div>
            ) : (
              <span className="flex items-center gap-1.5 text-body-sm font-bold text-teal-ink">
                <Icon name="check_circle" fill className="text-[20px]" />
                Seen · {firstName(alert.person.name)} knows
              </span>
            )}
          </div>
        );
      })}
      {!list.length ? <span className="py-[1.125rem] text-center text-body-md text-slate">No alerts match.</span> : null}
    </section>
  );
}

export default AlertsPanel;
