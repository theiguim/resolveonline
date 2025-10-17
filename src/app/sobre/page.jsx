"use client"

import { useRef } from "react";
import "../../styles/FormPages.css";
import Link from "next/link";

export default function SobrePage() {

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
    <main className="page-container">
      <section id="sobre" className="page-container">
        <div className="text-content-sobre">
          <h1 className="page-title-alt">
            Nossa Missão é Simplificar Seus Direitos
          </h1>

          <img className="about-img" src="/images/about-img.jpg" alt="Imagem sobre a empresa" />
          <p>
            A Resolve Online nasceu da percepção de que muitos consumidores perdem direitos por não conhecerem os caminhos para reivindicá-los. Burocracia, linguagem técnica e processos demorados acabam desmotivando as pessoas a buscarem o que é justo.
          </p>
          <p>
            Nossa plataforma foi criada para ser o caminho mais curto e claro entre você e a solução do seu problema. Combinamos tecnologia de ponta com uma equipe de especialistas dedicados para analisar, orientar e atuar na defesa dos seus interesses em áreas críticas como finanças, viagens, serviços essenciais e saúde.
          </p>
          <p>
            Acreditamos em um acesso à justiça mais democrático e eficiente. Desde o primeiro clique em nossos simuladores até a resolução do seu caso, estamos ao seu lado, transformando a complexidade em clareza e a frustração em resultado.
          </p>
        </div>
      </section>

      <section className="services-landing" id='services'>
        <h1 className="services-landing-title">Confira também:</h1>
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

        <div className="services-controls" style={{ maxWidth: 940, margin: '0 auto', paddingLeft: 10 }}>
          <button onClick={scrollLeft} className="scroll-btn">←</button>
          <button onClick={scrollRight} className="scroll-btn" style={{ marginLeft: 8 }}>→</button>
        </div>
      </section>
    </main>
  );
}
