'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { parseCOPInput, formatCOP } from '@/lib/format';
import { useFinanceStore, useMonthDrafts } from '@/store/financeStore';
import { NamedAmountItem } from '@/types/finance';

export default function RegistrarPage() {
  const drafts = useMonthDrafts();
  const updateDraft = useFinanceStore((state) => state.updateDraft);
  const saveSection = useFinanceStore((state) => state.saveSection);
  const saveAll = useFinanceStore((state) => state.saveAll);
  const [newIncomeName, setNewIncomeName] = useState('');
  const [newExpenseName, setNewExpenseName] = useState('');

  const updateAnaWeekly = (index: number, value: number) => {
    const updated = drafts.income.anaWeekly.map((week) =>
      week.weekIndex === index ? { ...week, amount: value } : week
    );
    updateDraft('income', { anaWeekly: updated });
  };

  const addOtherIncome = () => {
    if (!newIncomeName.trim()) return;
    const updated: NamedAmountItem[] = [
      ...drafts.income.otherIncome,
      { name: newIncomeName.trim(), amount: 0, notes: '' }
    ];
    setNewIncomeName('');
    updateDraft('income', { otherIncome: updated });
  };

  const updateOtherIncome = (index: number, amount: number) => {
    const updated = drafts.income.otherIncome.map((item, idx) =>
      idx === index ? { ...item, amount } : item
    );
    updateDraft('income', { otherIncome: updated });
  };

  const addOtherExpense = () => {
    if (!newExpenseName.trim()) return;
    const updated: NamedAmountItem[] = [
      ...drafts.expenses.otherItems,
      { name: newExpenseName.trim(), amount: 0, notes: '' }
    ];
    setNewExpenseName('');
    updateDraft('expenses', { otherItems: updated });
  };

  const updateOtherExpense = (index: number, amount: number) => {
    const updated = drafts.expenses.otherItems.map((item, idx) =>
      idx === index ? { ...item, amount } : item
    );
    updateDraft('expenses', { otherItems: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Registrar datos</h1>
          <p className="text-sm text-slate-400">Ingresa datos por sección y guarda cuando termines.</p>
        </div>
        <Button onClick={() => saveAll()}>Guardar todo</Button>
      </div>

      <Card title="Ingresos">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Ingreso fijo de Jhon"
            value={formatCOP(drafts.income.jhonMonthlyFixed)}
            inputMode="numeric"
            onChange={(event) =>
              updateDraft('income', { jhonMonthlyFixed: parseCOPInput(event.target.value) })
            }
            helper="Monto mensual en COP."
          />
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Ingreso semanal de Ana</h4>
            {drafts.income.anaWeekly.map((week) => (
              <Input
                key={week.weekIndex}
                label={`Semana ${week.weekIndex}`}
                value={formatCOP(week.amount)}
                inputMode="numeric"
                onChange={(event) => updateAnaWeekly(week.weekIndex, parseCOPInput(event.target.value))}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex flex-col gap-2 md:flex-row md:items-end">
            <Input
              label="Otro ingreso (nombre)"
              value={newIncomeName}
              onChange={(event) => setNewIncomeName(event.target.value)}
              inputMode="text"
              helper="Ejemplo: freelance, bonos, ventas."
            />
            <Button type="button" variant="secondary" onClick={addOtherIncome}>
              Agregar ingreso
            </Button>
          </div>
          {drafts.income.otherIncome.map((item, index) => (
            <Input
              key={`${item.name}-${index}`}
              label={item.name}
              value={formatCOP(item.amount)}
              inputMode="numeric"
              onChange={(event) => updateOtherIncome(index, parseCOPInput(event.target.value))}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => saveSection('income')}>
            Guardar ingresos
          </Button>
        </div>
      </Card>

      <Card title="Seguridad social">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Aporte fijo de Jhon"
            value={formatCOP(drafts.socialSecurity.jhonFixed)}
            inputMode="numeric"
            onChange={(event) => updateDraft('socialSecurity', { jhonFixed: parseCOPInput(event.target.value) })}
          />
          <Select
            label="Aporte de Ana"
            value={drafts.socialSecurity.ana.mode}
            onChange={(event) =>
              updateDraft('socialSecurity', { ana: { ...drafts.socialSecurity.ana, mode: event.target.value as 'auto' | 'manual' } })
            }
            helper="Auto = calcula 28.5% sobre 40% del ingreso de Ana."
          >
            <option value="auto">Automático</option>
            <option value="manual">Manual</option>
          </Select>
          {drafts.socialSecurity.ana.mode === 'manual' ? (
            <Input
              label="Aporte manual de Ana"
              value={formatCOP(drafts.socialSecurity.ana.manualAmount)}
              inputMode="numeric"
              onChange={(event) =>
                updateDraft('socialSecurity', {
                  ana: { ...drafts.socialSecurity.ana, manualAmount: parseCOPInput(event.target.value) }
                })
              }
            />
          ) : null}
          <Input
            label="Pago acuerdo mensual"
            value={formatCOP(drafts.socialSecurity.ana.agreementPaymentMonthly)}
            inputMode="numeric"
            onChange={(event) =>
              updateDraft('socialSecurity', {
                ana: { ...drafts.socialSecurity.ana, agreementPaymentMonthly: parseCOPInput(event.target.value) }
              })
            }
            helper="Si aplica acuerdo con seguridad social."
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => saveSection('socialSecurity')}>
            Guardar seguridad social
          </Button>
        </div>
      </Card>

      <Card title="Gastos">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Vivienda"
            value={formatCOP(drafts.expenses.housing)}
            inputMode="numeric"
            onChange={(event) => updateDraft('expenses', { housing: parseCOPInput(event.target.value) })}
          />
          <Input
            label="Servicios públicos"
            value={formatCOP(drafts.expenses.utilities)}
            inputMode="numeric"
            onChange={(event) => updateDraft('expenses', { utilities: parseCOPInput(event.target.value) })}
          />
          <Input
            label="Telecomunicaciones"
            value={formatCOP(drafts.expenses.telecom)}
            inputMode="numeric"
            onChange={(event) => updateDraft('expenses', { telecom: parseCOPInput(event.target.value) })}
          />
          <Input
            label="Suscripciones"
            value={formatCOP(drafts.expenses.subscriptions)}
            inputMode="numeric"
            onChange={(event) => updateDraft('expenses', { subscriptions: parseCOPInput(event.target.value) })}
          />
          <Input
            label="Mercado y hogar"
            value={formatCOP(drafts.expenses.groceriesAndHome)}
            inputMode="numeric"
            onChange={(event) => updateDraft('expenses', { groceriesAndHome: parseCOPInput(event.target.value) })}
          />
          <Input
            label="Mascotas"
            value={formatCOP(drafts.expenses.pets)}
            inputMode="numeric"
            onChange={(event) => updateDraft('expenses', { pets: parseCOPInput(event.target.value) })}
          />
          <Input
            label="Transporte"
            value={formatCOP(drafts.expenses.transport)}
            inputMode="numeric"
            onChange={(event) => updateDraft('expenses', { transport: parseCOPInput(event.target.value) })}
          />
          <Input
            label="Salud"
            value={formatCOP(drafts.expenses.health)}
            inputMode="numeric"
            onChange={(event) => updateDraft('expenses', { health: parseCOPInput(event.target.value) })}
          />
          <Input
            label="Educación"
            value={formatCOP(drafts.expenses.education)}
            inputMode="numeric"
            onChange={(event) => updateDraft('expenses', { education: parseCOPInput(event.target.value) })}
          />
          <Input
            label="Otros gastos base"
            value={formatCOP(drafts.expenses.other)}
            inputMode="numeric"
            onChange={(event) => updateDraft('expenses', { other: parseCOPInput(event.target.value) })}
          />
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex flex-col gap-2 md:flex-row md:items-end">
            <Input
              label="Otro gasto (nombre)"
              value={newExpenseName}
              onChange={(event) => setNewExpenseName(event.target.value)}
              inputMode="text"
              helper="Ejemplo: mantenimiento, imprevistos."
            />
            <Button type="button" variant="secondary" onClick={addOtherExpense}>
              Agregar gasto
            </Button>
          </div>
          {drafts.expenses.otherItems.map((item, index) => (
            <Input
              key={`${item.name}-${index}`}
              label={item.name}
              value={formatCOP(item.amount)}
              inputMode="numeric"
              onChange={(event) => updateOtherExpense(index, parseCOPInput(event.target.value))}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => saveSection('expenses')}>
            Guardar gastos
          </Button>
        </div>
      </Card>

      <Card title="Metas">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Meta de amortización"
            value={formatCOP(drafts.goals.monthlyAmortizationTarget)}
            inputMode="numeric"
            onChange={(event) =>
              updateDraft('goals', { monthlyAmortizationTarget: parseCOPInput(event.target.value) })
            }
          />
          <Input
            label="Meta de ahorro"
            value={formatCOP(drafts.goals.monthlySavingsTarget)}
            inputMode="numeric"
            onChange={(event) => updateDraft('goals', { monthlySavingsTarget: parseCOPInput(event.target.value) })}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => saveSection('goals')}>
            Guardar metas
          </Button>
        </div>
      </Card>
    </div>
  );
}
