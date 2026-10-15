import { useState } from "react";
import DatePicker from "@/components/common/DatePicker.jsx";
import Icon from "@/components/common/Icon.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import Segmented from "@/components/common/Segmented.jsx";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import ReflectionCard from "@/components/employee/journal/ReflectionCard.jsx";
import ReflectionComposer from "@/components/employee/journal/ReflectionComposer.jsx";
import { draftFromEntry, newDraft } from "@/components/employee/journal/reflection-draft.js";
import { DEMO_TODAY } from "@/data/work-day.js";
import { dayLabel } from "@/lib/mood.js";
import { useReflections } from "@/lib/reflections-store.js";
import { useViewMode } from "@/lib/view-mode.js";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "private", label: "Private" },
  { value: "shared", label: "Shared" },
];

// Reflections (design: "Reflections.dc.html"). Private by default; a shared
// entry shows its reply thread with the manager. Entries live in the
// reflections store, so check-ins and assistant notes appear here too.
function EmployeeJournal() {
  const entries = useReflections();
  const { calm } = useViewMode();
  const [composer, setComposer] = useState(null); // { draft, editId?, key }
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [date, setDate] = useState("");

  const hasFilter = !!(query || date || visibility !== "all");
  const clearFilters = () => {
    setQuery("");
    setDate("");
    setVisibility("all");
  };

  const q = query.trim().toLowerCase();
  const list = entries.filter(
    (e) =>
      (visibility === "all" || (visibility === "shared" ? e.shared : !e.shared)) &&
      (!date || e.date === date) &&
      (!q || [e.title, e.text, ...(e.moods || []), ...(e.ctx || [])].join(" ").toLowerCase().includes(q)),
  );
  const dates = [...new Set(list.map((e) => e.date))].sort().reverse();

  const openComposer = (draft, editId) => setComposer({ draft, editId, key: Date.now() });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Private unless you share"
        eyebrowIcon="lock"
        eyebrowIconFill
        title="Reflections"
        actions={
          !composer ? (
            <Button variant="dark" size="lg" onClick={() => openComposer(newDraft())} className="h-[2.875rem] pr-5 pl-3.5">
              <Icon name="add" className="text-[22px]" />
              New entry
            </Button>
          ) : null
        }
      />

      {composer ? (
        <ReflectionComposer
          key={composer.key}
          draft={composer.draft}
          editId={composer.editId}
          calm={calm}
          onClose={(saved) => {
            setComposer(null);
            if (saved) clearFilters();
          }}
        />
      ) : null}

      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <InputGroup className="flex-[1_1_13.75rem]">
            <InputGroupAddon>
              <Icon name="search" className="text-[22px] text-slate" />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search entries"
              aria-label="Search entries"
              className="text-body-lg font-normal"
            />
          </InputGroup>
          <Segmented
            value={visibility}
            onChange={setVisibility}
            options={FILTERS}
            label="Visibility filter"
            itemClassName="h-[2.375rem] px-3.5 text-body-md font-bold"
          />
          <DatePicker
            value={date}
            onChange={setDate}
            ariaLabel="Filter by date"
            placeholder="Any date"
            defaultMonth={DEMO_TODAY}
            className="h-[2.875rem] w-44"
          />
          {hasFilter ? (
            <Button variant="soft" onClick={clearFilters} className="h-[2.875rem] pr-3.5 pl-2.5">
              <Icon name="close" className="text-[18px]" />
              Clear
            </Button>
          ) : null}
        </div>

        {dates.map((day) => (
          <section key={day} className="flex flex-col gap-2.5" aria-label={dayLabel(day, DEMO_TODAY)}>
            <span className="pl-1 text-body-sm font-extrabold tracking-[0.06em] text-slate">{dayLabel(day, DEMO_TODAY)}</span>
            {list
              .filter((e) => e.date === day)
              .map((entry) => (
                <ReflectionCard
                  key={entry.id}
                  entry={entry}
                  calm={calm}
                  onEdit={() => openComposer(draftFromEntry(entry), entry.id)}
                />
              ))}
          </section>
        ))}

        {!list.length ? (
          <div className="rounded-card-sm border-[1.5px] border-dashed border-muted-border p-7 text-center text-body-lg text-slate">
            No entries match.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default EmployeeJournal;
