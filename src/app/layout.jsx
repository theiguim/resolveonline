// src/app/layout.jsx
import './globals.css'; // Importa estilos base e Tailwind

export const metadata = {
  metadataBase: new URL("https://resolveonline.com.br"),
  title: {
    default: "Resolve Online — Defesa do consumidor simplificada",
    template: "%s • Resolve Online",
  },
  description:
    "A Resolve Online é uma plataforma jurídica digital que defende os direitos do consumidor de forma simples, rápida e segura. Atuamos em golpes Pix, voos cancelados, cobranças indevidas e negativas de planos de saúde.",
  applicationName: "Resolve Online",
  keywords: [
    "defesa do consumidor",
    "indenização",
    "reclamação online",
    "golpe Pix",
    "voo cancelado",
    "cobrança indevida",
    "plano de saúde",
    "direitos do consumidor",
    "advocacia digital",
    "resolver problema",
  ],
  authors: [
    { name: "Resolve Online", url: "https://resolveonline.com.br" },
    { name: "Maria Eduarda de Paula Barbosa", url: "https://www.linkedin.com/in/mariadpb" },
  ],
  creator: "Resolve Online",
  publisher: "Resolve Online",
  alternates: {
    canonical: "https://resolveonline.com.br",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#E53935" },
    ],
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0F2430" },
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://resolveonline.com.br",
    siteName: "Resolve Online",
    title: "Resolve Online — Seus direitos, nossa luta",
    description:
      "Recupere seus direitos de forma simples e digital. Golpes Pix, voos cancelados, cobranças indevidas e planos de saúde — nós resolvemos.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Resolve Online — Defesa do consumidor digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@resolveonline",
    creator: "@resolveonline",
    title: "Resolve Online — Defesa do consumidor digital",
    description:
      "Plataforma jurídica online que resolve seus problemas com segurança e agilidade.",
    images: ["/og-image.png"],
  },
  manifest: "/site.webmanifest",
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
