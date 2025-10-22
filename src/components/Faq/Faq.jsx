import React, { useState } from "react";
import "./Faq.css";
import Link from "next/link";

export default function Faq({ serviceType = "geral" }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleItem = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // ============================
  // FAQ ESPECÍFICO POR SERVIÇO
  // ============================
  const faqs = {
    geral: [
      {
        q: "Por que devo fazer meu pedido de indenização com a Resolve Online?",
        a: "A Resolve Online combina tecnologia com atuação jurídica especializada para garantir que você receba o que tem direito, de forma rápida e sem burocracia. Cuidamos de todo o processo — da análise à indenização — enquanto você acompanha tudo online.",
      },
      {
        q: "Quais documentos preciso enviar para iniciar meu pedido?",
        a: "Basta fornecer seus dados básicos e as informações do caso. Nosso sistema identifica automaticamente o que é necessário conforme o tipo de direito que você está reivindicando.",
      },
      {
        q: "Posso incluir outras pessoas no mesmo pedido?",
        a: "Sim. Se o problema afetou familiares ou companheiros de viagem, você pode incluir todos, desde que tenha vínculo direto ou autorização.",
      },
      {
        q: "Existe um prazo limite para solicitar a indenização?",
        a: "Sim. Geralmente de 3 a 5 anos, dependendo do tipo de caso. É ideal registrar seu pedido o quanto antes para evitar perda de direito.",
      },
    ],

    pix: [
      {
        q: "Qual o prazo para pedir devolução pelo MED?",
        a: "O Mecanismo Especial de Devolução (MED) pode ser solicitado em até 80 dias após a transação. Após esse prazo, o banco pode negar automaticamente.",
      },
      {
        q: "O banco é obrigado a devolver o valor?",
        a: "Depende do caso. Se houve fraude comprovada ou falha de segurança, o banco tem responsabilidade solidária e deve restituir o cliente.",
      },
      {
        q: "O que acontece depois que eu envio meus dados?",
        a: "Nossa equipe analisa sua situação e orienta os próximos passos pelo WhatsApp, sem custo inicial e com total sigilo.",
      },
      {
        q: "Posso tentar a devolução mesmo que tenha digitado a chave errada?",
        a: "Sim, mas depende da resposta do recebedor. Se for erro humano, podemos tentar via notificação formal com base nas regras do Banco Central.",
      },
    ],

    energia: [
      {
        q: "Como sei se tenho direito a créditos na conta de luz?",
        a: "A ANEEL determina compensações automáticas (DIC/FIC) para interrupções longas ou frequentes. Se a sua conta não mostra créditos, pode haver erro da concessionária.",
      },
      {
        q: "Empresas também podem solicitar devolução?",
        a: "Sim. Consumidores comerciais, industriais e condomínios podem recuperar valores cobrados indevidamente, inclusive tributos.",
      },
      {
        q: "Preciso enviar minha conta de luz?",
        a: "Sim, a análise inicial requer o número da unidade consumidora e a fatura mais recente para verificar consumo e créditos.",
      },
      {
        q: "O que é a compensação DIC/FIC?",
        a: "É o desconto que a concessionária deve aplicar automaticamente na fatura por descumprimento dos limites de duração ou frequência das quedas de energia.",
      },
    ],

    voos: [
      {
        q: "Meu voo atrasou mais de 4 horas, tenho direito?",
        a: "Sim. A ANAC garante assistência material e, em atrasos superiores a 4h, pode haver indenização e até reembolso integral.",
      },
      {
        q: "E se o voo foi cancelado sem aviso?",
        a: "Se não houve aviso com 72h de antecedência, a companhia aérea é responsável e deve oferecer reacomodação ou indenização.",
      },
      {
        q: "Bagagem extraviada dá direito a indenização?",
        a: "Sim, se não for devolvida em até 7 dias (voos nacionais) ou 21 dias (internacionais). Danos e perdas devem ser ressarcidos.",
      },
      {
        q: "Posso pedir indenização para todos os passageiros juntos?",
        a: "Sim. Se todos foram impactados no mesmo voo, o pedido pode ser feito em grupo, facilitando o processo.",
      },
    ],

    saude: [
      {
        q: "Meu plano pode negar exame ou cirurgia?",
        a: "Não, se houver prescrição médica e respaldo científico. Mesmo fora do Rol da ANS, a cobertura pode ser obrigatória (Lei 14.454/22).",
      },
      {
        q: "O que fazer se meu plano cancelou sem aviso?",
        a: "Cancelamentos indevidos podem ser revertidos. É importante registrar o ocorrido e guardar os comprovantes de pagamento.",
      },
      {
        q: "A ANS pode obrigar a operadora a reembolsar valores?",
        a: "Sim. Em casos de urgência ou ausência de prestador na rede, o reembolso integral é devido.",
      },
      {
        q: "Meu plano é coletivo, mas o reajuste parece abusivo. Posso contestar?",
        a: "Pode sim. Mesmo em planos empresariais, os aumentos devem ser justificados e não podem ser desproporcionais.",
      },
    ],
  };

  const items = faqs[serviceType.toLowerCase()] || faqs.geral;

  return (
    <section className="faq">
      <div className="faq-container">
        <div className="faq-grid">
          <div className="faq-header">
            <h2>Perguntas frequentes</h2>
            <p>
              Ficou com dúvida?{" "}
              <Link className="help-link" href="/contato">Entre em contato conosco</Link>
            </p>
          </div>

          <div className="faq-content" id="faqAccordion">
            {items.map((item, index) => (
              <div key={index} className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => toggleItem(index)}
                  aria-expanded={activeIndex === index}
                >
                  <span>{item.q}</span>
                  <i className={`fas fa-chevron-${activeIndex === index ? "up" : "down"} arrow-icon`}></i>
                </button>
                <div
                  className={`accordion-body ${activeIndex === index ? "open" : ""}`}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
