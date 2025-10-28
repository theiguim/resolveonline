/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Permite alternar modo escuro
  
  // CORREÇÃO: Adicionamos 'src/' aos caminhos
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', 
  ],
  
  theme: {
    extend: {
      // Adicionando suas cores personalizadas ao tema do Tailwind
      colors: {
        'soft-blue': '#ebf5ff',
        'medium-blue': '#0958d7',
        'hard-blue': '#0d3074',
      },
      // Animação de fade-in para as páginas
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

