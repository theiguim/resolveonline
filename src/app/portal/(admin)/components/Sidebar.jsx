'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '../LogoutButton'; // Ajuste o caminho se necessário

// Ícones
import {
  LayoutDashboard,
  ClipboardList,
  Newspaper,
  X,
} from 'lucide-react';

// Componente NavLink interno
function NavLink({ item }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  
  return (
    <Link
      href={item.href}
      className={`flex items-center p-3 rounded-lg transition-colors
        ${
          isActive
            ? 'bg-medium-blue text-white shadow-lg' // Estilo Ativo
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }
      `}
    >
      <item.icon className="w-5 h-5" />
      <span className="ml-3 font-medium">{item.label}</span>
    </Link>
  );
}

// Conteúdo da Sidebar (reutilizado)
const SidebarContent = ({ user }) => {
  const menuItems = [
    { href: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/portal/formularios', label: 'Formulários', icon: ClipboardList },
    { href: '/portal/admin-blog', label: 'Gerenciar Blog', icon: Newspaper },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-center">
        <Image
          src="/images/logo-header-main.png" // Assumindo que a logo está em public/images/logo.png
          alt="Resolve Online Logo"
          width={160}
          height={45}
          priority
        />
      </div>
      
      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>
      
      {/* Rodapé da Sidebar com Botão de Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate" title={user.email}>
          {user.email}
        </p>
        <LogoutButton /> {/* Botão de logout é um Client Component */}
      </div>
    </div>
  );
};

// Componente principal da Sidebar
export default function Sidebar({ user, isMobileOpen, onClose }) {
  return (
    <>
      {/* Sidebar para Desktop */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md hidden lg:flex flex-col flex-shrink-0">
        <SidebarContent user={user} />
      </aside>

      {/* Overlay e Menu Mobile */}
      {isMobileOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          ></div>
          {/* Menu */}
          <aside className="fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col lg:hidden animate-fadeIn">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-500 dark:text-gray-400"
              aria-label="Fechar menu"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="mt-12"> {/* Espaço para o botão de fechar */}
              <SidebarContent user={user} />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
