import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req) {
  // Criamos uma resposta. Isso é necessário para poder ler e escrever cookies.
  const res = NextResponse.next();

  // 1. Crie o cliente Supabase para o servidor (Middleware)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // 2. Pega a sessão do usuário
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;
  
  // URL da página de login do portal
  const loginUrl = '/portal/login';

  // 3. Regra de proteção
  // Rotas protegidas são tudo dentro de /portal/ EXCETO a própria página de login
  const isProtectedRoute = pathname.startsWith('/portal/') && pathname !== loginUrl;

  if (!session && isProtectedRoute) {
    // ...redireciona para a página de login do portal.
    const url = req.nextUrl.clone();
    url.pathname = loginUrl;
    return NextResponse.redirect(url);
  }

  // 4. Regra de redirecionamento de login
  // Se o usuário ESTÁ logado E está tentando acessar a página de login...
  if (session && pathname === loginUrl) {
    // ...redireciona para o dashboard do portal.
    const url = req.nextUrl.clone();
    url.pathname = '/portal/dashboard'; // A nova URL do dashboard
    return NextResponse.redirect(url);
  }

  // 5. Deixa a requisição continuar
  return res;
}

// 6. Configuração do Matcher
// Isso define QUAIS rotas vão passar pelo middleware.
// Agora ele monitora TUDO dentro de /portal/
export const config = {
  matcher: [
    '/portal/:path*',
  ],
};

