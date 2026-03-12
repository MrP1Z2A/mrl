export const PROJECT_CATEGORIES = [
  'Audio and sound',
  'Internet of things',
  'Installations',
  'Home automation',
  'Flying things',
  'Lab tools',
  'Environment',
  'Robotics',
  'Interactive games',
  'Smart lighting',
  'Displays',
  'Wearables',
] as const;

export const CATEGORY_STRIP_ITEMS = ['All categories', ...PROJECT_CATEGORIES] as const;
