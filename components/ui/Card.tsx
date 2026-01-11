import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Card = ({ title, children, className }: CardProps) => {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow ${className ?? ''}`.trim()}>
      {title ? <h3 className="text-lg font-semibold mb-3">{title}</h3> : null}
      {children}
    </div>
  );
};
