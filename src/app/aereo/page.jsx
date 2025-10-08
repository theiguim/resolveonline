// AereoPage.jsx

'use client';
import { useState } from "react";
import "../../styles/FormPages.css";
import ResultDisplay from "../../components/ResultDisplay/ResultDisplay"; // Componente Genérico

export default function AereoPage() {
    const [problema, setProblema] = useState("atraso");
    const [escopo, setEscopo] = useState("domestico");
    const [horas, setHoras] = useState("");
    const [pernoite, setPernoite] = useState("nao");
    const [despesas, setDespesas] = useState(0);
    const [resultadoCalculo, setResultadoCalculo] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const h = parseFloat(horas) || 0;
        const d = parseFloat(despesas) || 0;
        let direitos = [];
        let checklist = [
            "Cópia dos Bilhetes Aéreos ou E-ticket",
            "Documento de Identificação (RG/CNH)",
            "Comprovante de Residência",
            "Prints/Comunicações sobre o problema (e-mails, avisos)",
        ];
        const ctaText = "Quero Abrir Minha Reclamação";
        const disclaimer = "Atenção: Esta é uma ferramenta informativa e o resultado é indicativo. Uma análise jurídica completa é necessária para confirmar todos os seus direitos e o valor da indenização.";

        if (problema === 'atraso' || problema === 'cancelamento') {
            checklist.push("Comprovantes de Despesas (alimentação, táxi, etc., se aplicável)");

            if (h >= 1) direitos.push("A partir de 1 hora de atraso: Direito à comunicação (internet, telefonemas).");
            if (h >= 2) direitos.push("A partir de 2 horas de atraso: Direito à alimentação (voucher, lanche, bebida).");
            if (h >= 4) {
                const hospedagem = (pernoite === 'sim')
                    ? "Direito a acomodação ou hospedagem e transporte de ida e volta (se houve pernoite confirmado)."
                    : "Direito a reacomodação ou reembolso integral.";
                direitos.push(`A partir de 4 horas de atraso: ${hospedagem}`);
                direitos.push("Você pode ter direito a uma indenização por danos morais por todo o transtorno causado.");
            }
            if (h < 1) direitos.push("Atrasos inferiores a 1 hora geralmente não geram direito a assistência material, mas dependendo do caso, ainda pode haver discussão sobre danos.");
        } else if (problema === 'overbooking') {
            checklist.push("Comprovante de pagamento de compensação imediata (se houver)");
            direitos.push("Em caso de overbooking, você tem direito a assistência material (conforme as horas de espera) e a uma compensação financeira imediata, além da possibilidade de indenização por danos morais.");
        } else { // bagagem
            checklist.push("RIB (Registro de Irregularidade de Bagagem) feito no aeroporto.");
            direitos.push("No caso de extravio de bagagem em voo doméstico, você tem direito a uma ajuda de custo imediata para despesas emergenciais. A companhia tem até 7 dias para localizar e devolver sua mala. Se não for encontrada, você deve ser indenizado.");
        }

        setResultadoCalculo({
            title: "Seus Direitos Prováveis:",
            content: direitos,
            expenses: d,
            checklist: checklist,
            disclaimer: disclaimer,
            ctaText: ctaText
        });
    };

    // Renderização do Componente (Mantida a estrutura original)
    return (
        <main className="page-container">
            <div className="header-section">
                <h1 className="page-title">Problemas com seu Voo?</h1>
                <p className="page-subtitle">
                    Atraso, cancelamento ou overbooking podem gerar indenização. Descubra seus direitos agora.
                </p>
            </div>

            <div className="max-w-3xl form-card box-shadow">
                <h2 className="form-title">Calculadora de Direitos do Passageiro Aéreo</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="aereo-problema" className="form-label">Qual foi o problema?</label>
                        <select
                            id="aereo-problema"
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

                    <div className="grid-2-cols">
                        <div className="form-group">
                            <label htmlFor="aereo-escopo" className="form-label">Tipo de Voo</label>
                            <select
                                id="aereo-escopo"
                                className="form-input"
                                value={escopo}
                                onChange={(e) => setEscopo(e.target.value)}
                                required
                            >
                                <option value="domestico">Doméstico</option>
                                <option value="internacional">Internacional</option>
                            </select>
                        </div>

                        {(problema === 'atraso' || problema === 'cancelamento') && (
                            <div className="form-group">
                                <label htmlFor="aereo-horas" className="form-label">Horas de atraso (na chegada)</label>
                                <input
                                    type="number"
                                    id="aereo-horas"
                                    className="form-input"
                                    placeholder="Ex: 5"
                                    min="0"
                                    value={horas}
                                    onChange={(e) => setHoras(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {(problema === 'atraso' || problema === 'cancelamento') && parseFloat(horas) >= 4 && (
                        <div className="grid-2-cols mt-4">
                            <div className="form-group">
                                <label htmlFor="aereo-pernoite" className="form-label">O voo exigiu pernoite no aeroporto ou cidade?</label>
                                <select
                                    id="aereo-pernoite"
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
                        <label htmlFor="aereo-despesas" className="form-label">Você teve despesas extras (alimentação, táxi, hotel) por conta do problema? (R$)</label>
                        <input
                            type="number"
                            id="aereo-despesas"
                            className="form-input"
                            placeholder="Ex: 150.00 (deixe 0 se não teve)"
                            min="0"
                            step="0.01"
                            value={despesas}
                            onChange={(e) => setDespesas(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit mt-4">Calcular Meus Direitos</button>
                </form>

                {/* Uso do ResultDisplay Genérico */}
                {resultadoCalculo && <ResultDisplay {...resultadoCalculo} />}
            </div>
        </main>
    );
}