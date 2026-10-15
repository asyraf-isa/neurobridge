// Profile API layer.
// USE_MOCK = true  -> works offline with sample data (good for Stitch/UI work and demos).
// USE_MOCK = false -> calls the backend. Set VITE_API_BASE_URL in .env, e.g.
//   VITE_API_BASE_URL=http://localhost:8000/api
//
// Suggested backend endpoints (agree these with the backend team):
//   GET    /employees/:id/support-profile                   -> profile
//   PUT    /employees/:id/support-profile/sections/:sid     -> body { fields } -> updated profile
//   GET    /employees/:id/support-profile/suggestions       -> [suggestion]
//   POST   /employees/:id/support-profile/suggestions/:sid/accept  -> updated profile
//   POST   /employees/:id/support-profile/suggestions/:sid/dismiss -> 204
//   GET    /employees/:id/support-profile/shared                -> only fields marked 'shared' (employer view)
//
// Privacy rule: the employer view must be filtered on the SERVER. The client-side
// filter in filterShared() is only for the "Preview employer view" tab.

import { mockProfile, mockSuggestions } from '@/data/profile-mock-data';
import { PROFILE_SECTIONS } from '@/data/profile-schema';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// ---------- helpers ----------
const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const clone = (x) => structuredClone(x);

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.status === 204 ? null : res.json();
}

// In-memory store for mock mode
let store = clone(mockProfile);
let suggestionStore = clone(mockSuggestions);

function sectionTitle(sectionId) {
  return PROFILE_SECTIONS.find((s) => s.id === sectionId)?.title ?? sectionId;
}

function addHistory(summary) {
  const now = new Date().toISOString();
  store.updatedAt = now;
  store.history = [{ at: now, summary }, ...store.history].slice(0, 20);
}

// ---------- public API ----------
export async function getProfile(employeeId) {
  if (USE_MOCK) {
    await wait();
    return clone(store);
  }
  return request(`/employees/${employeeId}/support-profile`);
}

export async function updateSection(employeeId, sectionId, fields) {
  if (USE_MOCK) {
    await wait();
    store.sections[sectionId] = clone(fields);
    addHistory(`Updated ${sectionTitle(sectionId)}`);
    return clone(store);
  }
  return request(`/employees/${employeeId}/support-profile/sections/${sectionId}`, {
    method: 'PUT',
    body: JSON.stringify({ fields }),
  });
}

export async function getSuggestions(employeeId) {
  if (USE_MOCK) {
    await wait(500);
    return clone(suggestionStore);
  }
  return request(`/employees/${employeeId}/support-profile/suggestions`);
}

export async function acceptSuggestion(employeeId, suggestion) {
  if (USE_MOCK) {
    await wait();
    const field = store.sections[suggestion.sectionId]?.[suggestion.fieldId];
    if (field) {
      if (Array.isArray(field.value)) {
        if (!field.value.includes(suggestion.value)) field.value.push(suggestion.value);
      } else if (suggestion.mode === 'append' && field.value) {
        field.value = `${field.value} ${suggestion.value}`;
      } else {
        field.value = suggestion.value;
      }
    }
    suggestionStore = suggestionStore.filter((s) => s.id !== suggestion.id);
    addHistory(`Added a suggestion to ${sectionTitle(suggestion.sectionId)}`);
    return clone(store);
  }
  return request(`/employees/${employeeId}/support-profile/suggestions/${suggestion.id}/accept`, { method: 'POST' });
}

export async function dismissSuggestion(employeeId, suggestionId) {
  if (USE_MOCK) {
    await wait(150);
    suggestionStore = suggestionStore.filter((s) => s.id !== suggestionId);
    return null;
  }
  return request(`/employees/${employeeId}/support-profile/suggestions/${suggestionId}/dismiss`, { method: 'POST' });
}

// ---------- pure helpers used by the UI ----------

// Keep only fields the employer can see: ones the employee shared, plus the
// fixed HR fields (locked in profile-schema.js), which the employer always has.
const LOCKED = new Set(
  PROFILE_SECTIONS.flatMap((s) =>
    s.fields.filter((f) => f.locked || f.alwaysShared).map((f) => `${s.id}.${f.id}`),
  ),
);

export function filterShared(profile) {
  const sections = {};
  for (const [sid, fields] of Object.entries(profile.sections)) {
    const shared = Object.fromEntries(
      Object.entries(fields).filter(
        ([fid, f]) => (f.visibility === 'shared' || LOCKED.has(`${sid}.${fid}`)) && !isEmpty(f.value),
      ),
    );
    if (Object.keys(shared).length) sections[sid] = shared;
  }
  return { ...profile, sections };
}

export function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.values(value).every(isEmpty);
  return false;
}

export function completion(profile) {
  let total = 0;
  let done = 0;
  const bySection = {};
  for (const section of PROFILE_SECTIONS) {
    let sTotal = 0;
    let sDone = 0;
    for (const field of section.fields) {
      if (field.locked) continue; // fixed HR fields — nothing for the employee to fill in
      sTotal++;
      if (!isEmpty(profile.sections[section.id]?.[field.id]?.value)) sDone++;
    }
    bySection[section.id] = { done: sDone, total: sTotal };
    total += sTotal;
    done += sDone;
  }
  return { percent: total ? Math.round((done / total) * 100) : 0, bySection };
}
