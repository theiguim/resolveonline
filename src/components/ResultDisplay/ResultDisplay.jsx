import React from "react";
import "./ResultDisplay.css";

export default function ResultDisplay({
  title,
  content,
  ctaText,
  checklist,
  disclaimer,
  expenses,
  serviceType,
  extraMessage,
  leadData,
}) {
  const contentArray = Array.isArray(content) ? content : content ? [content] : [];
  const checklistArray = Array.isArray(checklist) ? checklist : [];

  // 🔧 Mensagem WhatsApp contextualizada
  const gerarMensagem = (isUrgente = false) => {
    let cabecalho = "";
    let corpo = "";
    let fechamento = isUrgente
      ? "\n⚠️ Preciso de atendimento imediato, por favor!"
      : "\nAguardo as orientações para prosseguir com o atendimento.";

    switch (serviceType?.toLowerCase()) {
      // 💸 PIX (mantido)
      case "pix":
        cabecalho = isUrgente
          ? "🚨 *CASO URGENTE – PIX (acima de R$5.000)* 🚨"
          : "💸 *Simulador de Golpes PIX (MED)*";
        corpo = `
📋 *Informações do caso:*
• *Nome:* ${leadData?.nome || "-"}
• *WhatsApp:* ${leadData?.whats || "-"}
• *E-mail:* ${leadData?.email || "-"}
• *Valor do PIX:* R$ ${leadData?.valor || "-"}
• *Tipo de Fraude:* ${leadData?.fraudeTipo || "-"}
• *Tentou resolver com o banco:* ${leadData?.tentouResolver || "-"}
• *Tipo de erro:* ${leadData?.erroTipo || "-"}
        `;
        break;

      // ✈️ AÉREO (mantido)
      case "aéreo":
      case "aereo":
        cabecalho = isUrgente
          ? "🚨 *CASO URGENTE – Problema em Voo* 🚨"
          : "✈️ *Simulador de Direitos do Passageiro Aéreo*";
        corpo = `
📋 *Informações do voo:*
• *Nome:* ${leadData?.nome || "-"}
• *WhatsApp:* ${leadData?.whats || "-"}
• *E-mail:* ${leadData?.email || "-"}
• *Tipo de problema:* ${leadData?.problema || "-"}
• *Horas de atraso:* ${leadData?.horas || "-"}
• *Houve pernoite:* ${leadData?.pernoite || "-"}
• *Despesas extras:* R$ ${leadData?.despesas || "0,00"}
        `;
        break;

      // ⚡ ENERGIA — atualizado
      // ⚡ ENERGIA — atualizado com "outroProblema"
      case "energia":
        cabecalho = isUrgente
          ? "🚨 *CASO URGENTE – Interrupção de Energia* 🚨"
          : "⚡ *Análise de Problemas com Energia Elétrica (DIC/FIC)*";

        corpo = `
📋 *Informações do caso de energia:*
• *Nome:* ${leadData?.nome || "-"}
• *WhatsApp:* ${leadData?.whats || "-"}
• *E-mail:* ${leadData?.email || "-"}
• *Concessionária:* ${leadData?.distribuidora || "-"}
• *Valor médio da conta:* R$ ${leadData?.valorMedio || "-"}
• *Perfil de consumo:* ${leadData?.perfil || "-"}
• *Teve devolução na fatura?* ${leadData?.teveDevolucao || "-"}
• *Tempo sem energia:* ${leadData?.tempoSemEnergia || "-"} horas
• *Demora na religação:* ${leadData?.tempoReligacao || "-"} dias
• *Houve queima de aparelho?* ${leadData?.aparelhoQueimado || "-"}
• *Tipo de problema:* ${leadData?.problema || "-"}
${leadData?.outroProblema ? `• *Descrição adicional:* ${leadData.outroProblema}` : ""}
  `;
        break;


      // 🏥 SAÚDE — atualizado e completo
      case "saúde":
      case "saude":
        cabecalho = isUrgente
          ? "🚨 *CASO URGENTE – Plano de Saúde* 🚨"
          : "🏥 *Simulador de Direitos em Planos de Saúde*";

        corpo = `
📋 *Informações sobre o plano de saúde:*
• *Nome:* ${leadData?.nome || "-"}
• *WhatsApp:* ${leadData?.whats || "-"}
• *E-mail:* ${leadData?.email || "-"}
• *Operadora:* ${leadData?.operadora || "-"}
• *Tipo de plano:* ${leadData?.tipoPlano || "-"}
• *Tipo de problema:* ${leadData?.problema || "-"}
${leadData?.outrosServicos ? `• *Outro tipo de problema:* ${leadData.outrosServicos}` : ""}
• *É caso de urgência/emergência?* ${leadData?.urgencia === "sim" ? "Sim 🚨" : "Não"
          }
• *Possui documentos e protocolos?* ${leadData?.documentosProntos === "sim" ? "Sim 📄" : "Não"
          }
🧾 *Resumo automático do simulador:*
${ctaText ? `→ ${ctaText}` : "O usuário concluiu o simulador e deseja atendimento."}
  `;
        break;


      // 🧾 Default fallback
      default:
        cabecalho = "📋 *Simulador ResolveOnline*";
        corpo = `
• *Nome:* ${leadData?.nome || "-"}
• *WhatsApp:* ${leadData?.whats || "-"}
• *E-mail:* ${leadData?.email || "-"}
        `;
        break;
    }

    return `
${cabecalho}
${ctaText ? `\n${ctaText}\n` : ""}
${corpo.trim()}
${fechamento}
    `.trim();
  };

  // URLs dinâmicas do WhatsApp
  const whatsappUrl = `https://wa.me/553184815969?text=${encodeURIComponent(
    gerarMensagem(false)
  )}`;
  const urgenteUrl = `https://wa.me/553184815969?text=${encodeURIComponent(
    gerarMensagem(true)
  )}`;

  return (
    <div id="result-display" className="result-box" style={{ marginTop: "1.5rem" }}>
      <h4 className="res-title">{title}</h4>

      {extraMessage && (
        <div className="extra-message mt-3 p-3 bg-blue-50 border-l-4 border-blue-700 rounded">
          <p>{extraMessage}</p>
        </div>
      )}

      <div className="res-txt-content mt-2">
        {contentArray.map((p, i) => (
          <p key={i} className="text-gray-800 leading-relaxed mt-1">{p}</p>
        ))}
      </div>

      {checklistArray.length > 0 && (
        <>
          <h5 className="font-semibold mt-4 text-gray-700">Checklist de Documentos Essenciais:</h5>
          <ul className="list-disc list-inside ml-2 text-sm text-gray-600">
            {checklistArray.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </>
      )}

      {disclaimer && (
        <p className="res-aviso mt-3 text-gray-600 italic">⚖️ {disclaimer}</p>
      )}

      {ctaText && (
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <button className="btn-success mt-4">{ctaText}</button>
        </a>
      )}

      <a href={urgenteUrl} target="_blank" rel="noopener noreferrer">
        <button className="btn-danger mt-3">🚨 Meu caso é urgente</button>
      </a>
    </div>
  );
}
