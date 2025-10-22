import React, { useRef } from "react";
import "./Carousel.css";

export default function Carousel({ serviceType = "pix" }) {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 320, behavior: "smooth" });
  };

  // === Todos os slides disponíveis ===
  const slides = {
    pix: [
      {
        title: "Foi vítima de golpe com PIX?",
        text: "Você pode ter direito à devolução pelo Mecanismo Especial de Devolução (MED), disponível por até 80 dias.",
      },
      {
        title: "O banco pode ser responsabilizado!",
        text: "Se houve falha na segurança, ele deve ressarcir. Descubra em 1 minuto se tem direito.",
      },
      {
        title: "Golpe do amor? Boleto falso? Não importa!",
        text: "Se o dinheiro foi enviado por engano ou fraude, há solução possível.",
      },
      {
        title: "Sem custo inicial. Atendimento humanizado e sigiloso.",
        text: "Comece sua análise sem compromisso.",
      },
    ],

    energia: [
      {
        title: "Sua conta de luz pode estar cobrando impostos indevidos!",
        text: "Use nosso simulador e descubra se pode recuperar valores pagos a mais.",
      },
      {
        title: "Empresas e condomínios pagam tributos que podem ser devolvidos.",
        text: "Aproveite essa oportunidade legal.",
      },
      {
        title: "Sofreu prejuízo com queda de energia?",
        text: "Você pode ter direito a indenização. Veja se seu caso se encaixa.",
      },
      {
        title: "Envie sua conta para análise gratuita e veja seu potencial de economia.",
        text: "",
      },
    ],

    voos: [
      {
        title: "Voo atrasado, cancelado ou bagagem extraviada?",
        text: "Você pode receber até R$10.000 de indenização por passageiro. Simule em 1 minuto.",
      },
      {
        title: "Atrasos acima de 1h já dão direito a assistência.",
        text: "Acima de 4h, pode haver indenização. Saiba mais agora.",
      },
      {
        title: "Bagagem sumiu ou chegou danificada?",
        text: "A companhia aérea é responsável. Descubra seus direitos.",
      },
      {
        title: "Tudo 100% legal e respaldado por decisões da Justiça.",
        text: "Use o simulador e tenha um parecer inicial.",
      },
    ],

    saude: [
      {
        title: "Teve um exame, cirurgia ou reembolso negado pelo plano?",
        text: "Simule agora e veja se pode exigir seus direitos.",
      },
      {
        title: "Cancelaram seu plano sem aviso? Ou por idade?",
        text: "Isso pode ser ilegal. Descubra agora.",
      },
      {
        title: "Portabilidade negada?",
        text: "Você pode estar sendo lesado. Simule seu caso gratuitamente.",
      },
      {
        title: "Seu plano é individual, familiar ou empresarial?",
        text: "Cada um tem regras diferentes — nossa análise é personalizada.",
      },
    ],
  };

  // === Definir cor de fundo padrão por serviço ===
  const colorMap = {
    pix: "#2b4ef6",
    energia: "#fbbf24",
    voos: "#9333ea",
    saude: "#16a34a",
  };

  const cards = slides[serviceType.toLowerCase()] || [];
  const bgColor = colorMap[serviceType.toLowerCase()] || "#0d3074";

  return (
    <section className="carousel-container" >

      <div className="carousel-wrapper">
      {/* <h2 className="carousel-title">Destaques {serviceType.toUpperCase()}</h2> */}

      <div className="carousel-container" ref={carouselRef}>
        {cards.map((slide, index) => (
          <div
            key={`${serviceType}-${index}`}
            className="carousel-card"
            style={{
              backgroundColor: bgColor,
              backgroundImage: `url('/images/carousel/${serviceType}-${index + 1}.jpg')`,
            }}
          >
            <div className="carousel-overlay">
              <h3 className="carousel-card-title">{slide.title}</h3>
              <p className="carousel-card-text">{slide.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel-controls">
        <button className="scroll-btn" onClick={scrollLeft}>
          ←
        </button>
        <button className="scroll-btn" onClick={scrollRight}>
          →
        </button>
      </div>
      </div>
    </section>
  );
}
