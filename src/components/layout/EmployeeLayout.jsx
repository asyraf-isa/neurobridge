import PortalLayout from "./PortalLayout.jsx";
import { employeeMenu } from "@/lib/nav-config";

function EmployeeLayout() {
  return (
    <PortalLayout
      menu={employeeMenu}
      navLabel="Employee navigation"
      fallbackUser={{ name: "Maya Lin", title: "Content designer", email: "maya.lin@company.com" }}
      showViewSwitch
      accountItems={[
        { label: "My Profile", icon: "person", to: "/employee/profile" },
        { label: "Settings", icon: "settings", to: "/employee/settings" },
      ]}
    />
  );
}

export default EmployeeLayout;
