'use client';

import { useEffect } from 'react';
import { useHydrateFinance } from '@/store/financeStore';

export const ClientHydrate = () => {
  const hydrate = useHydrateFinance();
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return null;
};
