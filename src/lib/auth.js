// Demo sign-in only. The two accounts are hard-coded on purpose so anyone can
// try both portals — there is no backend and no real authentication. The
// "session" lives in sessionStorage so a page refresh keeps you signed in, and
// it disappears when the tab closes.

const SESSION_KEY = "neurobridge.session";

export const DEMO_ACCOUNTS = [
  {
    role: "employee",
    username: "employee",
    email: "maya.lin@company.com",
    password: "employee123",
    name: "Maya Lin",
    initials: "ML",
    title: "Content designer",
    portal: "Employee portal",
    home: "/employee",
  },
  {
    role: "employer",
    username: "employer",
    email: "priya.shah@company.com",
    password: "employer123",
    name: "Priya Shah",
    initials: "PS",
    title: "Line manager",
    portal: "Employer portal",
    home: "/employer",
  },
];

/** Where each role lands after signing in. */
export const ROLE_HOME = {
  employee: "/employee",
  employer: "/employer",
};

// The signed-in shape stored in sessionStorage — never expose the password.
function toSession({ role, name, initials, title, email, home }) {
  return { role, name, initials, title, email, home };
}

/**
 * Match `identifier` (username or email, case-insensitive) + `password` against
 * the demo accounts. Returns a session object, or `null` when it doesn't match.
 */
export function authenticate(identifier, password) {
  const id = String(identifier ?? "").trim().toLowerCase();

  const account = DEMO_ACCOUNTS.find(
    (entry) => (entry.username === id || entry.email === id) && entry.password === password,
  );

  return account ? toSession(account) : null;
}

/** The current session, or `null` when signed out / unreadable. */
export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
