'use client';
import { useSearchParams } from 'next/navigation';

export const useUtmParams = () => {
  if (typeof window === 'undefined') return {}; // evita erro no build

  const searchParams = useSearchParams();
  const utmParams = {};
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  keys.forEach(key => {
    const value = searchParams.get(key);
    if (value) utmParams[key] = value;
  });

  return utmParams;
};
