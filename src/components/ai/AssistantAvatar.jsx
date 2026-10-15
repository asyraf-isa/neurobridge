import Icon from "@/components/common/Icon.jsx";
import { cn } from "@/lib/utils";

/** The assistant's round sparkle avatar. */
function AssistantAvatar({ size = "md" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full border-[1.5px] border-muted-border bg-surface-container-lowest",
        size === "lg" ? "size-[2.875rem]" : "size-[2.125rem]",
      )}
    >
      <Icon name="auto_awesome" fill className={cn("text-primary", size === "lg" ? "text-[24px]" : "text-[19px]")} />
    </span>
  );
}

export default AssistantAvatar;
