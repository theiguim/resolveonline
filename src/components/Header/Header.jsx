'use client';

import { useState } from 'react';
import Link from 'next/link';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">
        <Link href="/"><img className='logo-header' src="/images/logo-header-main.png" alt="" /></Link>
      </div>

      <div
        className={`menu-toggle ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link href="/" onClick={() => setMenuOpen(false)}>Início</Link></li>
          <li><Link href="/pix" onClick={() => setMenuOpen(false)}>PIX</Link></li>
          <li><Link href="/aereo" onClick={() => setMenuOpen(false)}>Aéreo</Link></li>
          <li><Link href="/energia" onClick={() => setMenuOpen(false)}>Energia</Link></li>
          <li><Link href="/saude" onClick={() => setMenuOpen(false)}>Saúde</Link></li>
          <li><Link href="/sobre" onClick={() => setMenuOpen(false)}>Sobre</Link></li>
          <li><Link href="/contato" onClick={() => setMenuOpen(false)}>Contato</Link></li>
        </ul>
      </nav>

      <Link className='btn-header' href="/contato"><button className="btn">Fale Conosco</button></Link>
    </header>
  );
}
