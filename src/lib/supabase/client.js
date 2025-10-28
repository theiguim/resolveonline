// src/lib/supabase/client.js
// ESTE ARQUIVO É SEGURO PARA O CLIENTE (E SÓ PARA O CLIENTE)

import { createBrowserClient } from '@supabase/ssr';

// Note que não usamos 'cookies' ou 'next/headers' aqui.
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
