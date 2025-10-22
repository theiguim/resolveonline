"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./RelatedServices.css";

export default function RelatedServices() {
  const scrollRef = useRef(null);
  const pathname = usePathname(); // pega a rota atual

  // 🔎 Detecta a página atual
  const currentPage = pathname
    ?.replace("/", "")
    ?.replace("-", "")
    ?.toLowerCase() || "";

  // 🧩 Lista dos serviços
  const services = [
    {
      id: "pix",
      title: "Fraudes com Pix (MED)",
      desc: "Caiu em um golpe? Auxiliamos você a acionar o Mecanismo Especial de Devolução para reaver seu dinheiro.",
      img: "/images/services-img/pix.png",
      icon: "https://img.icons8.com/?size=100&id=uqpbD9vhCDEQ&format=png&color=0d3074",
      btn: "Verificar meu caso",
      link: "/pix",
    },
    {
      id: "aereo",
      title: "Direito do Passageiro Aéreo",
      desc: "Voo atrasado, cancelado ou overbooking? Calcule sua indenização e conheça seus direitos.",
      img: "/images/services-img/aereo.png",
      icon: "https://img.icons8.com/?size=100&id=12665&format=png&color=0d3074",
      btn: "Calcular indenização",
      link: "/aereo",
    },
    {
      id: "energia",
      title: "Interrupção de Energia",
      desc: "Ficou sem luz por muito tempo? Você pode ter direito a créditos por descumprimento dos limites DIC/FIC.",
      img: "/images/services-img/energia.png",
      icon: "https://img.icons8.com/?size=100&id=08VQFUNfGTux&format=png&color=0d3074",
      btn: "Analisar fatura",
      link: "/energia",
    },
    {
      id: "saude",
      title: "Planos de Saúde (ANS)",
      desc: "Negativa de cobertura, reajuste abusivo ou descumprimento de prazos? Saiba o que fazer.",
      img: "/images/services-img/saude.png",
      icon: "https://img.icons8.com/?size=100&id=35588&format=png&color=0d3074",
      btn: "Conhecer meus direitos",
      link: "/saude",
    },
  ];

  // 🔧 Filtra o serviço atual para não exibir ele mesmo
  const filtered = services.filter(
    (s) => !currentPage.includes(s.id)
  );

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="services-landing-content">
     <div className="services-landing" id="services">
       <h1 className="services-landing-title">Confira também:</h1>
      <div className="services-content" ref={scrollRef}>
        {filtered.map((service) => (
          <div className="service-element" key={service.id}>
            <img
              className="service-element-ico"
              src={service.icon}
              alt={service.title}
            />
            <img
              className="service-element-img"
              src={service.img}
              alt={service.title}
            />
            <h2>{service.title}</h2>
            <p>{service.desc}</p>
            <Link href={service.link}>
              <button className="btn">{service.btn}</button>
            </Link>
          </div>
        ))}
      </div>

      <div
        className="services-controls"
        style={{ maxWidth: 940, margin: "0 auto", paddingLeft: 10 }}
      >
        <button onClick={scrollLeft} className="scroll-btn">
          ←
        </button>
        <button
          onClick={scrollRight}
          className="scroll-btn"
          style={{ marginLeft: 8 }}
        >
          →
        </button>
      </div>
     </div>
    </section>
  );
}
