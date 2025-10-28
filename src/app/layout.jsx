// src/app/layout.jsx
import './globals.css'; // Importa estilos base e Tailwind

export const metadata = {
  title: 'Resolve Online',
  description: 'Defesa do consumidor simplificada',
};

/*
 * Layout raiz do Next.js — engloba tudo (admin, público, etc.)
 * NÃO deve conter Header/Footer nem fontes específicas.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
