'use client';

import { Search, Menu } from 'lucide-react';

export default function Header({ user, onMenuClick }) {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      
      {/* Botão de Menu Mobile */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 text-gray-700 dark:text-gray-300"
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Caixa de Busca (Desktop) */}
    {/*  <div className="hidden md:flex items-center">
        <input
          type="text"
          placeholder="Buscar..."
          className="px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-medium-blue"
        />
        <button className="-ml-8 p-2 text-gray-500 hover:text-medium-blue">
          <Search className="w-5 h-5" />
        </button>
      </div> */}
      
      {/* Perfil do Usuário (Direita) */}
      <div className="flex items-center ml-auto"> {/* ml-auto para empurrar para a direita */}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block mr-3">
          Olá, {user.email.split('@')[0]}
        </span>
        <div className="w-10 h-10 rounded-full bg-medium-blue flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {user.email[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}
