export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface DayPlan {
  /** ISO date string: YYYY-MM-DD */
  date: string;
  focus: string;
  tasks: Task[];
  energy: EnergyLevel | null;
  reflection: string;
  updatedAt: string;
}

export const MAX_TASKS = 3;
