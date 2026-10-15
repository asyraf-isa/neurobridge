import { Navigate, Route, Routes } from "react-router-dom";

import EmployeeLayout from "@/components/layout/EmployeeLayout.jsx";
import EmployerLayout from "@/components/layout/EmployerLayout.jsx";
import RequireRole from "@/components/layout/RequireRole.jsx";

import EmployeeDashboard from "@/pages/employee/dashboard.jsx";
import EmployeeProfile from "@/pages/employee/profile.jsx";
import EmployeeSettings from "@/pages/employee/settings.jsx";
import MyWork from "@/pages/employee/my-work.jsx";
import EmployeeJournal from "@/pages/employee/journal.jsx";
import EmployeeAssistant from "@/pages/employee/assistant.jsx";

import EmployerDashboard from "@/pages/employer/dashboard.jsx";
import EmployerProfile from "@/pages/employer/profile.jsx";
import EmployerSettings from "@/pages/employer/settings.jsx";
import Employees from "@/pages/employer/employees.jsx";
import EmployeeWorkspace from "@/pages/employer/employee-workspace.jsx";
import WorkspaceProfile from "@/pages/employer/employee-workspace-profile.jsx";
import WorkspaceResponseGuide from "@/pages/employer/employee-workspace-response-guide.jsx";
import WorkspaceSupportLog from "@/pages/employer/employee-workspace-support-log.jsx";
import EmployerAssistant from "@/pages/employer/assistant.jsx";

import NotFound from "@/pages/not-found.jsx";
import SignIn from "@/pages/sign-in.jsx";

// Route table for NeuroBridge. Placeholder pages are marked with a
// PagePlaceholder until their owner lands the real screen.
// Sign-in is the entry point: it authenticates against the hard-coded demo
// accounts and drops you straight into your role's dashboard.
// Each portal sits behind <RequireRole>, so a session can only reach its own
// dashboard — no role-switching route exists any more.
// The dashboard is each role's INDEX route (/employee, /employer); the old
// /dashboard URLs redirect there so existing links keep working.
// Each portal has its own AI Assistant page (they share components/ai/*).
// /employer/employees/:employeeId is the per-employee workspace. The Support
// Profile is its index route (shown first); Response Guide and Support Record
// (path: support-log) are nested sub-routes. A support view — never the
// employee's private reflections.
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/sign-in" element={<SignIn />} />

      <Route element={<RequireRole role="employee" />}>
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="dashboard" element={<Navigate to="/employee" replace />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="settings" element={<EmployeeSettings />} />
          <Route path="work" element={<MyWork />} />
          <Route path="journal" element={<EmployeeJournal />} />
          <Route path="ai" element={<EmployeeAssistant />} />
        </Route>
      </Route>

      <Route element={<RequireRole role="employer" />}>
        <Route path="/employer" element={<EmployerLayout />}>
          <Route index element={<EmployerDashboard />} />
          <Route path="dashboard" element={<Navigate to="/employer" replace />} />
          <Route path="profile" element={<EmployerProfile />} />
          <Route path="settings" element={<EmployerSettings />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/:employeeId" element={<EmployeeWorkspace />}>
            <Route index element={<WorkspaceProfile />} />
            <Route path="response-guide" element={<WorkspaceResponseGuide />} />
            <Route path="support-log" element={<WorkspaceSupportLog />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Route>
          <Route path="ai" element={<EmployerAssistant />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;