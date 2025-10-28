// ... outros imports
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServer } from '@/lib/supabase/server'; 
import PortalLayout from './components/PortalLayout'; 

async function checkAuth() {
  const cookieStore = await cookies();
  const supabase = createServer(cookieStore);
  
  // ---- MUDE ISTO ----
  // ANTES: const { data: { session } } = await supabase.auth.getSession();
  const { data, error } = await supabase.auth.getUser();
  // ---- FIM DA MUDANÇA ----
  
  // Se houver erro ou não houver usuário, redirecione
  if (error || !data.user) {
    redirect('/portal/login'); 
  }
  
  // Retorne o objeto 'user' diretamente
  return data.user; 
}

export default async function PortalAdminLayout({ children }) {
  // Renomeie 'session' para 'user' para clareza
  const user = await checkAuth(); 

  return (
    // Passe o 'user' em vez de 'session'
    <PortalLayout user={user}> 
      {children}
    </PortalLayout>
  );
}
