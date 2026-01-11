'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCOP } from '@/lib/format';

interface Props {
  data: Array<{ name: string; value: number }>;
}

const colors = ['#38bdf8', '#4ade80', '#facc15', '#fb7185', '#a78bfa', '#f97316', '#2dd4bf', '#c084fc', '#f472b6', '#94a3b8'];

export const ExpensesDonut = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.name}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCOP(Number(value))} />
      </PieChart>
    </ResponsiveContainer>
  );
};
