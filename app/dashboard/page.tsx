'use client';

import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { formatCOP } from '@/lib/format';
import { useFinanceStore } from '@/store/financeStore';
import { Button } from '@/components/ui/Button';
import { importData } from '@/lib/storage';
import { ChangeEvent, useRef } from 'react';
import { IncomeVsOutflowLine } from '@/components/charts/IncomeVsOutflowLine';
import { ExpensesDonut } from '@/components/charts/ExpensesDonut';
import { AnaWeeklyBars } from '@/components/charts/AnaWeeklyBars';
import { DebtPaymentsBars } from '@/components/charts/DebtPaymentsBars';

const statusStyles = {
  green: 'bg-emerald-500 text-slate-950',
  yellow: 'bg-amber-400 text-slate-950',
  red: 'bg-rose-500 text-slate-50'
};

export default function DashboardPage() {
  const selectedMonth = useFinanceStore((state) => state.ui.selectedMonth);
  const monthOrder = useFinanceStore((state) => state.data.settings.monthOrder);
  const setSelectedMonth = useFinanceStore((state) => state.setSelectedMonth);
  const monthComputed = useFinanceStore((state) => state.getMonthComputed());
  const historical = useFinanceStore((state) => state.getHistoricalComputed());
  const month = useFinanceStore((state) => state.data.months[selectedMonth]);
  const debts = useFinanceStore((state) => state.data.debts.items);
  const exportJson = useFinanceStore((state) => state.exportJson);
  const importJson = useFinanceStore((state) => state.importJson);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const data = await importData(file);
    importJson(data);
    event.target.value = '';
  };

  const expenseData = [
    { name: 'Vivienda', value: month.expenses.housing },
    { name: 'Servicios', value: month.expenses.utilities },
    { name: 'Telecom', value: month.expenses.telecom },
    { name: 'Suscripciones', value: month.expenses.subscriptions },
    { name: 'Mercado y hogar', value: month.expenses.groceriesAndHome },
    { name: 'Mascotas', value: month.expenses.pets },
    { name: 'Transporte', value: month.expenses.transport },
    { name: 'Salud', value: month.expenses.health },
    { name: 'Educación', value: month.expenses.education },
    { name: 'Otros', value: month.expenses.other }
  ];

  const weeklyData = month.income.anaWeekly.map((week) => ({
    name: `Sem ${week.weekIndex}`,
    value: week.amount
  }));

  const debtPayments = debts.map((debt) => ({ name: debt.name, value: debt.monthlyPayment }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-slate-400">Vista general del mes actual y KPIs clave.</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-end">
          <Select label="Mes actual" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
            {monthOrder.map((monthKey) => (
              <option key={monthKey} value={monthKey}>
                {monthKey}
              </option>
            ))}
          </Select>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => exportJson()}>
              Exportar JSON
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
            />
            <Button variant="ghost" onClick={() => fileInputRef.current?.click()}>
              Importar JSON
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Ingresos del mes">
          <div className="text-2xl font-semibold">{formatCOP(monthComputed.totalIncome)}</div>
          <p className="text-xs text-slate-400">Incluye ingresos de Ana semanal.</p>
        </Card>
        <Card title="Total comprometido">
          <div className="text-2xl font-semibold">{formatCOP(monthComputed.totalCommitted)}</div>
          <p className="text-xs text-slate-400">Gastos + seguridad social + cuotas + metas.</p>
        </Card>
        <Card title="Flujo neto">
          <div className="text-2xl font-semibold">{formatCOP(monthComputed.netCashFlow)}</div>
          <p className="text-xs text-slate-400">Lo que queda al final del mes.</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Semáforo financiero">
          <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${statusStyles[monthComputed.statusLight]}`}>
            {monthComputed.statusLight === 'green' && 'Verde: margen sano'}
            {monthComputed.statusLight === 'yellow' && 'Amarillo: ajustar'}
            {monthComputed.statusLight === 'red' && 'Rojo: recortar'}
          </div>
          {monthComputed.totalIncome === 0 ? (
            <p className="text-xs text-amber-200 mt-2">Primero registra ingresos para ver el semáforo real.</p>
          ) : null}
        </Card>
        <Card title="Metas del mes">
          <div className="text-2xl font-semibold">{formatCOP(monthComputed.totalGoals)}</div>
          <p className="text-xs text-slate-400">Ahorro + amortización.</p>
        </Card>
        <Card title="Cuotas de deudas">
          <div className="text-2xl font-semibold">{formatCOP(monthComputed.totalDebtPayments)}</div>
          <p className="text-xs text-slate-400">Suma de cuotas actuales.</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Ingresos vs Comprometido">
          <IncomeVsOutflowLine data={historical} />
        </Card>
        <Card title="Distribución de gastos">
          <ExpensesDonut data={expenseData} />
        </Card>
        <Card title="Ingresos de Ana por semana">
          <AnaWeeklyBars data={weeklyData} />
        </Card>
        <Card title="Cuotas por deuda">
          <DebtPaymentsBars data={debtPayments} />
        </Card>
      </div>
    </div>
  );
}
