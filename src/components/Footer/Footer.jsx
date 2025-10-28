'use client';

import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div>
          <img className='logo-footer'  src="/images/logo-footer-main.png" alt="" />
          {/* <p>Seus direitos, nossa luta.</p> */}
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
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/termos">Termos de Uso</Link></li>
            <li><Link href="/privacidade">Política de Privacidade</Link></li>
          </ul>
        </div>

        <div>
          <h2>Contato</h2>
          <ul>
            <li><Link href="mailto:contato@resolveonline.com.br">contato@resolveonline.com.br</Link></li>
            <li><Link href="https://wa.me/553184815969?text=Ol%C3%A1,%20eu%20gostaria%20de%20conhecer%20melhor%20a%20Resolve%20Online." target="_blank">(31) 8481-5969</Link></li>
            <li>Atendimento Nacional</li>
          </ul>
        </div>
      </div>

      <p className="footer-last">
        © 2025 Resolve Online. Todos os direitos reservados.
      </p>
    </footer>
  );
}
