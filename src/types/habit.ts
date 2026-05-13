export type HabitType = 'good' | 'bad';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  goal?: number; // Target for good habits (e.g., 8 glasses)
  currentCount: number; // Current count for good habits
  lastReset: Date | { toDate: () => Date } | null;
  startDate: Date | { toDate: () => Date } | null;
  lastRelapse?: Date | { toDate: () => Date } | null; // For bad habits
  streak: number;
  history: Record<string, number>; // Date string (YYYY-MM-DD) -> value
}

export interface HabitSession {
  lastSignIn: Date | { toDate: () => Date } | null;
  signInStreak: number;
  signInHistory: string[]; // List of YYYY-MM-DD strings
}
