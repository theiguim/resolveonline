'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client'; // Importa o cliente Supabase do lado do cliente
import { useRouter } from 'next/navigation';
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/esconder senha
  const router = useRouter();
  const supabase = createClient(); // Cria a instância do cliente Supabase para o cliente

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Redireciona para o dashboard após o login bem-sucedido
    // O middleware já vai garantir que ele seja redirecionado se já estiver logado
    router.push('/portal/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <Image
            src="/images/logo-header-main.png" // Caminho para sua logo na pasta public
            alt="Resolve Online Logo"
            width={250}
            height={70}
            priority
          />
        </div>

        <h2 className="login-title">Acesso ao Portal</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Senha</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  // Ícone de olho aberto
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  // Ícone de olho fechado
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.981 18.004A8.966 8.966 0 0012 21.75c4.321 0 8.166-2.008 10.049-5.322M3.981 18.004A8.965 8.965 0 0112 12c.767 0 1.523.05 2.26.155M3.981 18.004L3.98 18c.02.01.04.018.061.025M12 21.75c-1.396 0-2.744-.336-4.008-.973M21.75 12c-.767 0-1.523-.05-2.26-.155M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                )}
              </span>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
