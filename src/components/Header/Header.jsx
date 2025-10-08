'use client';

import { useState } from 'react';
import Link from 'next/link';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">
        <Link href="/">Logo</Link>
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
          <li><Link href="/">Início</Link></li>
          <li><Link href="/pix">PIX</Link></li>
          <li><Link href="/aereo">Aéreo</Link></li>
          <li><Link href="/energia">Energia</Link></li>
          <li><Link href="/saude">Saúde</Link></li>
          <li><Link href="/sobre">Sobre</Link></li>
          <li><Link href="/contato">Contato</Link></li>
        </ul>
      </nav>

      <button className="btn">Fale Conosco</button>
    </header>
  );
}
