import { redirect } from 'next/navigation';

// Esta página serve apenas para redirecionar o usuário
// do /portal para o /portal/dashboard.
// O middleware já terá garantido que o usuário está logado
// antes de chegar aqui.

export default function PortalRootPage() {
  redirect('/portal/dashboard');
  
  // Você pode retornar null ou um componente de loading,
  // mas o redirect() já cuida de tudo.
  return null;
}
