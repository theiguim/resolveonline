// PixPage.jsx - Fricção Reduzida

'use client';
import { useState } from "react";
import "../../styles/FormPages.css";
import ResultDisplay from "../../components/ResultDisplay/ResultDisplay";

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
            ctaText: ctaText
        });
    };

    return (
        <main className="page-container">
            {/* ... (Header mantido) */}
            <div className="header-section">
                <h1 className="page-title">Sofreu um golpe com PIX?</h1>
                <p className="page-subtitle">
                    Você tem até 80 dias para acionar o Mecanismo Especial de Devolução (MED). Use nosso simulador para entender os próximos passos.
                </p>
            </div>

            <div className="max-w-3xl form-card box-shadow">
                <h2 className="form-title">Simulador Rápido - Fraude PIX (MED)</h2>
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

                    <button type="submit" className="btn-submit mt-4">Analisar Elegibilidade</button>
                </form>

                {resultadoCalculo && <ResultDisplay {...resultadoCalculo} />}
            </div>
        </main>
    );
}