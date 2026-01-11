'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCOP, parseCOPInput } from '@/lib/format';
import { useFinanceStore } from '@/store/financeStore';

export default function DeudasPage() {
  const debts = useFinanceStore((state) => state.data.debts.items);
  const addDebt = useFinanceStore((state) => state.addDebt);
  const updateDebt = useFinanceStore((state) => state.updateDebt);
  const removeDebt = useFinanceStore((state) => state.removeDebt);
  const toggleDebt = useFinanceStore((state) => state.toggleDebtForConsolidation);
  const setConsolidationInput = useFinanceStore((state) => state.setConsolidationInput);
  const consolidationInputs = useFinanceStore((state) => state.consolidationInputs);
  const consolidation = useFinanceStore((state) => state.getConsolidationComputed());

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Deudas & Unificación</h1>
          <p className="text-sm text-slate-400">Gestiona deudas y simula unificación.</p>
        </div>
        <Button onClick={addDebt}>Agregar deuda</Button>
      </div>

      <Card title="Tabla de deudas">
        <div className="space-y-4">
          {debts.length === 0 ? (
            <p className="text-sm text-slate-400">Aún no hay deudas registradas.</p>
          ) : null}
          {debts.map((debt) => (
            <div key={debt.id} className="border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={debt.includeInConsolidation}
                    onChange={() => toggleDebt(debt.id)}
                    aria-label={`Incluir ${debt.name} en unificación`}
                  />
                  Incluir en unificación
                </label>
                <Input
                  label="Nombre"
                  value={debt.name}
                  inputMode="text"
                  onChange={(event) => updateDebt(debt.id, { name: event.target.value })}
                />
                <Input
                  label="Tipo"
                  value={debt.type}
                  inputMode="text"
                  onChange={(event) => updateDebt(debt.id, { type: event.target.value })}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  label="Saldo actual"
                  value={formatCOP(debt.balanceCurrent)}
                  inputMode="numeric"
                  onChange={(event) => updateDebt(debt.id, { balanceCurrent: parseCOPInput(event.target.value) })}
                />
                <Input
                  label="Cuota mensual"
                  value={formatCOP(debt.monthlyPayment)}
                  inputMode="numeric"
                  onChange={(event) => updateDebt(debt.id, { monthlyPayment: parseCOPInput(event.target.value) })}
                />
                <Input
                  label="Tasa EA"
                  value={debt.annualEffectiveRateEA}
                  inputMode="numeric"
                  onChange={(event) => updateDebt(debt.id, { annualEffectiveRateEA: Number(event.target.value) })}
                  helper="Ejemplo: 0.28"
                />
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => removeDebt(debt.id)}>
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Simulador de unificación">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Tasa EA (ej. 0.28)"
            value={consolidationInputs.annualEffectiveRateEA}
            inputMode="numeric"
            onChange={(event) => setConsolidationInput('annualEffectiveRateEA', Number(event.target.value))}
          />
          <Input
            label="Plazo en meses"
            value={consolidationInputs.months}
            inputMode="numeric"
            onChange={(event) => setConsolidationInput('months', Number(event.target.value))}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <div>
            <p className="text-sm text-slate-400">Principal seleccionado</p>
            <p className="text-lg font-semibold">{formatCOP(consolidation.principal)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Cuota estimada</p>
            <p className="text-lg font-semibold">{formatCOP(consolidation.estimatedMonthlyPayment)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Diferencia vs cuotas actuales</p>
            <p className="text-lg font-semibold">{formatCOP(consolidation.estimatedPaymentDifference)}</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Compara la cuota unificada con la suma de cuotas actuales seleccionadas.
        </p>
      </Card>
    </div>
  );
}
