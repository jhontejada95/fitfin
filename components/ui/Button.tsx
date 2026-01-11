import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

const variantClasses = {
  primary: 'bg-emerald-500 hover:bg-emerald-600 text-slate-950',
  secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100',
  ghost: 'bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-100'
};

export const Button = ({ variant = 'primary', className, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-medium transition ${variantClasses[variant]} ${
        className ?? ''
      }`}
    />
  );
};
