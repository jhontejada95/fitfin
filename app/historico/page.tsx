'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { formatCOP } from '@/lib/format';
import { useFinanceStore } from '@/store/financeStore';

export default function HistoricoPage() {
  const selectedMonth = useFinanceStore((state) => state.ui.selectedMonth);
  const monthOrder = useFinanceStore((state) => state.data.settings.monthOrder);
  const setSelectedMonth = useFinanceStore((state) => state.setSelectedMonth);
  const duplicatePreviousMonth = useFinanceStore((state) => state.duplicatePreviousMonth);
  const historical = useFinanceStore((state) => state.getHistoricalComputed());

  const currentIndex = monthOrder.indexOf(selectedMonth);
  const previousMonth = currentIndex > 0 ? monthOrder[currentIndex - 1] : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Histórico & Comparativas</h1>
          <p className="text-sm text-slate-400">Compara periodos y duplica meses anteriores.</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-end">
          <Select label="Mes" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
            {monthOrder.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </Select>
          <Button variant="secondary" onClick={duplicatePreviousMonth} disabled={!previousMonth}>
            Duplicar mes anterior
          </Button>
        </div>
      </div>

      <Card title="Comparativa mes a mes">
        <div className="grid gap-4 md:grid-cols-3">
          {historical.map((item) => {
            const net = item.income - item.committed;
            return (
              <div key={item.month} className="border border-slate-800 rounded-lg p-3">
                <p className="text-sm text-slate-400">{item.month}</p>
                <p className="text-base font-semibold">Ingreso: {formatCOP(item.income)}</p>
                <p className="text-base font-semibold">Comprometido: {formatCOP(item.committed)}</p>
                <p className={`text-base font-semibold ${net >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                  Flujo: {formatCOP(net)}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Tabla resumen">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="py-2">Mes</th>
                <th className="py-2">Ingreso</th>
                <th className="py-2">Comprometido</th>
                <th className="py-2">Flujo</th>
              </tr>
            </thead>
            <tbody>
              {historical.map((item) => {
                const net = item.income - item.committed;
                return (
                  <tr key={item.month} className="border-t border-slate-800">
                    <td className="py-2 pr-4">{item.month}</td>
                    <td className="py-2 pr-4">{formatCOP(item.income)}</td>
                    <td className="py-2 pr-4">{formatCOP(item.committed)}</td>
                    <td className={`py-2 ${net >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {formatCOP(net)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
