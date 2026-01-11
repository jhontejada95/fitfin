import { FinanceData } from '@/types/finance';
import { seedData } from '@/data/seed';

const STORAGE_KEY = 'finance_dashboard_data_v1';

export const loadData = (): FinanceData => {
  if (typeof window === 'undefined') {
    return seedData;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return seedData;
  }
  try {
    const parsed = JSON.parse(raw) as FinanceData;
    if (parsed.schemaVersion !== seedData.schemaVersion || !parsed.settings || !parsed.months) {
      return seedData;
    }
    return parsed;
  } catch (error) {
    console.error('Error parsing local data', error);
    return seedData;
  }
};

export const saveData = (data: FinanceData) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const exportData = (data: FinanceData) => {
  const content = JSON.stringify(data, null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'fitfin-export.json';
  anchor.click();
  URL.revokeObjectURL(url);
};

export const importData = async (file: File): Promise<FinanceData> => {
  const text = await file.text();
  const parsed = JSON.parse(text) as FinanceData;
  if (parsed.schemaVersion !== seedData.schemaVersion || !parsed.settings || !parsed.months) {
    throw new Error('El archivo no coincide con la versión esperada.');
  }
  return parsed;
};
