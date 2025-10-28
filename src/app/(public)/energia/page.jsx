'use client';
import { useState, useRef } from "react";
import "../../../styles/FormPages.css";
import ResultDisplay from "../../../components/ResultDisplay/ResultDisplay";
import Link from "next/link";
import Carousel from "@/components/Carousel/Carousel";
import Faq from "@/components/Faq/Faq";
import RelatedServices from "@/components/RelatedServices/RelatedServices";
import StepsSection from "@/components/StepsSection/StepsSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel/TestimonialsCarousel";
import { submitForm } from "../actions/formActions";


export default function EnergiaPage() {
  // ===========================
  // 🧩 Estados principais
  // ===========================
  const [problema, setProblema] = useState("conta_alta");
  const [outroProblema, setOutroProblema] = useState(""); // 🔧 NOVO
  const [perfil, setPerfil] = useState("residencial");
  const [distribuidora, setDistribuidora] = useState("");
  const [valorMedio, setValorMedio] = useState("");
  const [teveDevolucao, setTeveDevolucao] = useState("nao");
  const [aparelhoQueimado, setAparelhoQueimado] = useState("nao");
  const [tempoSemEnergia, setTempoSemEnergia] = useState("");
  const [tempoReligacao, setTempoReligacao] = useState("");
  const [resultadoCalculo, setResultadoCalculo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [nome, setNome] = useState("");
  const [whats, setWhats] = useState("");
  const [email, setEmail] = useState("");
  const [mostrarLeadForm, setMostrarLeadForm] = useState(false);

  const scrollRef = useRef(null);

  // ===========================
  // 📊 Lógica principal
  // ===========================
  const handleSubmit = (e) => {
    e.preventDefault();

    let analise = [];
    let checklist = [
      "Últimas 12 faturas de energia (PDF ou foto).",
      "Documento de identificação (RG ou CNH).",
      "Comprovante de residência atualizado."
    ];

    const disclaimer =
      "Esta é uma análise gratuita e preliminar. A confirmação depende da avaliação dos dados da sua fatura e histórico de consumo.";
    const ctaText = "Receber análise completa no WhatsApp";

    switch (problema) {
      case "conta_alta":
        analise.push("Podemos verificar se há cobranças indevidas ou falhas na medição.");
        analise.push("Se o valor médio da sua conta subiu sem justificativa, você pode ter direito a devolução parcial.");
        break;
      case "queima_aparelho":
        analise.push("Em casos de danos por oscilação de energia, a concessionária deve analisar e pode reembolsar o valor do conserto ou do aparelho.");
        analise.push("É importante ter nota fiscal ou orçamento técnico do equipamento afetado.");
        break;
      case "falta_frequente":
        analise.push("Faltas recorrentes de energia podem gerar créditos automáticos (DIC/FIC) na fatura.");
        analise.push("Se você não recebeu compensações, pode haver direito à restituição.");
        break;
      case "atraso_religacao":
        analise.push("O prazo máximo para religação é de até 24h (zona urbana) ou 48h (rural).");
        analise.push("Caso o prazo tenha sido ultrapassado, o consumidor tem direito à compensação.");
        break;
      case "outro": // 🔧 NOVO
        analise.push("Podemos avaliar se houve falha na prestação de serviço e se há valores a restituir.");
        if (outroProblema.trim()) {
          analise.push(`Descrição informada: "${outroProblema}".`);
        }
        break;
      default:
        analise.push("Podemos avaliar se houve falha na prestação de serviço e se há valores a restituir.");
        break;
    }

    setResultadoCalculo({
      title: "Resultado da Análise Inicial",
      content: analise,
      checklist,
      disclaimer,
      ctaText,
      serviceType: "Energia",
    });

    setMostrarLeadForm(true);
  };

  // ===========================
  // 🧾 Etapa de lead
  // ===========================
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // 1. Monta o objeto com todos os dados
    const leadData = {
    nome,
    whats,
    email,
    problema,
    outroProblema,
    perfil,
    distribuidora,
    valorMedio,
    teveDevolucao,
    aparelhoQueimado,
    tempoSemEnergia,
    tempoReligacao,
    };

    try {
    // 2. Chama a Server Action
    const { success, error } = await submitForm('energia', leadData);

    if (error) {
      throw new Error(error);
    }

    // 3. Se deu certo, continua o fluxo
    setMostrarLeadForm(false);
    setResultadoCalculo((prev) => ({
      ...prev,
      leadData: leadData,
    }));

    } catch (error) {
    // 4. Se deu erro
    console.error("Falha ao enviar formulário de energia:", error.message);
    setSubmitError("Houve um erro ao enviar seus dados. Tente novamente, por favor.");
    } finally {
    // 5. Para o loading
    setIsSubmitting(false);
    }
  };

  // ===========================
  // 🧱 Renderização
  // ===========================
  return (
    <main className="page-container">
      <div className="hero-sub-section" id="energia-page">
        <div className="header-section">
          <h1 className="page-title">Verifique possíveis créditos na sua conta de energia</h1>
          <p className="page-subtitle">
            <strong>Falta de energia, cobranças indevidas ou danos elétricos?</strong> Descubra se você tem direito à compensação e receba sua análise gratuita.
          </p>
        </div>
      </div>

      <StepsSection serviceType="energia" />

      <Carousel serviceType="energia" />

      <div className="max-w-3xl form-card box-shadow">
        <h2 className="form-title">Verificador de Compensação de Energia</h2>

        {/* FORM PRINCIPAL */}
        {!mostrarLeadForm && !resultadoCalculo && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Qual seu problema com a energia elétrica?</label>
              <select
                className="form-input"
                value={problema}
                onChange={(e) => setProblema(e.target.value)}
                required
              >
                <option value="conta_alta">Conta muito alta ou cobrança indevida</option>
                <option value="queima_aparelho">Queima de aparelho por queda de energia</option>
                <option value="falta_frequente">Falta de energia frequente</option>
                <option value="atraso_religacao">Atraso na religação da energia</option>
                <option value="outro">Outro problema</option>
              </select>
            </div>

            {/* 🔧 Campo condicional - descrição do outro problema */}
            {problema === "outro" && (
              <div className="form-group mt-3 fade-in">
                <label className="form-label">Descreva brevemente o problema</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Ex: A energia cai sempre que chove, ou demora dias para voltar..."
                  value={outroProblema}
                  onChange={(e) => setOutroProblema(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group mt-4">
              <label className="form-label">Qual seu perfil de consumo?</label>
              <select
                className="form-input"
                value={perfil}
                onChange={(e) => setPerfil(e.target.value)}
                required
              >
                <option value="residencial">Residencial</option>
                <option value="comercial">Comercial / Empresa</option>
                <option value="condominio">Condomínio</option>
                <option value="rural">Rural</option>
              </select>
            </div>

            <div className="form-group mt-4">
              <label className="form-label">Nome da concessionária de energia</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Enel, CPFL, Light, Outra (Digite o nome da concessionária)..."
                value={distribuidora}
                onChange={(e) => setDistribuidora(e.target.value)}
                required
              />
            </div>

            <div className="grid-2-cols mt-4">
              <div className="form-group">
                <label className="form-label">Valor médio da conta (R$)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Ex: 180.00"
                  value={valorMedio}
                  onChange={(e) => setValorMedio(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Teve devolução da concessionária?</label>
                <select
                  className="form-input"
                  value={teveDevolucao}
                  onChange={(e) => setTeveDevolucao(e.target.value)}
                  required
                >
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                </select>
              </div>
            </div>

            <div className="grid-2-cols mt-4">
              <div className="form-group">
                <label className="form-label">Algum aparelho queimou?</label>
                <select
                  className="form-input"
                  value={aparelhoQueimado}
                  onChange={(e) => setAparelhoQueimado(e.target.value)}
                  required
                >
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tempo sem energia (horas)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Ex: 6"
                  value={tempoSemEnergia}
                  onChange={(e) => setTempoSemEnergia(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group mt-4">
              <label className="form-label">Tempo que demorou para religar (em dias)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Ex: 1"
                value={tempoReligacao}
                onChange={(e) => setTempoReligacao(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-submit mt-4">Verificar possibilidade</button>
          </form>
        )}

        {/* FORM DE LEAD */}
        {mostrarLeadForm && (
          <form onSubmit={handleLeadSubmit} className="mt-6">
            <h3 className="form-title">📩 Para enviar sua análise completa</h3>
            <p className="text-gray-600 mb-4">
              Precisamos apenas dos seus dados para personalizar e enviar o resultado detalhado.
            </p>

            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <input
                type="text"
                className="form-input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp com DDD</label>
              <input
                type="tel"
                className="form-input"
                placeholder="(31) 99999-9999"
                value={whats}
                onChange={(e) => setWhats(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="text-sm text-gray-500 mt-3">
              🔒 Seus dados estão protegidos e serão usados apenas para envio da análise e contato sobre seus direitos.
            </div>

            {submitError && (
            <div className="p-3 my-3 text-red-700 bg-red-100 border border-red-200 rounded-md">
              {submitError}
            </div>
            )}

            <button
            type="submit"
            className="btn-submit mt-4"
            disabled={isSubmitting}
            >
            {isSubmitting ? "Enviando..." : "Ver meu resultado agora"}
            </button>
          </form>
        )}

        {/* RESULTADO FINAL */}
        {resultadoCalculo && !mostrarLeadForm && (
          <ResultDisplay
            {...resultadoCalculo}
            leadData={{
              nome,
              whats,
              email,
              problema,
              outroProblema, // 🔧 Adicione esta linha
              perfil,
              distribuidora,
              valorMedio,
              teveDevolucao,
              aparelhoQueimado,
              tempoSemEnergia,
              tempoReligacao,
            }}
          />
        )}
      </div>

      <TestimonialsCarousel />
      <RelatedServices />
      <Faq serviceType="energia" />
    </main>
  );
}
