import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Icon from "@/components/common/Icon.jsx";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-8 px-3 text-label-sm",
  md: "h-[2.125rem] px-3.5 text-label-md",
  lg: "h-10 px-4 text-label-lg",
};

/**
 * Segmented control from DESIGN.md: a slate pill track with an ink "on" pill
 * (Standard | Calm, Scale | 1–10, Write | Speak …). Built on ToggleGroup so it
 * keeps roving focus and arrow-key navigation.
 *
 * `options` is `[{ value, label, icon? }]`. Selecting the current value again
 * is ignored, so there is always exactly one choice.
 */
function Segmented({ value, onChange, options, size = "md", label, className, itemClassName }) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => next && onChange(next)}
      spacing={1}
      aria-label={label}
      className={cn("rounded-full bg-fill p-1", className)}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className={cn(
            SIZES[size],
            "rounded-full text-slate hover:bg-transparent hover:text-ink data-[state=on]:bg-ink! data-[state=on]:text-on-primary!",
            itemClassName,
          )}
        >
          {option.icon ? <Icon name={option.icon} className="text-[18px]" /> : null}
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export default Segmented;
