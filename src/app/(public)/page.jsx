'use client';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useEffect, useRef, useState } from 'react';
import "../../styles/Landing.css";
import Link from 'next/link';
import Carousel from '@/components/Carousel/Carousel';
import Faq from '@/components/Faq/Faq';

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

  // ---------- ServiceScroll ----------

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };


  return (
    <main className="main-page">
      <section className="hero-section">
        <div className='hero-section-wrapper'>
          <div className="hero-content">
            <h1>Seus Direitos, Nossa Luta.</h1>
            <p>
              <strong>Resolvemos problemas</strong> com <strong>golpes Pix</strong>, <strong>voos cancelados</strong>, <strong>cobranças indevidas</strong> de energia e negativas de <strong>planos de saúde</strong>.
              Veja se você tem direito.
            </p>
            <a href="#services"><button className="btn">Verificar meus direitos</button></a>
          </div>
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

      <section className="services" id='services'>
        <div className="services-txt">
          <h2>O que fazemos por você?</h2>
          <p>
            “Conte o que aconteceu e <strong>nós cuidamos de tudo</strong>. <strong>A Resolve garante seu direito de forma simples e rápida</strong>.
          </p>
        </div>

        <div className="services-content" ref={scrollRef}>
          <div className="service-element">
            <img
              className="service-element-ico"
              src="https://img.icons8.com/?size=100&id=uqpbD9vhCDEQ&format=png&color=0d3074"
              alt="Fraude Pix"
            />

            <img className='service-element-img' src="/images/services-img/pix.png" alt="" />
            <h2>Fraudes com Pix (MED)</h2>
            <p>Caiu em um golpe? Auxiliamos você a acionar o Mecanismo Especial de Devolução para reaver seu dinheiro.</p>
            {/* <a href="/pix">Verificar meu caso →</a> */}
            <Link href="/pix"><button className='btn'>Verificar meu caso</button></Link>
          </div>

          <div className="service-element">
            <img
              className="service-element-ico"
              src="https://img.icons8.com/?size=100&id=12665&format=png&color=0d3074"
              alt="Direito do Passageiro Aéreo"
            />

            <img className='service-element-img' src="/images/services-img/aereo.png" alt="" />
            <h2>Direito do Passageiro Aéreo</h2>
            <p>Voo atrasado, cancelado ou overbooking? Calcule sua indenização e conheça seus direitos.</p>
            {/* <a href="/aereo">Calcular indenização →</a> */}
            <Link href="/aereo"><button className='btn'>Calcular indenização</button></Link>
          </div>

          <div className="service-element">
            <img
              className="service-element-ico"
              src="https://img.icons8.com/?size=100&id=08VQFUNfGTux&format=png&color=0d3074"
              alt="Interrupção de Energia"
            />
            <img className='service-element-img' src="/images/services-img/energia.png" alt="" />
            <h2>Interrupção de Energia</h2>
            <p>Ficou sem luz por muito tempo? Você pode ter direito a créditos por descumprimento dos limites DIC/FIC.</p>
            {/* <a href="/energia">Analisar fatura →</a> */}
            <Link href="/energia"><button className='btn'>Analisar fatura</button></Link>
          </div>

          <div className="service-element">
            <img
              className="service-element-ico"
              src="https://img.icons8.com/?size=100&id=35588&format=png&color=0d3074"
              alt="Planos de Saúde"
            />

            <img className='service-element-img' src="/images/services-img/saude.png" alt="" />
            <h2>Planos de Saúde (ANS)</h2>
            <p>Negativa de cobertura, reajuste abusivo ou descumprimento de prazos? Saiba o que fazer.</p>
            {/* <a href="/saude">Conhecer meus direitos →</a> */}
            <Link href="/saude"><button className='btn'>Conhecer meus direitos</button></Link>
          </div>
        </div>

        <div className="services-controls" style={{ maxWidth: 1260, margin: '0 auto', paddingLeft: 10 }}>
          <button onClick={scrollLeft} className="scroll-btn">←</button>
          <button onClick={scrollRight} className="scroll-btn" style={{ marginLeft: 8 }}>→</button>
        </div>
      </section>

      {/* Passo a Passo */}
      <div className="passo-a-passo-container">
        <div className="passo-a-passo-header">
          <small>COMO FUNCIONA</small>
          <h2>
            Entenda em <strong className="medium-blue">3 passos simples</strong> como garantimos seu direito.
          </h2>
          <p>
            Você informa o ocorrido, nós cuidamos de toda a parte jurídica e o valor chega direto na sua conta.
            Sem papelada, sem audiências e sem enrolação.
          </p>
        </div>

        {/* timeline (substitua a parte correspondente) */}
        <div id="timeline" className="timeline">
          <div id="timeline-fill" className="timeline-fill" style={{ height: 0 }}></div>

          <div className="timeline-item" data-step="1">
            <div className="timeline-icon"><i className="fas fa-clock"></i></div>
            <div className="step-content">
              <small>PASSO 1</small>
              <h4>Preencha o formulário em poucos minutos</h4>
              <p>Após nos enviar, garantimos rapidez e total segurança aos seus dados.</p>
            </div>
          </div>

          <div className="timeline-item" data-step="2">
            <div className="timeline-icon"><i className="fas fa-check-square"></i></div>
            <div className="step-content">
              <small>PASSO 2</small>
              <h4>Deixe que nossa equipe especializada cuide de tudo</h4>
              <p>Entramos em contato com a parte responsável, conduzimos toda a negociação e acompanhamos o andamento até a solução do seu caso.</p>
            </div>
          </div>

          <div className="timeline-item" data-step="3">
            <div className="timeline-icon"><i className="fas fa-credit-card"></i></div>
            <div className="step-content">
              <small>PASSO 3</small>
              <h4>Receba o valor da indenização com segurança</h4>
              <p>Assim que o caso é finalizado, o pagamento é processado e o valor chega até você de forma simples e transparente.</p>
            </div>
          </div>
        </div>
      </div>

      <Faq serviceType="geral" />

    </main>
  );
}
