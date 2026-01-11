import './globals.css';
import { ReactNode } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { BottomTabs } from '@/components/navigation/BottomTabs';
import { ClientHydrate } from '@/app/ClientHydrate';

export const metadata = {
  title: 'FitFin',
  description: 'Dashboard financiero para uso mensual'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ClientHydrate />
        <div className="md:flex">
          <Sidebar />
          <main className="flex-1 px-4 pb-20 md:pb-8 md:px-10 md:py-8">
            {children}
          </main>
        </div>
        <BottomTabs />
      </body>
    </html>
  );
}
