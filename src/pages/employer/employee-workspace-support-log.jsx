import { useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import DatePicker from "@/components/common/DatePicker.jsx";
import Icon from "@/components/common/Icon.jsx";
import Segmented from "@/components/common/Segmented.jsx";
import { firstName, SEVERITY } from "@/components/employer/team-styles.js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MANAGER_INITIALS, MANAGER_NAME } from "@/data/team.js";
import { DEMO_TODAY } from "@/data/work-day.js";
import { addRecordNote, replyInRecord } from "@/lib/team-store.js";
import { cn } from "@/lib/utils";

const SEVERITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "reflection", label: "Reflections" },
  { value: "note", label: "Support notes" },
];
const SEVERITY_FILTERS = [{ value: "all", label: "Any severity" }, ...SEVERITIES];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const emptyForm = (kind = "note") => ({ date: DEMO_TODAY, sev: "low", situation: "", response: "", share: true, kind });
const formatDate = (iso) => {
  if (iso === DEMO_TODAY) return "Today";
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}`;
};

function exportCsv(person) {
  const esc = (v) => `"${String(v || "").replace(/"/g, '""')}"`;
  const rows = person.record.map((r) =>
    [r.date, r.kind === "reflection" ? "Reflection" : "Support note", r.kind === "reflection" ? person.name : MANAGER_NAME,
      r.shared ? "Yes" : "No", r.sev, r.title, r.text, r.response].map(esc).join(","),
  );
  const csv = ["Date,Type,Started by,Shared,Severity,Title,Text,Agreed response", ...rows].join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = `${person.name} support record.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// Workspace → Support Record: the employee's shared reflections and the
// manager's support notes in one list. For support only — never performance.
function WorkspaceSupportLog() {
  const { person } = useOutletContext();
  const location = useLocation();
  const first = firstName(person.name);
  const [form, setForm] = useState(() => (location.state?.openForm ? emptyForm(location.state.openForm) : null));
  const [saved, setSaved] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sevFilter, setSevFilter] = useState("all");
  const [drafts, setDrafts] = useState({});

  const patchForm = (patch) => setForm((f) => ({ ...f, ...patch }));

  const save = () => {
    if (!form.situation.trim()) return;
    addRecordNote(
      person.id,
      {
        date: formatDate(form.date),
        sort: 7 + Math.random(),
        sev: form.sev,
        title: form.kind === "checkin" ? "Check-in note" : "Support note",
        text: form.situation.trim(),
        response: form.response.trim(),
        shared: form.share,
      },
      { checkIn: form.kind === "checkin" },
    );
    setForm(null);
    setTypeFilter("all");
    setSevFilter("all");
    setSaved(form.share ? `Note saved and shared with ${first}.` : "Note saved. Private to you.");
  };

  const sendReply = (record) => {
    const text = (drafts[record.id] || "").trim();
    if (!text) return;
    replyInRecord(person.id, record.id, { from: MANAGER_NAME, initials: MANAGER_INITIALS, when: "Today, 11:12", text });
    setDrafts((d) => ({ ...d, [record.id]: "" }));
  };

  const items = person.record
    .filter((r) => (typeFilter === "all" || r.kind === typeFilter) && (sevFilter === "all" || r.sev === sevFilter))
    .sort((a, b) => b.sort - a.sort);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2.5">
        <span className="flex flex-[1_1_17.5rem] items-center gap-2 text-body-md text-ink-soft">
          <Icon name="shield" fill className="text-[20px] text-secondary" />
          For support only. Not for performance reviews or discipline.
        </span>
        <Button
          variant="dark"
          onClick={() => {
            setForm(emptyForm());
            setSaved("");
          }}
          className="pr-[1.125rem] pl-3.5 text-body-md"
        >
          <Icon name="add" className="text-[20px]" />
          Add note
        </Button>
        <Button variant="soft" onClick={() => exportCsv(person)} className="pr-[1.125rem] pl-3.5 text-body-md">
          <Icon name="download" className="text-[20px]" />
          Export
        </Button>
      </div>

      {saved ? (
        <div role="status" className="flex animate-msg-in items-center gap-2 rounded-2xl bg-tint-teal px-4 py-3 text-body-md font-bold text-teal-ink">
          <Icon name="check_circle" fill className="text-[20px]" />
          {saved}
        </div>
      ) : null}

      {form ? (
        <section className="flex animate-msg-in flex-col gap-3.5 rounded-3xl border-[1.5px] border-tint-indigo-border bg-surface-container-lowest px-6 py-[1.375rem]">
          <h2 className="m-0 text-[1.25rem] font-extrabold">{form.kind === "checkin" ? `Check-in note for ${first}` : "New support note"}</h2>
          <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-body-sm font-bold text-slate">Date</span>
              <DatePicker value={form.date} onChange={(date) => patchForm({ date })} ariaLabel="Date" className="w-48" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-body-sm font-bold text-slate">Severity</span>
              <Segmented value={form.sev} onChange={(sev) => patchForm({ sev })} options={SEVERITIES} label="Severity" itemClassName="h-9 px-3.5" />
            </div>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-bold text-slate">What happened</span>
            <Textarea value={form.situation} onChange={(e) => patchForm({ situation: e.target.value })} rows={2} className="resize-y rounded-2xl border px-3.5 py-3" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-bold text-slate">Agreed response</span>
            <Textarea value={form.response} onChange={(e) => patchForm({ response: e.target.value })} rows={2} className="resize-y rounded-2xl border px-3.5 py-3" />
          </label>
          <div className="flex items-center gap-3.5 rounded-2xl bg-fill-soft px-4 py-3">
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-body-lg font-bold">Share with {first}</span>
              <span className="text-body-sm text-slate">{first} can read it and reply. Turn off only for sensitive notes.</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.share}
              aria-label={`Share with ${first}`}
              onClick={() => patchForm({ share: !form.share })}
              className={cn(
                "relative h-[1.875rem] w-13 shrink-0 cursor-pointer rounded-full transition-colors duration-200",
                form.share ? "bg-primary" : "bg-muted-border",
              )}
            >
              <span
                className={cn(
                  "absolute top-1 size-[1.375rem] rounded-full bg-surface-container-lowest shadow-sm transition-[left] duration-200",
                  form.share ? "left-[1.625rem]" : "left-1",
                )}
              />
            </button>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button variant="dark" size="lg" onClick={save} disabled={!form.situation.trim()} className="h-[2.875rem] px-[1.375rem]">
              Save note
            </Button>
            <Button variant="soft" size="lg" onClick={() => setForm(null)} className="h-[2.875rem] px-[1.125rem]">
              Cancel
            </Button>
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap items-center gap-2.5">
        <Segmented
          value={typeFilter}
          onChange={setTypeFilter}
          options={TYPE_FILTERS}
          label="Filter by type"
          className="border border-divider bg-surface-container-lowest"
          itemClassName="h-[2.375rem] px-3.5"
        />
        <Segmented
          value={sevFilter}
          onChange={setSevFilter}
          options={SEVERITY_FILTERS}
          label="Filter by severity"
          className="flex-wrap border border-divider bg-surface-container-lowest"
          itemClassName="h-[2.375rem] px-3.5"
        />
      </div>

      {items.map((record) => {
        const reflection = record.kind === "reflection";
        const severity = SEVERITY[record.sev];
        const draft = drafts[record.id] || "";
        return (
          <article key={record.id} className="flex flex-col gap-2.5 rounded-3xl border border-divider bg-surface-container-lowest px-[1.375rem] py-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-2 text-label-sm font-extrabold tracking-[0.06em]",
                  reflection ? "bg-tint-indigo text-indigo-ink" : "bg-fill text-neutral-pill",
                )}
              >
                <Icon name={reflection ? "auto_stories" : "note_alt"} className="text-[15px]" />
                {reflection ? "REFLECTION" : "SUPPORT NOTE"}
              </span>
              <span className={cn("rounded-full px-2.5 py-1 text-label-sm font-extrabold tracking-[0.06em]", severity.className)}>{severity.label}</span>
              <span className="flex items-center gap-1 text-body-sm text-slate">
                <Icon name={record.shared ? "group" : "lock"} fill className="text-[16px]" />
                {reflection
                  ? `Started by ${first} · shared with you`
                  : record.shared
                    ? `Started by you · shared with ${first}`
                    : "Started by you · private to you"}
              </span>
              <span className="ml-auto text-body-sm text-slate">{record.date}</span>
            </div>
            <h3 className="m-0 text-[1.1875rem] leading-[1.3] font-extrabold">{record.title}</h3>
            <span className="text-body-lg leading-[1.55]">{record.text}</span>
            {record.response ? (
              <div className="flex flex-col gap-1 rounded-2xl bg-fill-soft px-3.5 py-3">
                <span className="text-[0.875rem] font-extrabold tracking-[0.06em] text-slate">AGREED RESPONSE</span>
                <span className="text-body-lg">{record.response}</span>
              </div>
            ) : null}
            {record.thread.length ? (
              <div className="flex flex-col gap-2.5 pt-1">
                {record.thread.map((m, i) => (
                  <div key={i} className="flex animate-msg-in items-start gap-2.5">
                    <span
                      className={cn(
                        "grid size-[1.875rem] shrink-0 place-items-center rounded-full text-label-sm font-extrabold",
                        m.initials === MANAGER_INITIALS ? "bg-tint-teal" : "bg-tint-indigo",
                      )}
                    >
                      {m.initials}
                    </span>
                    <div className="flex flex-1 flex-col gap-0.5 rounded-[0.25rem_1rem_1rem_1rem] bg-fill-soft px-3.5 py-2.5">
                      <span className="text-body-sm font-extrabold">
                        {m.from} <span className="font-semibold text-slate">· {m.when}</span>
                      </span>
                      <span className="text-body-lg">{m.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {reflection || record.shared ? (
              <div className="flex items-end gap-2">
                <Textarea
                  value={draft}
                  onChange={(e) => setDrafts((d) => ({ ...d, [record.id]: e.target.value }))}
                  rows={1}
                  aria-label="Reply in thread"
                  placeholder="Reply in the thread"
                  className="min-h-0 min-w-0 flex-1 resize-y rounded-2xl border px-3.5 py-[0.6875rem] leading-[1.45]"
                />
                <Button variant="dark" size="icon" aria-label="Send reply" disabled={!draft.trim()} onClick={() => sendReply(record)} className="size-11">
                  <Icon name="arrow_upward" className="text-[22px]" />
                </Button>
              </div>
            ) : null}
          </article>
        );
      })}
      {!items.length ? <span className="py-6 text-center text-body-lg text-slate">No entries match these filters.</span> : null}
    </div>
  );
}

export default WorkspaceSupportLog;
