'use client';
import { useState, useRef } from "react";
import "../../../styles/FormPages.css";
import ResultDisplay from "../../../components/ResultDisplay/ResultDisplay";

// Componentes de Layout (Importações originais mantidas)
import Link from "next/link";
import Carousel from "@/components/Carousel/Carousel";
import Faq from "@/components/Faq/Faq";
import RelatedServices from "@/components/RelatedServices/RelatedServices";
import StepsSection from "@/components/StepsSection/StepsSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel/TestimonialsCarousel";
// NOVO: Importa o Hook de UTMs
import { useUtmParams } from '@/hooks/useUtmParams';


export default function EnergiaPage() {
    // LÊ OS PARÂMETROS UTM DA URL (Ponto 5)
    const utmParams = useUtmParams();

    // ===========================
    // 🧩 Estados principais
    // ===========================
    const [problema, setProblema] = useState("conta_alta");
    const [outroProblema, setOutroProblema] = useState("");
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
    // 📊 Lógica de simulação (Qualificação)
    // ===========================
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validação adicional para o campo "outro"
        if (problema === "outro" && outroProblema.trim() === "") {
            setSubmitError("Por favor, descreva o problema na energia.");
            return;
        }

        // Vai para a etapa de lead (coleta de dados)
        setSubmitError(null);
        setMostrarLeadForm(true);
        setResultadoCalculo(null);
    };

    // ===========================
    // 📩 Envio de dados do lead (Chama a API Route)
    // ===========================
    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        // 1. Monta o objeto com todos os dados (Simulador + Lead + UTMs)
        const leadData = {
            serviceType: 'energia', // CRÍTICO: Identificador da vertical
            nome,
            whats,
            email,
            problema,
            outroProblema,
            perfil,
            distribuidora,
            valorMedio: parseFloat(valorMedio) || 0,
            teveDevolucao,
            aparelhoQueimado,
            tempoSemEnergia: parseFloat(tempoSemEnergia) || 0,
            tempoReligacao: parseFloat(tempoReligacao) || 0,
            ...utmParams, // <-- PONTO 5: INCLUI OS UTMS NO PAYLOAD DA API
        };

        try {
            // 2. Tenta enviar para a API Route (/api/submit-lead)
            const response = await fetch('/api/submit-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leadData),
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                throw new Error(result.error || "Erro desconhecido ao processar lead de energia.");
            }

            // 3. SE DEU CERTO: Renderiza o resultado usando os dados EXATOS devolvidos pela API
            setResultadoCalculo({
                ...result.resultData, 
                protocol: result.protocol,
                score: result.score,
            });

            // 4. Disparo de evento de rastreamento GA4 (Ponto 5)
            if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                   'event': 'lead_submit',
                   'serviceType': 'energia',
                   'leadScore': result.score,
                   'protocol': result.protocol,
                   'formLocation': 'LP_Energia',
                   ...utmParams, // <-- PONTO 5: ENVIA OS UTMS PARA O DATALAYER
                });
            }

            setMostrarLeadForm(false); // Sai da tela de lead
            
        } catch (error) {
            console.error("Falha ao processar o lead Energia:", error.message);
            setSubmitError(`Houve um erro: ${error.message}. Tente novamente, por favor.`);
        } finally {
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
                        {/* ... (Campos do Simulador) ... */}
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

                        {/* Campo condicional - descrição do outro problema */}
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
                            <label className="form-label">Tempo que demorou para religar (em dias) <span className="text-gray-500 font-normal">(se aplicável)</span></label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Ex: 1"
                                value={tempoReligacao}
                                onChange={(e) => setTempoReligacao(e.target.value)}
                                // REMOVIDO: required. Se for 0 dias, pode ser deixado em branco
                            />
                        </div>

                        {submitError && (
                            <div className="p-3 my-3 text-red-700 bg-red-100 border border-red-200 rounded-md">
                                {submitError}
                            </div>
                        )}
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
                    <ResultDisplay {...resultadoCalculo} />
                )}
            </div>

            <TestimonialsCarousel />
            <RelatedServices />
            <Faq serviceType="energia" />
        </main>
    );
}