'use client';
import { useState } from "react";
import "../../styles/FormPages.css";

export default function SaudePage() {
  const [problema, setProblema] = useState("negativa");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const renderResult = () => {
    let resultHTML = (
      <div>
        <h4 className="text-blue-800">Orientações e Próximos Passos:</h4>
        <p style={{ marginTop: "0.5rem" }}>
          {problema === "negativa" &&
            "Mesmo que um procedimento não esteja no Rol da ANS, a cobertura pode ser obrigatória se houver prescrição médica e comprovação científica. Desde a Lei 14.454/22, o Rol é considerado exemplificativo. É fundamental ter em mãos o laudo médico detalhado e a negativa formal do plano."}
          {problema === "prazo" &&
            "A ANS estabelece prazos máximos para atendimento (ex: 7 dias para consulta básica, 21 dias para cirurgias eletivas). Se o seu plano não cumpriu, o primeiro passo é abrir um protocolo de reclamação na operadora e, se não resolver, registrar uma Notificação de Intermediação Preliminar (NIP) na ANS."}
          {problema === "reajuste" &&
            "Reajustes anuais em planos individuais/familiares são limitados a um percentual definido pela ANS. Já em planos coletivos, o reajuste é negociado entre a operadora e a empresa/associação, mas não pode ser abusivo ou inviabilizar a permanência do consumidor. É importante solicitar à operadora a documentação que justifique o aumento."}
          {problema === "reembolso" &&
            "A negativa de reembolso (glosa) deve ser sempre justificada pela operadora. Se você utilizou um serviço fora da rede credenciada em uma situação de urgência/emergência ou por indisponibilidade de prestador na rede, o reembolso integral pode ser devido. Guarde todos os comprovantes e notas fiscais."}
        </p>
        <button className="btn-success" style={{ marginTop: "1rem" }}>
          Quero uma Análise do Meu Caso
        </button>
      </div>
    );
    return resultHTML;
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
            <label htmlFor="saude-problema" className="form-label">
              Qual é o seu problema?
            </label>
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
          <div className="form-group">
            <label className="form-label">O caso envolve urgência ou emergência?</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="urgencia" value="sim" /> Sim
              </label>
              <label>
                <input type="radio" name="urgencia" value="nao" /> Não
              </label>
            </div>
          </div>
          <button type="submit" className="btn-submit">
            Ver Próximos Passos
          </button>
        </form>

        {submitted && (
          <div id="saude-result" className="result-box" style={{ display: "block", marginTop: "1.5rem" }}>
            {renderResult()}
          </div>
        )}
      </div>
    </main>
  );
}
