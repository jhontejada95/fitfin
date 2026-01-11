'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/registrar', label: 'Registrar datos' },
  { href: '/deudas', label: 'Deudas & Unificación' },
  { href: '/historico', label: 'Histórico' },
  { href: '/como-usar', label: 'Cómo usar' }
];

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:min-h-screen md:bg-slate-900 md:border-r md:border-slate-800 md:px-6 md:py-8">
      <div className="text-lg font-semibold mb-6">FitFin</div>
      <nav className="space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-lg ${
                active ? 'bg-emerald-500 text-slate-950 font-medium' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
