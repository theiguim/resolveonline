'use client';
import { useState } from "react";
import "../../styles/FormPages.css";

export default function EnergiaPage() {
  const [distribuidora, setDistribuidora] = useState("");
  const [fatura, setFatura] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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

          <div className="form-group">
            <label className="form-label">Você tem uma fatura recente em mãos?</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="fatura"
                  value="sim"
                  checked={fatura === "sim"}
                  onChange={(e) => setFatura(e.target.value)}
                /> Sim
              </label>
              <label>
                <input
                  type="radio"
                  name="fatura"
                  value="nao"
                  checked={fatura === "nao"}
                  onChange={(e) => setFatura(e.target.value)}
                /> Não
              </label>
            </div>
          </div>

          <p className="text-sm-gray">
            Este verificador é indicativo. A análise completa requer o envio de documentos posteriormente.
          </p>

          <button type="submit" className="btn-submit">Verificar Possibilidade</button>
        </form>

        {submitted && (
          <div id="energia-result" className="result-box" style={{ display: 'block', marginTop: '1.5rem' }}>
            <h4 className="text-blue-800">Análise Indicativa</h4>
            <p style={{ marginTop: "0.5rem" }}>
              As distribuidoras são obrigadas a compensar os consumidores por interrupções que ultrapassem os limites de duração (DIC) e frequência (FIC) estabelecidos pela ANEEL.
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              O crédito geralmente aparece na própria fatura de energia com a sigla "Compensação DIC/FIC". Se você sofre com quedas constantes e prolongadas de energia e não vê essa compensação, pode haver uma irregularidade.
            </p>
            <p style={{ fontWeight: 700, marginTop: "1rem" }}>Recomendação:</p>
            <p>
              Nossa equipe pode analisar suas últimas 12 faturas para verificar se os créditos devidos foram pagos corretamente.
            </p>
            <button className="btn-success" style={{ marginTop: "1rem" }}>Enviar Faturas para Análise</button>
          </div>
        )}
      </div>
    </main>
  );
}
