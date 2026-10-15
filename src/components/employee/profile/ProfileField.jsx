import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { fieldText, isFilled } from "./profile-fields.js";

/**
 * One profile field (DESIGN.md → My Profile → Field row): label (+ SENSITIVE
 * tag), the value — or, while editing, a textarea / chip picker — and its
 * Private / Shared toggle. HR fields show "Always shared · HR" instead.
 * `paused`: a shared sensitive item waiting for review after a manager change.
 */
function ProfileField({ field, editing, onEdit, onToggleVisibility, managerName, paused, onReshare, onKeepPrivate }) {
  const shared = field.vis === "shared";

  return (
    <div className="flex flex-wrap items-start gap-x-5 gap-y-2.5 border-t border-fill py-4">
      <div className="flex min-w-0 flex-[1_1_22.5rem] flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[1.125rem] font-bold text-slate">{field.label}</span>
          {field.sensitive ? (
            <span className="rounded-full bg-fill px-2 py-0.5 text-label-sm font-extrabold tracking-[0.06em] text-slate">
              SENSITIVE
            </span>
          ) : null}
        </div>

        {!editing ? (
          isFilled(field) ? (
            <span className="text-[1.125rem] font-semibold">{fieldText(field)}</span>
          ) : (
            <span className="text-[1.125rem] font-semibold text-slate-soft">Not filled in yet</span>
          )
        ) : field.type === "text" ? (
          <Textarea
            value={field.value}
            onChange={(event) => onEdit({ value: event.target.value })}
            rows={2}
            aria-label={field.label}
            className="resize-y rounded-2xl border px-3.5 py-3"
          />
        ) : (
          <div className="flex flex-wrap gap-2" role="group" aria-label={field.label}>
            {field.options.map((option) => {
              const on = field.value.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    onEdit({ value: on ? field.value.filter((v) => v !== option) : [...field.value, option] })
                  }
                  className={cn(
                    "flex h-[2.375rem] cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] pr-3.5 pl-2.5 text-body-md font-bold transition-colors",
                    on ? "border-tint-indigo bg-tint-indigo text-ink" : "border-dashed border-muted-border bg-surface-container-lowest text-slate",
                  )}
                >
                  <Icon name={on ? "check" : "add"} className={cn("text-[18px]", on ? "text-primary" : "text-slate")} />
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {paused ? (
          <div className="mt-1 flex flex-wrap items-center gap-2.5 rounded-[0.875rem] bg-tint-indigo-soft px-3 py-2.5">
            <Icon name="pause_circle" className="text-[20px] text-primary" />
            <span className="flex-[1_1_11.25rem] text-body-md">Not shared with {managerName} yet.</span>
            <Button size="sm" onClick={onReshare}>
              Re-share
            </Button>
            <Button variant="ghost" size="sm" onClick={onKeepPrivate} className="bg-surface-container-lowest">
              Keep private
            </Button>
          </div>
        ) : null}
      </div>

      {field.vis === "always" ? (
        <span className="flex h-9 items-center gap-1.5 text-body-sm font-bold text-slate">
          <Icon name="badge" fill className="text-[17px]" />
          Always shared · HR
        </span>
      ) : (
        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={`${field.label}: ${shared ? "shared with your employer" : "private"}. Select to change.`}
          className={cn(
            "flex h-9 cursor-pointer items-center gap-1.5 rounded-full pr-3.5 pl-2.5 text-body-sm font-bold transition-colors duration-200",
            shared ? "bg-tint-indigo text-primary-hover hover:bg-tint-indigo-border" : "bg-fill text-ink-soft hover:bg-divider",
          )}
        >
          <Icon name={shared ? "person" : "lock"} fill className="text-[17px]" />
          {shared ? "Shared" : "Private"}
        </button>
      )}
    </div>
  );
}

export default ProfileField;
