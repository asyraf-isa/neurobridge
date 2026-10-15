import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import ProfileField from "./ProfileField.jsx";
import StrengthNotes from "./StrengthNotes.jsx";

/**
 * A profile section card: title + description, Edit (or a "Saved" tick), its
 * fields, the strengths notes for Work strengths, and Save section / Cancel
 * while editing. Saving asks for confirmation in the page.
 */
function ProfileSection({ section, fields, editing, justSaved, managerName, isPaused, onEdit, onCancel, onSave, onFieldEdit, onToggleVisibility, onReshare, onKeepPrivate }) {
  return (
    <section
      aria-labelledby={`section-${section.k}`}
      className="flex flex-col rounded-[1.75rem] border border-divider bg-surface-container-lowest px-7 pt-6 pb-2.5 max-sm:px-5"
    >
      <div className="flex items-start justify-between gap-3.5 pb-3.5">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 id={`section-${section.k}`} className="m-0 text-[1.6875rem] leading-[1.25] font-extrabold tracking-[-0.01em]">
            {section.title}
          </h2>
          <span className="text-body-md leading-[1.45] font-normal text-slate">{section.desc}</span>
        </div>
        <div className="flex items-center gap-2">
          {justSaved && !editing ? (
            <span className="flex items-center gap-1.5 text-body-md font-bold text-teal-ink" role="status">
              <Icon name="check_circle" fill className="text-[20px]" />
              Saved
            </span>
          ) : null}
          {!editing ? (
            <Button variant="soft" onClick={onEdit} aria-label={`Edit ${section.title}`} className="h-10 pr-4 pl-3 text-body-md">
              <Icon name="edit" className="text-[19px]" />
              Edit
            </Button>
          ) : null}
        </div>
      </div>

      {fields.map((field) => (
        <ProfileField
          key={field.id}
          field={field}
          editing={editing}
          managerName={managerName}
          paused={isPaused(field)}
          onEdit={(patch) => onFieldEdit(field.id, patch)}
          onToggleVisibility={() => onToggleVisibility(field)}
          onReshare={() => onReshare(field)}
          onKeepPrivate={() => onKeepPrivate(field)}
        />
      ))}

      {section.k === "strengths" ? <StrengthNotes /> : null}

      {editing ? (
        <div className="flex flex-wrap gap-2.5 border-t border-fill pt-3.5 pb-4">
          <Button variant="dark" size="lg" onClick={onSave} className="h-[2.875rem] px-[1.375rem]">
            Save section
          </Button>
          <Button variant="soft" size="lg" onClick={onCancel} className="h-[2.875rem] px-[1.125rem]">
            Cancel
          </Button>
        </div>
      ) : null}
    </section>
  );
}

export default ProfileSection;
