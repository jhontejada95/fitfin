'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCOP } from '@/lib/format';

interface Props {
  data: Array<{ name: string; value: number }>;
}

export const DebtPaymentsBars = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" tickFormatter={(value) => formatCOP(Number(value))} />
        <Tooltip formatter={(value) => formatCOP(Number(value))} />
        <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
