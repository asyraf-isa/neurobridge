import { useOutletContext } from "react-router-dom";
import Icon from "@/components/common/Icon.jsx";
import { GUIDE_LEVELS } from "@/components/employer/team-styles.js";
import { cn } from "@/lib/utils";

const CARD = "flex flex-col gap-2.5 rounded-3xl border border-divider bg-surface-container-lowest px-6 py-[1.375rem]";

// Workspace → Response Guide: early signs, what to do at each level, and
// Do / Do not — all from what the employee shared.
function WorkspaceResponseGuide() {
  const { person } = useOutletContext();
  const { guide } = person;

  return (
    <div className="flex flex-col gap-3.5">
      <section className={CARD}>
        <h2 className="m-0 text-[1.25rem] font-extrabold">Early signs to watch for</h2>
        {guide.signs.map((sign) => (
          <div key={sign} className="flex items-start gap-3">
            <span className="mt-2 size-2 shrink-0 rounded-full bg-tertiary" />
            <span className="text-body-lg">{sign}</span>
          </div>
        ))}
      </section>

      <section className={cn(CARD, "gap-3")}>
        <h2 className="m-0 text-[1.25rem] font-extrabold">What to do at each level</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))] gap-2.5">
          {GUIDE_LEVELS.map((level) => (
            <div key={level.k} className={cn("flex flex-col gap-1.5 rounded-panel px-[1.125rem] py-4", level.className)}>
              <span className={cn("text-body-sm font-extrabold tracking-[0.06em]", level.ink)}>{level.label}</span>
              <span className="text-body-lg">{guide.levels[level.k]}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(18.75rem,1fr))] gap-3.5">
        <section className={CARD}>
          <h2 className="m-0 text-[1.25rem] font-extrabold">Do</h2>
          {guide.dos.map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <Icon name="check" className="text-[20px] text-secondary" />
              <span className="text-body-lg leading-[1.45]">{item}</span>
            </div>
          ))}
        </section>
        <section className={CARD}>
          <h2 className="m-0 text-[1.25rem] font-extrabold">Do not</h2>
          {guide.donts.map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <Icon name="close" className="text-[20px] text-red-ink" />
              <span className="text-body-lg leading-[1.45]">{item}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default WorkspaceResponseGuide;
