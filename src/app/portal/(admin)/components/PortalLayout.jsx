'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

// ATUALIZADO: Recebe 'user' diretamente, em vez de 'session'
export default function PortalLayout({ user, children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        // ATUALIZADO: Passa 'user'
        user={user} 
        isMobileOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0"> {/* Adicionado min-w-0 para evitar overflow */}
        <Header
          // ATUALIZADO: Passa 'user'
          user={user}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        {/* Esta é a parte que você incluiu corretamente */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

