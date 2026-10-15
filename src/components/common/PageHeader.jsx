import Icon from "@/components/common/Icon.jsx";
import { cn } from "@/lib/utils";

/**
 * Page header from the design: a slate date/context eyebrow over a 44px/800
 * title, with optional actions aligned to the bottom-right.
 */
function PageHeader({ eyebrow, eyebrowIcon, eyebrowIconFill = false, title, actions, className }) {
  return (
    <header className={cn("flex flex-wrap items-end justify-between gap-5", className)}>
      <div className="flex min-w-0 flex-col gap-1.5">
        {eyebrow ? (
          <span className="flex items-center gap-1.5 text-body-lg font-bold text-slate">
            {eyebrowIcon ? <Icon name={eyebrowIcon} fill={eyebrowIconFill} className="text-[20px]" /> : null}
            {eyebrow}
          </span>
        ) : null}
        <h1 className="m-0 text-display-lg max-sm:text-display-lg-mobile">{title}</h1>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </header>
  );
}

export default PageHeader;
