import Icon from "@/components/common/Icon.jsx";
import AssistantAvatar from "./AssistantAvatar.jsx";

/** "Assistant" + a lock-prefixed privacy line, with page controls on the right. */
function AssistantHeader({ subtitle, children }) {
  return (
    <div className="relative z-30 flex flex-wrap items-center gap-3.5">
      <AssistantAvatar size="lg" />
      <div className="flex min-w-0 flex-[1_1_13.75rem] flex-col gap-0.5">
        <span className="text-[1.125rem] font-extrabold">Assistant</span>
        <span className="flex items-center gap-1.5 text-body-sm text-slate">
          <Icon name="lock" fill className="text-[16px]" />
          {subtitle}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export default AssistantHeader;
