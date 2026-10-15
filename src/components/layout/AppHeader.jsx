import BrandLogo from "@/components/common/BrandLogo.jsx";
import Icon from "@/components/common/Icon.jsx";

/**
 * AppHeader — compact top bar shown only below `md`, where the sidebar is an
 * off-canvas drawer. The design has no desktop top bar: each page carries its
 * own date eyebrow + title, and the account menu sits at the foot of the
 * sidebar.
 */
function AppHeader({ onOpenNav }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-divider bg-canvas/90 px-margin backdrop-blur md:hidden">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-slate transition-colors hover:bg-fill hover:text-ink"
      >
        <Icon name="menu" className="text-[24px]" />
      </button>
      <BrandLogo />
      <span className="text-[1.125rem] font-extrabold tracking-[-0.02em]">NeuroBridge</span>
    </header>
  );
}

export default AppHeader;
