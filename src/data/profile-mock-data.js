// Sample Support Profile for EMP001 (Aiman Rahman — same person as currentUser in mock-data.js).
// Used by lib/profile-api.js while VITE_USE_MOCK is not 'false'.
//
// Shape:
// sections[sectionId][fieldId] = { value, visibility }
//   visibility: 'private' | 'shared'  (shared = the employer can see it)
//   sensory value = { triggers: [], whatHappens: '', whatHelps: [] }

const S = 'shared'; // shared with employer
const P = 'private';

export const mockProfile = {
  employeeId: 'EMP001',
  updatedAt: '2026-09-18T09:30:00+08:00',
  sections: {
    basicInfo: {
      fullName: { value: 'Aiman Rahman', visibility: S },
      preferredName: { value: 'Aiman', visibility: S },
      contact: { value: 'aiman@example.com', visibility: S },
      role: { value: 'Procurement Assistant', visibility: S },
      department: { value: 'Procurement', visibility: S },
      employmentStatus: { value: 'Full-time', visibility: S },
    },
    aboutMe: {
      intro: {
        value: 'I like work that has clear steps. I am careful and I notice small mistakes that other people miss.',
        visibility: S,
      },
      strengths: { value: ['Detail-oriented', 'Reliable', 'Good memory for numbers'], visibility: S },
      skills: { value: ['Microsoft Excel', 'Data entry', 'Filing'], visibility: S },
      interests: { value: ['Trains', 'Board games'], visibility: P },
      experience: { value: '6-month internship in an accounts office.', visibility: S },
    },
    workPreferences: {
      taskTypes: { value: ['Checking purchase orders', 'Data entry'], visibility: S },
      environment: { value: ['Quiet space', 'Headphones allowed'], visibility: S },
      routine: { value: 'Same start time every day. Hardest tasks in the morning.', visibility: S },
      structure: { value: 'Very structured – clear steps and fixed schedule', visibility: S },
      hours: { value: '9:00 am – 5:00 pm', visibility: S },
      likes: { value: ['Checklists', 'Knowing the plan in advance'], visibility: S },
      dislikes: { value: ['Last-minute changes'], visibility: S },
      concerns: { value: ['Making a mistake in front of others'], visibility: P },
    },
    communication: {
      method: { value: ['Written'], visibility: S },
      instructions: { value: 'Written down, one step at a time, with a deadline.', visibility: S },
      detail: { value: 'Step-by-step detail', visibility: S },
      clarification: { value: 'By message first, so I have time to think.', visibility: S },
      colleagues: { value: '', visibility: S },
      supervisors: { value: 'Short weekly check-in works well.', visibility: S },
    },
    capabilities: {
      accuracy: { value: 'strength', visibility: S },
      concentration: { value: 'strength', visibility: S },
      speed: { value: 'ok', visibility: S },
      followingInstructions: { value: 'strength', visibility: S },
      identifyingErrors: { value: 'strength', visibility: S },
      learning: { value: 'ok', visibility: S },
      completing: { value: 'strength', visibility: S },
      teamwork: { value: 'developing', visibility: P },
      changes: { value: 'support', visibility: P },
      askingForHelp: { value: 'developing', visibility: P },
    },
    sensory: {
      vision: {
        value: { triggers: ['Flickering lights'], whatHappens: 'I get a headache and lose focus.', whatHelps: ['Desk lamp', 'Seat away from the flicker'] },
        visibility: S,
      },
      hearing: {
        value: { triggers: ['Loud phone calls nearby', 'Open-office noise'], whatHappens: 'I find it hard to concentrate.', whatHelps: ['Noise-cancelling headphones'] },
        visibility: S,
      },
      touch: { value: { triggers: [], whatHappens: '', whatHelps: [] }, visibility: P },
      taste: { value: { triggers: ['Strong food smells'], whatHappens: '', whatHelps: [] }, visibility: P },
    },
    emotional: {
      discomfort: { value: ['Being put on the spot in meetings'], visibility: P },
      affects: { value: [], visibility: P },
      stressful: { value: ['Sudden schedule changes'], visibility: P },
      helpsDifficult: { value: ['A few minutes somewhere quiet'], visibility: S },
      overwhelmed: { value: 'Let me step away for 10 minutes, then check in by message.', visibility: S },
      othersRespond: { value: 'Calm voice, short sentences.', visibility: S },
    },
    supportNeeds: {
      accommodations: { value: ['Quiet desk', 'Headphones allowed'], visibility: S },
      supportNeeded: { value: ['Written task lists', 'Advance notice of changes'], visibility: S },
      easier: { value: ['Clear deadlines'], visibility: S },
      shouldKnow: { value: 'If I am quiet, it does not mean I am upset. I am concentrating.', visibility: S },
      avoid: { value: ['Changing plans without telling me'], visibility: S },
      independent: { value: ['Checking purchase orders', 'Updating supplier records'], visibility: S },
      whenAskHelp: { value: '', visibility: S },
      contact: { value: 'Puan Siti (supervisor), Encik Hafiz (HR)', visibility: S },
    },
    safety: {
      considerations: { value: '', visibility: P },
      hazards: { value: [], visibility: P },
      transport: { value: ['Public transport (LRT/MRT/bus)'], visibility: P },
      travelIndependently: { value: 'Yes, on familiar routes', visibility: P },
      safetyPreferences: { value: '', visibility: P },
    },
  },
  history: [
    { at: '2026-09-18T09:30:00+08:00', summary: 'Updated Sensory preferences & challenges' },
    { at: '2026-09-10T14:05:00+08:00', summary: 'Shared Communication preferences with employer' },
    { at: '2026-09-02T10:00:00+08:00', summary: 'Profile created' },
  ],
};

// AI suggestions drawn from patterns in the employee's workplace reflections. The AI never edits the profile itself —
// the employee accepts or dismisses each suggestion.
export const mockSuggestions = [
  {
    id: 'sug-1',
    sectionId: 'communication',
    fieldId: 'instructions',
    mode: 'append',
    value: 'A short checklist at the start of the day.',
    reason: 'In your workplace reflections, you mentioned 3 times this month that written checklists helped you.',
  },
  {
    id: 'sug-2',
    sectionId: 'supportNeeds',
    fieldId: 'avoid',
    mode: 'append',
    value: 'Unplanned meetings',
    reason: 'Unexpected changes came up in 3 of your workplace reflections this month.',
  },
];
