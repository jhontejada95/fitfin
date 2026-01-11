import { ChangeEvent } from 'react';

interface InputProps {
  label: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  type?: string;
  placeholder?: string;
  inputMode?: 'numeric' | 'text';
  helper?: string;
}

export const Input = ({ label, helper, ...props }: InputProps) => {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <input {...props} />
      {helper ? <span className="text-xs text-slate-400">{helper}</span> : null}
    </label>
  );
};
