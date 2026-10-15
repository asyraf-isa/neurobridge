import { useState } from "react";
import { Outlet } from "react-router-dom";
import AccountMenu from "./AccountMenu.jsx";
import AppHeader from "./AppHeader.jsx";
import AppSidebar from "./AppSidebar.jsx";
import { getSession } from "@/lib/auth.js";
import { useViewMode } from "@/lib/view-mode.js";

const initialsOf = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

/**
 * Shared portal shell: sidebar (with the account menu at its foot) + main
 * column capped at `max-w-page` (1180px). Sets `data-view` so Calm view /
 * Quiet Shield re-tint every task colour underneath (see index.css).
 */
function PortalLayout({ menu, navLabel, badge, fallbackUser, accountItems, avatarClassName, showViewSwitch }) {
  const [navOpen, setNavOpen] = useState(false);
  const { calm } = useViewMode();
  const session = getSession();
  const user = { ...fallbackUser, ...session };
  user.initials = user.initials || initialsOf(user.name);

  return (
    <div data-view={calm ? "calm" : "standard"} className="flex min-h-dvh bg-canvas text-ink">
      <AppSidebar
        menu={menu}
        navLabel={navLabel}
        badge={badge}
        open={navOpen}
        onClose={() => setNavOpen(false)}
        footer={
          <AccountMenu
            user={user}
            items={accountItems}
            avatarClassName={avatarClassName}
            showViewSwitch={showViewSwitch}
            onNavigate={() => setNavOpen(false)}
          />
        }
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader onOpenNav={() => setNavOpen(true)} />

        <main className="flex flex-1 flex-col items-center px-margin-desktop pt-8 pb-24 max-lg:px-margin-tablet max-sm:px-margin max-sm:pt-6">
          <div className="flex w-full max-w-page flex-1 flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default PortalLayout;
