import React from "react";
import "./StepsSection.css"; // usa o mesmo CSS já existente

export default function StepsSection({ serviceType = "pix" }) {
  // Textos personalizados para cada tipo de página
  const texts = {
    pix: {
      title: "Como funciona:",
      description: (
        <>
          <strong>Preencha o simulador</strong> com os dados da transação. Caso o seu caso seja{" "}
          <strong>elegível</strong>, você poderá{" "}
          <strong>iniciar uma conversa direta com nossa equipe</strong> pelo WhatsApp, onde continuará o atendimento e
          receberá todas as <strong>orientações</strong> para acionar o{" "}
          <strong>MED de forma segura e rápida</strong>.
        </>
      ),
    },
    energia: {
      title: "Como funciona:",
      description: (
        <>
          <strong>Preencha o verificador</strong> com as informações da sua fatura. Se identificarmos{" "}
          <strong>possibilidade de compensação</strong>, você poderá continuar o atendimento{" "}
          <strong>pelo WhatsApp</strong> para enviar suas faturas e confirmar seu direito à{" "}
          <strong>devolução</strong>.
        </>
      ),
    },
    aereo: {
      title: "Como funciona:",
      description: (
        <>
          Informe os dados do seu voo na calculadora e veja se o caso é{" "}
          <strong>elegível para indenização</strong>. Se houver direito, você poderá{" "}
          <strong>continuar o atendimento pelo WhatsApp</strong> com nossa equipe, que vai{" "}
          <strong>orientar cada passo</strong> para registrar e acompanhar sua solicitação.
        </>
      ),
    },
    saude: {
      title: "Como funciona:",
      description: (
        <>
          <strong>Preencha o simulador</strong> com os dados do seu plano e situação. Caso o seu{" "}
          <strong>caso seja elegível</strong>, você poderá continuar o atendimento{" "}
          <strong>diretamente pelo WhatsApp</strong>, recebendo orientação sobre{" "}
          <strong>como contestar e resolver o problema</strong>.
        </>
      ),
    },
  };

  const content = texts[serviceType.toLowerCase()] || texts.pix;

  return (
    <div className="menu-landing">
      <div className="menu-landing-header">
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </div>

      <div className="range-content">
        <div className="info-element">
          <img src="/images/icos/preencher.png" alt="Preencher" />
          <h3>1. Preencha o formulário simulador</h3>
        </div>
        <div className="info-element">
          <img src="/images/icos/verificar.png" alt="Verificar" />
          <h3>2. Verifique se o seu caso é elegível</h3>
        </div>
        <div className="info-element">
          <img src="/images/icos/atendimento.png" alt="Atendimento" />
          <h3>3. Continue o atendimento pelo WhatsApp</h3>
        </div>
      </div>
    </div>
  );
}
