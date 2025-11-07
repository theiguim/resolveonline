// src/components/UtmWrapper.jsx
'use client';
import React, { useEffect } from 'react';
import { useUtmParams } from '@/hooks/useUtmParams';

// Este componente lê e armazena os UTMs, mas não renderiza nada visível
const UtmWrapper = ({ onUtmsReady }) => {
  const utmParams = useUtmParams();

  useEffect(() => {
    // Quando os UTMs estiverem prontos (lidos da URL), chama o callback
    if (Object.keys(utmParams).length > 0) {
      // Opcional: Salva no sessionStorage para persistência entre LPs
      if (typeof window !== 'undefined') {
          sessionStorage.setItem('resolved_utms', JSON.stringify(utmParams));
      }
      onUtmsReady(utmParams);
    }
  }, [utmParams, onUtmsReady]);

  return null; // Não renderiza nada
};

export default UtmWrapper;