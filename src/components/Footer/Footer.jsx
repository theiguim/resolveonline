'use client';

import Link from 'next/link';
import './Footer.css';
// Importando ícones (Exemplo usando Lucide, mas pode ser FontAwesome)
import { Instagram, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">

        {/* --- COLUNA ESQUERDA (Estilo BitBloom) --- */}
        <div className="footer-left">
          {/* Logo */}
          <img
            className='logo-footer'
            src="/images/logo-footer-main.png"
            alt="Logo Resolve Online"
          />

          {/* Bloco de Dados da Empresa */}
          <div className="company-info">
            <p className="company-name">VIVO SERVIÇOS</p>
            <p className="company-cnpj">CNPJ: 26.433.875/0001-70</p>
            <a href="mailto:contato@resolveonline.com.br" className="company-email">
              contato@resolveonline.com.br
            </a>
          </div>

          {/* Ícones de Redes Sociais */}
          <div className="social-icons">
            <a href="https://www.instagram.com/resolveonline.oficial/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            {/* <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a> */}
            <a href="https://www.facebook.com/profile.php?id=61583416754138#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={20} />
            </a>
          </div>
        </div>

        {/* --- DEMAIS COLUNAS (Mantidas iguais) --- */}
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
            <li><Link href="https://wa.me/553184815969" target="_blank">(31) 8481-5969</Link></li>
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