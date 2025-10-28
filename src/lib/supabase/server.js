// src/lib/supabase/server.js
// ESTE ARQUIVO É SEGURO PARA O SERVIDOR (E SÓ PARA O SERVIDOR)

import { createServerClient } from '@supabase/ssr';
// ✅ Mantenha este import, pois suas páginas e actions vão usá-lo
import { cookies } from 'next/headers'; 

// ✅ CORREÇÃO: A função agora ACEITA o cookieStore como argumento
export const createServer = (cookieStore) => {
 
 // ❌ A linha "const cookieStore = cookies()" foi REMOVIDA daqui.

 // Cria o cliente Supabase para o servidor
 return createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
   cookies: {
    get(name) {
     // Usa o cookieStore que foi passado como argumento
     return cookieStore.get(name)?.value;
    },
    set(name, value, options) {
     try {
      cookieStore.set({ name, value, ...options });
     } catch (error) {
      // Ignora erros (esperado em Server Actions)
     }
    },
    remove(name, options) {
     try {
      cookieStore.set({ name, value: '', ...options });
     } catch (error) {
      // Ignora erros (esperado em Server Actions)
     }
    },
   },
  }
 );
};