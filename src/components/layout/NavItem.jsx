import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import Icon from "@/components/common/Icon.jsx";

// Plain <button> + useNavigate instead of <NavLink> — react-router-dom
// 7.18.x has an open bug where <Link>/<NavLink> click handling can freeze
// the tab for many seconds (github.com/remix-run/react-router/issues/15501).
// This sidesteps it while keeping the same active-state styling.
//
// DESIGN.md: active item = light-indigo fill, 800 weight, filled indigo icon;
// inactive = slate text with a faint outlined icon and a fill on hover.
// `end` paths match exactly; others also match their sub-routes.
function NavItem({ label, path, icon, end = false, onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = end
    ? location.pathname === path
    : location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      onClick={() => {
        if (location.pathname !== path) navigate(path);
        onNavigate?.();
      }}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-[0.6875rem] text-left text-body-lg transition-colors duration-200",
        isActive ? "bg-tint-indigo font-extrabold text-ink" : "text-slate hover:bg-fill",
      )}
    >
      {icon ? (
        <Icon name={icon} fill={isActive} className={cn("text-[22px]", isActive ? "text-tertiary" : "text-slate-soft")} />
      ) : null}
      <span>{label}</span>
    </button>
  );
}

export default NavItem;
