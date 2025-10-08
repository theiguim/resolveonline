'use client';
import { useState } from "react";
import "../../styles/FormPages.css";

export default function PixPage() {
  const [valor, setValor] = useState("");
  const [dataTransacao, setDataTransacao] = useState("");
  const [fraudeTipo, setFraudeTipo] = useState("Golpe do Falso Parente/Amigo");
  const [submitted, setSubmitted] = useState(false);
  const [diffDays, setDiffDays] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const transacao = new Date(dataTransacao);
    const hoje = new Date();
    const diffTime = Math.abs(hoje - transacao);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDiffDays(days);
    setSubmitted(true);
  };

  return (
    <main className="page-container">
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
            <div className="form-group">
              <label htmlFor="pix-valor" className="form-label">Valor do PIX (R$)</label>
              <input
                type="number"
                id="pix-valor"
                className="form-input"
                placeholder="Ex: 1500,00"
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

          <div className="form-group">
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

          <button type="submit" className="btn-submit">Analisar Elegibilidade</button>
        </form>

        {submitted && (
          <div id="pix-result" className="result-box" style={{ display: 'block', marginTop: '1.5rem' }}>
            {diffDays <= 80 ? (
              <>
                <h4 className="text-green-700">Boa Notícia: Você está dentro do prazo!</h4>
                <p className="mt-2">Sua transação ocorreu há {diffDays} dias, dentro da janela de 80 dias para abertura do Mecanismo Especial de Devolução (MED).</p>
                <p className="mt-4" style={{ fontWeight: 700 }}>Próximos Passos Essenciais:</p>
                <ul className="list-disc">
                  <li><strong>IMEDIATAMENTE:</strong> Contate seu banco pelo chat ou telefone e registre uma contestação da transação, solicitando a abertura de um MED. Anote o protocolo.</li>
                  <li><strong>BOLETIM DE OCORRÊNCIA:</strong> Registre um B.O. online descrevendo a fraude.</li>
                  <li><strong>REÚNA PROVAS:</strong> Salve prints da conversa com o golpista, comprovante do Pix e o B.O.</li>
                </ul>
                <button className="btn-success" style={{ marginTop: '1rem' }}>Quero Ajuda para Abrir o Caso</button>
              </>
            ) : (
              <>
                <h4 className="text-red-700">Atenção: Prazo para o MED expirado.</h4>
                <p className="mt-2">Sua transação ocorreu há {diffDays} dias. O prazo formal para o Mecanismo Especial de Devolução (MED) é de 80 dias.</p>
                <p className="mt-2">A recuperação via MED é improvável, mas outras ações podem ser possíveis. Recomendamos que você fale com nossa equipe para avaliar alternativas.</p>
                <button className="btn-action" style={{ marginTop: '1rem' }}>Conversar com um Especialista</button>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
