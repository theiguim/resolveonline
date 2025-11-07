'use client';
import { useState, useRef } from "react";
import "../../../styles/FormPages.css";
import ResultDisplay from "../../../components/ResultDisplay/ResultDisplay";

// Componentes de Layout (Importações mantidas)
import Carousel from "@/components/Carousel/Carousel";
import Faq from "@/components/Faq/Faq";
import RelatedServices from "@/components/RelatedServices/RelatedServices";
import StepsSection from "@/components/StepsSection/StepsSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel/TestimonialsCarousel";
// NOVO: Importa o Hook de UTMs
import { useUtmParams } from '@/hooks/useUtmParams';


export default function SaudePage() {
    // LÊ OS PARÂMETROS UTM DA URL (Ponto 5)
    const utmParams = useUtmParams(); 

    // ===========================
    // 🧩 Estados principais
    // ===========================
    const [problema, setProblema] = useState("negativa");
    const [outrosServicos, setOutrosServicos] = useState("");
    const [urgencia, setUrgencia] = useState("");
    const [operadora, setOperadora] = useState("");
    const [tipoPlano, setTipoPlano] = useState("individual");
    const [documentosProntos, setDocumentosProntos] = useState("");

    // ====== Etapa de coleta de leads ======
    const [nome, setNome] = useState("");
    const [whats, setWhats] = useState("");
    const [email, setEmail] = useState("");
    const [mostrarLeadForm, setMostrarLeadForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const [resultadoCalculo, setResultadoCalculo] = useState(null);
    const scrollRef = useRef(null);

    // =========================
    // Lógica de simulação (Qualificação)
    // =========================
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validação adicional para o campo "outros"
        if (problema === "outros" && outrosServicos.trim() === "") {
            setSubmitError("Por favor, descreva o problema de saúde.");
            return;
        }

        // CRÍTICO: A lógica de análise (direitos, checklist) é MIGRADA PARA A API.
        setSubmitError(null);
        setMostrarLeadForm(true); // Move para a tela de lead
        setResultadoCalculo(null);
    };

    // =========================
    // 📩 Envio de dados do lead (Chama a API Route)
    // =========================
    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        // 1. Monta o objeto com todos os dados (Simulador + Lead + UTMs)
        const leadData = {
            serviceType: 'saude', // CRÍTICO: Identificador da vertical
            nome,
            whats,
            email,
            problema,
            outrosServicos,
            urgencia,
            operadora,
            tipoPlano,
            documentosProntos,
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
                throw new Error(result.error || "Erro desconhecido ao processar lead de saúde.");
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
                   'serviceType': 'saude',
                   'leadScore': result.score,
                   'protocol': result.protocol,
                   'formLocation': 'LP_Saude',
                   ...utmParams, // <-- PONTO 5: ENVIA OS UTMS PARA O DATALAYER
                });
            }

            setMostrarLeadForm(false); // Sai da tela de lead
            
        } catch (error) {
            console.error("Falha ao processar o lead Saúde:", error.message);
            setSubmitError(`Houve um erro: ${error.message}. Tente novamente, por favor.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // =========================
    // Renderização visual
    // =========================
    return (
        <main className="page-container">

            <div className="hero-sub-section" id="saude-page">
                <div className="header-section">
                    <h1 className="page-title">Plano de saúde negou cobertura?</h1>
                    <p className="page-subtitle">
                        Seu plano <strong>não cumpriu os prazos da ANS, negou um procedimento ou aplicou um reajuste abusivo?</strong>
                        Use nosso simulador para entender se <strong>você tem direito a contestação e quais passos seguir</strong>.
                    </p>
                </div>
            </div>

            <StepsSection serviceType="saude" />
            <Carousel serviceType="saude" />

            <div className="max-w-3xl form-card box-shadow">
                <h2 className="form-title">Simulador de Direitos - Planos de Saúde</h2>

                {/* ========================= ETAPA 1 - FORM PRINCIPAL ========================= */}
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
                                <option value="outros">Outro tipo de problema</option>
                            </select>
                        </div>

                        {problema === "outros" && (
                            <div className="form-group mt-3">
                                <label className="form-label">Descreva brevemente sua necessidade</label>
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    placeholder="Ex: Preciso incluir dependente, contestar coparticipação, plano não cobre terapias..."
                                    value={outrosServicos}
                                    onChange={(e) => setOutrosServicos(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                        )}

                        {problema === "reajuste" && (
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
                                placeholder="Ex: Unimed, SulAmérica, Bradesco Saúde, Outro..."
                                value={operadora}
                                onChange={(e) => setOperadora(e.target.value)}
                            />
                        </div>

                        <div className="grid-2-cols mt-4">
                            <div className="form-group">
                                <label className="form-label">O caso envolve urgência ou emergência?</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="urgencia" value="sim" checked={urgencia === "sim"} onChange={(e) => setUrgencia(e.target.value)} required /> Sim</label>
                                    <label><input type="radio" name="urgencia" value="nao" checked={urgencia === "nao"} onChange={(e) => setUrgencia(e.target.value)} required /> Não</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Você já possui a negativa/prescrição/protocolos?</label>
                                <div className="radio-group">
                                    <label><input type="radio" name="docs-prontos" value="sim" checked={documentosProntos === "sim"} onChange={(e) => setDocumentosProntos(e.target.value)} required /> Sim</label>
                                    <label><input type="radio" name="docs-prontos" value="nao" checked={documentosProntos === "nao"} onChange={(e) => setDocumentosProntos(e.target.value)} required /> Não</label>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm-gray mt-4">
                            Simulações relacionadas a planos de saúde seguem as normas da ANS. A plataforma não realiza atendimento jurídico direto, apenas fornece informações baseadas na regulação vigente.
                        </p>

                        <button type="submit" className="btn-submit mt-4">Ver Próximos Passos</button>
                    </form>
                )}

                {/* ========================= ETAPA 2 - FORM DE LEAD ========================= */}
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
                            {isSubmitting ? "Enviando..." : "Ver Resultado"}
                        </button>
                    </form>
                )}

                {/* ========================= ETAPA 3 - RESULTADO FINAL ========================= */}
                {resultadoCalculo && !mostrarLeadForm && (
                    <ResultDisplay
                        {...resultadoCalculo}
                        // leadData é agora desnecessário no front-end, mas mantido para referência se precisar
                    />
                )}
            </div>

            <TestimonialsCarousel />
            <RelatedServices />
            <Faq serviceType="saude" />
        </main>
    );
}