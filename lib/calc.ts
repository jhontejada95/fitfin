import { DebtItem, MonthData } from '@/types/finance';

export interface MonthComputed {
  anaMonthlyTotal: number;
  totalIncome: number;
  anaIBC: number;
  anaSSAuto: number;
  anaSS: number;
  totalSocialSecurity: number;
  totalExpenses: number;
  totalDebtPayments: number;
  totalGoals: number;
  totalCommitted: number;
  netCashFlow: number;
  debtToIncomePct: number;
  netFlowPct: number;
  statusLight: 'green' | 'yellow' | 'red';
}

export const computeMonth = (month: MonthData, debts: DebtItem[]): MonthComputed => {
  const anaMonthlyTotal = month.income.anaWeekly.reduce(
    (sum, week) => sum + (week.amount || 0),
    0
  );
  const otherIncomeTotal = month.income.otherIncome.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const totalIncome = (month.income.jhonMonthlyFixed || 0) + anaMonthlyTotal + otherIncomeTotal;
  const anaIBC = anaMonthlyTotal * 0.4;
  const anaSSAuto = anaIBC * 0.285;
  const anaSS = month.socialSecurity.ana.mode === 'auto' ? anaSSAuto : month.socialSecurity.ana.manualAmount;
  const totalSocialSecurity =
    (month.socialSecurity.jhonFixed || 0) + anaSS + (month.socialSecurity.ana.agreementPaymentMonthly || 0);

  const totalExpenses =
    (month.expenses.housing || 0) +
    (month.expenses.utilities || 0) +
    (month.expenses.telecom || 0) +
    (month.expenses.subscriptions || 0) +
    (month.expenses.groceriesAndHome || 0) +
    (month.expenses.pets || 0) +
    (month.expenses.transport || 0) +
    (month.expenses.health || 0) +
    (month.expenses.education || 0) +
    (month.expenses.other || 0) +
    month.expenses.otherItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  const totalDebtPayments = debts.reduce((sum, debt) => sum + (debt.monthlyPayment || 0), 0);
  const totalGoals =
    (month.goals.monthlyAmortizationTarget || 0) + (month.goals.monthlySavingsTarget || 0);
  const totalCommitted = totalSocialSecurity + totalExpenses + totalDebtPayments + totalGoals;
  const netCashFlow = totalIncome - totalCommitted;
  const debtToIncomePct = totalIncome > 0 ? totalDebtPayments / totalIncome : 0;
  const netFlowPct = totalIncome > 0 ? netCashFlow / totalIncome : 0;
  const statusLight = netFlowPct >= 0.1 ? 'green' : netFlowPct >= 0 ? 'yellow' : 'red';

  return {
    anaMonthlyTotal,
    totalIncome,
    anaIBC,
    anaSSAuto,
    anaSS,
    totalSocialSecurity,
    totalExpenses,
    totalDebtPayments,
    totalGoals,
    totalCommitted,
    netCashFlow,
    debtToIncomePct,
    netFlowPct,
    statusLight
  };
};

export interface ConsolidationComputed {
  principal: number;
  monthlyRate: number;
  estimatedMonthlyPayment: number;
  currentSelectedMonthlyPayments: number;
  estimatedPaymentDifference: number;
}

export const computeConsolidation = (debts: DebtItem[], annualEffectiveRateEA: number, months: number) => {
  const selected = debts.filter((debt) => debt.includeInConsolidation);
  const principal = selected.reduce((sum, debt) => sum + (debt.balanceCurrent || 0), 0);
  const monthlyRate = Math.pow(1 + annualEffectiveRateEA, 1 / 12) - 1;
  const estimatedMonthlyPayment =
    principal > 0 && monthlyRate > 0 && months > 0
      ? (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
      : 0;
  const currentSelectedMonthlyPayments = selected.reduce((sum, debt) => sum + (debt.monthlyPayment || 0), 0);
  return {
    principal,
    monthlyRate,
    estimatedMonthlyPayment,
    currentSelectedMonthlyPayments,
    estimatedPaymentDifference: estimatedMonthlyPayment - currentSelectedMonthlyPayments
  };
};
