'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import '../login/login.css'; // Reutilizando seu CSS de login

export default function RedefinirSenhaPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Função de validação de senha
  const validatePassword = (password) => {
    // Pelo menos 6 caracteres, 1 maiúscula, 1 número, 1 especial
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (!validatePassword(password)) {
      setError('A senha não atende aos requisitos de segurança.');
      return;
    }

    setLoading(true);

    // O SDK do Supabase já pegou o token da URL e configurou a sessão.
    // Agora podemos apenas atualizar a senha do usuário.
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError('Erro ao redefinir a senha: ' + error.message);
    } else {
      setMessage('Senha redefinida com sucesso! Redirecionando para o login...');
      // Redireciona para o login após um breve momento
      setTimeout(() => {
        router.push('/login');
      }, 3000);
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

        <h2 className="login-title">Redefinir Senha</h2>

        {/* Se a mensagem de sucesso existir, mostre-a e esconda o form */}
        {message ? (
          <p className="success-message">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group password-group">
              <label htmlFor="password">Nova Senha</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/* Ícone de olho (copiado do seu login) */}
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" d="M3.981 18.004A8.966 8.966 0 0012 21.75c4.321 0 8.166-2.008 10.049-5.322M3.981 18.004A8.965 8.965 0 0112 12c.767 0 1.523.05 2.26.155M3.981 18.004L3.98 18c.02.01.04.018.061.025M12 21.75c-1.396 0-2.744-.336-4.008-.973M21.75 12c-.767 0-1.523-.05-2.26-.155M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /> </svg>
                  )}
                </span>
              </div>
            </div>

            <div className="form-group password-group">
              <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Requisitos da senha */}
            <div className="password-requirements">
              <p>A senha deve conter:</p>
              <ul>
                <li>Pelo menos 6 caracteres</li>
                <li>Pelo menos 1 letra maiúscula</li>
                <li>Pelo menos 1 número</li>
                <li>Pelo menos 1 caractere especial (ex: !@#$%)</li>
              </ul>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}