import { Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import Icon from "@/components/common/Icon.jsx";
import Segmented from "@/components/common/Segmented.jsx";
import { AVATAR_TILES, firstName, STATUS, URGENCY } from "@/components/employer/team-styles.js";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/lib/team-store.js";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "", label: "Support Profile" },
  { value: "response-guide", label: "Response Guide" },
  { value: "support-log", label: "Support Record" },
];

// Employer → per-employee workspace (design: Employer Portal → ws). The layout
// for its three tabs (Support Profile is the index route); children read the
// person via useOutletContext(). A support view only — never their journal.
function EmployeeWorkspace() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { people } = useTeam();
  const person = people.find((p) => p.id === employeeId);

  if (!person) return <Navigate to="/employer/employees" replace />;

  const base = `/employer/employees/${person.id}`;
  const tab = TABS.find((t) => t.value && location.pathname.endsWith(`/${t.value}`))?.value ?? "";
  const status = STATUS[person.status];
  const first = firstName(person.name);
  const urgency = URGENCY[person.urgency] ?? URGENCY.mild;
  const hasAlert = person.status !== "stable" && !!person.alert;

  return (
    <div className="flex w-full max-w-250 flex-col gap-[1.375rem]">
      <Button
        variant="ghost"
        onClick={() => navigate("/employer/employees")}
        className="h-10 self-start pr-3.5 pl-2 text-body-md text-ink-soft"
      >
        <Icon name="chevron_left" className="text-[22px]" />
        Employees
      </Button>

      <header className="flex flex-wrap items-center gap-x-5 gap-y-4">
        <span className={cn("grid size-16 shrink-0 place-items-center rounded-full text-[1.375rem] font-extrabold", AVATAR_TILES[person.tile])}>
          {person.initials}
        </span>
        <div className="flex flex-[1_1_16.25rem] flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="m-0 text-[2.25rem] leading-[1.1] font-extrabold tracking-[-0.02em]">{person.name}</h1>
            <span className={cn("rounded-full px-3 py-[0.3125rem] text-body-sm font-extrabold", status.className)}>{status.label}</span>
          </div>
          <span className="text-body-lg text-slate">
            {person.role} · {person.team} · last check-in {person.last.toLowerCase()}
          </span>
        </div>
        <Button variant="soft" size="lg" onClick={() => navigate(`/employer/ai?person=${person.id}`)} className="h-[2.875rem] pr-[1.125rem] pl-3.5">
          <Icon name="auto_awesome" fill className="text-[20px] text-primary" />
          Ask how to support {first}
        </Button>
      </header>

      {hasAlert ? (
        <div role="alert" className={cn("flex flex-wrap items-center gap-x-3.5 gap-y-3 rounded-[1.25rem] border-[1.5px] py-4 pr-[1.125rem] pl-4", urgency.surface)}>
          <span className={cn("grid size-11 shrink-0 place-items-center rounded-[0.875rem]", urgency.tile)}>
            <Icon name={person.alertIcon} fill className="text-[24px]" />
          </span>
          <div className="flex flex-[1_1_18.75rem] flex-col gap-0.5">
            <span className={cn("flex flex-wrap items-center gap-2 text-body-sm font-extrabold tracking-[0.06em]", urgency.ink)}>
              DISTRESS NOTIFICATION
              <span className={cn("rounded-full px-2.5 py-0.5 text-[0.75rem] tracking-[0.08em]", urgency.tile)}>{urgency.label}</span>
              <span className="font-bold tracking-normal text-slate">{person.alertWhen}</span>
            </span>
            <span className="text-body-lg">{person.alert}</span>
          </div>
          <Button
            onClick={() => navigate(`${base}/support-log`, { state: { openForm: "checkin" } })}
            className={cn("pr-[1.125rem] pl-3.5 text-body-md hover:brightness-95", urgency.tile)}
          >
            <Icon name="edit_note" className="text-[20px]" />
            Log a check-in note
          </Button>
        </div>
      ) : null}

      <Segmented
        value={tab}
        onChange={(value) => navigate(value ? `${base}/${value}` : base)}
        label="Workspace"
        size="lg"
        className="flex-wrap self-start border border-divider bg-surface-container-lowest p-[0.3125rem]"
        itemClassName="group h-11 px-[1.125rem] text-body-lg font-bold text-ink-soft"
        options={TABS.map((t) => ({
          value: t.value,
          label:
            t.value === "support-log" ? (
              <>
                {t.label}
                <span className="grid h-6 min-w-6 place-items-center rounded-full bg-fill px-[0.4375rem] text-[0.875rem] font-extrabold text-ink group-data-[state=on]:bg-on-primary/18 group-data-[state=on]:text-on-primary">
                  {person.record.length}
                </span>
              </>
            ) : (
              t.label
            ),
        }))}
      />

      {/* Keyed by navigation so "Log a check-in note" can reopen the form. */}
      <Outlet key={location.key} context={{ person }} />
    </div>
  );
}

export default EmployeeWorkspace;
