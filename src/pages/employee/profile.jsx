import { useState } from "react";
import Icon from "@/components/common/Icon.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import Segmented from "@/components/common/Segmented.jsx";
import EmployerPreview from "@/components/employee/profile/EmployerPreview.jsx";
import ProfileSection from "@/components/employee/profile/ProfileSection.jsx";
import SuggestionBanner from "@/components/employee/profile/SuggestionBanner.jsx";
import { isFilled } from "@/components/employee/profile/profile-fields.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CURRENT_MANAGER,
  MANAGER_CHANGED,
  NOW_LABEL,
  PROFILE_HISTORY,
  PROFILE_SECTIONS,
  PROFILE_SUGGESTIONS,
  PROFILE_TABS,
} from "@/data/support-profile.js";
import { cn } from "@/lib/utils";

const clone = (value) => structuredClone(value);

// My Profile (design: "My Profile.dc.html"): the support profile in four
// themed tabs. Every field has its own Private / Shared toggle; editing a
// section ends with a confirmation that says what will be shared.
function EmployeeProfile() {
  const [sections, setSections] = useState(() => clone(PROFILE_SECTIONS));
  const [tab, setTab] = useState("about");
  const [editing, setEditing] = useState(null); // section key
  const [draft, setDraft] = useState(null); // fields being edited
  const [confirming, setConfirming] = useState(false);
  const [savedKey, setSavedKey] = useState(null);
  const [preview, setPreview] = useState(false);
  const [history, setHistory] = useState(PROFILE_HISTORY);
  const [suggestions, setSuggestions] = useState(() =>
    PROFILE_SUGGESTIONS.map((s) => ({ ...s, status: "pending", draft: s.add })),
  );
  const [reviewed, setReviewed] = useState({});

  const byKey = (k) => sections.find((s) => s.k === k);
  const log = (what, sec) => setHistory((list) => [{ what, sec, when: NOW_LABEL }, ...list]);
  const setField = (secKey, fieldId, fn) =>
    setSections((list) =>
      list.map((s) => (s.k !== secKey ? s : { ...s, fields: s.fields.map((f) => (f.id === fieldId ? fn(f) : f)) })),
    );
  const updateSuggestion = (id, patch) => setSuggestions((list) => list.map((g) => (g.id === id ? { ...g, ...patch } : g)));

  const isPaused = (f) => MANAGER_CHANGED && f.sensitive && f.vis === "shared" && !reviewed[f.id];
  const isVisible = (f) => f.vis === "always" || (f.vis === "shared" && !isPaused(f));

  const done = sections.filter((s) => s.fields.every(isFilled)).length;
  const pausedCount = sections.flatMap((s) => s.fields).filter(isPaused).length;
  const currentTab = PROFILE_TABS.find((t) => t.k === tab);

  const changeTab = (k) => {
    setTab(k);
    setEditing(null);
    setDraft(null);
    setSavedKey(null);
  };

  const applySuggestion = (g, text) => {
    const field = byKey(g.sec).fields.find((f) => f.id === g.field);
    setField(g.sec, g.field, (f) => ({ ...f, value: f.value ? `${f.value} ${text}` : text }));
    updateSuggestion(g.id, { status: "accepted", prev: field.value });
    log(`Added from a suggestion: "${text}"`, byKey(g.sec).title);
  };

  const toggleVisibility = (section, field) => {
    const next = field.vis === "shared" ? "private" : "shared";
    if (editing === section.k) {
      setDraft((list) => list.map((f) => (f.id === field.id ? { ...f, vis: next } : f)));
      return;
    }
    setField(section.k, field.id, (f) => ({ ...f, vis: next }));
    log(`${next === "shared" ? "Shared" : "Made private"} "${field.label}"`, section.title);
  };

  const sharedInDraft = (draft || []).filter((f) => f.vis !== "private").length;
  const editingSection = editing ? byKey(editing) : null;

  return (
    <div className="flex flex-col gap-7">
      <PageHeader
        eyebrow="Your support profile"
        title="My Profile"
        actions={
          <>
            <Button
              variant={preview ? "dark" : "soft"}
              size="lg"
              onClick={() => setPreview((p) => !p)}
              className="h-[2.875rem] pr-[1.125rem] pl-3.5"
            >
              <Icon name={preview ? "close" : "visibility"} className="text-[22px]" />
              {preview ? "Exit preview" : "Preview employer view"}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="soft" size="icon" aria-label="Change history" className="size-[2.875rem] aria-expanded:bg-divider">
                  <Icon name="history" className="text-[22px]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" sideOffset={10} className="flex w-[21.25rem] flex-col gap-1 rounded-3xl border-divider px-[1.125rem] pt-4 pb-2.5 shadow-float">
                <span className="pb-1 text-body-sm font-extrabold tracking-[0.06em] text-slate">CHANGE HISTORY</span>
                {history.map((h, i) => (
                  <div key={i} className="flex gap-3 py-2">
                    <span className="mt-[0.4375rem] size-2 shrink-0 rounded-full bg-muted-border" />
                    <div className="flex flex-1 flex-col gap-0.5">
                      <span className="text-body-md font-bold">{h.what}</span>
                      <span className="text-body-sm text-slate">
                        {h.sec} · {h.when}
                      </span>
                    </div>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          </>
        }
      />
      <div className="-mt-4 flex items-center gap-3">
        <div className="h-1.5 w-35 overflow-hidden rounded-full bg-divider">
          <div
            className="h-full rounded-full bg-secondary transition-[width] duration-400"
            style={{ width: `${Math.round((done / sections.length) * 100)}%` }}
          />
        </div>
        <span className="text-body-md text-slate tabular-nums">
          {done} of {sections.length} sections complete
        </span>
      </div>

      {MANAGER_CHANGED && pausedCount > 0 && !preview ? (
        <div className="flex max-w-[53.75rem] flex-wrap items-center gap-3 rounded-panel bg-tint-indigo-soft py-3.5 pr-4 pl-5 text-body-lg">
          <Icon name="swap_horiz" fill className="text-[22px] text-primary" />
          <span className="flex-[1_1_18.75rem]">
            Your manager is now {CURRENT_MANAGER}. {pausedCount} sensitive item{pausedCount > 1 ? "s are" : " is"} not shared
            until you review {pausedCount > 1 ? "them" : "it"}.
          </span>
          <Button onClick={() => changeTab("well")} className="h-10 text-body-md">
            Review sensitive details
          </Button>
        </div>
      ) : null}

      {preview ? (
        <EmployerPreview sections={sections} isVisible={isVisible} managerName={CURRENT_MANAGER} />
      ) : (
        <div className="flex w-full max-w-[53.75rem] flex-col gap-5">
          <Segmented
            value={tab}
            onChange={changeTab}
            label="Profile themes"
            size="lg"
            className="flex-wrap self-start border border-divider bg-surface-container-lowest p-[0.3125rem]"
            itemClassName="h-11 px-5 text-body-lg font-bold text-ink-soft"
            options={PROFILE_TABS.map((t) => {
              const todo = !t.secs.every((k) => byKey(k).fields.every(isFilled));
              return {
                value: t.k,
                label: (
                  <>
                    {t.label}
                    {todo ? (
                      <span className="size-[0.4375rem] rounded-full bg-warning-dot">
                        <span className="sr-only"> (has empty fields)</span>
                      </span>
                    ) : null}
                  </>
                ),
              };
            })}
          />

          {suggestions
            .filter((g) => g.status !== "rejected" && currentTab.secs.includes(g.sec))
            .map((g) => (
              <SuggestionBanner
                key={g.id}
                suggestion={g}
                sectionTitle={byKey(g.sec).title}
                onAccept={() => applySuggestion(g, g.add)}
                onAdjust={() => updateSuggestion(g.id, { status: "adjusting" })}
                onDraft={(text) => updateSuggestion(g.id, { draft: text })}
                onSaveAdjust={() => applySuggestion(g, g.draft)}
                onCancelAdjust={() => updateSuggestion(g.id, { status: "pending", draft: g.add })}
                onReject={() => updateSuggestion(g.id, { status: "rejected" })}
                onUndo={() => {
                  setField(g.sec, g.field, (f) => ({ ...f, value: g.prev }));
                  updateSuggestion(g.id, { status: "pending" });
                }}
              />
            ))}

          {currentTab.secs.map((k) => {
            const section = byKey(k);
            const isEditing = editing === k;
            return (
              <ProfileSection
                key={k}
                section={section}
                fields={isEditing ? draft : section.fields}
                editing={isEditing}
                justSaved={savedKey === k}
                managerName={CURRENT_MANAGER}
                isPaused={isPaused}
                onEdit={() => {
                  setEditing(k);
                  setDraft(clone(section.fields));
                  setSavedKey(null);
                }}
                onCancel={() => {
                  setEditing(null);
                  setDraft(null);
                }}
                onSave={() => setConfirming(true)}
                onFieldEdit={(fieldId, patch) => setDraft((list) => list.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)))}
                onToggleVisibility={(field) => toggleVisibility(section, field)}
                onReshare={(field) => {
                  setReviewed((r) => ({ ...r, [field.id]: true }));
                  log(`Re-shared "${field.label}" with ${CURRENT_MANAGER}`, section.title);
                }}
                onKeepPrivate={(field) => {
                  setField(section.k, field.id, (f) => ({ ...f, vis: "private" }));
                  setReviewed((r) => ({ ...r, [field.id]: true }));
                  log(`Kept "${field.label}" private`, section.title);
                }}
              />
            );
          })}
        </div>
      )}

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent className="max-w-105!">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[1.4375rem] leading-[1.25]">Save {editingSection?.title}?</AlertDialogTitle>
            <AlertDialogDescription className="text-body-lg font-normal text-ink-soft">
              {sharedInDraft
                ? `${sharedInDraft} field${sharedInDraft > 1 ? "s are" : " is"} shared with ${CURRENT_MANAGER}. The rest stay private.`
                : "Every field in this section stays private."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={cn("mt-1.5 flex-row flex-wrap justify-start!")}>
            <AlertDialogAction
              variant="dark"
              size="lg"
              className="px-[1.375rem]"
              onClick={() => {
                setSections((list) => list.map((s) => (s.k === editing ? { ...s, fields: draft } : s)));
                log("Saved section", editingSection.title);
                setSavedKey(editing);
                setEditing(null);
                setDraft(null);
              }}
            >
              Yes, save
            </AlertDialogAction>
            <AlertDialogCancel variant="soft" size="lg" className="px-[1.125rem]">
              Keep editing
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default EmployeeProfile;
