import { Navigate, Outlet } from "react-router-dom";
import { getSession } from "@/lib/auth.js";

/**
 * Gate for a portal. Anonymous visitors are sent back to the sign-in page, and
 * a signed-in account can only open its own portal — an employee session
 * hitting `/employer/...` is bounced to `/employee`, and vice versa.
 *
 * Not real security: `src/lib/auth.js` hard-codes the demo accounts.
 */
function RequireRole({ role }) {
  const session = getSession();

  if (!session) return <Navigate to="/" replace />;
  if (session.role !== role) return <Navigate to={session.home} replace />;

  return <Outlet />;
}

export default RequireRole;
