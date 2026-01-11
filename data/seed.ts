import { FinanceData, MonthData } from '@/types/finance';

const emptyMonth: MonthData = {
  income: {
    jhonMonthlyFixed: 0,
    anaWeekly: [
      { weekIndex: 1, amount: 0, dateFrom: '', dateTo: '', notes: '' },
      { weekIndex: 2, amount: 0, dateFrom: '', dateTo: '', notes: '' },
      { weekIndex: 3, amount: 0, dateFrom: '', dateTo: '', notes: '' },
      { weekIndex: 4, amount: 0, dateFrom: '', dateTo: '', notes: '' },
      { weekIndex: 5, amount: 0, dateFrom: '', dateTo: '', notes: '' }
    ],
    otherIncome: []
  },
  socialSecurity: {
    jhonFixed: 0,
    ana: {
      mode: 'auto',
      manualAmount: 0,
      agreementPaymentMonthly: 0
    }
  },
  expenses: {
    housing: 0,
    utilities: 0,
    telecom: 0,
    subscriptions: 0,
    groceriesAndHome: 0,
    pets: 0,
    transport: 0,
    health: 0,
    education: 0,
    other: 0,
    otherItems: []
  },
  goals: {
    monthlyAmortizationTarget: 0,
    monthlySavingsTarget: 0
  }
};

const monthKeys = [
  '2026-01',
  '2026-02',
  '2026-03',
  '2026-04',
  '2026-05',
  '2026-06',
  '2026-07',
  '2026-08',
  '2026-09',
  '2026-10',
  '2026-11',
  '2026-12'
];

const months = monthKeys.reduce<Record<string, MonthData>>((acc, key) => {
  acc[key] = JSON.parse(JSON.stringify(emptyMonth)) as MonthData;
  return acc;
}, {});

export const seedData: FinanceData = {
  schemaVersion: '1',
  settings: {
    currency: 'COP',
    locale: 'es-CO',
    year: 2026,
    monthOrder: monthKeys,
    defaultMonth: '2026-01'
  },
  months,
  debts: {
    items: []
  }
};

export const emptyMonthTemplate = emptyMonth;
