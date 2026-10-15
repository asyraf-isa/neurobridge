// Structure of "My Support Profile".
// Icons are Material Symbols names, rendered with <Icon name="…" /> (see AGENTS.md §5.7).
// Sections follow the Frontend Requirement & Planning doc ("4. Klara — Employee Profile"),
// plus Workplace safety from the NeuroBridge feature specification.
// The page renders from this schema, so adding or renaming a field only needs a change here.
//
// Field types:
//   text      - one-line input
//   textarea  - longer free text
//   tags      - a list of short items (strengths, likes, triggers...)
//   choice    - pick one option
//   multi     - pick any number of options
//   rating    - capability level (see RATING_LEVELS)
//   sensory   - triggers / what happens / what helps, for one sense
//
// sensitive: true  -> defaults to Private and shows a reminder before sharing.

// Visibility of each field — two options: 'private' (only me) or 'shared' (my employer can see it).
export const VISIBILITY = {
  PRIVATE: 'private',
  SHARED: 'shared',
};

export const VISIBILITY_LABELS = {
  private: { label: 'Private', icon: 'lock', help: 'Only you can see this' },
  shared: { label: 'Shared with employer', icon: 'group', help: 'Your employer can see this' },
};

export const RATING_LEVELS = [
  { value: 'strength', label: 'A strength' },
  { value: 'ok', label: 'Doing okay' },
  { value: 'developing', label: 'Still learning' },
  { value: 'support', label: 'I need support' },
];

