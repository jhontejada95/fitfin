'use client';

import { create } from 'zustand';
import { FinanceData, FinanceDrafts, MonthData, MonthKey, UiState, DebtItem } from '@/types/finance';
import { seedData } from '@/data/seed';
import { loadData, saveData } from '@/lib/storage';
import { computeConsolidation, computeMonth } from '@/lib/calc';

const cloneMonth = (month: MonthData): MonthData => JSON.parse(JSON.stringify(month)) as MonthData;

interface FinanceStoreState {
  data: FinanceData;
  ui: UiState;
  drafts: FinanceDrafts;
  consolidationInputs: {
    annualEffectiveRateEA: number;
    months: number;
  };
  hydrate: () => void;
  setSelectedMonth: (month: MonthKey) => void;
  setSidebarOpen: (value: boolean) => void;
  updateDraft: (section: keyof FinanceDrafts, payload: Partial<MonthData[keyof MonthData]>) => void;
  saveSection: (section: keyof FinanceDrafts) => void;
  saveAll: () => void;
  resetToSeed: () => void;
  exportJson: () => void;
  importJson: (data: FinanceData) => void;
  duplicatePreviousMonth: () => void;
  addDebt: () => void;
  updateDebt: (id: string, payload: Partial<DebtItem>) => void;
  removeDebt: (id: string) => void;
  toggleDebtForConsolidation: (id: string) => void;
  setConsolidationInput: (key: 'annualEffectiveRateEA' | 'months', value: number) => void;
  getMonthComputed: (monthKey?: MonthKey) => ReturnType<typeof computeMonth>;
  getHistoricalComputed: () => Array<{ month: MonthKey; income: number; committed: number }>;
  getConsolidationComputed: () => ReturnType<typeof computeConsolidation>;
}

const initialData = seedData;

const initialDrafts: FinanceDrafts = cloneMonth(seedData.months[seedData.settings.defaultMonth]) as FinanceDrafts;

