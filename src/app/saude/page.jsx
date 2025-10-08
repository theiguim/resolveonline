// SaudePage.jsx

'use client';
import { useState } from "react";
import "../../styles/FormPages.css";
import ResultDisplay from "../../components/ResultDisplay/ResultDisplay"; // Componente Genérico

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

    return (
        <main className="page-container">
            <div className="header-section">
                <h1 className="page-title">Plano de Saúde Negou Cobertura?</h1>
                <p className="page-subtitle">
                    Seu plano não cumpriu os prazos da ANS, negou um procedimento ou aplicou um reajuste abusivo? Entenda o que fazer.
                </p>
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
        </main>
    );
}