// src/app/(public)/layout.jsx
import { Inter } from 'next/font/google';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

// Importa a fonte Inter (a original do projeto)
const inter = Inter({ subsets: ['latin'] });

export default function PublicLayout({ children }) {
  return (
    <div className={inter.className}>
      {/* Botão fixo do WhatsApp */}
      <a
        href="https://wa.me/553184815969?text=Ol%C3%A1,%20eu%20gostaria%20de%20conhecer%20melhor%20a%20Resolve%20Online."
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="wpp-fixed"
          src="/images/wpp-fixed.png"
          alt="whatsapp link"
        />
      </a>

      {/* Cabeçalho e conteúdo principal */}
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
