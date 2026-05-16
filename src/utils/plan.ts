import { DayPlan, EnergyLevel, MAX_TASKS, Task } from '@/types/DayPlan';

export function createEmptyPlan(date: string): DayPlan {
  return {
    date,
    focus: '',
    tasks: [],
    energy: null,
    reflection: '',
    updatedAt: new Date().toISOString(),
  };
}

export function addTask(plan: DayPlan, text: string): DayPlan {
  const trimmed = text.trim();
  if (!trimmed || plan.tasks.length >= MAX_TASKS) return plan;
  const task: Task = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text: trimmed,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  return { ...plan, tasks: [...plan.tasks, task], updatedAt: new Date().toISOString() };
}

export function toggleTask(plan: DayPlan, id: string): DayPlan {
  return {
    ...plan,
    tasks: plan.tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)),
    updatedAt: new Date().toISOString(),
  };
}

export function removeTask(plan: DayPlan, id: string): DayPlan {
  return {
    ...plan,
    tasks: plan.tasks.filter(t => t.id !== id),
    updatedAt: new Date().toISOString(),
  };
}

export function updateTaskText(plan: DayPlan, id: string, text: string): DayPlan {
  const trimmed = text.trim();
  if (!trimmed) return removeTask(plan, id);
  return {
    ...plan,
    tasks: plan.tasks.map(t => (t.id === id ? { ...t, text: trimmed } : t)),
    updatedAt: new Date().toISOString(),
  };
}

export function updateFocus(plan: DayPlan, focus: string): DayPlan {
  return { ...plan, focus: focus.trim(), updatedAt: new Date().toISOString() };
}

export function updateEnergy(plan: DayPlan, energy: EnergyLevel): DayPlan {
  return { ...plan, energy, updatedAt: new Date().toISOString() };
}

export function updateReflection(plan: DayPlan, reflection: string): DayPlan {
  return { ...plan, reflection, updatedAt: new Date().toISOString() };
}

export function completedCount(plan: DayPlan): number {
  return plan.tasks.filter(t => t.completed).length;
}

/** Returns a value from 0 to 1. Returns 0 when no tasks exist. */
export function planProgress(plan: DayPlan): number {
  if (plan.tasks.length === 0) return 0;
  return completedCount(plan) / plan.tasks.length;
}
