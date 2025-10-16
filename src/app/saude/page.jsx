// SaudePage.jsx

'use client';
import { useState, useRef } from "react";
import "../../styles/FormPages.css";
import ResultDisplay from "../../components/ResultDisplay/ResultDisplay"; // Componente Genérico
import Link from "next/link";

export default function SaudePage() {
    const [problema, setProblema] = useState("negativa");
    const [urgencia, setUrgencia] = useState(""); // Captura do contexto (Sim/Não)
    const [operadora, setOperadora] = useState("");
    const [tipoPlano, setTipoPlano] = useState("individual"); // Para lógica de Reajuste
    const [documentosProntos, setDocumentosProntos] = useState("");

    const [resultadoCalculo, setResultadoCalculo] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        let title = "Orientações e Próximos Passos (ANS):";
        let content = [];
        let checklist = [
            "Laudo/Relatório Médico detalhado com a justificativa do tratamento",
            "Cópia do Contrato/Carteirinha do Plano de Saúde",
            "Comprovante de Residência",
        ];
        const ctaText = "Quero uma Análise do Meu Caso";
        const disclaimer = "Aviso: Esta ferramenta é informativa e não substitui a análise de um advogado. Os prazos e critérios são baseados nas Resoluções Normativas (RN) da ANS.";

        // LÓGICA DE SAÍDA (Requisito 4.4)
        switch (problema) {
            case "negativa":
                content = [
                    "A cobertura pode ser obrigatória mesmo fora do Rol da ANS (Lei 14.454/22).",
                    "Critérios objetivos: Deve haver prescrição médica e comprovação científica.",
                    `Próximos passos: Apresentar o laudo médico detalhado e a negativa formal do plano. ${urgencia === 'sim' ? 'Devido à urgência/emergência, o prazo de análise da operadora é reduzido.' : ''}`
                ];
                checklist.push("Negativa formal de cobertura da operadora.");
                break;

            case "prazo":
                content = [
                    "Prazos máximos por tipo de atendimento (RN 259/ANS):",
                    "7 dias úteis: Consulta básica / 14 dias úteis: Fonoaudiologia, Fisioterapia, Psicologia e Terapia Ocupacional.",
                    "21 dias úteis: Cirurgias eletivas / Imediato: Casos de urgência e emergência.",
                    "Próximos passos: Abrir protocolo na operadora e, se não cumprido, registrar uma Notificação de Intermediação Preliminar (NIP) na ANS."
                ];
                checklist.push("Protocolos de contato/reclamação com a operadora.");
                break;

            case "reajuste":
                const reajusteContent = tipoPlano === 'individual'
                    ? "Reajustes em planos individuais/familiares são limitados ao percentual máximo definido pela ANS. Seu reajuste é ilegal se estiver acima deste teto."
                    : "Reajustes em planos coletivos são negociados, mas não podem ser abusivos. É fundamental solicitar a documentação que justifique o aumento.";

                content = [
                    `Tipo de Plano: ${tipoPlano.toUpperCase()}. ${reajusteContent}`,
                    "Próximos passos: Solicitar a documentação completa (memória de cálculo) que justifique o aumento e avaliar se o percentual é abusivo."
                ];
                checklist.push("Comunicado de reajuste e os últimos 3 boletos pagos.");
                break;

            case "reembolso":
                content = [
                    "A glosa deve ser sempre justificada pela operadora.",
                    "O reembolso integral pode ser devido em casos de urgência/emergência ou se não houver prestador disponível na rede.",
                    "Próximos passos: Guardar todos os comprovantes, notas fiscais e solicitar a justificativa da glosa à operadora."
                ];
                checklist.push("Notas fiscais, recibos e solicitação de reembolso.");
                break;
        }

        setResultadoCalculo({
            title: title,
            content: content,
            checklist: checklist,
            disclaimer: disclaimer,
            ctaText: ctaText
        });
    };

    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

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

            <div className="menu-landing">

                <div className="menu-landing-header">
                    <h1>Como funciona:</h1>
                    <p>
                        <strong>Preencha o simulador</strong> com os dados do seu plano e situação. Caso o seu <strong>caso seja elegível</strong>, você poderá continuar o atendimento diretamente pelo WhatsApp <strong>com nossa equipe, que vai orientar cada passo para abrir a contestação e acompanhar o processo de forma segura e transparente</strong>.
                    </p>
                </div>

                <div className="range-content">
                    <div className="info-element">
                        <img src="/images/icos/preencher.png" alt="15 anos de atuação" />
                        <h3>1. Preencha o formulário simulador</h3>
                    </div>
                    <div className="info-element">
                        <img src="/images/icos/verificar.png" alt="Atuação Nacional" />
                        <h3>2. Verifique se o seu caso é elegível</h3>
                    </div>
                    <div className="info-element">
                        <img src="/images/icos/atendimento.png" alt="Métricas LGPD" />
                        <h3>3. Continue o atendimento pelo WhatsApp</h3>
                    </div>
                </div>
            </div>


            <div className="max-w-3xl form-card box-shadow">
                <h2 className="form-title">Simulador de Direitos - Planos de Saúde</h2>
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
                            <option value="negativa">Negativa de Cobertura / Fora do Rol</option>
                            <option value="prazo">Prazo de atendimento estourado (RN 259)</option>
                            <option value="reajuste">Reajuste Abusivo</option>
                            <option value="reembolso">Reembolso Negado / Glosa</option>
                        </select>
                    </div>

                    {/* Campo Condicional para Reajuste (Requisito 4.4) */}
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
                        // Opcional para reduzir fricção
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
                        Este simulador fornece apenas orientações. A análise completa exige a documentação e um profissional.
                    </p>

                    <button type="submit" className="btn-submit mt-4">Ver Próximos Passos</button>
                </form>

                {/* Uso do ResultDisplay Genérico */}
                {resultadoCalculo && <ResultDisplay {...resultadoCalculo} />}
            </div>

            <section className="services-landing" id='services'>
                <h1 className="services-landing-title">Confira também:</h1>
                <div className="services-content" ref={scrollRef}>
                    <div className="service-element">
                        <img
                            className="service-element-ico"
                            src="https://img.icons8.com/?size=100&id=uqpbD9vhCDEQ&format=png&color=0d3074"
                            alt="Fraude Pix"
                        />

                        <img className='service-element-img' src="/images/services-img/pix.png" alt="" />
                        <h2>Fraudes com Pix (MED)</h2>
                        <p>Caiu em um golpe? Auxiliamos você a acionar o Mecanismo Especial de Devolução para reaver seu dinheiro.</p>
                        {/* <a href="/pix">Verificar meu caso →</a> */}
                        <Link href="/pix"><button className='btn'>Verificar meu caso</button></Link>
                    </div>
                    <div className="service-element">
                        <img
                            className="service-element-ico"
                            src="https://img.icons8.com/?size=100&id=12665&format=png&color=0d3074"
                            alt="Direito do Passageiro Aéreo"
                        />

                        <img className='service-element-img' src="/images/services-img/aereo.png" alt="" />
                        <h2>Direito do Passageiro Aéreo</h2>
                        <p>Voo atrasado, cancelado ou overbooking? Calcule sua indenização e conheça seus direitos.</p>
                        {/* <a href="/aereo">Calcular indenização →</a> */}
                        <Link href="/aereo"><button className='btn'>Calcular indenização</button></Link>
                    </div>

                    <div className="service-element">
                        <img
                            className="service-element-ico"
                            src="https://img.icons8.com/?size=100&id=08VQFUNfGTux&format=png&color=0d3074"
                            alt="Interrupção de Energia"
                        />
                        <img className='service-element-img' src="/images/services-img/energia.png" alt="" />
                        <h2>Interrupção de Energia</h2>
                        <p>Ficou sem luz por muito tempo? Você pode ter direito a créditos por descumprimento dos limites DIC/FIC.</p>
                        {/* <a href="/energia">Analisar fatura →</a> */}
                        <Link href="/energia"><button className='btn'>Analisar fatura</button></Link>
                    </div>
                </div>

                <div className="services-controls" style={{ maxWidth: 940, margin: '0 auto', paddingLeft: 10 }}>
                    <button onClick={scrollLeft} className="scroll-btn">←</button>
                    <button onClick={scrollRight} className="scroll-btn" style={{ marginLeft: 8 }}>→</button>
                </div>
            </section>
        </main>
    );
}