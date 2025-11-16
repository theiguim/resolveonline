'use client';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useEffect, useRef, useState } from 'react'; 
import "../../styles/Landing.css";
import Link from 'next/link';
import Carousel from '@/components/Carousel/Carousel';
import Faq from '@/components/Faq/Faq';

export default function Home() {

  // ==========================================================
  // LÓGICA DO CARROSSEL HERO (JÁ ESTÁ COM 5 SEGUNDOS)
  // ==========================================================

  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Seus Direitos, Nossa Luta.",
      text: (
        <>
          <strong>Resolvemos problemas</strong> com <strong>golpes Pix</strong>, <strong>voos cancelados</strong>, <strong>cobranças indevidas</strong> de energia e negativas de <strong>planos de saúde</strong>.
          Veja se você tem direito.
        </>
      ),
      image: "/images/teste2.jpg" // Imagem geral
    },
    {
      title: "Caiu em um Golpe Pix?",
      text: (
        <>
          Não se desespere. Auxiliamos você a acionar o <strong>Mecanismo Especial de Devolução (MED)</strong> para reaver seu dinheiro de forma rápida.
        </>
      ),
      image: "/hero/pix_hero.jpg" // Imagem do Pix
    },
    {
      title: "Problemas com seu Voo?",
      text: (
        <>
          <strong>Voo atrasado, cancelado ou overbooking?</strong> Calcule sua indenização e conheça seus direitos antes de decolar.
        </>
      ),
      image: "/hero/aereo_hero.jpg" // Imagem Aéreo
    },
    {
      title: "Negativa do Plano de Saúde?",
      text: (
        <>
          <strong>Negativa de cobertura</strong>, reajuste abusivo ou descumprimento de prazos? Saiba o que fazer para garantir seu tratamento.
        </>
      ),
      image: "/hero/saude_hero.jpg" // Imagem Saúde
    },
    {
      title: "Conta de Energia Indevida?",
      text: (
        <>
          Ficou <strong>sem luz por muito tempo</strong> ou sua conta veio com <strong>cobranças erradas</strong>? Você pode ter direito a créditos e compensações.
        </>
      ),
      image: "/hero/energia_hero.jpg" // Imagem Energia
    }
  ];

  const totalSlides = heroSlides.length;

  // Efeito para o carrossel automático
  useEffect(() => {
    // ESTE INTERVALO JÁ ESTÁ EM 5000ms (5 SEGUNDOS)
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); 

    return () => clearInterval(slideInterval);
  }, [totalSlides]);

  // ==========================================================
  // LÓGICA ORIGINAL (Timeline, FAQ) - MANTIDA
  // ==========================================================
  
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

    return () => {
      window.removeEventListener('scroll', updateTimeline);
      window.removeEventListener('resize', updateTimeline);
      if (accordion) accordion.replaceWith(accordion.cloneNode(true));
    };
  }, []);

  // ---------- ServiceScroll (MANTIDO) ----------
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
      
      {/* ========================================================== */}
      {/* SEÇÃO HERO ATUALIZADA (MUDANÇA ESTRUTURAL) */}
      {/* ========================================================== */}
      <section className="hero-section">
  
        {/* 1. ESTE NOVO 'TRACK' VAI CONTER TODOS OS SLIDES */}
        <div 
          className="hero-slides-track"
          // 2. A MÁGICA ACONTECE AQUI: O 'track' desliza multiplicando 
          //    o slide atual por -100%
          style={{ transform: `translateX(-${currentSlide * 113}%)` }}
        >
          {/* Mapeia e renderiza todos os slides LADO A LADO */}
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              // 3. A classe 'active' não é mais necessária aqui
              className="hero-section-wrapper hero-slide"
              style={{
                backgroundImage: `linear-gradient(to right, #091735ec 8%, #091735c4 45%, #09173518 60%), url(${slide.image})`
              }}
            >
              <div className="hero-content">
                <h1>{slide.title}</h1>
                <p>{slide.text}</p>
                <a href="#services"><button className="btn">Verificar meus direitos</button></a>
              </div>
            </div>
          ))}
        </div>

        {/* Pontos de Navegação (MANTIDOS) */}
        <div className="hero-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)} 
            />
          ))}
        </div>
      </section>
      {/* ========================================================== */}
      {/* FIM DA SEÇÃO HERO ATUALIZADA */}
      {/* ========================================================== */}


      {/* RESTANTE DO SEU CÓDIGO ORIGINAL - MANTIDO */}
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