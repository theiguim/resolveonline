'use client';
import { useState } from "react";
import "../../styles/FormPages.css";

export default function AereoPage() {
  const [problema, setProblema] = useState("atraso");
  const [escopo, setEscopo] = useState("domestico");
  const [horas, setHoras] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let resultHTML = '<h4 class="text-blue-800">Seus Direitos Prováveis:</h4>';

    if (problema === 'atraso' || problema === 'cancelamento') {
      if (horas >= 1) {
        resultHTML += '<p style="margin-top: 0.5rem;"><strong>A partir de 1 hora de atraso:</strong> Direito à comunicação (internet, telefonemas).</p>';
      }
      if (horas >= 2) {
        resultHTML += '<p style="margin-top: 0.5rem;"><strong>A partir de 2 horas de atraso:</strong> Direito à alimentação (voucher, lanche, bebida).</p>';
      }
      if (horas >= 4) {
        resultHTML += '<p style="margin-top: 0.5rem;"><strong>A partir de 4 horas de atraso:</strong> Direito a acomodação ou hospedagem (se houver pernoite) e transporte de ida e volta. Além disso, a companhia deve oferecer opções de reacomodação em outro voo ou reembolso integral.</p><p style="margin-top: 0.5rem; font-weight: 700;">Você pode ter direito a uma indenização por danos morais por todo o transtorno causado.</p>';
      }
      if (horas < 1) {
        resultHTML += '<p style="margin-top: 0.5rem;">Atrasos inferiores a 1 hora geralmente não geram direito a assistência material, mas dependendo do caso, ainda pode haver discussão sobre danos.</p>';
      }
    } else if (problema === 'overbooking') {
      resultHTML += '<p style="margin-top: 0.5rem;">Em caso de overbooking, a companhia deve procurar por voluntários para desistir do embarque em troca de vantagens. Caso você seja impedido de embarcar contra sua vontade, tem direito a assistência material (conforme as horas de espera) e a uma compensação financeira imediata, além da possibilidade de indenização por danos morais.</p>';
    } else { // bagagem
      resultHTML += '<p style="margin-top: 0.5rem;">No caso de extravio de bagagem em voo doméstico, você tem direito a uma ajuda de custo imediata para despesas emergenciais. A companhia tem até 7 dias para localizar e devolver sua mala. Se não for encontrada, você deve ser indenizado.</p>';
    }

    resultHTML += '<button class="btn-success">Quero Abrir Minha Reclamação</button>';

    setResult(resultHTML);
  };

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
          </div>

          <button type="submit" className="btn-submit">Calcular Meus Direitos</button>
        </form>

        {result && <div id="aereo-result" className="result-box" dangerouslySetInnerHTML={{ __html: result }} />}
      </div>
    </main>
  );
}
