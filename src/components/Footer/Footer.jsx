'use client';

import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div>
          <h1>LOGO</h1>
          <p>Seus direitos, nossa luta.</p>
        </div>

        <div>
          <h2>Serviços</h2>
          <ul>
            <li><Link href="/pix">Fraude Pix</Link></li>
            <li><Link href="/aereo">Direito Aéreo</Link></li>
            <li><Link href="/energia">Interrupção de Energia</Link></li>
            <li><Link href="/saude">Planos de Saúde</Link></li>
          </ul>
        </div>

        <div>
          <h2>Institucional</h2>
          <ul>
            <li><Link href="/sobre">Sobre Nós</Link></li>
            <li><Link href="/termos">Termos de Uso</Link></li>
            <li><Link href="/privacidade">Política de Privacidade</Link></li>
          </ul>
        </div>

        <div>
          <h2>Contato</h2>
          <ul>
            <li><Link href="mailto:contato@resolveonline.com.br">contato@resolveonline.com.br</Link></li>
            <li><Link href="tel:+5500000000000">(XX) XXXXX-XXXX</Link></li>
            <li>Atendimento Nacional</li>
          </ul>
        </div>
      </div>

      <p className="footer-last">
        © 2025 Resolve Online. Todos os direitos reservados. Este é um site informativo e não substitui a consulta a
        um profissional.
      </p>
    </footer>
  );
}
