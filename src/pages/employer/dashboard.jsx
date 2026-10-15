import { useNavigate } from "react-router-dom";
import Icon from "@/components/common/Icon.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import { Button } from "@/components/ui/button";
import AlertsPanel from "@/components/employer/dashboard/AlertsPanel.jsx";
import { ACTIVITY_TONES } from "@/components/employer/team-styles.js";
import { ACTIVITY, EMPLOYER_DATE } from "@/data/team.js";
import { getSession } from "@/lib/auth.js";
import { useTeam } from "@/lib/team-store.js";
import { cn } from "@/lib/utils";

// Employer dashboard (design: "Employer Portal.dc.html" → dash): a status
// snapshot of the team, Alerts, and the Notifications Centre.
function EmployerDashboard() {
  const navigate = useNavigate();
  const { people, seen } = useTeam();
  const firstName = (getSession()?.name ?? "Priya Shah").split(" ")[0];
  const count = (status) => people.filter((p) => p.status === status).length;
  const openWorkspace = (pid, tab = "") => navigate(`/employer/employees/${pid}${tab ? `/${tab}` : ""}`);

  const snapshot = [
    { n: count("stable"), label: "Stable", icon: "sentiment_satisfied", tile: "bg-tint-teal text-teal-ink" },
    { n: count("checkin"), label: "Could use a check-in", icon: "chat", tile: "bg-tint-indigo text-primary" },
    { n: count("request"), label: "Open support request", icon: "support", tile: "bg-amber-tint text-amber-ink" },
  ];

  return (
    <div className="flex flex-wrap items-stretch gap-6">
      <div className="flex min-w-0 flex-[1_1_33.75rem] flex-col gap-6">
        <PageHeader
          eyebrow={EMPLOYER_DATE}
          eyebrowIcon="today"
          title={`Good morning, ${firstName}`}
          actions={
            <Button variant="dark" size="lg" onClick={() => navigate("/employer/employees")} className="pr-5 pl-4">
              <Icon name="groups" className="text-[22px]" />
              Review team
            </Button>
          }
        />

        <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
          {snapshot.map((s) => (
            <div key={s.label} className="flex min-w-0 flex-col items-start gap-3 rounded-3xl border border-divider bg-surface-container-lowest px-5 py-[1.125rem]">
              <span className={cn("grid size-11 shrink-0 place-items-center rounded-[0.875rem]", s.tile)}>
                <Icon name={s.icon} fill className="text-[26px]" />
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[2rem] leading-none font-extrabold tabular-nums">{s.n}</span>
                <span className="text-body-md leading-[1.3] text-ink-soft">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        <AlertsPanel people={people} seen={seen} onReply={(pid) => openWorkspace(pid)} />
      </div>

      <div className="flex min-w-0 flex-[1_1_18.75rem] flex-col">
        <section aria-labelledby="activity-title" className="flex flex-1 flex-col gap-1 rounded-[1.75rem] border border-divider bg-surface-container-lowest px-6 pt-6 pb-3.5">
          <h2 id="activity-title" className="m-0 pb-1.5 text-headline-sm">
            Notifications Centre
          </h2>
          {ACTIVITY.map((event, i) => (
            <button
              key={i}
              type="button"
              onClick={() => openWorkspace(event.pid, event.tab)}
              className="-mx-2 flex cursor-pointer items-start gap-3 rounded-2xl px-2 py-3 text-left transition-colors hover:bg-fill-soft"
            >
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", ACTIVITY_TONES[event.tone])}>
                <Icon name={event.icon} className="text-[20px]" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-body-md leading-[1.4] font-bold">{event.text}</span>
                <span className="text-body-sm text-slate">{event.when}</span>
              </span>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}

export default EmployerDashboard;
