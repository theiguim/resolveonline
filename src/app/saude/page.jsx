'use client';
import { useState, useRef } from "react";
import "../../styles/FormPages.css";
import ResultDisplay from "../../components/ResultDisplay/ResultDisplay";
import Link from "next/link";
import Carousel from "@/components/Carousel/Carousel";
import Faq from "@/components/Faq/Faq";
import RelatedServices from "@/components/RelatedServices/RelatedServices";
import StepsSection from "@/components/StepsSection/StepsSection";

export default function SaudePage() {
  const [problema, setProblema] = useState("negativa");
  const [urgencia, setUrgencia] = useState("");
  const [operadora, setOperadora] = useState("");
  const [tipoPlano, setTipoPlano] = useState("individual");
  const [documentosProntos, setDocumentosProntos] = useState("");

  // ====== NOVO: coleta de leads ======
  const [nome, setNome] = useState("");
  const [whats, setWhats] = useState("");
  const [email, setEmail] = useState("");
  const [mostrarLeadForm, setMostrarLeadForm] = useState(false);

  const [resultadoCalculo, setResultadoCalculo] = useState(null);
  const scrollRef = useRef(null);

  // =========================
  // Lógica de cálculo dinâmica
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    let title = "Análise Inicial – Plano de Saúde";
    let content = [];
    let checklist = [
      "Carteirinha ou contrato do plano de saúde.",
      "Documento de identificação (RG/CNH).",
      "Comprovante de residência atualizado."
    ];
    const disclaimer =
      "Esta é uma análise preliminar baseada nas normas da ANS. A confirmação depende da análise dos documentos enviados.";
    const ctaText = "Falar com especialista";

    switch (problema) {
      case "negativa":
        content = [
          "O plano pode ser obrigado a cobrir o procedimento negado, mesmo fora do Rol da ANS (Lei 14.454/22).",
          urgencia === "sim"
            ? "Por se tratar de urgência, a operadora deve autorizar de forma imediata."
            : "Para casos não urgentes, o prazo máximo é de até 21 dias úteis.",
          "Encaminhe o pedido médico e a negativa por escrito para avaliação.",
        ];
        checklist.push("Pedido médico e negativa formal da operadora.");
        break;

      case "portabilidade":
        content = [
          "A portabilidade deve ser aceita se você possui mais de 2 anos de plano anterior e solicitou dentro do prazo de 120 dias (RN 438/ANS).",
          "Caso tenha sido negada sem justificativa, é possível exigir o cumprimento imediato.",
        ];
        checklist.push("Contrato anterior e comprovante de tempo de plano.");
        break;

      case "cancelamento":
        content = [
          "Cancelamentos sem aviso prévio de 60 dias podem ser revertidos.",
          "Se as mensalidades estão em dia, o cancelamento pode ser irregular.",
          "Encaminhe comprovantes e o comunicado da operadora para análise."
        ];
        checklist.push("Últimos boletos e notificação recebida.");
        break;

      case "reajuste":
        const reajusteMsg =
          tipoPlano === "individual"
            ? "Planos individuais têm reajuste limitado pela ANS. Se o percentual ultrapassar o teto, é ilegal."
            : "Planos coletivos precisam justificar o aumento com base técnica e memória de cálculo.";
        content = [
          reajusteMsg,
          "Encaminhe boletos e comunicado de reajuste para análise detalhada."
        ];
        checklist.push("Comunicado de reajuste e últimos boletos pagos.");
        break;

      case "reembolso":
        content = [
          "O reembolso deve ser feito conforme prazos da RN 259/ANS.",
          "Se não houver prestador disponível ou em caso de urgência, o reembolso integral é devido.",
          "Encaminhe notas fiscais e comprovantes para revisão."
        ];
        checklist.push("Notas fiscais e comprovantes de solicitação de reembolso.");
        break;

      default:
        content = [
          "Seu caso pode ter direito à contestação com base nas normas da ANS.",
          "Encaminhe os documentos básicos para nossa equipe verificar."
        ];
        break;
    }

    setResultadoCalculo({
      title,
      content,
      checklist,
      disclaimer,
      ctaText,
      serviceType: "Saúde"
    });

    // Mostra o form de lead antes do resultado
    setMostrarLeadForm(true);
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    setMostrarLeadForm(false);
    setResultadoCalculo((prev) => ({
      ...prev,
      leadData: {
        nome,
        whats,
        email,
        problema,
        urgencia,
        operadora,
        tipoPlano,
        documentosProntos
      },
    }));
  };

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  // =========================
  // Renderização visual (NÃO ALTERADA)
  // =========================
  return (
    <main className="page-container">

      <div className="hero-sub-section" id="saude-page" >
        <div className="header-section">
          <h1 className="page-title">Plano de saúde negou cobertura?</h1>
          <p className="page-subtitle">
            Seu plano <strong>não cumpriu os prazos da ANS, negou um procedimento ou aplicou um reajuste abusivo?</strong> Use nosso simulador para entender se <strong>você tem direito a contestação e quais passos seguir</strong>.
          </p>
        </div>
      </div>

      <StepsSection serviceType="saude" />

       <Carousel serviceType="saude" />

      <div className="max-w-3xl form-card box-shadow">
        <h2 className="form-title">Simulador de Direitos - Planos de Saúde</h2>

        {/* =========================
            ETAPA 1 - FORM PRINCIPAL
        ========================= */}
        {!mostrarLeadForm && !resultadoCalculo && (
          <form id="saude-simulator-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="saude-problema" className="form-label">Qual é o seu problema?</label>
              <select
                id="saude-problema"
                className="form-input"
                value={problema}
                onChange={(e) => setProblema(e.target.value)}
                required
              >
                <option value="negativa">Negativa de procedimento médico</option>
                <option value="portabilidade">Portabilidade de carências negada</option>
                <option value="cancelamento">Cancelamento indevido do plano</option>
                <option value="reajuste">Aumento abusivo</option>
                <option value="reembolso">Problemas com reembolso</option>
              </select>
            </div>

            {problema === 'reajuste' && (
              <div className="form-group mt-4">
                <label htmlFor="saude-tipo-plano" className="form-label">Tipo de Contrato do seu Plano</label>
                <select
                  id="saude-tipo-plano"
                  className="form-input"
                  value={tipoPlano}
                  onChange={(e) => setTipoPlano(e.target.value)}
                  required
                >
                  <option value="individual">Individual/Familiar</option>
                  <option value="coletivo">Coletivo (Empresarial ou por Adesão)</option>
                </select>
              </div>
            )}

            <div className="form-group mt-4">
              <label htmlFor="saude-operadora" className="form-label">Qual é a Operadora/Nome do Plano? <span className="text-gray-500 font-normal">(opcional)</span></label>
              <input
                type="text"
                id="saude-operadora"
                className="form-input"
                placeholder="Ex: Unimed, SulAmérica, Bradesco Saúde"
                value={operadora}
                onChange={(e) => setOperadora(e.target.value)}
              />
            </div>

            <div className="grid-2-cols mt-4">
              <div className="form-group">
                <label className="form-label">O caso envolve urgência ou emergência?</label>
                <div className="radio-group">
                  <label>
                    <input type="radio" name="urgencia" value="sim" checked={urgencia === "sim"} onChange={(e) => setUrgencia(e.target.value)} required /> Sim
                  </label>
                  <label>
                    <input type="radio" name="urgencia" value="nao" checked={urgencia === "nao"} onChange={(e) => setUrgencia(e.target.value)} required /> Não
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Você já possui a negativa/prescrição/protocolos em mãos?</label>
                <div className="radio-group">
                  <label>
                    <input type="radio" name="docs-prontos" value="sim" checked={documentosProntos === "sim"} onChange={(e) => setDocumentosProntos(e.target.value)} required /> Sim
                  </label>
                  <label>
                    <input type="radio" name="docs-prontos" value="nao" checked={documentosProntos === "nao"} onChange={(e) => setDocumentosProntos(e.target.value)} required /> Não
                  </label>
                </div>
              </div>
            </div>

            <p className="text-sm-gray mt-4">
              Simulações relacionadas a planos de saúde seguem as normas da ANS. A plataforma não realiza atendimento jurídico direto, apenas fornece informações baseadas na regulação vigente.
            </p>
            <button type="submit" className="btn-submit mt-4">Ver Próximos Passos</button>
          </form>
        )}

        {/* =========================
            ETAPA 2 - FORM DE LEAD
        ========================= */}
        {mostrarLeadForm && (
          <form onSubmit={handleLeadSubmit} className="mt-6">
            <h3 className="form-title">📩 Receba sua análise completa</h3>
            <p className="text-gray-600 mb-4">
              Para enviarmos seu resultado personalizado e a melhor forma de resolver seu caso, informe seus dados abaixo.
            </p>

            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <input type="text" className="form-input" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp com DDD</label>
              <input type="tel" className="form-input" placeholder="(31) 99999-9999" value={whats} onChange={(e) => setWhats(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <p className="text-sm text-gray-500 mt-3">
              🔒 Seus dados são protegidos. Usamos apenas para te ajudar a resolver o problema com seu plano de saúde.
            </p>

            <button type="submit" className="btn-submit mt-4">Ver Resultado</button>
          </form>
        )}

        {/* =========================
            ETAPA 3 - RESULTADO FINAL
        ========================= */}
        {resultadoCalculo && !mostrarLeadForm && (
          <ResultDisplay
            {...resultadoCalculo}
            leadData={{
              nome,
              whats,
              email,
              problema,
              urgencia,
              operadora,
              tipoPlano,
              documentosProntos,
            }}
          />
        )}
      </div>
      <RelatedServices />
      <Faq serviceType="saude" />
    </main>
  );
}
