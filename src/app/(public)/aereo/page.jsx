'use client';
export const dynamic = 'force-dynamic'; // Garante renderização dinâmica, evita build estático

import { useState, useRef } from "react";
import "../../../styles/FormPages.css";

// Layouts e componentes
import Link from "next/link";
import Carousel from "@/components/Carousel/Carousel";
import Faq from "@/components/Faq/Faq";
import RelatedServices from "@/components/RelatedServices/RelatedServices";
import StepsSection from "@/components/StepsSection/StepsSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel/TestimonialsCarousel";
import ResultDisplay from "../../../components/ResultDisplay/ResultDisplay";
import UtmWrapper from "@/components/UtmWrapper/UtmWrapper"; // <-- Novo componente isolado

export default function AereoPage() {
    // 🔹 Estado de UTMs capturado via UtmWrapper
    const [utmParams, setUtmParams] = useState({});

    // ===========================
    // 🧩 Estados principais
    // ===========================
    const [problema, setProblema] = useState("atraso");
    const [escopo, setEscopo] = useState("domestico");
    const [horas, setHoras] = useState("");
    const [pernoite, setPernoite] = useState("nao");
    const [despesas, setDespesas] = useState(0);
    const [resultadoCalculo, setResultadoCalculo] = useState(null);
    const [antecedenciaAviso, setAntecedenciaAviso] = useState('');

    // Etapa de coleta de dados pessoais (lead)
    const [nome, setNome] = useState("");
    const [whats, setWhats] = useState("");
    const [email, setEmail] = useState("");
    const [mostrarLeadForm, setMostrarLeadForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const scrollRef = useRef(null);

    // ===========================
    // 📊 Lógica de simulação (Qualificação)
    // ===========================
    const handleSubmit = (e) => {
        e.preventDefault();

        const h = parseFloat(horas) || 0;
        if ((problema === "atraso" || problema === "cancelamento") && h < 0) {
            setSubmitError("As horas de atraso devem ser zero ou positivas.");
            return;
        }

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
            serviceType: "aereo",
            nome,
            whats,
            email,
            problema,
            escopo,
            horas: parseFloat(horas) || 0,
            pernoite,
            despesas: parseFloat(despesas) || 0,
            antecedenciaAviso: antecedenciaAviso, // <-- ADICIONE ESTA LINHA
            ...utmParams, // <-- Inclui UTMs vindas do UtmWrapper
        };

        try {
            // 2. Envia para a API
            const response = await fetch("/api/submit-lead", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(leadData),
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                throw new Error(result.error || "Erro desconhecido ao processar lead aéreo.");
            }

            // 3. Exibe o resultado da simulação
            setResultadoCalculo({
                ...result.resultData,
                protocol: result.protocol,
                score: result.score,
            });

            // 4. Rastreamento (GA4)
            if (typeof window !== "undefined" && window.dataLayer) {
                window.dataLayer.push({
                    event: "lead_submit",
                    serviceType: "aereo",
                    leadScore: result.score,
                    protocol: result.protocol,
                    formLocation: "LP_Aereo",
                    ...utmParams,
                });
            }

            setMostrarLeadForm(false);
        } catch (error) {
            console.error("Falha ao processar o lead Aéreo:", error.message);
            setSubmitError(`Houve um erro: ${error.message}. Tente novamente, por favor.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ===========================
    // 🧱 Renderização
    // ===========================
    return (
        <>
            <UtmWrapper onUtmsReady={setUtmParams} />
            <main className="page-container">
                <div className="hero-sub-section" id="aereo-page">
                    <div className="header-section">
                        <h1 className="page-title">Teve problemas com seu voo?</h1>
                        <p className="page-subtitle">
                            <strong>Atrasos, cancelamentos, overbooking ou extravio de bagagem podem gerar indenização.</strong> Use nossa calculadora gratuita e veja se você tem direito agora mesmo.
                        </p>
                    </div>
                </div>

                <StepsSection serviceType="aereo" />

                <Carousel serviceType="voos" />

                <div className="max-w-3xl form-card box-shadow">
                    <h2 className="form-title">Calculadora de Direitos do Passageiro Aéreo</h2>

                    {/* FORM PRINCIPAL (Simulador) */}
                    {!mostrarLeadForm && !resultadoCalculo && (
                        <form onSubmit={handleSubmit}>
                            {/* ... (Campos do Simulador mantidos) ... */}
                            <div className="form-group">
                                <label className="form-label">Qual foi o problema?</label>
                                <select
                                    className="form-input"
                                    value={problema}
                                    onChange={(e) => setProblema(e.target.value)}
                                    required
                                >
                                    <option value="atraso">Atraso de Voo</option>
                                    <option value="cancelamento">Cancelamento</option>
                                    <option value="overbooking">Overbooking (Preterição de Embarque)</option>
                                    <option value="bagagem">Extravio de Bagagem</option>
                                </select>
                            </div>

                            {/* ================ CAMPO DE ANTECEDÊNCIA ADICIONADO ================ */}
                            {problema === "cancelamento" && (
                                <div className="form-group mt-4">
                                    <label className="form-label">Com quanta antecedência você foi avisado sobre o cancelamento do voo?</label>
                                    <select
                                        className="form-input"
                                        value={antecedenciaAviso}
                                        onChange={(e) => setAntecedenciaAviso(e.target.value)}
                                        // Tornamos 'required' condicional, para não bloquear o form se o campo estiver oculto
                                        required={problema === "cancelamento"} 
                                    >
                                        <option value="">Selecione uma opção</option>
                                        <option value="menos_72h">Menos de 72h antes do embarque</option>
                                        <option value="mais_72h">72h ou mais antes do embarque</option>
                                    </select>
                                    <p className="text-sm-gray mt-2">
                                        Considere a data e hora em que recebeu a notificação da companhia aérea.
                                    </p>
                                </div>
                            )}
                            {/* ================================================ */}

                            {(problema === "atraso" || problema === "cancelamento") && (
                                <div className="grid-2-cols mt-4">
                                    <div className="form-group">
                                        <label className="form-label">Horas de atraso (na chegada)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="Ex: 5"
                                            min="0"
                                            value={horas}
                                            onChange={(e) => setHoras(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {(problema === "atraso" || problema === "cancelamento") && parseFloat(horas) >= 4 && (
                                <div className="grid-2-cols mt-4">
                                    <div className="form-group">
                                        <label className="form-label">Houve pernoite?</label>
                                        <select
                                            className="form-input"
                                            value={pernoite}
                                            onChange={(e) => setPernoite(e.target.value)}
                                            required
                                        >
                                            <option value="nao">Não</option>
                                            <option value="sim">Sim</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="form-group mt-4">
                                <label className="form-label">Você teve despesas extras (alimentação, táxi, hotel)? (R$)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Ex: 150.00"
                                    min="0"
                                    step="0.01"
                                    value={despesas}
                                    onChange={(e) => setDespesas(e.target.value)}
                                    required
                                />
                            </div>

                            <p className="text-sm-gray mt-4">
                                As informações fornecidas têm caráter informativo e seguem as normas da ANAC e do Código de Defesa do Consumidor.
                            </p>

                            <button type="submit" className="btn-submit mt-4">
                                Calcular Meus Direitos
                            </button>
                        </form>
                    )}

                    {/* FORM DE COLETA DE LEAD */}
                    {mostrarLeadForm && (
                        <form onSubmit={handleLeadSubmit} className="mt-6">
                            <h3 className="form-title">✉️ Para enviar sua análise com detalhes</h3>
                            {/* ... (Campos de Lead mantidos) ... */}
                            <p className="text-gray-600 mb-4">
                                Precisamos apenas dos seus dados para personalizar e entregar o resultado completo.
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

                            <div className="form-privacy mt-4 text-sm text-gray-500">
                                🔒 Seus dados estão seguros. Usamos suas informações apenas para esta análise e para te ajudar a exercer seus direitos.
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

<<<<<<< HEAD
                    {/* RESULTADO FINAL (Só aparece após a submissão do lead) */}
                    {resultadoCalculo && !mostrarLeadForm && (
                        <ResultDisplay {...resultadoCalculo} />
                    )}
                </div>

                <TestimonialsCarousel />
                <RelatedServices />
                <Faq serviceType="voos" />
            </main>
        </>
=======
                        {/* ================================================ */}
                        {/* ================ NOVO CAMPO ADICIONADO ================ */}
                        {/* ================================================ */}
                        {problema === "cancelamento" && (
                            <div className="form-group mt-4">
                                <label className="form-label">Com quanta antecedência você foi avisado sobre o cancelamento do voo?</label>
                                <select
                                    className="form-input"
                                    value={antecedenciaAviso} // Assumindo que você criará este estado
                                    onChange={(e) => setAntecedenciaAviso(e.target.value)} // Assumindo que você criará este setter
                                    required
                                >
                                    <option value="">Selecione uma opção</option>
                                    <option value="menos_72h">Menos de 72h antes do embarque</option>
                                    <option value="mais_72h">72h ou mais antes do embarque</option>
                                </select>
                                <p className="text-sm-gray mt-2">
                                    Considere a data e hora em que recebeu a notificação da companhia aérea.
                                </p>
                            </div>
                        )}
                        {/* ================================================ */}
                        {/* ================ FIM DO NOVO CAMPO ================= */}
                        {/* ================================================ */}


                        {(problema === "atraso" || problema === "cancelamento") && (
                            <div className="grid-2-cols mt-4">
                                <div className="form-group">
                                    <label className="form-label">Horas de atraso (na chegada)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Ex: 5"
                                        min="0"
                                        value={horas}
                                        onChange={(e) => setHoras(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {(problema === "atraso" || problema === "cancelamento") && parseFloat(horas) >= 4 && (
                            <div className="grid-2-cols mt-4">
                                <div className="form-group">
                                    <label className="form-label">Houve pernoite?</label>
                                    <select
                                        className="form-input"
                                        value={pernoite}
                                        onChange={(e) => setPernoite(e.target.value)}
                                        required
                                    >
                                        <option value="nao">Não</option>
                                        <option value="sim">Sim</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="form-group mt-4">
                            <label className="form-label">Você teve despesas extras (alimentação, táxi, hotel)? (R$)</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Ex: 150.00"
                                min="0"
                                step="0.01"
                                value={despesas}
                                onChange={(e) => setDespesas(e.target.value)}
                                required
                            />
                        </div>

                        <p className="text-sm-gray mt-4">
                            As informações fornecidas têm caráter informativo e seguem as normas da ANAC e do Código de Defesa do Consumidor.
                        </p>

                        <button type="submit" className="btn-submit mt-4">
                            Calcular Meus Direitos
                        </button>
                    </form>
                )}

                {/* FORM DE COLETA DE LEAD */}
                {mostrarLeadForm && (
                    <form onSubmit={handleLeadSubmit} className="mt-6">
                        <h3 className="form-title">✉️ Para enviar sua análise com detalhes</h3>
                        <p className="text-gray-600 mb-4">
                            Precisamos apenas dos seus dados para personalizar e entregar o resultado completo.
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

                        <div className="form-privacy mt-4 text-sm text-gray-500">
                            🔒 Seus dados estão seguros. Usamos suas informações apenas para esta análise e para te ajudar a exercer seus direitos.
                        </div>

                        {submitError && (
              <div className="p-3 my-3 text-red-700 bg-red-100 border border-red-200 rounded-md">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              className="btn-submit mt-4"
              disabled={isSubmitting} // Desabilita enquanto envia
            >
              {isSubmitting ? "Enviando..." : "Ver meu resultado agora"}
            </button>
          </form>
                )}

                {/* RESULTADO FINAL */}
                {resultadoCalculo && !mostrarLeadForm && (
                    <ResultDisplay {...resultadoCalculo} leadData={{
                        nome,
                        whats,
                        email,
                        problema,
                        horas,
                        pernoite,
                        despesas,
                        antecedenciaAviso // VARIÁVEL ADICIONADA AQUI
                    }} />
                )}
            </div>

            <TestimonialsCarousel />
            <RelatedServices />
            <Faq serviceType="voos" />
        </main>
>>>>>>> c31938d2d030fe1bcc0804eb47f0a78081605098
    );
}