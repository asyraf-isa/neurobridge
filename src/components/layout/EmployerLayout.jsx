import PortalLayout from "./PortalLayout.jsx";
import { employerMenu } from "@/lib/nav-config";

function EmployerLayout() {
  return (
    <PortalLayout
      menu={employerMenu}
      navLabel="Employer navigation"
      badge="EMPLOYER"
      avatarClassName="bg-tint-teal"
      fallbackUser={{ name: "Priya Shah", title: "Line manager", email: "priya.shah@company.com" }}
      accountItems={[
        { label: "My Profile", icon: "person", to: "/employer/profile" },
        { label: "Settings", icon: "settings", to: "/employer/settings" },
      ]}
    />
  );
}

export default EmployerLayout;
