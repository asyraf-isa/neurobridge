import { forwardRef } from "react";
import Icon from "@/components/common/Icon.jsx";
import { cn } from "@/lib/utils";

/** 40px outlined round icon button used in the assistant header. */
const CircleButton = forwardRef(function CircleButton({ icon, label, className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cn(
        "grid size-10 cursor-pointer place-items-center rounded-full border-[1.5px] border-muted-border bg-surface-container-lowest text-slate transition-colors hover:bg-fill aria-expanded:border-tertiary",
        className,
      )}
      {...props}
    >
      <Icon name={icon} className="text-[21px]" />
    </button>
  );
});

export default CircleButton;
