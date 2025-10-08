'use client';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useEffect } from 'react';
import "./../styles/Landing.css";

export default function Home() {

  useEffect(() => {
    // ---------- TIMELINE ----------
    const timeline = document.getElementById('timeline');
    const fillBar = document.getElementById('timeline-fill');
    const items = document.querySelectorAll('.timeline-item');

    function updateTimeline() {
      if (!timeline) return;

      const timelineRect = timeline.getBoundingClientRect();
      const timelineTop = timelineRect.top;
      const triggerPoint = window.innerHeight * 0.50;
      const timelineHeight = timelineRect.height;

      let scrollYOffset = triggerPoint - timelineTop;
      let fillHeight = Math.max(0, scrollYOffset);
      fillHeight = Math.min(fillHeight, timelineHeight);

      fillBar.style.height = `${fillHeight}px`;

      items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const icon = item.querySelector('.timeline-icon');

        if (itemRect.top < triggerPoint) {
          icon.classList.add('active');
        } else {
          icon.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', updateTimeline);
    window.addEventListener('resize', updateTimeline);
    updateTimeline();

    // ---------- FAQ ACCORDION ----------
    const accordion = document.getElementById('faqAccordion');
    if (accordion) {
      accordion.addEventListener('click', function (e) {
        const header = e.target.closest('.accordion-header');
        if (!header) return;

        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        const body = header.nextElementSibling;

        document.querySelectorAll('.accordion-header[aria-expanded="true"]').forEach(openHeader => {
          if (openHeader !== header) {
            openHeader.setAttribute('aria-expanded', 'false');
            openHeader.nextElementSibling.style.maxHeight = 0;
          }
        });

        if (isExpanded) {
          header.setAttribute('aria-expanded', 'false');
          body.style.maxHeight = 0;
        } else {
          header.setAttribute('aria-expanded', 'true');
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    }

    // Cleanup para evitar múltiplos binds em hot reload
    return () => {
      window.removeEventListener('scroll', updateTimeline);
      window.removeEventListener('resize', updateTimeline);
      if (accordion) accordion.replaceWith(accordion.cloneNode(true)); // remove os event listeners
    };
  }, []);



  return (
    <main>
      <section className="hero-section">
        <div className="hero-content">
          <h1>Seus Direitos, Nossa Luta.</h1>
          <p>
            Resolvemos problemas com golpes Pix, voos cancelados, cobranças indevidas de energia e negativas de planos de saúde.
            Veja se você tem direito.
          </p>
          <button className="btn">Fale Conosco</button>
        </div>
      </section>

      <section className="range-info">
        <h2>
          A sua <strong className="medium-blue">solução</strong> está conosco!
        </h2>

        <div className="range-content">
          <div className="info-element">
            <img src="/images/icos/15anos.png" alt="15 anos de atuação" />
            <h3>Há 15 anos de atuação.</h3>
          </div>
          <div className="info-element">
            <img src="/images/icos/nacional.png" alt="Atuação Nacional" />
            <h3>Atuação Nacional</h3>
          </div>
          <div className="info-element">
            <img src="/images/icos/seguro.png" alt="Métricas LGPD" />
            <h3>Métricas LGPD.</h3>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="services-txt">
          <h2>Áreas de atuação</h2>
          <p>
            Oferecemos suporte jurídico e soluções personalizadas para cada tipo de problema.
            Nossa equipe analisa seu caso e orienta o melhor caminho para fazer valer seus direitos.
          </p>
        </div>

        <div className="services-content">
          <div className="service-element">
            <img
              className="service-element-ico"
              src="https://img.icons8.com/?size=100&id=uqpbD9vhCDEQ&format=png&color=0d3074"
              alt="Fraude Pix"
            />
            <h2>Fraudes com Pix (MED)</h2>
            <p>Caiu em um golpe? Auxiliamos você a acionar o Mecanismo Especial de Devolução para reaver seu dinheiro.</p>
            <a href="/pix">Verificar meu caso →</a>
          </div>

          <div className="service-element">
            <img
              className="service-element-ico"
              src="https://img.icons8.com/?size=100&id=12665&format=png&color=0d3074"
              alt="Direito do Passageiro Aéreo"
            />
            <h2>Direito do Passageiro Aéreo</h2>
            <p>Voo atrasado, cancelado ou overbooking? Calcule sua indenização e conheça seus direitos.</p>
            <a href="/aereo">Calcular indenização →</a>
          </div>

          <div className="service-element">
            <img
              className="service-element-ico"
              src="https://img.icons8.com/?size=100&id=08VQFUNfGTux&format=png&color=0d3074"
              alt="Interrupção de Energia"
            />
            <h2>Interrupção de Energia</h2>
            <p>Ficou sem luz por muito tempo? Você pode ter direito a créditos por descumprimento dos limites DIC/FIC.</p>
            <a href="/energia">Analisar fatura →</a>
          </div>

          <div className="service-element">
            <img
              className="service-element-ico"
              src="https://img.icons8.com/?size=100&id=35588&format=png&color=0d3074"
              alt="Planos de Saúde"
            />
            <h2>Planos de Saúde (ANS)</h2>
            <p>Negativa de cobertura, reajuste abusivo ou descumprimento de prazos? Saiba o que fazer.</p>
            <a href="/saude">Conhecer meus direitos →</a>
          </div>
        </div>
      </section>

      {/* Passo a Passo */}
      <div className="passo-a-passo-container">
        <div className="passo-a-passo-header">
          <small>COMO FUNCIONA</small>
          <h2>
            Siga estas <strong className="medium-blue">3 etapas</strong> para garantir sua indenização
          </h2>
          <p>
            Receber sua indenização de voo nunca foi tão fácil. Nós cuidamos de toda a parte burocrática e você recebe
            sem complicações.
          </p>
        </div>

        {/* timeline (substitua a parte correspondente) */}
        <div id="timeline" className="timeline">
          <div id="timeline-fill" className="timeline-fill" style={{ height: 0 }}></div>

          <div className="timeline-item" data-step="1">
            <div className="timeline-icon"><i className="fas fa-clock"></i></div>
            <div className="step-content">
              <small>PASSO 1</small>
              <h4>Faça seu pedido de indenização em 2 min</h4>
              <p>Garantimos rapidez e total segurança aos seus dados.</p>
            </div>
          </div>

          <div className="timeline-item" data-step="2">
            <div className="timeline-icon"><i className="fas fa-check-square"></i></div>
            <div className="step-content">
              <small>PASSO 2</small>
              <h4>A gente cuida de tudo pra você</h4>
              <p>Negociamos com a companhia aérea e cuidamos de todo o processo.</p>
            </div>
          </div>

          <div className="timeline-item" data-step="3">
            <div className="timeline-icon"><i className="fas fa-credit-card"></i></div>
            <div className="step-content">
              <small>PASSO 3</small>
              <h4>Você recebe sua indenização</h4>
              <p>Assim que a companhia paga, transferimos para sua conta.</p>
            </div>
          </div>
        </div>
      </div>
      {/* FAQ */}
      <section className="faq">
        <div className="faq-container">
          <div className="faq-grid">
            <div className="faq-header">
              <h2>Perguntas frequentes</h2>
              <p>
                Ficou com dúvida?{' '}
                <a href="#" className="help-link">
                  Entre em contato conosco
                </a>
              </p>
            </div>

            <div className="faq-content" id="faqAccordion">
              <div className="accordion-item">
                <button className="accordion-header" aria-expanded="false">
                  <span>Por que devo fazer meu pedido de indenização com a AirHelp?</span>
                  <i className="fas fa-chevron-down arrow-icon"></i>
                </button>
                <div className="accordion-body">
                  <p>
                    A AirHelp é a líder mundial em indenização de voos, cuidando de toda a burocracia para você.
                    Nossos especialistas garantem o máximo de sucesso com o mínimo de esforço de sua parte.
                  </p>
                </div>
              </div>

              <div className="accordion-item">
                <button className="accordion-header" aria-expanded="false">
                  <span>Quais documentos são necessários para dar entrada em um pedido de indenização?</span>
                  <i className="fas fa-chevron-down arrow-icon"></i>
                </button>
                <div className="accordion-body">
                  <p>
                    Normalmente, precisamos apenas da sua <strong>reserva de voo</strong> (e-ticket ou número da reserva)
                    e dos <strong>detalhes dos passageiros</strong> para iniciarmos o processo de análise.
                  </p>
                </div>
              </div>

              <div className="accordion-item">
                <button className="accordion-header" aria-expanded="false">
                  <span>É possível pedir indenização para quem viajou comigo?</span>
                  <i className="fas fa-chevron-down arrow-icon"></i>
                </button>
                <div className="accordion-body">
                  <p>
                    Sim, você pode incluir outros passageiros da mesma reserva, desde que tenha a autorização deles
                    para fazer o pedido em nome de todos.
                  </p>
                </div>
              </div>

              <div className="accordion-item">
                <button className="accordion-header" aria-expanded="false">
                  <span>Há algum limite de prazo para fazer meu pedido de indenização?</span>
                  <i className="fas fa-chevron-down arrow-icon"></i>
                </button>
                <div className="accordion-body">
                  <p>
                    O prazo varia dependendo do país e da legislação aplicável. Em muitos casos, você pode reivindicar voos
                    de até <strong>3 anos</strong> atrás. É melhor verificar o quanto antes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
