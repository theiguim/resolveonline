'use client';
import { useState, useRef } from "react";
import "../../styles/FormPages.css";
import ResultDisplay from "../../components/ResultDisplay/ResultDisplay";
import Link from "next/link";
import Carousel from "@/components/Carousel/Carousel";
import Faq from "@/components/Faq/Faq";
import RelatedServices from "@/components/RelatedServices/RelatedServices";
import StepsSection from "@/components/StepsSection/StepsSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel/TestimonialsCarousel";

export default function AereoPage() {
    // ===========================
    // 🧩 Estados principais
    // ===========================
    const [problema, setProblema] = useState("atraso");
    const [escopo, setEscopo] = useState("domestico");
    const [horas, setHoras] = useState("");
    const [pernoite, setPernoite] = useState("nao");
    const [despesas, setDespesas] = useState(0);
    const [resultadoCalculo, setResultadoCalculo] = useState(null);

    // Etapa de coleta de dados pessoais (lead)
    const [nome, setNome] = useState("");
    const [whats, setWhats] = useState("");
    const [email, setEmail] = useState("");
    const [mostrarLeadForm, setMostrarLeadForm] = useState(false);

    const scrollRef = useRef(null);

    // ===========================
    // 📊 Lógica de simulação
    // ===========================
    const handleSubmit = (e) => {
        e.preventDefault();

        const h = parseFloat(horas) || 0;
        const d = parseFloat(despesas) || 0;
        let direitos = [];
        let checklist = [
            "Cópia dos Bilhetes Aéreos ou E-ticket",
            "Documento de Identificação (RG/CNH)",
            "Comprovante de Residência",
            "Prints ou comunicações da companhia aérea",
        ];

        const disclaimer = "Esta é uma estimativa. A análise final depende de fatores como causa do problema, responsabilidade da companhia aérea e documentação apresentada.";
        const ctaText = "Continuar para Atendimento via WhatsApp";

        // ------------------------
        // Regras por tipo de problema
        // ------------------------
        if (problema === "atraso") {
            checklist.push("Comprovantes de despesas (alimentação, táxi, hotel)");
            if (h < 1) {
                direitos.push("Atrasos inferiores a 1 hora geralmente não geram direito à assistência material.");
            } else if (h >= 1 && h < 2) {
                direitos.push("A partir de 1 hora de atraso: direito à comunicação (internet, telefonemas).");
            } else if (h >= 2 && h < 4) {
                direitos.push("A partir de 2 horas de atraso: direito à alimentação (voucher, lanche, bebida).");
            } else if (h >= 4) {
                direitos.push("A partir de 4 horas de atraso: direito a reacomodação imediata ou reembolso integral.");
                if (pernoite === "sim") {
                    direitos.push("Como houve pernoite, há direito a hospedagem e transporte de ida e volta.");
                }
                direitos.push("Pode haver direito a indenização por danos morais.");
            }
        } else if (problema === "cancelamento") {
            checklist.push("Aviso de cancelamento (e-mail, SMS, aplicativo)");
            direitos.push("Cancelamento sem aviso prévio de 72h garante direito à reacomodação, reembolso ou compensação financeira.");
            direitos.push("Se não recebeu opção de reacomodação ou reembolso, pode haver falha grave do transportador.");
        } else if (problema === "overbooking") {
            checklist.push("Comprovante de comparecimento e cartão de embarque.");
            direitos.push("Em caso de overbooking (preterição de embarque), você tem direito à compensação financeira imediata e assistência material.");
            direitos.push("A companhia deve oferecer reacomodação ou reembolso. Caso não tenha ocorrido, há forte indicativo para indenização.");
        } else if (problema === "bagagem") {
            checklist.push("Registro de Irregularidade de Bagagem (RIB).");
            direitos.push("Em extravio, a empresa deve localizar e devolver sua mala em até 7 dias (voo doméstico) ou 21 dias (internacional).");
            direitos.push("Se ultrapassado o prazo, ou se houve despesas, há direito a reembolso e possível indenização.");
        }

        // Resultado base
        setResultadoCalculo({
            title: "Resultado da Análise:",
            content: direitos,
            checklist,
            disclaimer,
            expenses: d,
            ctaText,
            serviceType: "Aéreo"
        });

        // Exibe etapa de coleta de dados antes de renderizar o resultado
        setMostrarLeadForm(true);
    };

    // ===========================
    // 📩 Envio de dados do lead
    // ===========================
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
                horas,
                pernoite,
                despesas,
            },
        }));
    };

    // ===========================
    // 🔄 Scroll
    // ===========================
    const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
    const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });

    // ===========================
    // 🧱 Renderização
    // ===========================
    return (
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

                {/* FORM PRINCIPAL */}
                {!mostrarLeadForm && !resultadoCalculo && (
                    <form onSubmit={handleSubmit}>
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

                        <button type="submit" className="btn-submit mt-4">Ver meu resultado agora</button>
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
                        despesas
                    }} />
                )}
            </div>

            <TestimonialsCarousel />
            <RelatedServices />
            <Faq serviceType="voos" />
        </main>
    );
}
