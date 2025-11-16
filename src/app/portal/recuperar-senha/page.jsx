'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import '../login/login.css'; // Reutilizando seu CSS de login

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const supabase = createClient();

  // URL para onde o Supabase deve redirecionar (DEVE estar na lista de permissões)
  const getRedirectURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Defina isso nas suas variáveis de ambiente
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Suporte para Vercel
      'http://resolveonline.vercel.app/';
    
    // Garante que termine com /
    url = url.includes('http') ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    
    return `${url}redefinir-senha`; // Sua página de redefinição
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const redirectUrl = getRedirectURL();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      setError('Erro ao enviar e-mail: ' + error.message);
    } else {
      setMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <Image
            src="/images/logo-header-main.png"
            alt="Resolve Online Logo"
            width={250}
            height={70}
            priority
          />
        </div>

        <h2 className="login-title">Recuperar Senha</h2>

        {/* Se a mensagem foi enviada, mostre-a e esconda o formulário */}
        {message ? (
          <div className="success-message">
            <p>{message}</p>
            <Link href="/login" className="login-button" style={{ textDecoration: 'none', marginTop: '20px', display: 'inline-block', padding: '10px 20px' }}>
              Voltar ao Login
            </Link>
          </div>
        ) : (
          <>
            <p className="login-subtitle" style={{ marginBottom: '20px' }}>
              Digite seu e-mail para enviarmos um link de redefinição.
            </p>
            <form onSubmit={handleSubmit} className="login-form">
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

              {error && <p className="error-message">{error}</p>}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}