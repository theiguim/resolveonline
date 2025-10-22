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
        q: "Há custo para começar?",
        a: "A análise preliminar é gratuita em todas as áreas. O início do serviço ocorre apenas se a análise for aprovada, com os valores indicados por vertical.",
      },
      {
        q: "Como cobram?",
        a: "PIX: início R$ 100–250 (se aprovado) + 10–20% no êxito. Voos: 15–25% no êxito (adiantamento possível, sob avaliação). Energia: início R$ 150–300 (se aprovado) + 15–25% no êxito. Plano de Saúde: início R$ 200–500 (se aprovado) + 15–25% no êxito.",
      },
      {
        q: "Quando pago?",
        a: "Após aprovação para iniciar (valor fixo) e, no percentual, somente após a obtenção do resultado/benefício previsto em contrato.",
      },
      {
        q: "Prometem resultado?",
        a: "Não. Transparência total: cada caso depende de documentos, prazos e condutas das partes. Mantemos você informado em cada etapa.",
      },
      {
        q: "Posso falar com alguém agora?",
        a: "Sim. Clique em “Falar no WhatsApp” após enviar seus dados para receber a análise personalizada e o checklist.",
      },
    ],

    pix: [
      {
        q: "O que vocês resolvem no PIX?",
        a: "Golpes (engenharia social, falso boleto, “do amor”), transferência por engano (chave errada), contas clonadas, e atrasos/recusas do banco em aplicar o MED.",
      },
      {
        q: "O que é o MED e qual o prazo?",
        a: "Mecanismo Especial de Devolução do Bacen. Em regra, dá para acionar até 80 dias após a transferência.",
      },
      {
        q: "Preciso de BO?",
        a: "Ajuda, mas não é obrigatório. Priorize: comprovante do PIX, prints da conversa, protocolo do banco.",
      },
      {
        q: "Transferi por engano. Ainda dá para reverter?",
        a: "Sim, analisamos tempo de reação, contato com o recebedor e resposta do banco.",
      },
      {
        q: "O banco negou; vale tentar de novo?",
        a: "Sim. Reavaliamos estratégia e documentação.",
      },
      {
        q: "Quais documentos enviam mais “força” ao caso?",
        a: "Comprovante do PIX, prints, e-mails, gravações/protocolo do banco, BO (se houver).",
      },
      {
        q: "Quanto tempo para retorno?",
        a: "Em média até 24h úteis após recebermos tudo.",
      },
      {
        q: "Como recebo o parecer?",
        a: "WhatsApp + e-mail, com próximos passos.",
      },
      {
        q: "Tem custo?",
        a: "Análise preliminar: grátis. Para iniciar, se aprovado: R$ 100 a R$ 250. Êxito: 10% a 20% do valor recuperado. Quaisquer custos de terceiros serão informados antes.",
      },
      {
        q: "Assinam contrato?",
        a: "Sim. Tudo formalizado (inclusive base de cálculo e prazos).",
      },
    ],

    energia: [
      {
        q: "Quais problemas vocês atendem?",
        a: "Cobrança indevida (itens tarifários, TUST/TUSD, ICMS/base, leituras estimadas), Demanda contratada/ultrapassagem (B2B/condomínios), Bandeiras/encargos aplicados de forma duvidosa, Quedas recorrentes (DIC/FIC) e danos a equipamentos, Atraso de ligação/religação e atendimento ineficaz, Troca de medidor/erro de medição.",
      },
      {
        q: "Sou empresa/condomínio — muda algo?",
        a: "Sim. Aplicamos auditoria tarifária focada em economia recorrente e eventual restituição retroativa (12–60 meses, conforme caso).",
      },
      {
        q: "Quais documentos preciso?",
        a: "Faturas 6–12 meses (ideal 12), UC, protocolos com a concessionária, fotos/notas de equipamentos danificados, contratos (se houver).",
      },
      {
        q: "Como funciona a análise?",
        a: "Triagem técnica da fatura/itens, histórico, perfil de consumo, demanda contratada e indicadores de qualidade (DIC/FIC).",
      },
      {
        q: "Quedas e danos: o que pesa?",
        a: "Frequência/duração, protocolos, prova do dano (nota/ orçamento/laudo) e nexo temporal com o evento.",
      },
      {
        q: "Ligação/religação: o que consideram?",
        a: "Data do pedido/pagamento, prazos regulamentares, protocolos e impacto.",
      },
      {
        q: "Erro de medição/medidor trocado: sinais?",
        a: "Salto atípico de consumo após troca, leituras estimadas repetidas, inconsistência com histórico.",
      },
      {
        q: "Quanto tempo para retorno?",
        a: "Até 48h úteis após termos tudo.",
      },
      {
        q: "Tem custo?",
        a: "Análise: grátis. Para iniciar, se aprovado: R$ 150 a R$ 300 (ativação do fluxo). Êxito: 15% a 25% sobre restituição/economia obtida. Custos de terceiros (se houver) somente com autorização.",
      },
      {
        q: "Assinam contrato?",
        a: "Sim. Base de cálculo (restituição/economia) e condições ficam explícitas.",
      },
      {
        q: "Posso ter corte de energia por pedir revisão?",
        a: "Não. Revisão e reclamação não autorizam corte por si só. Mantendo faturas correntes em dia, não há relação.",
      },
    ],

    voos: [
      {
        q: "Em quais situações vocês atuam?",
        a: "Atraso (foco na hora de chegada), cancelamento, overbooking (preterição) e bagagem (extravio/dano/violação).",
      },
      {
        q: "Por que perguntam “horas de atraso”?",
        a: "Porque >4h de atraso eleva direitos (assistência, reacomodação e possível indenização). Para cancelamento, analisamos aviso prévio, reacomodação e reembolso; o fluxo é diferente de atraso.",
      },
      {
        q: "Overbooking tem regras próprias?",
        a: "Sim: presença no aeroporto, check-in, embarque negado e alternativas oferecidas.",
      },
      {
        q: "Bagagem: o que preciso?",
        a: "Etiqueta, PIR, fotos, notas fiscais do que foi danificado/necessário comprar, comprovante da reserva.",
      },
      {
        q: "Quais docs ajudam no geral?",
        a: "Cartão de embarque, e-mails/SMS da cia., comprovantes de despesas, protocolos, fotos do painel.",
      },
      {
        q: "Qual o prazo para reclamar?",
        a: "Em regra, 5 anos em voos nacionais e 2 anos em internacionais (convenções internacionais). Analise o quanto antes.",
      },
      {
        q: "Quanto tempo para retorno?",
        a: "24–48h úteis após documentação.",
      },
      {
        q: "Adiantam valores?",
        a: "Podemos avaliar adiantamento em acordos específicos (consulte disponibilidade).",
      },
      {
        q: "Tem custo?",
        a: "Análise: grátis. Êxito: 15% a 25% da indenização recebida. Custos externos (se houver) são alinhados antes.",
      },
      {
        q: "Assinam contrato?",
        a: "Sim, com base de cálculo e condições claras.",
      },
    ],

    saude: [
      {
        q: "Quais casos vocês pegam?",
        a: "Negativas (exame, cirurgia, medicamento), reembolso negado/parcial, portabilidade negada, cancelamento indevido, aumento por faixa etária, exclusão de dependente e demora na liberação.",
      },
      {
        q: "Por que pedem tipo de plano e tempo de vínculo?",
        a: "Regras mudam entre individual/familiar/empresarial/coletivo; o tempo impacta portabilidade, reajustes e estabilidade.",
      },
      {
        q: "Negativa de cobertura: o que preciso?",
        a: "Pedido/laudo médico e negativa por escrito (ou e-mail). Se não tiver, pedimos formalização.",
      },
      {
        q: "Reembolso: como analisam?",
        a: "Notas fiscais, recibos, protocolo de reembolso e previsão contratual.",
      },
      {
        q: "Portabilidade negada: critérios?",
        a: "Tempo de vínculo, janela de solicitação (120 dias), compatibilidade de planos e regulamentação ANS.",
      },
      {
        q: "Cancelamento indevido: quando ocorre?",
        a: "Sem aviso, por falha do estipulante (empregador), ou por critérios irregulares. Em muitos casos é possível restabelecer.",
      },
      {
        q: "Aumento por faixa etária é sempre legal?",
        a: "Não. Deve seguir contrato/regra ANS e ter equilíbrio. Avaliamos boletos antes/depois e cláusulas.",
      },
      {
        q: "Urgência: dá para agilizar?",
        a: "Sim. Após aprovação da análise, acionamos imediatamente os canais competentes para buscar liberação rápida.",
      },
      {
        q: "Quanto tempo para retorno?",
        a: "24–72h úteis, variando pela complexidade.",
      },
      {
        q: "Tem custo?",
        a: "Análise: grátis. Para iniciar, se aprovado: R$ 200 a R$ 500. Êxito: 15% a 25% sobre o benefício econômico (valor liberado/reembolsado, conforme contrato). Custos de terceiros (se houver) são avisados antes.",
      },
      {
        q: "Assinam contrato?",
        a: "Sim. Base de cálculo (benefício liberado/reembolso) e prazos definidos.",
      },
      {
        q: "E meus dados?",
        a: "Tratados com sigilo e conforme LGPD. Usados só para sua análise e acompanhamento.",
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

  )
}