export const useFinanceStore = create<FinanceStoreState>((set, get) => ({
  data: initialData,
  ui: {
    selectedMonth: seedData.settings.defaultMonth,
    toastQueue: [],
    isSidebarOpen: false
  },
  drafts: initialDrafts,
  consolidationInputs: {
    annualEffectiveRateEA: 0.28,
    months: 24
  },
  hydrate: () => {
    const stored = loadData();
    set({
      data: stored,
      ui: { ...get().ui, selectedMonth: stored.settings.defaultMonth },
      drafts: cloneMonth(stored.months[stored.settings.defaultMonth]) as FinanceDrafts
    });
  },
  setSelectedMonth: (month) => {
    const state = get();
    const monthData = state.data.months[month];
    set({
      ui: { ...state.ui, selectedMonth: month },
      drafts: cloneMonth(monthData) as FinanceDrafts
    });
  },
  setSidebarOpen: (value) => {
    set((state) => ({ ui: { ...state.ui, isSidebarOpen: value } }));
  },
  updateDraft: (section, payload) => {
    set((state) => ({
      drafts: {
        ...state.drafts,
        [section]: { ...state.drafts[section], ...payload }
      }
    }));
  },
  saveSection: (section) => {
    const state = get();
    const monthKey = state.ui.selectedMonth;
    const updatedMonth = {
      ...state.data.months[monthKey],
      [section]: state.drafts[section]
    } as MonthData;
    const updatedData = {
      ...state.data,
      months: {
        ...state.data.months,
        [monthKey]: updatedMonth
      }
    };
    saveData(updatedData);
    set({ data: updatedData });
  },
  saveAll: () => {
    const state = get();
    const monthKey = state.ui.selectedMonth;
    const updatedMonth = {
      income: state.drafts.income,
      socialSecurity: state.drafts.socialSecurity,
      expenses: state.drafts.expenses,
      goals: state.drafts.goals
    } as MonthData;
    const updatedData = {
      ...state.data,
      months: {
        ...state.data.months,
        [monthKey]: updatedMonth
      }
    };
    saveData(updatedData);
    set({ data: updatedData });
  },
  resetToSeed: () => {
    saveData(seedData);
    set({
      data: seedData,
      ui: { ...get().ui, selectedMonth: seedData.settings.defaultMonth },
      drafts: cloneMonth(seedData.months[seedData.settings.defaultMonth]) as FinanceDrafts
    });
  },
  exportJson: () => {
    if (typeof window === 'undefined') return;
    const { exportData } = require('@/lib/storage') as typeof import('@/lib/storage');
    exportData(get().data);
  },
  importJson: (data) => {
    saveData(data);
    set({
      data,
      ui: { ...get().ui, selectedMonth: data.settings.defaultMonth },
      drafts: cloneMonth(data.months[data.settings.defaultMonth]) as FinanceDrafts
    });
  },
  duplicatePreviousMonth: () => {
    const state = get();
    const currentIndex = state.data.settings.monthOrder.indexOf(state.ui.selectedMonth);
    if (currentIndex <= 0) return;
    const previousKey = state.data.settings.monthOrder[currentIndex - 1];
    const previous = state.data.months[previousKey];
    const cloned = cloneMonth(previous);
    const updatedData = {
      ...state.data,
      months: {
        ...state.data.months,
        [state.ui.selectedMonth]: cloned
      }
    };
    saveData(updatedData);
    set({ data: updatedData, drafts: cloneMonth(cloned) as FinanceDrafts });
  },
  addDebt: () => {
    const newDebt: DebtItem = {
      id: `debt-${Date.now()}`,
      name: 'Nueva deuda',
      type: 'crédito',
      balanceInitial: 0,
      balanceCurrent: 0,
      annualEffectiveRateEA: 0.28,
      monthlyPayment: 0,
      paymentDayOfMonth: 1,
      priority: 1,
      includeInConsolidation: true,
      allowsPrepayment: true,
      prepaymentPenalty: 0,
      notes: ''
    };
    set((state) => {
      const updatedData = {
        ...state.data,
        debts: {
          items: [...state.data.debts.items, newDebt]
        }
      };
      saveData(updatedData);
      return { data: updatedData };
    });
  },
  updateDebt: (id, payload) => {
    set((state) => {
      const updated = state.data.debts.items.map((debt) => (debt.id === id ? { ...debt, ...payload } : debt));
      const updatedData = {
        ...state.data,
        debts: { items: updated }
      };
      saveData(updatedData);
      return { data: updatedData };
    });
  },
  removeDebt: (id) => {
    set((state) => {
      const updated = state.data.debts.items.filter((debt) => debt.id !== id);
      const updatedData = {
        ...state.data,
        debts: { items: updated }
      };
      saveData(updatedData);
      return { data: updatedData };
    });
  },
  toggleDebtForConsolidation: (id) => {
    set((state) => {
      const updated = state.data.debts.items.map((debt) =>
        debt.id === id ? { ...debt, includeInConsolidation: !debt.includeInConsolidation } : debt
      );
      const updatedData = {
        ...state.data,
        debts: { items: updated }
      };
      saveData(updatedData);
      return { data: updatedData };
    });
  },
  setConsolidationInput: (key, value) => {
    set((state) => ({ consolidationInputs: { ...state.consolidationInputs, [key]: value } }));
  },
  getMonthComputed: (monthKey) => {
    const state = get();
    const key = monthKey ?? state.ui.selectedMonth;
    return computeMonth(state.data.months[key], state.data.debts.items);
  },
  getHistoricalComputed: () => {
    const state = get();
    return state.data.settings.monthOrder.map((month) => {
      const computed = computeMonth(state.data.months[month], state.data.debts.items);
      return {
        month,
        income: computed.totalIncome,
        committed: computed.totalCommitted
      };
    });
  },
  getConsolidationComputed: () => {
    const state = get();
    return computeConsolidation(
      state.data.debts.items,
      state.consolidationInputs.annualEffectiveRateEA,
      state.consolidationInputs.months
    );
  }
}));

export const useHydrateFinance = () => {
  const hydrate = useFinanceStore((state) => state.hydrate);
  return hydrate;
};

export const useMonthDrafts = () => useFinanceStore((state) => state.drafts);
