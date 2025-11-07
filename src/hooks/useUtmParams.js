// Este hook usa a API do Next.js (useSearchParams) para ler os parâmetros da URL.
// Lembre-se de adicionar o "use client" se a função for chamada em um Server Component.
import { useSearchParams } from 'next/navigation';

export const useUtmParams = () => {
  // useSearchParams só funciona em componentes do lado do cliente ('use client')
  const searchParams = useSearchParams();
  const utmParams = {};

  // Lista dos parâmetros UTMs padrão que queremos rastrear
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  keys.forEach(key => {
    // Tenta obter o valor de cada parâmetro na URL
    const value = searchParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  // Retorna um objeto limpo, por exemplo: { utm_source: 'google', utm_medium: 'cpc' }
  return utmParams;
};