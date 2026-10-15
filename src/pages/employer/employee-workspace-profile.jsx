import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Icon from "@/components/common/Icon.jsx";
import { firstName } from "@/components/employer/team-styles.js";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MANAGER_NAME } from "@/data/team.js";
import { addStrengthNote } from "@/lib/team-store.js";

// Workspace → Support Profile: only what the employee shared, in collapsible
// sections, with a keyword filter, jump-to-section and an AI summary.
function WorkspaceProfile() {
  const { person } = useOutletContext();
  const [open, setOpen] = useState({ 0: true });
  const [keyword, setKeyword] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const first = firstName(person.name);

  const kw = keyword.trim().toLowerCase();
  const sections = person.profile
    .map((sec, i) => ({
      ...sec,
      i,
      fields: sec.fields.filter((f) => !kw || `${f.label} ${f.value} ${sec.title}`.toLowerCase().includes(kw)),
    }))
    .filter((sec) => sec.fields.length || (!kw && sec.title === "Work strengths"));
  const allOpen = sections.length > 0 && sections.every((sec) => open[sec.i] || kw);

  const jumpTo = (value) => {
    setKeyword("");
    setOpen((o) => ({ ...o, [value]: true }));
    requestAnimationFrame(() => document.getElementById(`ws-sec-${value}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const addNote = () => {
    const text = noteDraft.trim();
    if (!text) return;
    addStrengthNote(person.id, { from: MANAGER_NAME, when: "Today", text });
    setNoteDraft("");
  };

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-start gap-3.5 rounded-[1.375rem] bg-tint-indigo-soft px-5 py-[1.125rem]">
        <Icon name="auto_awesome" fill className="text-[24px] text-primary" />
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[0.875rem] font-extrabold tracking-[0.08em] text-primary-hover">
            AI SUMMARY · FROM WHAT {first.toUpperCase()} SHARED
          </span>
          <span className="text-[1.125rem] leading-[1.55] font-semibold">{person.summary}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <InputGroup className="h-12 flex-[1_1_16.25rem] border-[1.5px]">
          <InputGroupAddon>
            <Icon name="filter_list" className="text-[20px] text-slate" />
          </InputGroupAddon>
          <InputGroupInput
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Filter by keyword"
            aria-label="Filter profile by keyword"
            className="text-body-lg font-normal"
          />
        </InputGroup>
        <Select value="" onValueChange={jumpTo}>
          <SelectTrigger aria-label="Jump to section" className="h-12">
            <SelectValue placeholder="Jump to section" />
          </SelectTrigger>
          <SelectContent>
            {person.profile.map((sec, i) => (
              <SelectItem key={sec.title} value={String(i)}>
                {sec.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="soft"
          onClick={() => setOpen(Object.fromEntries(person.profile.map((_, i) => [i, !allOpen])))}
          className="h-12 pr-4 pl-3 text-body-md"
        >
          <Icon name={allOpen ? "unfold_less" : "unfold_more"} className="text-[20px]" />
          {allOpen ? "Collapse all" : "Expand all"}
        </Button>
      </div>

      {sections.map((sec) => {
        const isOpen = !!open[sec.i] || !!kw;
        return (
          <Collapsible
            key={sec.title}
            open={isOpen}
            onOpenChange={(next) => setOpen((o) => ({ ...o, [sec.i]: next }))}
            id={`ws-sec-${sec.i}`}
            className="flex scroll-mt-6 flex-col rounded-3xl border border-divider bg-surface-container-lowest"
          >
            <CollapsibleTrigger className="flex min-h-16 cursor-pointer items-center gap-3 rounded-3xl px-[1.375rem] py-3 text-left">
              <span className="flex-1 text-[1.1875rem] font-extrabold">{sec.title}</span>
              <span className="text-body-sm font-bold text-slate">{sec.fields.length} shared</span>
              <Icon name={isOpen ? "expand_less" : "expand_more"} className="text-[24px] text-slate" />
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col px-[1.375rem] pb-4">
              {sec.fields.map((field) => (
                <div key={field.label} className="flex flex-col gap-1 border-t border-fill py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm font-bold text-slate">{field.label}</span>
                    {field.sensitive ? (
                      <span className="rounded-full bg-fill px-2 py-0.5 text-label-sm font-extrabold tracking-[0.06em] text-slate">
                        SENSITIVE<span className="sr-only">: shared individually and can be withdrawn at any time</span>
                      </span>
                    ) : null}
                  </div>
                  <span className="text-body-lg">{field.value}</span>
                </div>
              ))}

              {sec.title === "Work strengths" ? (
                <div className="mt-1.5 flex flex-col gap-2.5 rounded-[1.25rem] bg-tint-teal px-[1.125rem] py-4">
                  <span className="text-[0.875rem] font-extrabold tracking-[0.08em] text-teal-ink">
                    ENCOURAGEMENT NOTES · SHOWN ON {first.toUpperCase()}&apos;S WORK STRENGTHS CARD
                  </span>
                  {person.strengthNotes.map((note, i) => (
                    <div key={i} className="flex flex-col gap-1 rounded-2xl bg-surface-container-lowest px-3.5 py-3">
                      <span className="text-body-lg">“{note.text}”</span>
                      <span className="text-body-sm text-ink-soft">
                        {note.from} · {note.when}
                      </span>
                    </div>
                  ))}
                  <Textarea
                    value={noteDraft}
                    onChange={(event) => setNoteDraft(event.target.value)}
                    rows={2}
                    aria-label="Add an encouragement note"
                    placeholder="Name one specific thing they did well"
                    className="resize-y rounded-2xl border border-success-border px-3.5 py-3"
                  />
                  <Button variant="dark" onClick={addNote} disabled={!noteDraft.trim()} className="self-start px-[1.125rem] text-body-md hover:bg-teal-ink">
                    Add note
                  </Button>
                </div>
              ) : null}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
      {!sections.length ? (
        <span className="py-6 text-center text-body-lg text-slate">Nothing shared matches “{keyword}”.</span>
      ) : null}
    </div>
  );
}

export default WorkspaceProfile;
