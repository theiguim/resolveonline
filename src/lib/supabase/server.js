// src/lib/supabase/server.js
import { createServerClient } from '@supabase/ssr';

// ✅ Aceita o cookieStore como argumento
export const createServer = (cookieStore) => {
  // 🔒 Usa variáveis seguras no ambiente do servidor
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // ⚠️ Log de fallback — útil para detectar se as variáveis estão faltando no build
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Variáveis do Supabase ausentes no build (SUPABASE_URL/ANON_KEY).');
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (_) {}
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (_) {}
      },
    },
  });
};
