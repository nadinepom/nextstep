import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { DayPlan } from '@/types/DayPlan';
import { lastNDays, todayKey } from '@/utils/date';
import { createEmptyPlan } from '@/utils/plan';

const KEY_PREFIX = 'nextstep:plan:';

async function loadPlan(date: string): Promise<DayPlan> {
  try {
    const raw = await AsyncStorage.getItem(KEY_PREFIX + date);
    return raw ? (JSON.parse(raw) as DayPlan) : createEmptyPlan(date);
  } catch {
    return createEmptyPlan(date);
  }
}

async function savePlan(plan: DayPlan): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_PREFIX + plan.date, JSON.stringify(plan));
  } catch {
    // Non-fatal: data reloads on next open
  }
}

// ─── Shared today plan context ────────────────────────────────────────────────

interface DayPlanContextValue {
  plan: DayPlan;
  updatePlan: (updater: (prev: DayPlan) => DayPlan) => void;
  loading: boolean;
}

const DayPlanContext = createContext<DayPlanContextValue | null>(null);

export function DayPlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlanState] = useState<DayPlan>(() => createEmptyPlan(todayKey()));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlan(todayKey()).then(p => {
      setPlanState(p);
      setLoading(false);
    });
  }, []);

  const updatePlan = useCallback((updater: (prev: DayPlan) => DayPlan) => {
    setPlanState(prev => {
      const next = updater(prev);
      savePlan(next);
      return next;
    });
  }, []);

  return (
    <DayPlanContext.Provider value={{ plan, updatePlan, loading }}>
      {children}
    </DayPlanContext.Provider>
  );
}

export function useTodayPlan(): DayPlanContextValue {
  const ctx = useContext(DayPlanContext);
  if (!ctx) throw new Error('useTodayPlan must be used within DayPlanProvider');
  return ctx;
}

// ─── Weekly plans (independent, read from storage) ────────────────────────────

export function useWeekPlans() {
  const days = lastNDays(7);
  const today = todayKey();
  const { plan: todayPlan } = useTodayPlan();
  const [historicalPlans, setHistoricalPlans] = useState<Record<string, DayPlan>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pastDays = days.filter(d => d !== today);
    Promise.all(pastDays.map(d => loadPlan(d))).then(loaded => {
      const map: Record<string, DayPlan> = {};
      pastDays.forEach((d, i) => {
        map[d] = loaded[i];
      });
      setHistoricalPlans(map);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Always use the live context plan for today so updates are instantly visible
  const plans = { ...historicalPlans, [today]: todayPlan };

  return { plans, days, loading };
}
