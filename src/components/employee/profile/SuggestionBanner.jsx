import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * Self-insight from private reflections (DESIGN.md → My Profile →
 * Suggestions): adds to a field as private. Add / Edit / Dismiss, then Undo.
 */
function SuggestionBanner({ suggestion, sectionTitle, onAccept, onAdjust, onDraft, onSaveAdjust, onCancelAdjust, onReject, onUndo }) {
  const { status } = suggestion;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-3xl bg-tint-indigo px-[1.125rem] py-4">
      <Icon name="auto_awesome" fill className="text-[22px] text-primary" />
      <div className="flex min-w-0 flex-[1_1_18.75rem] flex-col gap-[0.1875rem]">
        <span className="text-body-sm font-bold text-primary-hover">
          Suggestion from your reflections · adds to <span className="text-body-lg font-extrabold text-ink">{sectionTitle}</span> as private
        </span>
        {status === "pending" ? <span className="text-[1.125rem] leading-[1.45] font-semibold">“{suggestion.add}”</span> : null}
        {status === "adjusting" ? (
          <Textarea
            value={suggestion.draft}
            onChange={(event) => onDraft(event.target.value)}
            rows={2}
            aria-label="Edit suggestion"
            className="mt-1 min-h-0 resize-y rounded-[0.875rem] border px-3 py-2.5 leading-[1.45]"
          />
        ) : null}
        {status === "accepted" ? (
          <span className="flex items-center gap-1.5 text-body-md font-bold text-teal-ink" role="status">
            <Icon name="check_circle" fill className="text-[18px]" />
            Added to {sectionTitle}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {status === "pending" ? (
          <>
            <Button variant="dark" size="sm" onClick={onAccept} className="h-[2.375rem] text-body-md">
              Add
            </Button>
            <Button variant="ghost" size="sm" onClick={onAdjust} className="h-[2.375rem] bg-surface-container-lowest text-body-md hover:bg-fill">
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={onReject} className="h-[2.375rem] px-3 text-body-md text-ink-soft hover:bg-on-primary/60">
              Dismiss
            </Button>
          </>
        ) : null}
        {status === "adjusting" ? (
          <>
            <Button variant="dark" size="sm" onClick={onSaveAdjust} className="h-[2.375rem] text-body-md">
              Add
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancelAdjust} className="h-[2.375rem] bg-surface-container-lowest text-body-md hover:bg-fill">
              Cancel
            </Button>
          </>
        ) : null}
        {status === "accepted" ? (
          <Button variant="ghost" size="sm" onClick={onUndo} className="h-[2.375rem] bg-surface-container-lowest text-body-md hover:bg-fill">
            Undo
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default SuggestionBanner;
