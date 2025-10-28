"use client"

import { useRef } from "react";
import "../../../styles/FormPages.css";
import Link from "next/link";
import RelatedServices from "@/components/RelatedServices/RelatedServices";

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

      <RelatedServices />
    </main>
  );
}
