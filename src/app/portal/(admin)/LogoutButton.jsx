'use client';

import { useRouter } from 'next/navigation';
// CORREÇÃO: Importamos a FUNÇÃO 'createClient' em vez da instância 'supabase'
import { createClient } from '@/lib/supabase/client'; 
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();
  // CORREÇÃO: Criamos a instância do cliente aqui dentro do componente
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      // Redireciona para o login do portal
      router.push('/portal/login');
      router.refresh(); // Garante a atualização da sessão
    } else {
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      // Usando as cores do seu tema definidas no tailwind.config.js
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-bold cursor-pointer transition-all duration-300
                 bg-gradient-to-r from-hard-blue to-medium-blue 
                 hover:from-medium-blue hover:to-hard-blue hover:scale-[1.02]"
    >
      <LogOut className="w-5 h-5" />
      Sair
    </button>
  );
}

