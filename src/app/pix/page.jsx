// PixPage.jsx - Fricção Reduzida

'use client';
import { useState, useRef } from "react";
import "../../styles/FormPages.css";
import ResultDisplay from "../../components/ResultDisplay/ResultDisplay";
import Link from "next/link";


export default function PixPage() {
    // ... (Estados mantidos)
    const [valor, setValor] = useState("");
    const [dataTransacao, setDataTransacao] = useState("");
    const [fraudeTipo, setFraudeTipo] = useState("Golpe do Falso Parente/Amigo");
    const [chavePix, setChavePix] = useState("");
    const [idPix, setIdPix] = useState("");
    const [bancoPagador, setBancoPagador] = useState("");

    const [resultadoCalculo, setResultadoCalculo] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        // ... (Lógica handleSubmit mantida)
        if (!dataTransacao) {
            alert("Por favor, preencha a data da transação.");
            return;
        }

        const transacao = new Date(dataTransacao);
        const hoje = new Date();
        const diffTime = Math.abs(hoje.getTime() - transacao.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let title;
        let content;
        let ctaText;
        let disclaimer = "Aviso: A elegibilidade para o MED (Mecanismo Especial de Devolução) baseia-se no prazo de 80 dias. O sucesso depende da análise do seu banco e do banco recebedor.";
        let checklist;

        // ... (Lógica de qualificação mantida)
        if (diffDays <= 80) {
            title = "Boa Notícia: Você está dentro do prazo!";
            ctaText = "Quero Ajuda para Abrir o Caso";
            content = [
                `Sua transação ocorreu há ${diffDays} dias, dentro da janela de 80 dias para abertura do Mecanismo Especial de Devolução (MED).`,
                "Próximos Passos Essenciais:",
                "IMEDIATAMENTE: Contate seu banco (chat ou telefone) e registre uma contestação da transação, solicitando a abertura de um MED. Anote o protocolo.",
                "BOLETIM DE OCORRÊNCIA: Registre um B.O. online descrevendo a fraude.",
            ];
            checklist = [
                "Prints da conversa ou do anúncio falso",
                "Comprovante do PIX (com ID/E2E visível)",
                "Boletim de Ocorrência (B.O.)",
                "Protocolo de contestação do seu banco",
            ];

        } else {
            title = "Atenção: Prazo para o MED expirado.";
            ctaText = "Conversar com um Especialista";
            content = [
                `Sua transação ocorreu há ${diffDays} dias. O prazo formal para o Mecanismo Especial de Devolução (MED) é de 80 dias.`,
                "A recuperação via MED é improvável, mas outras ações judiciais ou administrativas ainda podem ser possíveis, dependendo da falha do seu banco. Recomendamos que você fale com nossa equipe para avaliar alternativas.",
            ];
            checklist = [
                "Comprovante do PIX (com ID/E2E visível)",
                "Documentos pessoais e de contato",
            ];
        }

        setResultadoCalculo({
            title: title,
            content: content,
            checklist: checklist,
            disclaimer: disclaimer,
            ctaText: ctaText,
            serviceType:"PIX"
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
            {/* ... (Header mantido) */}


            <div className="hero-sub-section" id="pix-page" >
                <div className="header-section">
                    <h1 className="page-title">Foi vítima de golpe com PIX?</h1>
                    <p className="page-subtitle">
                        <strong>Você pode ter direito à devolução pelo Mecanismo Especial de Devolução (MED)</strong> — um recurso do Banco Central disponível por até 80 dias após o envio do valor. <strong>Use nosso simulador gratuito e veja se o seu caso é elegível para análise</strong>.
                    </p>
                </div>
            </div>

            <div className="menu-landing">

                <div className="menu-landing-header">
                    <h1>Como funciona:</h1>
                    <p>
                        <strong>Preencha o simulador</strong> com os dados da transação. Caso o seu caso seja <strong>elegível</strong>, você poderá <strong>iniciar uma conversa direta com nossa equipe</strong> pelo WhatsApp, onde continuará o atendimento e receberá todas as <strong>orientações</strong> para acionar o <strong>MED de forma segura e rápida</strong>.
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
                <h2 className="form-title">Simulador de Fraude PIX (MED)</h2>
                <form id="pix-simulator-form" onSubmit={handleSubmit}>

                    <div className="grid-2-cols">
                        {/* Valor e Data permanecem required */}
                        <div className="form-group">
                            <label htmlFor="pix-valor" className="form-label">Valor do PIX (R$)</label>
                            <input
                                type="number"
                                id="pix-valor"
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
                            <label htmlFor="pix-data" className="form-label">Data da Transação</label>
                            <input
                                type="date"
                                id="pix-data"
                                className="form-input"
                                value={dataTransacao}
                                onChange={(e) => setDataTransacao(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid-2-cols mt-4">
                        {/* Banco Pagador - AGORA OPCIONAL */}
                        <div className="form-group">
                            <label htmlFor="pix-banco-pagador" className="form-label">Seu Banco (Pagador) <span className="text-gray-500 font-normal">(opcional)</span></label>
                            <input
                                type="text"
                                id="pix-banco-pagador"
                                className="form-input"
                                placeholder="Ex: Banco do Brasil, Itaú"
                                value={bancoPagador}
                                onChange={(e) => setBancoPagador(e.target.value)}
                            // REMOVIDO: required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pix-chave" className="form-label">Chave PIX do Destino <span className="text-gray-500 font-normal">(opcional)</span></label>
                            <input
                                type="text"
                                id="pix-chave"
                                className="form-input"
                                placeholder="Ex: CPF, Telefone ou E-mail"
                                value={chavePix}
                                onChange={(e) => setChavePix(e.target.value)}
                            // Já era opcional
                            />
                        </div>
                    </div>

                    {/* ID da Transação (E2E) - AGORA OPCIONAL */}
                    <div className="form-group mt-4">
                        <label htmlFor="pix-id" className="form-label">ID da Transação (E2E ou Código de Autenticação) <span className="text-gray-500 font-normal">(opcional)</span></label>
                        <input
                            type="text"
                            id="pix-id"
                            className="form-input"
                            placeholder="Ex: E202110051234567890123456789"
                            value={idPix}
                            onChange={(e) => setIdPix(e.target.value)}
                        // REMOVIDO: required
                        />
                    </div>

                    <div className="form-group mt-4">
                        <label htmlFor="pix-fraude-tipo" className="form-label">Tipo de Fraude</label>
                        <select
                            id="pix-fraude-tipo"
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
                    <p className="text-sm-gray mt-4">
                        A plataforma Resolve Online atua como intermediadora digital entre consumidores e instituições financeiras. O uso do simulador não constitui representação jurídica formal. O prazo e a devolução de valores dependem das políticas do Banco Central e do banco envolvido.
                    </p>
                    <button type="submit" className="btn-submit mt-4">Analisar Elegibilidade</button>
                </form>

                {resultadoCalculo && <ResultDisplay {...resultadoCalculo} />}
            </div>
            <section className="services-landing" id='services'>
                <h1 className="services-landing-title">Confira também:</h1>
                <div className="services-content" ref={scrollRef}>
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