import { Inter } from 'next/font/google';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Resolve Online',
  description: 'Defesa do consumidor simplificada',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <a href="https://wa.me/553184815969?text=Ol%C3%A1,%20eu%20gostaria%20de%20conhecer%20melhor%20a%20Resolve%20Online."
          target="_blank"><img className="wpp-fixed" src="/images/wpp-fixed.png" alt="whatsapp link" /></a>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
