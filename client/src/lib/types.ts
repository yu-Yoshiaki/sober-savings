export interface SavingsEntry {
  id: string;
  date: string; // ISO string
  amount: number;
  note?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  image: string;
}

export interface UserSettings {
  dailyTarget: number; // Estimated daily spending on alcohol
  startDate: string; // ISO string
  currency: string;
  name: string;
}

export interface AppState {
  entries: SavingsEntry[];
  settings: UserSettings;
  activeGoalId: string | null;
  goals: Goal[];
}

export const DEFAULT_GOALS: Goal[] = [
  {
    id: 'travel',
    title: 'Mediterranean Getaway',
    description: 'A serene week on the coast with healthy food and clear mornings.',
    targetAmount: 300000,
    image: '/images/travel-goal.png',
  },
  {
    id: 'dining',
    title: 'Fine Dining Experience',
    description: 'A full course dinner at a top-tier restaurant, savoring every flavor.',
    targetAmount: 50000,
    image: '/images/dining-goal.png',
  },
  {
    id: 'gadget',
    title: 'Tech Upgrade',
    description: 'The latest noise-cancelling headphones and tablet for your creative work.',
    targetAmount: 150000,
    image: '/images/gadget-goal.png',
  },
];

export const INITIAL_STATE: AppState = {
  entries: [],
  settings: {
    dailyTarget: 1000, // Default 1000 JPY
    startDate: new Date().toISOString(),
    currency: '¥',
    name: 'Guest',
  },
  activeGoalId: 'travel',
  goals: DEFAULT_GOALS,
};
