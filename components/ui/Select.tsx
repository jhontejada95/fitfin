import { ChangeEvent, ReactNode } from 'react';

interface SelectProps {
  label: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
  helper?: string;
}

export const Select = ({ label, helper, children, ...props }: SelectProps) => {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <select {...props}>{children}</select>
      {helper ? <span className="text-xs text-slate-400">{helper}</span> : null}
    </label>
  );
};
