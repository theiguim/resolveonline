'use client';

import { useEffect } from 'react';
import { useUtmParams } from '@/hooks/useUtmParams';

/**
 * Componente client-side que captura os parâmetros UTM
 * e os repassa para o componente pai via callback.
 */
export default function UtmWrapper({ onUtmsReady }) {
  const utmParams = useUtmParams();

  useEffect(() => {
    if (onUtmsReady && Object.keys(utmParams).length > 0) {
      onUtmsReady(utmParams);
    }
  }, [utmParams, onUtmsReady]);

  return null; // não renderiza nada visível
}