export const PROFILE_SECTIONS = [
  {
    id: 'basicInfo',
    title: 'Basic information',
    icon: 'badge',
    intro: 'The basics about you and your job.',
    // locked: true -> set by HR when the account is created. Shown in view mode only
    //   (hidden when editing), always visible to the employer, not counted in completion.
    // alwaysShared: true -> editable, but always visible to the employer (no Private option).
    fields: [
      { id: 'fullName', label: 'Name', type: 'text', locked: true },
      { id: 'preferredName', label: 'Preferred name', type: 'text', hint: 'What should people call you?', alwaysShared: true },
      { id: 'contact', label: 'Work email', type: 'text', locked: true },
      { id: 'role', label: 'Current job / role', type: 'text', locked: true },
      { id: 'department', label: 'Department / team', type: 'text', locked: true },
      {
        id: 'employmentStatus',
        label: 'Employment status',
        type: 'choice',
        options: ['Full-time', 'Part-time', 'Internship', 'Trial / on-the-job training', 'Contract'],
        locked: true,
      },
    ],
  },
  {
    id: 'aboutMe',
    title: 'About me',
    icon: 'person',
    intro: 'A short introduction so people get to know you.',
    fields: [
      { id: 'intro', label: 'Short introduction', type: 'textarea', hint: 'Two or three sentences is enough.' },
      { id: 'strengths', label: 'Strengths', type: 'tags', hint: 'e.g. Detail-oriented' },
      { id: 'skills', label: 'Skills', type: 'tags', hint: 'e.g. Microsoft Excel' },
      { id: 'interests', label: 'Interests', type: 'tags' },
      { id: 'experience', label: 'Work experience', type: 'textarea' },
    ],
  },
  {
    id: 'communication',
    title: 'Communication preferences',
    icon: 'chat',
    intro: 'How you like to receive information and talk with others.',
    fields: [
      { id: 'method', label: 'Preferred communication method', type: 'multi', options: ['Written', 'Verbal', 'Visual'] },
      { id: 'instructions', label: 'How instructions should be given', type: 'textarea', hint: 'e.g. Written, one step at a time' },
      {
        id: 'detail',
        label: 'Preferred level of detail',
        type: 'choice',
        options: ['Step-by-step detail', 'Main points only', 'Main points, with detail when I ask'],
      },
      { id: 'clarification', label: 'How I prefer to ask for clarification', type: 'textarea' },
      { id: 'colleagues', label: 'Communication with colleagues', type: 'textarea' },
      { id: 'supervisors', label: 'Communication with supervisors', type: 'textarea' },
    ],
  },
  {
    id: 'workPreferences',
    title: 'Work preferences',
    icon: 'work',
    intro: 'The kind of work and routine that suits you.',
    fields: [
      { id: 'taskTypes', label: 'Preferred types of tasks', type: 'tags', hint: 'e.g. Data entry, checking documents' },
      {
        id: 'environment',
        label: 'Preferred working environment',
        type: 'multi',
        options: ['Quiet space', 'Own desk', 'Away from walkways', 'Natural light', 'Working from home sometimes', 'Headphones allowed'],
      },
      { id: 'routine', label: 'Preferred work routine', type: 'textarea' },
      {
        id: 'structure',
        label: 'Preferred level of structure',
        type: 'choice',
        options: ['Very structured – clear steps and fixed schedule', 'Some structure – plan with some flexibility', 'Flexible – I plan my own work'],
      },
      { id: 'hours', label: 'Preferred working hours', type: 'text', hint: 'e.g. 9:00 am – 5:00 pm' },
      { id: 'likes', label: 'Likes', type: 'tags' },
      { id: 'dislikes', label: 'Dislikes', type: 'tags' },
      { id: 'concerns', label: 'Fears / concerns', type: 'tags', sensitive: true },
    ],
  },
  {
    id: 'sensory',
    title: 'Sensory preferences & challenges',
    icon: 'hearing',
    intro: 'What you notice through your senses, and what helps.',
    fields: [
      { id: 'vision', label: 'Vision', type: 'sensory' },
      { id: 'hearing', label: 'Hearing', type: 'sensory' },
      { id: 'touch', label: 'Touch', type: 'sensory' },
      { id: 'taste', label: 'Taste / smell', type: 'sensory' },
    ],
  },
  {
    id: 'supportNeeds',
    title: 'Workplace support',
    icon: 'support',
    intro: 'Accommodations and support needs: what makes work easier, and who to go to.',
    fields: [
      { id: 'accommodations', label: 'Accommodations (workplace adjustments)', type: 'tags', hint: 'e.g. Quiet desk, headphones allowed' },
      { id: 'supportNeeded', label: 'What support do I need?', type: 'tags' },
      { id: 'easier', label: 'What makes work easier for me?', type: 'tags' },
      { id: 'shouldKnow', label: 'What should my manager / colleagues know?', type: 'textarea' },
      { id: 'avoid', label: 'What should people avoid?', type: 'tags' },
      { id: 'independent', label: 'What can I do independently?', type: 'tags' },
      { id: 'whenAskHelp', label: 'When should I ask for help?', type: 'textarea' },
      { id: 'contact', label: 'Who should I contact when I need support?', type: 'text' },
    ],
  },
  {
    id: 'capabilities',
    title: 'Work strengths',
    icon: 'star',
    intro: 'How you see yourself at work. There are no wrong answers.',
    fields: [
      { id: 'accuracy', label: 'Accuracy', type: 'rating' },
      { id: 'concentration', label: 'Concentration', type: 'rating' },
      { id: 'speed', label: 'Work speed', type: 'rating' },
      { id: 'followingInstructions', label: 'Following instructions', type: 'rating' },
      { id: 'identifyingErrors', label: 'Identifying errors', type: 'rating' },
      { id: 'learning', label: 'Learning new tasks', type: 'rating' },
      { id: 'completing', label: 'Completing assigned work', type: 'rating' },
      { id: 'teamwork', label: 'Teamwork', type: 'rating' },
      { id: 'changes', label: 'Handling changes', type: 'rating' },
      { id: 'askingForHelp', label: 'Problem-solving / asking for help', type: 'rating' },
    ],
  },
  {
    id: 'emotional',
    title: 'Emotional & situational preferences',
    icon: 'partly_cloudy_day',
    intro: 'Situations that are hard for you, and how others can help.',
    fields: [
      { id: 'discomfort', label: 'Situations that may cause discomfort', type: 'tags', sensitive: true },
      { id: 'affects', label: 'Things that affect my emotions / behaviour', type: 'tags', sensitive: true },
      { id: 'stressful', label: 'Common stressful situations', type: 'tags', sensitive: true },
      { id: 'helpsDifficult', label: 'What helps during difficult situations', type: 'tags' },
      { id: 'overwhelmed', label: 'Preferred support when overwhelmed', type: 'textarea' },
      { id: 'othersRespond', label: 'How I prefer others to respond', type: 'textarea' },
    ],
  },
  {
    id: 'safety',
    title: 'Workplace safety & practical needs',
    icon: 'health_and_safety',
    intro: 'Safety and getting to and from work.',
    fields: [
      { id: 'considerations', label: 'Safety considerations', type: 'textarea' },
      { id: 'hazards', label: 'Workplace hazards to be aware of', type: 'tags' },
      {
        id: 'transport',
        label: 'Transportation',
        type: 'multi',
        options: ['Public transport (LRT/MRT/bus)', 'Drive myself', 'Family drops me off', 'E-hailing', 'Walk', 'Company transport'],
      },
      {
        id: 'travelIndependently',
        label: 'Ability to travel independently',
        type: 'choice',
        options: ['Yes, independently', 'Yes, on familiar routes', 'With some support', 'Need someone with me'],
      },
      { id: 'safetyPreferences', label: 'Relevant workplace safety preferences', type: 'textarea' },
    ],
  },
];

// Visibility used when a field has never been set.
// Sensitive fields start Private; everything else starts Shared with employer.
export function defaultVisibility(field) {
  if (field.locked || field.alwaysShared) return VISIBILITY.SHARED;
  return field.sensitive ? VISIBILITY.PRIVATE : VISIBILITY.SHARED;
}
