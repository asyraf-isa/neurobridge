import { format, parseISO } from "date-fns";
import Icon from "@/components/common/Icon.jsx";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Pill field (DESIGN.md): 44px, muted border, 600 weight.
const FIELD_CLASSES =
  "h-11 w-full min-w-0 justify-start gap-2 rounded-full border border-muted-border bg-surface-container-lowest px-3.5 text-body-md font-semibold text-ink hover:border-tertiary-soft hover:bg-surface-container-lowest";

/**
 * Accessible date picker: a Popover-backed shadcn Calendar that replaces the
 * native `<input type="date">`. `value` / `onChange` use ISO `yyyy-MM-dd`
 * strings, so it stays a drop-in for the fields it replaces.
 *
 * The label uses the medium ("PP") date format and truncates, so a long
 * localised date can never spill outside a fixed-width trigger.
 */
function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Pick a date",
  ariaLabel,
  className,
  align = "start",
  defaultMonth,
}) {
  const selected = value ? parseISO(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-label={ariaLabel}
          data-empty={selected ? undefined : true}
          className={cn(
            FIELD_CLASSES,
            "data-[empty=true]:text-slate",
            className,
          )}
        >
          <Icon name="calendar_today" className="text-[20px] text-slate" />
          <span className="min-w-0 truncate">
            {selected ? format(selected, "PP") : placeholder}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align={align}
        collisionPadding={12}
        className="w-auto rounded-3xl border-divider bg-surface-container-lowest p-1 shadow-float"
      >
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected ?? (defaultMonth ? parseISO(defaultMonth) : undefined)}
          autoFocus
          onSelect={(next) => onChange?.(next ? format(next, "yyyy-MM-dd") : "")}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
