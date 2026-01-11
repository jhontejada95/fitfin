export type MonthKey = string;

export interface IncomeWeek {
  weekIndex: number;
  amount: number;
  dateFrom: string;
  dateTo: string;
  notes: string;
}

export interface NamedAmountItem {
  name: string;
  amount: number;
  notes: string;
}

export interface IncomeData {
  jhonMonthlyFixed: number;
  anaWeekly: IncomeWeek[];
  otherIncome: NamedAmountItem[];
}

export interface SocialSecurityData {
  jhonFixed: number;
  ana: {
    mode: 'auto' | 'manual';
    manualAmount: number;
    agreementPaymentMonthly: number;
  };
}

export interface ExpensesData {
  housing: number;
  utilities: number;
  telecom: number;
  subscriptions: number;
  groceriesAndHome: number;
  pets: number;
  transport: number;
  health: number;
  education: number;
  other: number;
  otherItems: NamedAmountItem[];
}

export interface GoalsData {
  monthlyAmortizationTarget: number;
  monthlySavingsTarget: number;
}

export interface MonthData {
  income: IncomeData;
  socialSecurity: SocialSecurityData;
  expenses: ExpensesData;
  goals: GoalsData;
}

export interface DebtItem {
  id: string;
  name: string;
  type: string;
  balanceInitial: number;
  balanceCurrent: number;
  annualEffectiveRateEA: number;
  monthlyPayment: number;
  paymentDayOfMonth: number;
  priority: number;
  includeInConsolidation: boolean;
  allowsPrepayment: boolean;
  prepaymentPenalty: number;
  notes: string;
}

export interface FinanceSettings {
  currency: string;
  locale: string;
  year: number;
  monthOrder: MonthKey[];
  defaultMonth: MonthKey;
}

export interface FinanceData {
  schemaVersion: string;
  settings: FinanceSettings;
  months: Record<MonthKey, MonthData>;
  debts: {
    items: DebtItem[];
  };
}

export interface FinanceDrafts {
  income: IncomeData;
  socialSecurity: SocialSecurityData;
  expenses: ExpensesData;
  goals: GoalsData;
}

export interface UiState {
  selectedMonth: MonthKey;
  toastQueue: string[];
  isSidebarOpen: boolean;
}
