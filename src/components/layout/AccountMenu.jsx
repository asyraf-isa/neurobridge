import { useNavigate } from "react-router-dom";
import Icon from "@/components/common/Icon.jsx";
import Segmented from "@/components/common/Segmented.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearSession } from "@/lib/auth.js";
import { setView, useViewMode } from "@/lib/view-mode.js";
import { cn } from "@/lib/utils";

const VIEW_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "calm", label: "Calm" },
];

/**
 * Account button pinned to the foot of the sidebar, and its menu (DESIGN.md →
 * "Avatar menu"): name + email, optional View (Standard / Calm) switch, the
 * role's `items` ({ label, icon, to } — only routes that exist), Log out.
 */
function AccountMenu({ user, avatarClassName, items = [], showViewSwitch = false, onNavigate }) {
  const navigate = useNavigate();
  const { view } = useViewMode();

  const goTo = (path) => {
    onNavigate?.();
    navigate(path);
  };

  const handleLogOut = () => {
    clearSession();
    goTo("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] border-transparent py-2 pr-2.5 pl-2 text-left transition-colors duration-200 outline-none hover:bg-fill focus-visible:ring-4 focus-visible:ring-tint-indigo data-[state=open]:border-tertiary"
        >
          <span
            className={cn(
              "grid size-[2.375rem] shrink-0 place-items-center rounded-full bg-tint-indigo-soft text-body-sm font-extrabold",
              avatarClassName,
            )}
          >
            {user.initials}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-body-lg font-extrabold">{user.name}</span>
            <span className="truncate text-body-sm text-slate">{user.title}</span>
          </span>
          <Icon name="unfold_more" className="text-[20px] text-slate" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" sideOffset={8} className="w-[17.5rem]">
        <div className="flex items-center gap-3 px-2.5 pt-2.5 pb-3">
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-full bg-tint-indigo-soft text-body-sm font-extrabold",
              avatarClassName,
            )}
          >
            {user.initials}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-body-lg font-extrabold">{user.name}</span>
            <span className="truncate text-body-sm font-normal text-slate">{user.email}</span>
          </span>
        </div>
        <DropdownMenuSeparator className="mt-0" />

        {showViewSwitch ? (
          <div className="flex items-center justify-between gap-2.5 py-1.5 pr-1.5 pl-3">
            <span className="flex items-center gap-3 text-body-lg font-bold">
              <Icon name="contrast" className="text-[22px] text-slate" />
              View
            </span>
            <Segmented value={view} onChange={setView} options={VIEW_OPTIONS} size="sm" label="View" />
          </div>
        ) : null}

        {items.map((item) => (
          <DropdownMenuItem key={item.to} onSelect={() => goTo(item.to)}>
            <Icon name={item.icon} className="text-[22px] text-slate" />
            {item.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogOut}>
          <Icon name="logout" className="text-[22px] text-slate" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AccountMenu;
