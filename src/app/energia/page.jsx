// EnergiaPage.jsx

'use client';
import { useState } from "react";
import "../../styles/FormPages.css";
import ResultDisplay from "../../components/ResultDisplay/ResultDisplay";

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
        });
    };

    return (
        <main className="page-container">
            <div className="header-section">
                <h1 className="page-title">Créditos por Apagão na sua Fatura</h1>
                <p className="page-subtitle">
                    Faltas de energia prolongadas podem gerar compensação automática (DIC/FIC). Verifique se você pode ter direito.
                </p>
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
                        Este verificador é indicativo. A análise completa requer o envio de documentos posteriormente.
                    </p>

                    <button type="submit" className="btn-submit mt-4">Verificar Possibilidade</button>
                </form>

                {resultadoCalculo && <ResultDisplay {...resultadoCalculo} />}
            </div>
        </main>
    );
}