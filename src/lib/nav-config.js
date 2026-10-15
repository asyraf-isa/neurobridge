// Sidebar navigation per role. `end: true` = active only on the exact path
// (the dashboards are index routes, so every page would otherwise match them).
export const employeeMenu = [
  { label: 'Dashboard', path: '/employee', icon: 'space_dashboard', end: true },
  { label: 'My Profile', path: '/employee/profile', icon: 'person' },
  { label: 'My Work', path: '/employee/work', icon: 'checklist' },
  { label: 'Reflections', path: '/employee/journal', icon: 'auto_stories' },
  { label: 'AI Assistant', path: '/employee/ai', icon: 'forum' },
];

export const employerMenu = [
  { label: 'Dashboard', path: '/employer', icon: 'space_dashboard', end: true },
  { label: 'Employees', path: '/employer/employees', icon: 'groups' },
  { label: 'AI Assistant', path: '/employer/ai', icon: 'forum' },
];
