// EnergiaPage.jsx

'use client';
import { useState, useRef } from "react";
import "../../styles/FormPages.css";
import ResultDisplay from "../../components/ResultDisplay/ResultDisplay";
import Link from "next/link";

export default function EnergiaPage() {
    const [distribuidora, setDistribuidora] = useState("");
    const [uc, setUc] = useState(""); // Unidade Consumidora (UC)
    const [fatura, setFatura] = useState("");
    const [resultadoCalculo, setResultadoCalculo] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const disclaimer = "Este verificador é indicativo. A análise completa requer o envio de documentos posteriormente.";

        const content = [
            "As distribuidoras são obrigadas a compensar os consumidores por interrupções que ultrapassem os limites de duração (DIC) e frequência (FIC) estabelecidos pela ANEEL.",
            "O crédito geralmente aparece na própria fatura de energia com a sigla \"Compensação DIC/FIC\". Se você sofre com quedas constantes e prolongadas de energia e não vê essa compensação, pode haver uma irregularidade.",
            "Recomendação:",
            "Nossa equipe pode analisar suas últimas 12 faturas para verificar se os créditos devidos foram pagos corretamente."
        ];

        const checklist = [
            "Cópia das últimas 12 faturas de energia.",
            "Documento de Identificação (RG/CNH).",
            "Comprovante de Residência (em nome do titular)."
        ];

        setResultadoCalculo({
            title: "Análise Indicativa",
            content: content,
            checklist: checklist,
            disclaimer: disclaimer,
            ctaText: "Enviar Faturas para Análise",
            serviceType:"Energia"
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

            <div className="hero-sub-section" id="energia-page" >
                <div className="header-section">
                    <h1 className="page-title">Créditos por apagão na sua fatura</h1>
                    <p className="page-subtitle">
                        <strong>Falta de energia prolongada pode gerar compensação automática (DIC/FIC)</strong>. Use nosso verificador para <strong>descobrir se você tem direito e receber orientação sobre os próximos passos</strong>.
                    </p>
                </div>
            </div>

            <div className="menu-landing">

                <div className="menu-landing-header">
                    <h1>Como funciona:</h1>
                    <p>
                        <strong>Preencha os dados</strong> da sua fatura no verificador. Se identificarmos que há <strong>direito à compensação</strong>, você poderá iniciar uma conversa pelo WhatsApp com nossa equipe, que vai te <strong>guiar com segurança por todo o processo até receber a devolução</strong>.
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
                <h2 className="form-title">Verificador de Energia</h2>
                <form id="energia-verifier-form" onSubmit={handleSubmit}>

                    <div className="grid-2-cols">
                        <div className="form-group">
                            <label htmlFor="energia-distribuidora" className="form-label">Sua Distribuidora de Energia</label>
                            <input
                                type="text"
                                id="energia-distribuidora"
                                className="form-input"
                                placeholder="Ex: Enel, CPFL, Light..."
                                value={distribuidora}
                                onChange={(e) => setDistribuidora(e.target.value)}
                                required
                            />
                        </div>

                        {/* Campo Unidade Consumidora (UC) - AGORA OPCIONAL */}
                        <div className="form-group">
                            <label htmlFor="energia-uc" className="form-label">Nº da Unidade Consumidora (UC) <span className="text-gray-500 font-normal">(opcional)</span></label>
                            <input
                                type="text"
                                id="energia-uc"
                                className="form-input"
                                placeholder="Ex: 1234567-8"
                                value={uc}
                                onChange={(e) => setUc(e.target.value)}
                            // REMOVIDO: required
                            />
                        </div>
                    </div>

                    <div className="form-group mt-4">
                        <label className="form-label">Você tem uma fatura recente em mãos?</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="fatura"
                                    value="sim"
                                    checked={fatura === "sim"}
                                    onChange={(e) => setFatura(e.target.value)}
                                    required // Deve ser required
                                /> Sim
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="fatura"
                                    value="nao"
                                    checked={fatura === "nao"}
                                    onChange={(e) => setFatura(e.target.value)}
                                    required // Deve ser required
                                /> Não
                            </label>
                        </div>
                    </div>

                    <p className="text-sm-gray mt-4">
                        A Resolve Online auxilia consumidores na identificação de cobranças indevidas de energia elétrica. A restituição depende das regras da concessionária e da regulamentação da ANEEL.
                    </p>

                    <button type="submit" className="btn-submit mt-4">Verificar Possibilidade</button>
                </form>

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
                            src="https://img.icons8.com/?size=100&id=35588&format=png&color=0d3074"
                            alt="Planos de Saúde"
                        />

                        <img className='service-element-img' src="/images/services-img/saude.png" alt="" />
                        <h2>Planos de Saúde (ANS)</h2>
                        <p>Negativa de cobertura, reajuste abusivo ou descumprimento de prazos? Saiba o que fazer.</p>
                        {/* <a href="/saude">Conhecer meus direitos →</a> */}
                        <Link href="/saude"><button className='btn'>Conhecer meus direitos</button></Link>
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