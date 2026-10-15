import { useState } from "react";
import Icon from "@/components/common/Icon.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import { Button } from "@/components/ui/button";
import CheckInHistory from "@/components/employee/dashboard/CheckInHistory.jsx";
import CurrentFocus from "@/components/employee/dashboard/CurrentFocus.jsx";
import QuickCheckIn from "@/components/employee/dashboard/QuickCheckIn.jsx";
import { CHECK_IN_DAYS } from "@/data/check-ins.js";
import { DEMO_DATE_LONG, DEMO_TODAY } from "@/data/work-day.js";
import { getSession } from "@/lib/auth.js";
import { setQuietShield, useViewMode } from "@/lib/view-mode.js";
import { useWorkDay } from "@/lib/work-day-store.js";

// Employee dashboard (design: "Dashboard v3.dc.html"): greeting, Quiet Shield
// banner when on, Quick check-in beside its history, then Current focus.
function EmployeeDashboard() {
  const { calm, quiet } = useViewMode();
  const day = useWorkDay();
  // Today's check-in once recorded (undefined = none yet, null = "not sure").
  const [todayValue, setTodayValue] = useState(undefined);
  const firstName = (getSession()?.name ?? "Maya Lin").split(" ")[0];

  const days = CHECK_IN_DAYS.map(([iso, v]) => [iso, iso === DEMO_TODAY && todayValue != null ? todayValue : v]);
  const currentTask = day.tasks.find((t) => t.id === day.current && !t.done);

  return (
    <div className="flex flex-col gap-[1.625rem]">
      <PageHeader eyebrow={DEMO_DATE_LONG} title={`Good morning, ${firstName}`} />

      {quiet ? (
        <div className="flex flex-wrap items-center gap-3 rounded-panel bg-tint-teal px-5 py-3.5 text-body-lg" role="status">
          <Icon name="shield" fill className="text-[20px] text-secondary" />
          <span className="flex-1">Quiet Shield is on. Notifications are held until you turn it off.</span>
          <Button variant="ghost" size="sm" onClick={() => setQuietShield(false)} className="bg-on-primary/70 hover:bg-on-primary">
            Turn off
          </Button>
        </div>
      ) : null}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <QuickCheckIn calm={calm} quiet={quiet} onCheckIn={setTodayValue} />
        <CheckInHistory days={days} today={DEMO_TODAY} calm={calm} />
      </div>

      <CurrentFocus task={currentTask} />
    </div>
  );
}

export default EmployeeDashboard;
