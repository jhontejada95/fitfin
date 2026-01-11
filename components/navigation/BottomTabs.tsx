'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/registrar', label: 'Registrar' },
  { href: '/deudas', label: 'Deudas' },
  { href: '/historico', label: 'Histórico' },
  { href: '/como-usar', label: 'Cómo usar' }
];

export const BottomTabs = () => {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 md:hidden">
      <div className="flex justify-around text-xs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 py-3 text-center ${isActive ? 'text-emerald-300' : 'text-slate-400'}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
