import { useState } from "react";
import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import { dayLabel, MONTHS, moodDot, moodLevel, moodScore } from "@/lib/mood.js";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const LEGEND = [
  { v: 8, label: "UNPLEASANT" },
  { v: 50, label: "NEUTRAL" },
  { v: 92, label: "PLEASANT" },
];
const RECENT_DAYS = 14;

const monthKey = (iso) => iso.slice(0, 7);
const shiftMonth = (key, by) => {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1 + by, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

/**
 * Check-in history: a month calendar of mood dots (dashed ring = no check-in,
 * dark ring = today). Selecting a day shows its level and score.
 * `days` is [[iso, value | null], …], oldest first.
 */
function CheckInHistory({ days, today, calm }) {
  const [month, setMonth] = useState(monthKey(today));
  const [selected, setSelected] = useState("");

  const byDay = Object.fromEntries(days);
  const minMonth = monthKey(days[0][0]);
  const maxMonth = monthKey(today);
  const [year, mon] = month.split("-").map(Number);
  const lead = (new Date(year, mon - 1, 1).getDay() + 6) % 7;
  const inMonth = new Date(year, mon, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: inMonth }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  const recentCount = days.slice(-RECENT_DAYS).filter(([, v]) => v != null).length;
  const selectedValue = selected ? byDay[selected] : null;

  return (
    <section aria-labelledby="history-title" className="flex min-w-0 flex-col gap-3.5 rounded-card border border-divider bg-surface-container-lowest px-7 py-[1.375rem] max-sm:px-5">
      <div className="flex flex-col gap-0.5">
        <h2 id="history-title" className="m-0 text-headline-sm">
          Check-in history
        </h2>
        <span className="text-body-sm text-slate">
          {recentCount} check-ins in the last {RECENT_DAYS} days. Select a day to see its score.
        </span>
      </div>

      <div className="flex items-center justify-between gap-1.5">
        <Button
          variant="soft"
          size="icon-sm"
          aria-label="Previous month"
          disabled={month <= minMonth}
          onClick={() => setMonth((m) => shiftMonth(m, -1))}
          className="disabled:opacity-35"
        >
          <Icon name="chevron_left" className="text-[20px]" />
        </Button>
        <span className="flex-1 text-center text-body-sm font-extrabold tracking-[0.04em]" aria-live="polite">
          {MONTHS[mon - 1]} {year}
        </span>
        <Button
          variant="soft"
          size="icon-sm"
          aria-label="Next month"
          disabled={month >= maxMonth}
          onClick={() => setMonth((m) => shiftMonth(m, 1))}
          className="disabled:opacity-35"
        >
          <Icon name="chevron_right" className="text-[20px]" />
        </Button>
      </div>

      <div className="flex animate-rise flex-col gap-3.5">
        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((w, i) => (
            <span key={i} aria-hidden="true" className="pb-0.5 text-center text-[0.75rem] font-extrabold text-slate-soft">
              {w}
            </span>
          ))}
          {cells.map((d, i) => {
            if (!d) return <span key={`blank-${i}`} />;
            const iso = `${month}-${String(d).padStart(2, "0")}`;
            const v = byDay[iso];
            const has = v != null;
            const future = iso > today;
            const isToday = iso === today;
            const isSelected = selected === iso;
            return (
              <button
                key={iso}
                type="button"
                aria-pressed={isSelected}
                aria-label={has ? `${dayLabel(iso, today)}: ${moodLevel(v)}` : `${dayLabel(iso, today)}: no check-in`}
                disabled={!has}
                onClick={() => setSelected((s) => (s === iso ? "" : iso))}
                className={cn(
                  "flex min-h-13 flex-col items-center justify-center gap-1.5 rounded-lg py-1.5 disabled:cursor-default",
                  has && "cursor-pointer hover:bg-fill-soft",
                  isSelected && "bg-fill",
                  future && "opacity-45",
                )}
              >
                <span
                  className={cn(
                    "aspect-square w-full max-w-6 rounded-full",
                    !has && (future ? "border-[1.5px] border-fill" : "border-[1.5px] border-dashed border-muted-border"),
                    isToday && "ring-2 ring-ink ring-offset-[3px] ring-offset-surface-container-lowest",
                  )}
                  style={has ? { background: moodDot(v, calm) } : undefined}
                />
                <span className={cn("text-[0.875rem] font-bold tabular-nums", isToday || isSelected ? "text-ink" : "text-slate")}>{d}</span>
              </button>
            );
          })}
        </div>

        {selectedValue != null ? (
          <div className="flex animate-rise flex-wrap items-center gap-x-4 gap-y-3 rounded-panel bg-fill-soft px-4 py-3.5">
            <span className="size-10 shrink-0 rounded-full" style={{ background: moodDot(selectedValue, calm) }} />
            <div className="flex flex-[1_1_12.5rem] flex-col gap-0.5">
              <span className="text-body-sm font-bold text-slate">{dayLabel(selected, today)}</span>
              <span className="text-[1.1875rem] font-extrabold">{moodLevel(selectedValue)}</span>
            </div>
            <span className="text-headline-md tabular-nums">
              {moodScore(selectedValue)}
              <span className="text-body-md font-bold text-slate"> / 10</span>
            </span>
            <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={() => setSelected("")} className="bg-surface-container-lowest text-slate">
              <Icon name="close" className="text-[20px]" />
            </Button>
          </div>
        ) : null}

        <div className="flex flex-wrap justify-between gap-x-3 gap-y-1.5 text-[0.75rem] font-semibold tracking-[0.04em] text-slate">
          {LEGEND.map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <span className="size-3 rounded-full" style={{ background: moodDot(item.v, calm) }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CheckInHistory;
