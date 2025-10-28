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


export default function PixPage() {
    // --- Estados do formulário ---
    const [valor, setValor] = useState("");
    const [dataTransacao, setDataTransacao] = useState("");
    const [fraudeTipo, setFraudeTipo] = useState("Golpe do Falso Parente/Amigo");
    const [chavePix, setChavePix] = useState("");
    const [idPix, setIdPix] = useState("");
    const [bancoPagador, setBancoPagador] = useState("");
    const [tentouResolver, setTentouResolver] = useState("");
    const [erroTipo, setErroTipo] = useState("");
    const [resultadoCalculo, setResultadoCalculo] = useState(null);
    const [leadStep, setLeadStep] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null); 
    const [submitError, setSubmitError] = useState(null);

    // --- Campos do lead ---
    const [nome, setNome] = useState("");
    const [whats, setWhats] = useState("");
    const [email, setEmail] = useState("");

    // --- Upload e popup ---
    const [mostrarUpload, setMostrarUpload] = useState(false);
    const [arquivo, setArquivo] = useState(null);

    // --- Scroll refs ---
    const scrollRef = useRef(null);
    const scrollLeft = () => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    };
    const scrollRight = () => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    };

    // --- Submissão inicial do simulador ---
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!dataTransacao) {
            alert("Por favor, preencha a data da transação.");
            return;
        }
        setLeadStep(true); // ativa tela de captura
    };

    // --- Submissão do lead ---
    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const transacao = new Date(dataTransacao);
        const hoje = new Date();
        const diffDays = Math.floor(Math.abs(hoje - transacao) / (1000 * 60 * 60 * 24));

        let title, content, checklist, ctaText;
        const disclaimer =
            "Esta é uma análise prévia. A confirmação da viabilidade dependerá de avaliação jurídica mais detalhada.";

        const msgBase = {
            "Golpe do Falso Parente/Amigo":
                "⚠️ Golpe comum de engenharia social. Caso tenha sido induzido ao erro, registre um B.O. e contate o banco solicitando abertura de MED.",
            "Falso Leilão/Venda":
                "Esse tipo de golpe envolve anúncios falsos. Guarde prints da negociação e registre o ocorrido.",
            "Phishing (Link Falso)":
                "Você pode ter clicado em link falso. Se houve acesso indevido, altere senhas e comunique o banco.",
            "Engenharia Social":
                "Golpe baseado em manipulação emocional. Sempre registre protocolo e B.O. para reforçar seu caso.",
            Outro: "Situação atípica. Nossa equipe pode avaliar a melhor estratégia conforme o contexto.",
        };

        if (diffDays <= 80) {
            title = "Boa notícia! Você está dentro do prazo.";
            ctaText = "Continuar para Atendimento";
            content = [
                msgBase[fraudeTipo],
                `Sua transação ocorreu há ${diffDays} dias — dentro do prazo de 80 dias para o MED.`,
                "Aja rápido: registre contestação com o banco e boletim de ocorrência.",
            ];
            checklist = [
                "Comprovante do PIX (E2E visível)",
                "B.O. e protocolo do banco",
                "Prints ou mensagens da negociação",
            ];
        } else {
            title = "Atenção: Prazo formal expirado.";
            ctaText = "Falar com especialista em alternativas";
            content = [
                msgBase[fraudeTipo],
                `A transação tem ${diffDays} dias — o prazo para o MED expirou, mas outras medidas são possíveis.`,
            ];
            checklist = [
                "Comprovante do PIX",
                "Documentos de identificação",
                "Provas de falha bancária, se houver",
            ];
        }

        const leadData = {
            nome,
            whats,
            email,
            valor,
            dataTransacao,
            fraudeTipo,
            chavePix, // Campo já existia no estado
            idPix, // Campo já existia no estado
            bancoPagador, // Campo já existia no estado
            tentouResolver,
            erroTipo,
            };

            // 2. Tenta enviar para o Supabase
            try {
            // Substitui o fetch()
            const { success, error } = await submitForm('pix', leadData);

            if (error) {
                throw new Error(error);
            }

            // 3. Se deu certo, continua o fluxo normal
            setResultadoCalculo({
                title,
                content,
                checklist,
                disclaimer,
                ctaText,
                serviceType: "PIX",
                extraMessage:
                erroTipo === "Digitei errado por conta própria"
                    ? "🔍 Parece ter sido um erro humano. Ainda assim, verifique se o banco pode ajudar e mantenha o comprovante da transação."
                    : "💡 Casos de golpe com indução ao erro podem ter maior chance de recuperação se o MED for aberto dentro de 80 dias.",
            });

            setLeadStep(false);

            } catch (error) {
            // 4. Se deu erro no envio
            console.error("Falha ao enviar formulário PIX:", error.message);
            setSubmitError("Houve um erro ao enviar seus dados. Tente novamente, por favor.");
            } finally {
            // 5. Para o loading
            setIsSubmitting(false);
            }
        };

    // --- Ações de botões auxiliares ---
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
                            leadData={{
                                nome,
                                whats,
                                email,
                                valor,
                                fraudeTipo,
                                tentouResolver,
                                erroTipo,
                            }}
                        />


                        {/* POPUP UPLOAD */}
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
