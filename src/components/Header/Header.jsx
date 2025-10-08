'use client';

import Link from 'next/link';
import './Header.css';

export default function Header() {
  return (
    <header>
      <h1>Logo</h1>
      <nav>
        <ul>
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
