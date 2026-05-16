/** Returns a YYYY-MM-DD string for the given Date in local time. */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Returns today's YYYY-MM-DD key. */
export function todayKey(): string {
  return toDateKey(new Date());
}

/** Returns the last n days as date keys, oldest first. */
export function lastNDays(n: number): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(toDateKey(d));
  }
  return days;
}

/** Returns a short weekday + date label, e.g. "Mon, May 13" or "Mo., 13. Mai". */
export function formatDateLabel(dateKey: string, locale = 'en'): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' });
}

/** Returns a short weekday name, e.g. "Mon" or "Mo.". */
export function shortWeekday(dateKey: string, locale = 'en'): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString(locale, { weekday: 'short' });
}

/** Returns a greeting based on current hour. */
export function timeGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 18) return 'Good afternoon';
  if (h >= 18 && h < 22) return 'Good evening';
  return 'Good night';
}

/** Returns the i18n key for the current time-based greeting. */
export function timeGreetingKey(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'home.greeting.morning';
  if (h >= 12 && h < 18) return 'home.greeting.afternoon';
  if (h >= 18 && h < 22) return 'home.greeting.evening';
  return 'home.greeting.night';
}

export function isToday(dateKey: string): boolean {
  return dateKey === todayKey();
}
