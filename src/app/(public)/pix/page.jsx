'use client';

export const dynamic = 'force-dynamic';

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
import { useUtmParams } from '@/hooks/useUtmParams'; // <-- HOOK DE UTMs

export default function PixPage() {

    // LÊ OS PARÂMETROS UTM DA URL (Ponto 5)
    const utmParams = useUtmParams();

    // --- Estados do formulário ---
    const [valor, setValor] = useState("");
    const [dataTransacao, setDataTransacao] = useState("");
    const [fraudeTipo, setFraudeTipo] = useState("Golpe do Falso Parente/Amigo");

    // Campos de qualificação (opcionais para reduzir fricção)
    const [chavePix, setChavePix] = useState("");
    const [idPix, setIdPix] = useState("");
    const [bancoPagador, setBancoPagador] = useState("");

    // Novos campos de qualificação
    const [tentouResolver, setTentouResolver] = useState("");
    const [erroTipo, setErroTipo] = useState("");

    const [resultadoCalculo, setResultadoCalculo] = useState(null);
    const [leadStep, setLeadStep] = useState(false); // true: Exibe formulário de lead
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [submitError, setSubmitError] = useState(null);

    // --- Campos do lead ---
    const [nome, setNome] = useState("");
    const [whats, setWhats] = useState("");
    const [email, setEmail] = useState("");

    // --- Upload e popup (Mantidos) ---
    const [mostrarUpload, setMostrarUpload] = useState(false);
    const [arquivo, setArquivo] = useState(null);

    // --- Scroll refs (Mantidos) ---
    const scrollRef = useRef(null);
    const scrollLeft = () => { if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: "smooth" }); };
    const scrollRight = () => { if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: "smooth" }); };

    // --- Submissão inicial do simulador (1ª Etapa: Qualificação) ---
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(null);
        if (!dataTransacao) {
            setFormError("Por favor, preencha a data da transação para calcular o prazo.");
            return;
        }
        // Move para a tela de captura de lead
        setLeadStep(true);
    };

    // --- Submissão do lead (2ª Etapa: Captura -> Envio para API) ---
    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        // 1. Coleta TODOS os dados do formulário (Simulador + Lead + UTMs)
        const leadData = {
            serviceType: 'pix', 
            nome,
            whats,
            email,
            valor: parseFloat(valor), 
            dataTransacao,
            fraudeTipo,
            chavePix,
            idPix,
            bancoPagador,
            tentouResolver,
            erroTipo,
            ...utmParams, // <-- PONTO 5: INCLUI OS UTMS NO PAYLOAD DA API
        };

        try {
            // 2. Tenta enviar para a API Route
            const response = await fetch('/api/submit-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leadData),
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                // Trata erro de validação ou erro interno da API
                throw new Error(result.error || "Erro desconhecido na API. Verifique os logs.");
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
                    'serviceType': 'pix',
                    'leadScore': result.score,
                    'protocol': result.protocol,
                    'formLocation': 'LP_Pix',
                    ...utmParams, // <-- PONTO 5: ENVIA OS UTMS PARA O DATALAYER
                });
            }

            setLeadStep(false); // Sai da tela de lead

        } catch (error) {
            console.error("Falha ao processar o lead PIX:", error.message);
            setSubmitError(`Houve um erro: ${error.message}. Tente novamente, por favor.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Ações de botões auxiliares (Mantidas) ---
    const handleUrgenteClick = () => {
        window.open(
            "https://wa.me/5599999999999?text=Meu caso é urgente (acima de R$5000)",
            "_blank"
        );
    };
    const handleUploadClick = () => setMostrarUpload(true);

    return (
        <main className="page-container">

            {/* HERO / INTRO */}
            <div className="hero-sub-section" id="pix-page">
                <div className="header-section">
                    <h1 className="page-title">Foi vítima de golpe com PIX?</h1>
                    <p className="page-subtitle">
                        <strong>Você pode ter direito à devolução pelo Mecanismo Especial de Devolução (MED)</strong> — um recurso do Banco Central disponível por até 80 dias após o envio do valor.
                        <strong> Use nosso simulador gratuito e veja se o seu caso é elegível para análise.</strong>
                    </p>
                </div>
            </div>

            <StepsSection serviceType="pix" />
            <Carousel serviceType="pix" />

            {/* FORMULÁRIO / RESULTADO */}
            <div className="max-w-3xl form-card box-shadow">
                <h2 className="form-title">Simulador de Fraude PIX (MED)</h2>

                {/* === FORMULÁRIO PRINCIPAL === */}
                {!leadStep && !resultadoCalculo && (
                    <form onSubmit={handleSubmit}>
                        <div className="grid-2-cols">
                            {/* ... (Input Valor e Data - Mantidos) ... */}
                            <div className="form-group">
                                <label>Valor do PIX (R$)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Ex: 1500,00"
                                    min="0.01"
                                    step="0.01"
                                    value={valor}
                                    onChange={(e) => setValor(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Data da Transação</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={dataTransacao}
                                    onChange={(e) => setDataTransacao(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group mt-4">
                            <label>Tipo de Fraude</label>
                            <select
                                className="form-input"
                                value={fraudeTipo}
                                onChange={(e) => setFraudeTipo(e.target.value)}
                            >
                                <option>Golpe do Falso Parente/Amigo</option>
                                <option>Falso Leilão/Venda</option>
                                <option>Phishing (Link Falso)</option>
                                <option>Engenharia Social</option>
                                <option>Outro</option>
                            </select>
                        </div>

                        {/* CAMPOS OPCIONAIS ADICIONADOS ANTERIORMENTE */}
                        <div className="grid-2-cols mt-4">
                            <div className="form-group">
                                <label>Seu Banco (Pagador) <span className="text-gray-500 font-normal">(opcional)</span></label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ex: Banco do Brasil"
                                    value={bancoPagador}
                                    onChange={(e) => setBancoPagador(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Chave PIX do Destino <span className="text-gray-500 font-normal">(opcional)</span></label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ex: CPF, Telefone ou E-mail"
                                    value={chavePix}
                                    onChange={(e) => setChavePix(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group mt-4">
                            <label>ID da Transação (E2E ou Código de Autenticação) <span className="text-gray-500 font-normal">(opcional)</span></label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ex: E202110051234567890123456789"
                                value={idPix}
                                onChange={(e) => setIdPix(e.target.value)}
                            />
                        </div>


                        {/* ... (Outros campos mantidos) ... */}
                        <div className="form-group mt-4">
                            <label>Você já tentou resolver com o banco?</label>
                            <select
                                className="form-input"
                                value={tentouResolver}
                                onChange={(e) => setTentouResolver(e.target.value)}
                                required
                            >
                                <option value="">Selecione...</option>
                                <option>Sim</option>
                                <option>Não</option>
                            </select>
                        </div>

                        <div className="form-group mt-4">
                            <label>Você foi induzido ao erro ou digitou errado?</label>
                            <select
                                className="form-input"
                                value={erroTipo}
                                onChange={(e) => setErroTipo(e.target.value)}
                                required
                            >
                                <option value="">Selecione...</option>
                                <option>Fui induzido ao erro (golpe)</option>
                                <option>Digitei errado por conta própria</option>
                            </select>
                        </div>

                        <p className="text-sm-gray mt-4">
                            Esta é uma análise prévia. A devolução depende da resposta do banco e do Banco Central.
                        </p>
                        {formError && (
                            <div className="p-3 my-3 text-red-700 bg-red-100 border border-red-200 rounded-md">
                                {formError}
                            </div>
                        )}

                        <button type="submit" className="btn-submit mt-4">
                            Ver meu resultado
                        </button>
                    </form>
                )}

                {/* === CAPTURA DE LEAD === */}
                {leadStep && (
                    <form onSubmit={handleLeadSubmit} className="lead-form mt-6">
                        <h3>✉️ Para enviar sua análise com detalhes</h3>
                        <p>Precisamos apenas de seus dados para personalizar e entregar o resultado completo.</p>
                        {/* ... (Campos de Lead mantidos: nome, whats, email) ... */}
                        <div className="form-group mt-4">
                            <label>Nome completo</label>
                            <input className="form-input" required value={nome} onChange={(e) => setNome(e.target.value)} />
                        </div>
                        <div className="form-group mt-4">
                            <label>WhatsApp com DDD</label>
                            <input className="form-input" type="tel" required placeholder="(11) 99999-9999" value={whats} onChange={(e) => setWhats(e.target.value)} />
                        </div>
                        <div className="form-group mt-4">
                            <label>E-mail</label>
                            <input className="form-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <p className="text-sm-gray mt-4">
                            🔒 Seus dados estão seguros. Usamos suas informações apenas para essa análise e para te ajudar a exercer seus direitos como consumidor.
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
                            {isSubmitting ? "Enviando..." : "Receber Resultado"}
                        </button>
                    </form>
                )}

                {/* === RESULTADO FINAL === */}
                {resultadoCalculo && (
                    <>
                        <ResultDisplay
                            {...resultadoCalculo}
                        // Removido leadData. ResultDisplay não precisa mais dos dados brutos do lead
                        />


                        {/* POPUP UPLOAD (Mantido) */}
                        {mostrarUpload && (
                            <div className="popup-overlay">
                                <div className="popup-card">
                                    <h3>📎 Envie seu comprovante do PIX</h3>
                                    <input type="file" onChange={(e) => setArquivo(e.target.files[0])} className="form-input mt-2" />
                                    <div className="mt-3 flex gap-3">
                                        <button className="btn" onClick={() => setMostrarUpload(false)}>Fechar</button>
                                        {arquivo && (
                                            <button className="btn-success" onClick={() => { alert("✅ Comprovante anexado com sucesso!"); setMostrarUpload(false); }}>
                                                Enviar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <TestimonialsCarousel />
            <RelatedServices />
            <Faq serviceType="pix" />
        </main>
    );
}