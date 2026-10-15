import { useEffect } from "react";
import { cn } from "@/lib/utils";
import BrandLogo from "@/components/common/BrandLogo.jsx";
import NavItem from "./NavItem.jsx";

/**
 * AppSidebar — the 228px rail shared by both roles (DESIGN.md → Layout):
 * logo (+ an optional role `badge`), the nav, and `footer` (the account menu)
 * pinned to the bottom. Sticky full-height on desktop.
 *
 * Below `md` it becomes an off-canvas drawer driven by `open` / `onClose`.
 */
function AppSidebar({ menu, navLabel, badge, footer, open = false, onClose }) {
  // Close the drawer with Escape while it is open.
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Scrim — only reachable below md, where the rail is a drawer. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-dvh w-sidebar shrink-0 flex-col gap-8 overflow-y-auto border-r border-divider bg-canvas px-4 py-[1.625rem] transition-transform duration-200 ease-out md:sticky md:z-10 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col gap-2 px-2">
          <div className="flex items-center gap-2.5">
            <BrandLogo />
            <span className="text-[1.25rem] font-extrabold tracking-[-0.02em]">NeuroBridge</span>
          </div>
          {badge ? (
            <span className="self-start rounded-full bg-tint-teal px-2.5 py-[0.1875rem] text-label-sm font-extrabold tracking-[0.08em] text-teal-ink">
              {badge}
            </span>
          ) : null}
        </div>

        <nav aria-label={navLabel} className="flex flex-col gap-1">
          {menu.map((item) => (
            <NavItem
              key={item.path}
              label={item.label}
              path={item.path}
              icon={item.icon}
              end={item.end}
              onNavigate={onClose}
            />
          ))}
        </nav>

        {footer ? <div className="relative mt-auto">{footer}</div> : null}
      </aside>
    </>
  );
}

export default AppSidebar;
